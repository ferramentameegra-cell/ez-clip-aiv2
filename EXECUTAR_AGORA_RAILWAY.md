# ⚡ Executar Agora - Configuração Railway

## ✅ Projeto Criado! Configure Agora:

**Link do Projeto:** https://railway.com/project/55a522bc-0e9d-4868-956f-f6301042057a

---

## 🚀 Passos Rápidos (5 minutos)

### 1️⃣ Variáveis Básicas
**Railway → Service → Variables → New Variable**

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

### 2️⃣ Criar MySQL
- "+ New" → "Database" → "Add MySQL"
- MySQL → Variables → Copiar `MYSQL_URL`
- Service → Variables → Adicionar `DATABASE_URL` = (valor copiado)

### 3️⃣ Criar Redis (Opcional)
- "+ New" → "Database" → "Add Redis"
- Redis → Variables → Copiar `REDIS_URL`
- Service → Variables → Adicionar `REDIS_URL` = (valor copiado)

### 4️⃣ Gerar Domínio
- Settings → "Domains" → "Generate Domain"
- Copiar URL gerada
- Variables → Adicionar `FRONTEND_URL` = (URL gerada)

### 5️⃣ Aplicar Migrations
- MySQL → "Data" → Execute SQL necessário
- Ou via CLI: `railway connect mysql && npm run db:push`

---

## ✅ Checklist Rápido

- [ ] Variáveis básicas
- [ ] MySQL criado + DATABASE_URL
- [ ] Redis criado + REDIS_URL (opcional)
- [ ] Domínio gerado + FRONTEND_URL
- [ ] Migrations aplicadas
- [ ] Build completou
- [ ] Site funcionando

---

## 🔗 Links Úteis

- **Projeto Railway:** https://railway.com/project/55a522bc-0e9d-4868-956f-f6301042057a
- **Repositório GitHub:** https://github.com/ferramentameegra-cell/ez-clip-aiv2

---

**Comece agora pelo Passo 1!** 🚀
