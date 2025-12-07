# 🚀 DEPLOY NO RAILWAY - AGORA!

## ✅ TUDO PRONTO PARA DEPLOY!

Build passou com sucesso! ✅

---

## 📋 PASSO A PASSO COMPLETO:

### **1️⃣ Fazer Push para GitHub**

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git add .
git commit -m "Deploy: EZ clip ai - Correções aplicadas"
git push origin main
```

**Se precisar autenticar no GitHub**, veja: `PUSH_PARA_GITHUB.md`

---

### **2️⃣ Criar Projeto no Railway**

1. Acesse: **https://railway.app**
2. Faça login (ou crie conta grátis)
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Autorize Railway a acessar seu GitHub
6. Selecione o repositório **"ez-clip-ai"**

✅ Railway detecta automaticamente que é Node.js e começa o deploy!

---

### **3️⃣ Adicionar Banco MySQL**

No dashboard do projeto Railway:

1. Clique em **"New"** (botão verde)
2. Selecione **"Database" → "MySQL"**
3. Railway cria automaticamente
4. Vá em **"Variables"** do MySQL
5. **Copie** a variável `DATABASE_URL` (será usada depois)

---

### **4️⃣ Configurar Variáveis de Ambiente**

No projeto principal Railway, vá em **"Variables"** e adicione:

#### **OBRIGATÓRIAS:**

```env
PORT=3001
NODE_ENV=production

# Banco (copie do MySQL que você criou)
DATABASE_URL=mysql://... (Railway fornece)

# JWT (crie um segredo aleatório)
JWT_SECRET=seu_secret_aleatorio_aqui_123456789

# Cloudflare R2 (você já tem)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=auto
AWS_S3_BUCKET=nome_do_seu_bucket_r2
AWS_S3_ENDPOINT=https://seu_account_id.r2.cloudflarestorage.com

# OpenAI (você já tem)
OPENAI_API_KEY=sua_openai_key
```

#### **IMPORTANTE - VITE_TRPC_URL:**

Depois que Railway der a URL do projeto, adicione:

```env
VITE_TRPC_URL=https://seu-projeto.up.railway.app
```

Railway vai fazer redeploy automaticamente!

---

### **5️⃣ Aguardar Deploy**

Railway faz deploy automaticamente! Acompanhe os logs em tempo real.

**Tempo:** ~5-10 minutos

---

### **6️⃣ Aplicar Migrations (Criar Tabelas)**

Após o deploy, no Railway:

**Opção A: Via Shell (recomendado)**

1. Vá em **"Deployments"**
2. Clique no último deploy
3. Clique em **"Shell"** ou **"Open Shell"**
4. Execute:

```bash
npm run db:push
```

**Opção B: Via Railway CLI**

```bash
railway run npm run db:push
```

---

### **7️⃣ Atualizar VITE_TRPC_URL**

1. No Railway, copie a URL do projeto (ex: `https://ez-clip-ai-production.up.railway.app`)
2. Vá em **"Variables"**
3. Adicione/atualize:

```env
VITE_TRPC_URL=https://seu-projeto.up.railway.app
```

4. Railway faz redeploy automático!

---

### **8️⃣ Acessar o Site!**

Railway fornece URL automaticamente:

```
https://seu-projeto.up.railway.app
```

---

## ✅ PRONTO!

O site estará no ar! 🎉

---

## 📝 NOTAS IMPORTANTES:

- ✅ Railway fornece HTTPS automaticamente
- ✅ Deploy automático a cada push no GitHub
- ✅ MySQL é gerenciado pelo Railway
- ✅ FFmpeg já está configurado no Dockerfile
- ✅ PORT é detectado automaticamente pelo Railway

---

## 🐛 Se algo der errado:

1. Verifique os logs no Railway
2. Verifique se todas as variáveis estão configuradas
3. Verifique se o banco MySQL foi criado
4. Me envie os erros que aparecerem!

---

**Vamos fazer o deploy!** 🚀

