-- 🔥 ADICIONAR 1000 CRÉDITOS PARA ADMINS
-- Execute este SQL no Railway Dashboard (MySQL > Query)

UPDATE users 
SET credits = credits + 1000 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');

-- Verificar se foi aplicado
SELECT id, name, email, credits 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');

