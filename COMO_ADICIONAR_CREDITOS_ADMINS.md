# 🔥 ADICIONAR 1000 CRÉDITOS PARA ADMINS

## 📋 OPÇÃO 1: Via SQL no Railway (MAIS FÁCIL) ⭐

### **Passo a Passo:**

1. **Acesse Railway Dashboard:**
   - https://railway.app
   - Projeto: `ez-clip-ai`
   - Clique no serviço **"MySQL"**

2. **Vá na Aba "Query":**
   - Clique em **"Query"** ou **"Connect"**

3. **Cole e Execute:**

```sql
UPDATE users 
SET credits = credits + 1000 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');

-- Verificar se foi aplicado
SELECT id, name, email, credits 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');
```

4. ✅ **Pronto!**

---

## 📋 OPÇÃO 2: Via Script Node.js

### **Execute no Railway:**

```bash
railway run node scripts/adicionar-creditos-admins.js
```

---

## 📋 OPÇÃO 3: Via Painel Admin (Após deploy)

1. Acesse o site como admin
2. Vá em `/admin/users`
3. Clique em editar cada usuário
4. Adicione 1000 créditos

---

## ✅ VERIFICAR

Execute no Railway Query:

```sql
SELECT id, name, email, credits 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');
```

**Deve mostrar:**
- ✅ `credits` = 1000+ para cada email

---

**📁 Arquivo SQL:** `SQL_ADICIONAR_CREDITOS_ADMINS.sql` tem o SQL pronto para copiar! 🚀

