# 🚀 COMANDOS PARA DEPLOY NO RAILWAY

## ✅ TUDO PRONTO!

Build passou com sucesso! Agora é só fazer deploy.

---

## 📋 COMANDOS (COPIE E COLE):

### 1. Fazer Push para GitHub

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git add .
git commit -m "Deploy: Correções aplicadas - EZ clip ai"
git push origin main
```

---

### 2. No Railway Dashboard:

1. **Acesse:** https://railway.app
2. **Clique:** "New Project"
3. **Selecione:** "Deploy from GitHub repo"
4. **Autorize:** Railway a acessar GitHub
5. **Escolha:** Repositório "ez-clip-ai"

Railway faz deploy automático! 🚀

---

### 3. Adicionar Variáveis de Ambiente

No Railway, vá em **"Variables"**:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=mysql://... (Railway fornece automaticamente)

JWT_SECRET=seu_jwt_secret_aleatorio
```

**Depois adicione as variáveis que você já tem:**
- Cloudflare R2 (AWS_ACCESS_KEY_ID, etc)
- OpenAI (OPENAI_API_KEY)
- E outras que já configurou

---

### 4. Adicionar Banco MySQL

No Railway:
1. Clique em **"New"**
2. Selecione **"Database" → "MySQL"**
3. Railway cria e fornece `DATABASE_URL` automaticamente

---

### 5. Aplicar Migrations

Após deploy, no Railway CLI ou Shell:

```bash
railway run npm run db:push
```

---

### 6. Acessar!

Railway fornece URL automaticamente:
```
https://seu-projeto.up.railway.app
```

---

## ⚡ RESUMO RÁPIDO:

```bash
# 1. Push para GitHub
git add . && git commit -m "Deploy" && git push origin main

# 2. Railway faz deploy automático

# 3. Configure variáveis no Railway

# 4. Pronto!
```

---

**Pronto para deploy!** 🎉

