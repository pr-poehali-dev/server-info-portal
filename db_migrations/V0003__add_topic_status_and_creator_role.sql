-- Добавление статусов для тем форума
ALTER TABLE forum_topics 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'open';

-- Добавление таблицы для ролей игроков
CREATE TABLE IF NOT EXISTS player_roles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    role_name VARCHAR(100) NOT NULL,
    role_description TEXT,
    assigned_by INT REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Обновление роли для Tourist_wagnera на creator
UPDATE users 
SET role = 'creator',
    display_name = 'Tourist_wagnera (Глава проекта)'
WHERE username = 'Tourist_wagnera';

-- Создание индексов
CREATE INDEX IF NOT EXISTS idx_player_roles_user ON player_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_status ON forum_topics(status);
