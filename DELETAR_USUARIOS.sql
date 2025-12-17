-- Deletar usuários específicos da base de dados
-- Emails: josyasborba@hotmail.com e daniel.braun@hotmail.com

-- Verificar usuários antes de deletar
SELECT id, email, name, role, credits, created_at 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');

-- Deletar usuário josyasborba@hotmail.com
DELETE FROM users WHERE email = 'josyasborba@hotmail.com';

-- Deletar usuário daniel.braun@hotmail.com
DELETE FROM users WHERE email = 'daniel.braun@hotmail.com';

-- Verificar se foram deletados (não deve retornar nada)
SELECT id, email, name 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');
