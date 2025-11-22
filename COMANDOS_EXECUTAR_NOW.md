# ⚡ COMANDOS PARA EXECUTAR AGORA

## 🎯 O QUE FAZER AGORA (Passo a Passo)

### 1️⃣ Instalar Railway CLI (PRIMEIRO)

**No seu terminal, execute:**

```bash
curl -fsSL https://railway.app/install.sh | sh
```

**Quando pedir senha de administrador, digite sua senha do Mac.**

Depois, feche e abra o terminal novamente, ou execute:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

**Teste:**

```bash
railway --version
```

Se aparecer uma versão (ex: `v3.x.x`), está funcionando! ✅

---

### 2️⃣ Após Instalar Railway CLI

**Me avise quando tiver instalado**, e eu faço o resto automaticamente!

Ou execute manualmente (depois que eu fizer, você não precisa fazer isso):

```bash
# Login
railway login

# Conectar ao projeto
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway link

# Configurar variáveis (depois que você adicionar MySQL/Redis no dashboard)
JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set BUILT_IN_FORGE_API_URL=https://api.manus.im
railway variables set AWS_REGION=us-east-1
railway variables set AWS_S3_BUCKET=ez-clip-ai

# Aplicar migrations
railway run npm run db:push
```

---

### 3️⃣ No Dashboard Railway (Precisa Fazer Manualmente)

Você precisa fazer isso no dashboard web:

1. **Acesse:** https://railway.app/project
2. **Clique no projeto:** `ez-clip-ai`
3. **Adicionar MySQL:**
   - Clique em **"+ New"** → **"Database"** → **"MySQL"**
   - Aguarde 1-2 minutos
4. **Adicionar Redis:**
   - Clique em **"+ New"** → **"Database"** → **"Redis"**
   - Aguarde 1-2 minutos
5. **Gerar Domínio:**
   - Vá em **"Settings"** → **"Domains"**
   - Clique em **"Generate Domain"**
   - Copie o domínio gerado

---

## ✅ RESUMO

1. **Instalar Railway CLI** (precisa de senha - você faz)
2. **Me avise quando instalado** (eu faço o resto)
3. **Adicionar MySQL/Redis no dashboard** (você faz)
4. **Eu configuro tudo** (automatizado)

---

**Depois que você instalar o Railway CLI, me avise e eu faço TUDO automaticamente! 🚀**

