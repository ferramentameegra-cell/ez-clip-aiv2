# 🔧 Executar SQL no Railway - GUIA RÁPIDO

## ⚠️ ERRO: Unknown column 'onboarding_use_case'

**Problema:** As colunas de onboarding não existem no banco do Railway.

---

## ✅ SOLUÇÃO: Executar SQL no Railway

### **OPÇÃO 1: Via Railway Dashboard (Mais Fácil)** ⭐

1. Acesse: **https://railway.app**
2. Entre no projeto **"ez-clip-ai"**
3. Clique no serviço **"MySQL"** (ou banco de dados)
4. Vá na aba **"Query"** ou **"Data"**
5. Cole este SQL:

```sql
ALTER TABLE users ADD COLUMN onboarding_use_case TEXT;
ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255);
ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;
```

6. Clique em **"Run"** ou **"Execute"**
7. ✅ Pronto!

---

### **OPÇÃO 2: Via Railway CLI**

```bash
# 1. Instalar CLI (se não tiver)
npm i -g @railway/cli

# 2. Fazer login
railway login

# 3. Conectar ao projeto
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway link

# 4. Executar SQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "ALTER TABLE users ADD COLUMN onboarding_use_case TEXT; ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255); ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;"
```

---

### **OPÇÃO 3: Copiar SQL Direto**

Copie e cole no Railway:

```sql
ALTER TABLE users ADD COLUMN onboarding_use_case TEXT;
ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255);
ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;
```

---

## ✅ Verificar se Funcionou

Execute:

```sql
DESCRIBE users;
```

Ou:

```sql
SHOW COLUMNS FROM users LIKE 'onboarding%';
```

Você deve ver:
- ✅ `onboarding_use_case`
- ✅ `onboarding_niche`
- ✅ `onboarding_at`

---

## 🎯 Próximos Passos

1. ✅ Executar SQL acima
2. ✅ Verificar colunas criadas
3. ✅ Tentar criar conta novamente
4. ✅ Deve funcionar! 🎉

---

**Execute o SQL e teste criar a conta novamente!** 🚀

