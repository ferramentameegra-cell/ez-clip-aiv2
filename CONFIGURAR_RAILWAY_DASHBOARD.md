# ✅ Configurar Railway via Dashboard - Passo a Passo Completo

## 🎯 Projeto Criado! Agora Configure Tudo:

**Projeto Railway:** https://railway.com/project/55a522bc-0e9d-4868-956f-f6301042057a

---

## 📋 Passo 1: Configurar Variáveis Básicas

1. **Acesse:** https://railway.com/project/55a522bc-0e9d-4868-956f-f6301042057a
2. Clique no **serviço principal** (ez-clip-aiv2)
3. Vá em **"Variables"** (menu lateral)
4. Clique em **"New Variable"**
5. Adicione uma por uma:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=swzr2Yl2Z/ebLEkbW8csjfFe8B7tsu6+zJWx+E8ripE=
```

**⚠️ IMPORTANTE:** Adicione cada variável separadamente (uma por vez).

---

## 📋 Passo 2: Criar MySQL

1. No mesmo projeto Railway, clique em **"+ New"** (canto superior direito)
2. Selecione **"Database"** → **"Add MySQL"**
3. Aguarde o MySQL ser criado (1-2 minutos)
4. Clique no serviço **MySQL** criado
5. Vá em **"Variables"**
6. Encontre **`MYSQL_URL`** e **copie o valor completo**
7. Volte para o **serviço principal** (ez-clip-aiv2)
8. Vá em **"Variables"** → **"New Variable"**
9. Adicione:
   - **Key:** `DATABASE_URL`
   - **Value:** (cole o valor de `MYSQL_URL` que você copiou)
10. Clique em **"Add"**

---

## 📋 Passo 3: Criar Redis (Opcional mas Recomendado)

1. No projeto Railway, clique em **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde o Redis ser criado
3. Clique no serviço **Redis** criado
4. Vá em **"Variables"**
5. Encontre **`REDIS_URL`** e **copie o valor completo**
6. Volte para o **serviço principal** (ez-clip-aiv2)
7. Vá em **"Variables"** → **"New Variable"**
8. Adicione:
   - **Key:** `REDIS_URL`
   - **Value:** (cole o valor de `REDIS_URL` que você copiou)
9. Clique em **"Add"**

---

## 📋 Passo 4: Gerar Domínio

1. No **serviço principal** (ez-clip-aiv2), clique em **"Settings"** (menu lateral)
2. Vá em **"Domains"**
3. Clique em **"Generate Domain"**
4. Aguarde o domínio ser gerado (ex: `https://ez-clip-aiv2-production.up.railway.app`)
5. **Anote a URL completa gerada**
6. Volte para **"Variables"**
7. Clique em **"New Variable"**
8. Adicione:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://sua-url.railway.app` (cole a URL gerada)
9. Clique em **"Add"**

---

## 📋 Passo 5: Verificar Deploy

1. Vá em **"Deployments"** (menu lateral)
2. Clique no deploy mais recente
3. Clique em **"View Logs"**
4. Aguarde o build completar (3-5 minutos)
5. Verifique se não há erros

---

## 📋 Passo 6: Aplicar Migrations (Importante!)

### Opção A: Via Railway Dashboard

1. Clique no serviço **MySQL**
2. Vá em **"Data"** ou **"Query"**
3. Execute o SQL necessário
4. Veja `drizzle/schema.ts` para entender as tabelas

### Opção B: Via Terminal (Se tiver Railway CLI)

```bash
# Instalar Railway CLI primeiro
npm install -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Conectar ao MySQL
railway connect mysql

# Em outro terminal, aplicar migrations
cd /Users/josyasborba/Desktop/viral-clips-ai
npm run db:push
```

---

## ✅ Checklist Completo

Antes de considerar tudo configurado:

- [ ] Variáveis básicas configuradas (NODE_ENV, PORT, JWT_SECRET)
- [ ] MySQL criado
- [ ] DATABASE_URL configurado (copiado de MYSQL_URL)
- [ ] Redis criado (opcional)
- [ ] REDIS_URL configurado (se criou Redis)
- [ ] Domínio gerado
- [ ] FRONTEND_URL configurado
- [ ] Build completou com sucesso
- [ ] Migrations aplicadas
- [ ] Site acessível no domínio gerado
- [ ] Health check funcionando (`/health`)

---

## 🧪 Testar Após Configuração

Depois de tudo configurado, teste:

1. **Health Check:**
   ```
   https://seu-dominio.railway.app/health
   ```

2. **Frontend:**
   ```
   https://seu-dominio.railway.app
   ```

3. **API:**
   ```
   https://seu-dominio.railway.app/api
   ```

---

## 🐛 Troubleshooting

### Build Falhou
- Verifique logs: Deployments → View Logs
- Certifique-se que todas variáveis estão configuradas
- Verifique se `package.json` tem scripts `build` e `start`

### Database Connection Failed
- Verifique se `DATABASE_URL` está correto
- Certifique-se que copiou o valor completo de `MYSQL_URL`
- Verifique se MySQL está rodando

### Site Não Carrega
- Verifique logs do Railway
- Certifique-se que `FRONTEND_URL` está configurado
- Teste o endpoint `/health` primeiro

---

## 🚀 Próximos Passos

Após tudo configurado e funcionando:

1. ✅ Testar todas funcionalidades
2. ✅ Configurar variáveis opcionais (OpenAI, AWS S3, etc.)
3. ✅ Configurar domínio customizado (opcional)
4. ✅ Configurar webhooks (Stripe, etc.)
5. ✅ Adicionar monitoramento

---

**Status:** ✅ **Guia completo para configurar via Dashboard!**

**Comece pelo Passo 1: Configurar Variáveis Básicas** 🚀
