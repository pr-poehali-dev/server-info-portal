-- Обновление пароля для аккаунта создателя
-- Новый пароль: RussianTown2026
UPDATE users 
SET password_hash = '$2b$12$LQ3vK5k5hGqXjF8oN3X4HOYvK7Q.RJ5z7F8J.8C2pF4.gH5.wK6xO'
WHERE username = 'creator';
