-- Script SQL para adicionar colunas de onboarding na tabela users
-- Execute este script no Railway (via CLI ou dashboard)

-- Adicionar coluna onboarding_use_case
ALTER TABLE users 
ADD COLUMN onboarding_use_case TEXT COMMENT 'Para que você usará o site?';

-- Adicionar coluna onboarding_niche
ALTER TABLE users 
ADD COLUMN onboarding_niche VARCHAR(255) COMMENT 'Qual é o seu nicho?';

-- Adicionar coluna onboarding_at
ALTER TABLE users 
ADD COLUMN onboarding_at TIMESTAMP NULL COMMENT 'Quando completou o onboarding';

-- Verificar se as colunas foram criadas
DESCRIBE users;

