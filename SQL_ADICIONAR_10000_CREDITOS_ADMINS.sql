-- Adicionar 10000 créditos para emails de administradores
-- Execute no Railway MySQL Dashboard

UPDATE users 
SET credits = 10000
WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com');

-- Verificar se funcionou
SELECT id, name, email, credits, role 
FROM users 
WHERE email IN ('daniel.braun@hotmail.com', 'josyasborba@hotmail.com');

