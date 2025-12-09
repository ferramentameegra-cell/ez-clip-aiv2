# 🔧 Como Aplicar Migration no Railway

## ❌ Erro Encontrado

```
Unknown column 'onboarding_use_case' in 'field list'
```

**Causa:** As colunas de onboarding não existem no banco de dados do Railway.

---

## ✅ SOLUÇÃO: Adicionar Colunas no Railway

### **OPÇÃO 1: Via Railway CLI (Recomendado)**

1. **Instalar Railway CLI** (se ainda não tiver):
   ```bash
   npm i -g @railway/cli
   ```

2. **Fazer login**:
   ```bash
   railway login
   ```

3. **Conectar ao projeto**:
   ```bash
   railway link
   ```

4. **Executar SQL**:
   ```bash
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < SQL_ADICIONAR_COLUNAS_ONBOARDING_SIMPLES.sql
   ```

   **OU** executar comandos diretos:
   ```bash
   railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "ALTER TABLE users ADD COLUMN onboarding_use_case TEXT, ADD COLUMN onboarding_niche VARCHAR(255), ADD COLUMN onboarding_at TIMESTAMP NULL;"
   ```

---

### **OPÇÃO 2: Via Railway Dashboard**

1. Acesse: **https://railway.app**
2. Entre no projeto **"ez-clip-ai"**
3. Vá em **"MySQL"** (ou o serviço de banco de dados)
4. Clique em **"Connect"** ou **"Query"**
5. Cole e execute:

```sql
ALTER TABLE users 
ADD COLUMN onboarding_use_case TEXT COMMENT 'Para que você usará o site?',
ADD COLUMN onboarding_niche VARCHAR(255) COMMENT 'Qual é o seu nicho?',
ADD COLUMN onboarding_at TIMESTAMP NULL COMMENT 'Quando completou o onboarding';
```

---

### **OPÇÃO 3: Via MySQL Client Local**

Se você tiver acesso às credenciais do banco:

```bash
mysql -h [HOST] -u [USER] -p[DATABASE] < SQL_ADICIONAR_COLUNAS_ONBOARDING_SIMPLES.sql
```

---

## 📋 SQL para Executar

```sql
ALTER TABLE users 
ADD COLUMN onboarding_use_case TEXT,
ADD COLUMN onboarding_niche VARCHAR(255),
ADD COLUMN onboarding_at TIMESTAMP NULL;
```

---

## ✅ Verificar se Funcionou

Execute:

```sql
DESCRIBE users;
```

Ou:

```sql
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users' 
AND COLUMN_NAME LIKE 'onboarding%';
```

Você deve ver:
- `onboarding_use_case` (TEXT)
- `onboarding_niche` (VARCHAR)
- `onboarding_at` (TIMESTAMP)

---

## 🚨 IMPORTANTE

**Se as colunas já existirem**, você pode receber um erro. Nesse caso, use o script `SQL_ADICIONAR_COLUNAS_ONBOARDING.sql` que verifica antes de adicionar.

---

**Após aplicar a migration, tente criar uma nova conta novamente!** ✅

