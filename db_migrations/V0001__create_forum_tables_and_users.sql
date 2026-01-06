-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin', 'creator')),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Создание таблицы категорий форума
CREATE TABLE IF NOT EXISTS forum_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0
);

-- Создание таблицы тем форума
CREATE TABLE IF NOT EXISTS forum_topics (
    id SERIAL PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES forum_categories(id),
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES users(id),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы сообщений форума
CREATE TABLE IF NOT EXISTS forum_posts (
    id SERIAL PRIMARY KEY,
    topic_id INT REFERENCES forum_topics(id),
    author_id INT REFERENCES users(id),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка категорий форума
INSERT INTO forum_categories (id, name, icon, color, description, display_order) VALUES
('support', 'Техническая поддержка', 'Headphones', 'text-primary', 'Помощь по техническим вопросам', 1),
('news', 'Новости сервера', 'Newspaper', 'text-secondary', 'Официальные новости и обновления', 2),
('rules', 'Правила и FAQ', 'BookOpen', 'text-primary', 'Правила сервера и часто задаваемые вопросы', 3),
('factions', 'Фракции', 'Shield', 'text-secondary', 'Обсуждение фракций и набор', 4),
('general', 'Общие вопросы', 'MessageSquare', 'text-primary', 'Общение и вопросы по игре', 5),
('reports', 'Жалобы', 'Flag', 'text-destructive', 'Жалобы на нарушения правил', 6);

-- Создание аккаунта создателя (пароль: admin123)
INSERT INTO users (username, email, password_hash, display_name, role) VALUES
('creator', 'creator@russiantown.ru', '$2b$10$rQ8YvL.3TGmjKvH9H8F8pu7nQV4oHx4XvXTKJPK3YmCQZHF5WsZqK', 'Турист-Вагнера', 'creator');

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_forum_topics_category ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_author ON forum_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_topic ON forum_posts(topic_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author ON forum_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
