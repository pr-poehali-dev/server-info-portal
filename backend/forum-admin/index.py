"""
API для управления форумом: модерация тем, выдача ролей, управление статусами
Доступно только для пользователей с ролью creator или admin
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, date

def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        body = json.loads(event.get('body', '{}')) if method in ['POST', 'PUT'] else {}
        query_params = event.get('queryStringParameters', {})
        
        admin_id = body.get('admin_id') or query_params.get('admin_id')
        
        if not admin_id:
            return error_response('Admin ID required', 401)
        
        if not check_admin_rights(conn, admin_id):
            return error_response('Access denied: admin rights required', 403)
        
        action = body.get('action') or query_params.get('action')
        
        if action == 'update_topic_status':
            return update_topic_status(conn, body)
        elif action == 'lock_topic':
            return lock_topic(conn, body)
        elif action == 'pin_topic':
            return pin_topic(conn, body)
        elif action == 'assign_role':
            return assign_player_role(conn, body, admin_id)
        elif action == 'remove_role':
            return remove_player_role(conn, body)
        elif action == 'get_user_roles':
            user_id = query_params.get('user_id')
            return get_user_roles(conn, user_id)
        elif action == 'get_all_users':
            return get_all_users(conn)
        elif action == 'update_user_role':
            return update_user_role(conn, body)
        
        return error_response('Invalid action', 400)
    
    finally:
        conn.close()


def check_admin_rights(conn, user_id: str) -> bool:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    return user and user['role'] in ['creator', 'admin', 'moderator']


def update_topic_status(conn, body: dict) -> dict:
    topic_id = body.get('topic_id')
    status = body.get('status')
    
    if not topic_id or not status:
        return error_response('Topic ID and status required', 400)
    
    valid_statuses = ['open', 'in_review', 'resolved', 'closed', 'rejected']
    if status not in valid_statuses:
        return error_response(f'Invalid status. Must be one of: {", ".join(valid_statuses)}', 400)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "UPDATE forum_topics SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
        (status, topic_id)
    )
    topic = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not topic:
        return error_response('Topic not found', 404)
    
    return success_response({'topic': dict(topic), 'message': f'Статус темы изменён на: {status}'})


def lock_topic(conn, body: dict) -> dict:
    topic_id = body.get('topic_id')
    is_locked = body.get('is_locked', True)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "UPDATE forum_topics SET is_locked = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
        (is_locked, topic_id)
    )
    topic = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not topic:
        return error_response('Topic not found', 404)
    
    message = 'Тема закрыта' if is_locked else 'Тема открыта'
    return success_response({'topic': dict(topic), 'message': message})


def pin_topic(conn, body: dict) -> dict:
    topic_id = body.get('topic_id')
    is_pinned = body.get('is_pinned', True)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "UPDATE forum_topics SET is_pinned = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *",
        (is_pinned, topic_id)
    )
    topic = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not topic:
        return error_response('Topic not found', 404)
    
    message = 'Тема закреплена' if is_pinned else 'Тема откреплена'
    return success_response({'topic': dict(topic), 'message': message})


def assign_player_role(conn, body: dict, admin_id: str) -> dict:
    user_id = body.get('user_id')
    role_name = body.get('role_name')
    role_description = body.get('role_description', '')
    
    if not user_id or not role_name:
        return error_response('User ID and role name required', 400)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
    if not cursor.fetchone():
        cursor.close()
        return error_response('User not found', 404)
    
    cursor.execute(
        "INSERT INTO player_roles (user_id, role_name, role_description, assigned_by) VALUES (%s, %s, %s, %s) RETURNING *",
        (user_id, role_name, role_description, admin_id)
    )
    role = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return success_response({'role': dict(role), 'message': f'Роль "{role_name}" выдана пользователю'})


def remove_player_role(conn, body: dict) -> dict:
    role_id = body.get('role_id')
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM player_roles WHERE id = %s", (role_id,))
    conn.commit()
    deleted = cursor.rowcount
    cursor.close()
    
    if deleted == 0:
        return error_response('Role not found', 404)
    
    return success_response({'message': 'Роль удалена'})


def get_user_roles(conn, user_id: str) -> dict:
    if not user_id:
        return error_response('User ID required', 400)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """SELECT pr.*, u.username as assigned_by_username 
           FROM player_roles pr 
           LEFT JOIN users u ON pr.assigned_by = u.id 
           WHERE pr.user_id = %s 
           ORDER BY pr.assigned_at DESC""",
        (user_id,)
    )
    roles = cursor.fetchall()
    cursor.close()
    
    return success_response({'roles': [dict(r) for r in roles]})


def get_all_users(conn) -> dict:
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """SELECT id, username, display_name, role, email, created_at, last_login 
           FROM users 
           ORDER BY created_at DESC"""
    )
    users = cursor.fetchall()
    cursor.close()
    
    return success_response({'users': [dict(u) for u in users]})


def update_user_role(conn, body: dict) -> dict:
    user_id = body.get('user_id')
    new_role = body.get('role')
    
    if not user_id or not new_role:
        return error_response('User ID and role required', 400)
    
    valid_roles = ['user', 'moderator', 'admin', 'creator']
    if new_role not in valid_roles:
        return error_response(f'Invalid role. Must be one of: {", ".join(valid_roles)}', 400)
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "UPDATE users SET role = %s WHERE id = %s RETURNING *",
        (new_role, user_id)
    )
    user = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    if not user:
        return error_response('User not found', 404)
    
    return success_response({'user': dict(user), 'message': f'Роль обновлена на: {new_role}'})


def success_response(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, **data}, default=json_serial),
        'isBase64Encoded': False
    }


def error_response(message: str, status_code: int = 400) -> dict:
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': message}),
        'isBase64Encoded': False
    }