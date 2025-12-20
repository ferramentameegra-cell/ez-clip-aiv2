# 🚀 Como Conectar GitHub ao Railway - AGORA

## ✅ Caminho Mais Rápido e Fácil

---

## 🎯 MÉTODO 1: Via Dashboard (Recomendado - Mais Fácil)

### 1️⃣ Acessar Railway
```
https://railway.app
```
- Faça login (pode usar conta GitHub)

### 2️⃣ Criar Novo Projeto
- Clique em **"+ New Project"** (canto superior direito)
- Selecione **"Deploy from GitHub repo"**

### 3️⃣ Autorizar Railway (Primeira Vez)
- GitHub vai pedir autorização
- Clique em **"Authorize Railway"**
- Selecione o repositório criado (ou "All repositories")
- Clique em **"Install & Authorize"**

### 4️⃣ Selecionar Repositório
- Na lista, encontre seu repositório (ex: `viral-clips-ai`)
- Clique nele
- Railway vai começar deploy automaticamente ✅

### 5️⃣ Aguardar Deploy
- Aguarde 3-5 minutos
- Acompanhe em **"Deployments"** → **"View Logs"**

**PRONTO! Repositório conectado! 🎉**

---

## 🎯 MÉTODO 2: Via Script Automatizado (Mais Rápido)

Execute no terminal:

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
./deploy-railway-automatico.sh
```

O script faz TUDO automaticamente:
- ✅ Instala Railway CLI
- ✅ Faz login
- ✅ Cria projeto
- ✅ Conecta ao GitHub
- ✅ Configura variáveis
- ✅ Faz deploy

---

## 🎯 MÉTODO 3: Via Railway CLI Manual

### Passo 1: Instalar CLI
```bash
npm install -g @railway/cli
```

### Passo 2: Login
```bash
railway login
```
(Abre navegador para autenticação)

### Passo 3: Criar Projeto
```bash
railway init
```

Escolha:
- **"Create a new project"**
- Nome: `viral-clips-ai` (ou o que preferir)
- **"Deploy from GitHub repo"**
- Selecione seu repositório

### Passo 4: Deploy
```bash
railway up
```

---

## 📋 Depois de Conectar - Configurar

### 1. Variáveis Básicas (Railway → Variables)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

### 2. Criar MySQL
- Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
- Copiar `DATABASE_URL` → Adicionar nas variáveis

### 3. Criar Redis (Opcional)
- Railway → **"+ New"** → **"Database"** → **"Add Redis"**
- Copiar `REDIS_URL` → Adicionar nas variáveis

### 4. Gerar Domínio
- Railway → Settings → **"Domains"** → **"Generate Domain"**
- Atualizar `FRONTEND_URL` nas variáveis

---

## ✅ Resumo Rápido

**Opção Mais Fácil:**
1. Acesse: https://railway.app
2. **"+ New Project"** → **"Deploy from GitHub repo"**
3. Autorize e selecione seu repositório
4. PRONTO! ✅

**Opção Automatizada:**
```bash
./deploy-railway-automatico.sh
```

---

## 🐛 Problemas?

### "Repository not found"
- Verifique se autorizou Railway no GitHub
- GitHub → Settings → Applications → Railway

### "Build failed"
- Verifique logs: Railway → Deployments → View Logs
- Certifique-se que `package.json` tem `build` e `start`

---

## 🚀 Execute Agora!

**Opção 1 (Dashboard):**
1. https://railway.app
2. "+ New Project" → "Deploy from GitHub repo"
3. Selecionar repositório

**Opção 2 (Script):**
```bash
./deploy-railway-automatico.sh
```

---

**Status:** ✅ **Pronto para conectar!**
