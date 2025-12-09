# 🔥 COPIE E COLE NO RAILWAY AGORA

## ⚠️ ERRO: Unknown column 'onboarding_use_case'

**SOLUÇÃO:** Execute este SQL no Railway:

---

## 📋 PASSO A PASSO

### 1. Acesse Railway Dashboard

1. Abra: **https://railway.app**
2. Entre no projeto **"ez-clip-ai"**
3. Clique no serviço **"MySQL"** (ou banco de dados)

### 2. Vá na Aba Query

1. Clique em **"Query"** ou **"Data"** ou **"Connect"**
2. Procure por um campo de texto para SQL

### 3. Cole Este SQL:

```sql
ALTER TABLE users ADD COLUMN onboarding_use_case TEXT;
ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255);
ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;
```

### 4. Execute

1. Clique em **"Run"** ou **"Execute"** ou **"Send"**
2. ✅ Pronto!

---

## ✅ Verificar se Funcionou

Cole e execute:

```sql
DESCRIBE users;
```

Procure por:
- ✅ `onboarding_use_case`
- ✅ `onboarding_niche`  
- ✅ `onboarding_at`

---

## 🎯 Após Executar

1. ✅ SQL executado
2. ✅ Tente criar conta novamente
3. ✅ Deve funcionar!

---

**Arquivo:** `SQL_COPIAR_COLAR_RAILWAY.sql` tem o SQL pronto para copiar! 🚀

