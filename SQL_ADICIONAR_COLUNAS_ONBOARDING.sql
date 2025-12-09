-- Script SQL para adicionar colunas de onboarding na tabela users
-- Execute este script no banco de dados do Railway

-- Verificar se as colunas já existem antes de adicionar
SET @dbname = DATABASE();
SET @tablename = "users";
SET @columnname1 = "onboarding_use_case";
SET @columnname2 = "onboarding_niche";
SET @columnname3 = "onboarding_at";

-- Adicionar coluna onboarding_use_case se não existir
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname1)
  ) > 0,
  "SELECT 1", -- Coluna já existe
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname1, " TEXT COMMENT 'Para que você usará o site?'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Adicionar coluna onboarding_niche se não existir
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname2)
  ) > 0,
  "SELECT 1", -- Coluna já existe
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname2, " VARCHAR(255) COMMENT 'Qual é o seu nicho?'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Adicionar coluna onboarding_at se não existir
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname3)
  ) > 0,
  "SELECT 1", -- Coluna já existe
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname3, " TIMESTAMP NULL COMMENT 'Quando completou o onboarding'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verificar resultado
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME IN ('onboarding_use_case', 'onboarding_niche', 'onboarding_at')
ORDER BY COLUMN_NAME;

