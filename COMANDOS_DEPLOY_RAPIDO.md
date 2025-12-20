# ⚡ Deploy Rápido - Comandos para Copiar e Colar

## 🚀 Método Dashboard (Recomendado)

### 1. Acessar Railway
```
https://railway.app
```

### 2. Criar Projeto
- "+ New Project" → "Deploy from GitHub repo"
- Selecionar: `ferramentameegra-cell/ez-clip-aiv2`
- Deploy Now

### 3. Variáveis Básicas (Railway → Variables)

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

### 4. Criar MySQL
- "+ New" → "Database" → "Add MySQL"
- Copiar `DATABASE_URL` → Adicionar nas variáveis

### 5. Criar Redis (Opcional)
- "+ New" → "Database" → "Add Redis"
- Copiar `REDIS_URL` → Adicionar nas variáveis

### 6. Gerar Domínio
- Settings → "Domains" → "Generate Domain"
- Atualizar `FRONTEND_URL` com a URL gerada

---

## 🚀 Método CLI (Se tiver Railway CLI instalado)

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Criar/linkar projeto
railway init
# ou
railway link

# Configurar variáveis
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=

# Criar MySQL e Redis no Dashboard primeiro
# Depois configurar URLs:
railway variables set DATABASE_URL=mysql://...
railway variables set REDIS_URL=redis://...

# Deploy
railway up

# Aplicar migrations
railway connect mysql
npm run db:push
```

---

## ✅ Checklist Rápido

- [ ] Railway conectado ao GitHub
- [ ] Build completou
- [ ] Variáveis configuradas
- [ ] MySQL criado
- [ ] Redis criado (opcional)
- [ ] Migrations aplicadas
- [ ] Domínio gerado
- [ ] Site funcionando

---

**Recomendado:** Use o Dashboard - mais fácil! 🚀
