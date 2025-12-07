# 🚀 DEPLOY NO RAILWAY - PASSO A PASSO

## ✅ BUILD PASSOU COM SUCESSO!

O projeto está pronto para deploy!

---

## 📋 CHECKLIST PRÉ-DEPLOY:

- ✅ Build funciona (`npm run build`)
- ✅ Dockerfile configurado
- ✅ Scripts no package.json corretos
- ✅ Nome alterado para "EZ clip ai"
- ✅ Headers corrigidos

---

## 🚀 PASSO 1: Fazer Push para GitHub

### 1.1. Verificar status do Git

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git status
```

### 1.2. Adicionar todas as mudanças

```bash
git add .
git commit -m "Correções: Header duplicado removido, nome alterado para EZ clip ai"
```

### 1.3. Fazer push para GitHub

```bash
git push origin main
```

**Se ainda não tiver repositório no GitHub:**

1. Acesse: https://github.com/new
2. Crie repositório: `ez-clip-ai`
3. Depois execute:

```bash
git remote add origin https://github.com/SEU_USUARIO/ez-clip-ai.git
git branch -M main
git push -u origin main
```

---

## 🚂 PASSO 2: Deploy no Railway

### 2.1. Criar Projeto no Railway

1. Acesse: https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize Railway a acessar seu GitHub
5. Selecione o repositório **"ez-clip-ai"**

### 2.2. Adicionar Banco MySQL

1. No dashboard do projeto, clique em **"New"**
2. Selecione **"Database" → "MySQL"**
3. Railway cria automaticamente
4. Copie a variável `DATABASE_URL` (será usada depois)

### 2.3. Configurar Variáveis de Ambiente

No Railway, vá em **"Variables"** e adicione:

#### OBRIGATÓRIAS:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=mysql://... (Railway fornece automaticamente)

# JWT
JWT_SECRET=seu_secret_aleatorio_aqui

# Cloudflare R2 (já configurado)
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=auto
AWS_S3_BUCKET=nome_do_seu_bucket
AWS_S3_ENDPOINT=https://seu_account_id.r2.cloudflarestorage.com

# OpenAI (já configurado)
OPENAI_API_KEY=sua_openai_key

# Frontend
VITE_TRPC_URL=https://seu-projeto.up.railway.app
```

#### OPCIONAIS (para depois):

```env
# Stripe (opcional)
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

### 2.4. Railway vai fazer deploy automaticamente!

Acompanhe os logs em tempo real. Deve levar ~5-10 minutos.

---

## ✅ PASSO 3: Aplicar Migrations

Após o deploy, execute no Railway:

1. Vá em **"Deployments"**
2. Clique no último deploy
3. Vá em **"Shell"**
4. Execute:

```bash
npm run db:push
```

Ou use Railway CLI:

```bash
railway run npm run db:push
```

---

## 🌐 PASSO 4: Acessar o Site

Railway fornece uma URL automática:

```
https://seu-projeto.up.railway.app
```

---

## 🔧 TROUBLESHOOTING:

### Erro: "Cannot find module"
- Verifique se todas as dependências estão no `package.json`
- Execute `npm install` localmente para garantir

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está correta
- Verifique se o banco MySQL foi criado

### Erro: "Port already in use"
- Railway define a porta automaticamente via `PORT`
- Não precisa configurar manualmente

---

## 📝 RESUMO RÁPIDO:

```bash
# 1. Fazer push
git add .
git commit -m "Ready for deploy"
git push origin main

# 2. Railway faz deploy automático

# 3. Adicionar variáveis de ambiente no Railway

# 4. Aplicar migrations
railway run npm run db:push

# 5. Acessar site!
```

---

**Pronto para fazer deploy!** 🚀

