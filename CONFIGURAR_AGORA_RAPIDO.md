# ⚡ Configurar Railway Agora - Guia Rápido

## ✅ Projeto Criado! Agora Configure:

---

### 1️⃣ Variáveis Básicas

**Railway → Service → Variables → New Variable**

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

---

### 2️⃣ Criar MySQL

1. Railway → **"+ New"** → **"Database"** → **"Add MySQL"**
2. MySQL → **Variables** → Copiar `DATABASE_URL`
3. Service → **Variables** → Adicionar `DATABASE_URL`

---

### 3️⃣ Criar Redis (Opcional)

1. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
2. Redis → **Variables** → Copiar `REDIS_URL`
3. Service → **Variables** → Adicionar `REDIS_URL`

---

### 4️⃣ Gerar Domínio

1. Railway → **Settings** → **"Domains"** → **"Generate Domain"**
2. Copiar URL gerada
3. Service → **Variables** → Adicionar `FRONTEND_URL=https://sua-url.railway.app`

---

### 5️⃣ Aplicar Migrations

**Via Dashboard:**
- MySQL → **"Data"** → Execute SQL

**Via CLI:**
```bash
railway connect mysql
npm run db:push
```

---

## ✅ Checklist

- [ ] Variáveis básicas
- [ ] MySQL criado
- [ ] Redis criado (opcional)
- [ ] Domínio gerado
- [ ] Migrations aplicadas
- [ ] Site funcionando

---

**Comece agora pelo Passo 1!** 🚀
