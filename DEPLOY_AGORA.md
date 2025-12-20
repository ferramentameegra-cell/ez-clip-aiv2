# 🚀 Deploy Agora - EZ Clips AI

## ✅ Deploy no Railway (Passo a Passo Rápido)

### 1️⃣ Acessar Railway
```
https://railway.app
```
Faça login (pode usar conta GitHub)

---

### 2️⃣ Criar Projeto
1. Clique em **"+ New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Autorize Railway (se necessário)
4. Selecione: **`ferramentameegra-cell/ez-clip-aiv2`**
5. Clique em **"Deploy Now"**

✅ Railway vai detectar automaticamente e começar o build!

---

### 3️⃣ Configurar Variáveis

**Railway → Seu Projeto → Service → Variables → "New Variable"**

Adicione:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

---

### 4️⃣ Criar MySQL

1. Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
2. Aguarde criar (1-2 min)
3. MySQL → **Variables** → Copiar `DATABASE_URL`
4. Serviço principal → **Variables** → Adicionar `DATABASE_URL`

---

### 5️⃣ Criar Redis (Opcional)

1. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde criar
3. Redis → **Variables** → Copiar `REDIS_URL`
4. Serviço principal → **Variables** → Adicionar `REDIS_URL`

---

### 6️⃣ Gerar Domínio

1. Railway → **Settings** → **"Domains"**
2. Clique em **"Generate Domain"**
3. Anote a URL (ex: `https://ez-clip-aiv2-production.up.railway.app`)
4. Atualize `FRONTEND_URL` nas variáveis

---

### 7️⃣ Aplicar Migrations

**Via Dashboard:**
- Railway → MySQL → **"Data"** → Execute SQL necessário

**Via CLI:**
```bash
railway connect mysql
npm run db:push
```

---

## ✅ Verificar Deploy

- Health: `https://seu-projeto.railway.app/health`
- Site: `https://seu-projeto.railway.app`

---

## 🎯 Pronto!

Seu EZ Clips AI está no ar! 🚀

**Documentação completa:** Veja `DEPLOY_RAILWAY_COMPLETO.md`
