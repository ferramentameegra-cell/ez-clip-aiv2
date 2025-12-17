# 🗑️ Como Deletar Usuários da Base de Dados

## 📋 Usuários a Deletar

- `josyasborba@hotmail.com`
- `daniel.braun@hotmail.com`

---

## ✅ MÉTODO 1: Via Railway Dashboard (Mais Fácil)

1. **Acesse:** https://railway.app
2. **Entre** no projeto **"ez-clip-ai"**
3. **Clique** no serviço **"MySQL"**
4. **Vá** na aba **"Query"** ou **"Data"**
5. **Cole** este SQL:

```sql
-- Verificar usuários antes de deletar
SELECT id, email, name, role, credits, created_at 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');

-- Deletar usuários
DELETE FROM users WHERE email = 'josyasborba@hotmail.com';
DELETE FROM users WHERE email = 'daniel.braun@hotmail.com';

-- Verificar se foram deletados (não deve retornar nada)
SELECT id, email, name 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');
```

6. **Clique** em **"Run"** ou **"Execute"**
7. ✅ **Pronto!**

---

## 🔧 MÉTODO 2: Via Script Node.js

Execute no terminal:

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai

# Certifique-se de ter DATABASE_URL configurada
# Execute o script
node scripts/deletar-usuarios.js
```

**Nota:** O script precisa da variável `DATABASE_URL` configurada no ambiente.

---

## 📝 SQL Completo

Arquivo: `DELETAR_USUARIOS.sql`

```sql
-- Verificar usuários antes de deletar
SELECT id, email, name, role, credits, created_at 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');

-- Deletar usuários
DELETE FROM users WHERE email = 'josyasborba@hotmail.com';
DELETE FROM users WHERE email = 'daniel.braun@hotmail.com';

-- Verificar se foram deletados
SELECT id, email, name 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');
```

---

## ⚠️ ATENÇÃO

- Esta operação é **IRREVERSÍVEL**
- Os dados dos usuários serão **permanentemente deletados**
- Jobs e clipes associados a esses usuários podem ser afetados

---

## ✅ Verificação

Após executar, verifique se os usuários foram deletados:

```sql
SELECT id, email, name 
FROM users 
WHERE email IN ('josyasborba@hotmail.com', 'daniel.braun@hotmail.com');
```

**Resultado esperado:** Nenhuma linha retornada (usuários deletados)

---

**O método mais fácil é pelo Dashboard do Railway!** 🚀

