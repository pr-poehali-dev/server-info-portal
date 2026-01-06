"""
API для регистрации, входа и управления пользователями
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
import bcrypt
import secrets

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                return register_user(conn, body)
            elif action == 'login':
                return login_user(conn, body)
            elif action == 'verify':
                return verify_token(conn, body)
        
        elif method == 'GET':
            query_params = event.get('queryStringParameters', {})
            action = query_params.get('action')
            
            if action == 'profile':
                user_id = query_params.get('user_id')
                return get_user_profile(conn, user_id)
        
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()


def register_user(conn, body: dict) -> dict:
    username = body.get('username', '').strip()
    email = body.get('email', '').strip()
    password = body.get('password', '')
    display_name = body.get('display_name', username)
    
    if not username or not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Все поля обязательны'}),
            'isBase64Encoded': False
        }
    
    if len(username) < 3:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Логин должен быть минимум 3 символа'}),
            'isBase64Encoded': False
        }
    
    if len(password) < 6:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пароль должен быть минимум 6 символов'}),
            'isBase64Encoded': False
        }
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
    if cursor.fetchone():
        cursor.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пользователь с таким логином или email уже существует'}),
            'isBase64Encoded': False
        }
    
    cursor.execute(
        "INSERT INTO users (username, email, password_hash, display_name) VALUES (%s, %s, %s, %s) RETURNING id, username, email, display_name, role",
        (username, email, password_hash, display_name)
    )
    user = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    token = secrets.token_urlsafe(32)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'user': dict(user),
            'token': token
        }),
        'isBase64Encoded': False
    }


def login_user(conn, body: dict) -> dict:
    username = body.get('username', '').strip()
    password = body.get('password', '')
    
    if not username or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Логин и пароль обязательны'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "SELECT id, username, email, display_name, role, password_hash FROM users WHERE username = %s OR email = %s",
        (username, username)
    )
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный логин или пароль'}),
            'isBase64Encoded': False
        }
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        cursor.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный логин или пароль'}),
            'isBase64Encoded': False
        }
    
    cursor.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s", (user['id'],))
    conn.commit()
    cursor.close()
    
    token = secrets.token_urlsafe(32)
    user_data = dict(user)
    del user_data['password_hash']
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'success': True,
            'user': user_data,
            'token': token
        }),
        'isBase64Encoded': False
    }


def verify_token(conn, body: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'valid': True}),
        'isBase64Encoded': False
    }


def get_user_profile(conn, user_id: str) -> dict:
    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "SELECT id, username, display_name, role, avatar_url, created_at FROM users WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()
    cursor.close()
    
    if not user:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'user': dict(user)}),
        'isBase64Encoded': False
    }
