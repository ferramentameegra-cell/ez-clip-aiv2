# ⚠️ ERRO: Unknown column 'onboarding_use_case' in 'field list'

## 🔍 Problema Identificado

Ao criar uma nova conta, o erro ocorre porque:
1. O código tenta **retornar** as colunas `onboarding_use_case`, `onboarding_niche`, `onboarding_at`
2. Essas colunas **não existem** no banco de dados do Railway

---

## ✅ SOLUÇÃO RÁPIDA: Adicionar Colunas no Banco

### **Executar no Railway:**

```sql
ALTER TABLE users 
ADD COLUMN onboarding_use_case TEXT,
ADD COLUMN onboarding_niche VARCHAR(255),
ADD COLUMN onboarding_at TIMESTAMP NULL;
```

---

## 📋 Como Executar

### **OPÇÃO 1: Railway Dashboard (Mais Fácil)**

1. Acesse: **https://railway.app**
2. Entre no projeto **"ez-clip-ai"**
3. Clique no serviço **"MySQL"** (ou banco de dados)
4. Clique em **"Query"** ou **"Connect"**
5. Cole e execute o SQL acima
6. ✅ Pronto!

---

### **OPÇÃO 2: Railway CLI**

```bash
# Conectar ao projeto
railway link

# Executar SQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "ALTER TABLE users ADD COLUMN onboarding_use_case TEXT, ADD COLUMN onboarding_niche VARCHAR(255), ADD COLUMN onboarding_at TIMESTAMP NULL;"
```

---

## 🔧 Verificar se Funcionou

Execute:

```sql
DESCRIBE users;
```

Procure por:
- ✅ `onboarding_use_case`
- ✅ `onboarding_niche`
- ✅ `onboarding_at`

---

## 📝 Arquivos Criados

1. ✅ `SQL_ADICIONAR_COLUNAS_ONBOARDING_SIMPLES.sql` - Script simples
2. ✅ `SQL_ADICIONAR_COLUNAS_ONBOARDING.sql` - Script com verificação
3. ✅ `COMO_APLICAR_MIGRATION_RAILWAY.md` - Guia completo

---

## 🎯 Próximos Passos

1. ✅ Executar SQL no Railway
2. ✅ Verificar se as colunas foram criadas
3. ✅ Tentar criar conta novamente
4. ✅ Testar se funciona

---

**Execute o SQL e tente criar a conta novamente!** 🚀

