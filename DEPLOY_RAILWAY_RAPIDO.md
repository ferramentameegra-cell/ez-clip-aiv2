# 🚀 DEPLOY RÁPIDO NO RAILWAY

## ✅ STATUS: PRONTO PARA DEPLOY!

Build passou com sucesso! ✅

---

## 🚀 PASSO A PASSO:

### **PASSO 1: Fazer Push para GitHub**

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git add .
git commit -m "Deploy: Correções aplicadas, nome alterado para EZ clip ai"
git push origin main
```

---

### **PASSO 2: Criar Projeto no Railway**

1. Acesse: **https://railway.app**
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize Railway
5. Selecione o repositório **"ez-clip-ai"**

Railway vai detectar automaticamente e fazer deploy!

---

### **PASSO 3: Adicionar Banco MySQL**

No dashboard do projeto Railway:

1. Clique em **"New"**
2. Selecione **"Database" → "MySQL"**
3. Railway cria automaticamente
4. **Copie** a variável `DATABASE_URL`

---

### **PASSO 4: Configurar Variáveis de Ambiente**

No Railway, vá em **"Variables"** e adicione:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=mysql://... (Railway fornece)

JWT_SECRET=seu_secret_aleatorio_aqui

# Cloudflare R2 (já configurado)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=auto
AWS_S3_BUCKET=nome_do_bucket
AWS_S3_ENDPOINT=https://seu_account_id.r2.cloudflarestorage.com

# OpenAI (já configurado)
OPENAI_API_KEY=sua_openai_key

# Frontend (será configurado depois que Railway der a URL)
VITE_TRPC_URL=https://seu-projeto.up.railway.app
```

---

### **PASSO 5: Aguardar Deploy**

Railway faz deploy automaticamente! Acompanhe os logs.

Tempo estimado: **5-10 minutos**

---

### **PASSO 6: Aplicar Migrations**

Após o deploy, execute no Railway:

1. Vá em **"Deployments"**
2. Clique no último deploy
3. Vá em **"Shell"** ou use Railway CLI:

```bash
railway run npm run db:push
```

---

### **PASSO 7: Atualizar VITE_TRPC_URL**

1. No Railway, copie a URL do seu projeto (ex: `https://ez-clip-ai.up.railway.app`)
2. Vá em **"Variables"**
3. Atualize `VITE_TRPC_URL` com a URL completa:

```env
VITE_TRPC_URL=https://ez-clip-ai.up.railway.app
```

4. Railway faz redeploy automaticamente!

---

### **PASSO 8: Acessar o Site!**

```
https://seu-projeto.up.railway.app
```

---

## ✅ PRONTO!

O site estará no ar! 🎉

---

## 📝 NOTAS:

- Railway fornece HTTPS automaticamente
- Deploy é automático a cada push no GitHub
- MySQL é gerenciado pelo Railway
- FFmpeg já está no Dockerfile

---

**Vamos fazer o deploy?** 🚀

