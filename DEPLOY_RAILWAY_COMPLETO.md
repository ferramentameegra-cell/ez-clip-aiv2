# 🚀 DEPLOY COMPLETO NO RAILWAY - EZ CLIP AI

## ✅ STATUS: PRONTO PARA DEPLOY!

- ✅ Build passou com sucesso
- ✅ Repositório conectado ao GitHub: `ferramentameegra-cell/ez-clip-ai`
- ✅ Dockerfile configurado
- ✅ Todos os arquivos prontos

---

## 🚀 PASSO A PASSO COMPLETO:

### **PASSO 1: Fazer Push para GitHub**

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git add .
git commit -m "Deploy: EZ clip ai - Correções aplicadas"
git push origin main
```

**OU use o script automático:**

```bash
bash fazer-push.sh
```

---

### **PASSO 2: Criar Projeto no Railway**

1. Acesse: **https://railway.app**
2. Faça login (ou crie conta grátis)
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Autorize Railway a acessar seu GitHub (primeira vez)
6. Selecione o repositório **"ez-clip-ai"**

✅ Railway detecta automaticamente e começa o deploy!

---

### **PASSO 3: Adicionar Banco MySQL**

No dashboard do projeto Railway:

1. Clique em **"New"** (botão verde)
2. Selecione **"Database" → "MySQL"**
3. Railway cria automaticamente
4. Aguarde ~30 segundos
5. Clique no serviço MySQL
6. Vá na aba **"Variables"**
7. **COPIE** o valor de `MYSQL_URL` ou `DATABASE_URL`

---

### **PASSO 4: Configurar Variáveis de Ambiente**

No projeto principal Railway, vá em **"Variables"** e adicione:

#### **VARIÁVEIS OBRIGATÓRIAS:**

```env
# Porta (Railway define automaticamente, mas vamos garantir)
PORT=3001
NODE_ENV=production

# Banco de Dados (copie do MySQL que você criou)
DATABASE_URL=mysql://... (valor do MySQL que você copiou)

# JWT (crie um segredo aleatório forte)
JWT_SECRET=ez_clip_ai_jwt_secret_2025_xyz123456789

# Cloudflare R2 (você já configurou antes)
AWS_ACCESS_KEY_ID=sua_access_key_r2
AWS_SECRET_ACCESS_KEY=sua_secret_key_r2
AWS_REGION=auto
AWS_S3_BUCKET=nome_do_seu_bucket_r2
AWS_S3_ENDPOINT=https://seu_account_id.r2.cloudflarestorage.com

# OpenAI (você já configurou)
OPENAI_API_KEY=sua_openai_api_key
```

#### **VARIÁVEL IMPORTANTE - VITE_TRPC_URL:**

Depois que Railway finalizar o deploy e fornecer a URL, você precisa adicionar:

```env
VITE_TRPC_URL=https://seu-projeto.up.railway.app
```

**Como descobrir a URL:**
- No Railway, vá em **"Settings" → "Domains"**
- Railway fornece automaticamente: `seu-projeto.up.railway.app`

---

### **PASSO 5: Aguardar Deploy**

Railway faz deploy automaticamente! 

Acompanhe os logs em tempo real no dashboard.

**Tempo estimado:** ~5-10 minutos

**Você verá:**
```
[INFO] Installing dependencies...
[INFO] Building application...
[INFO] Starting server...
```

---

### **PASSO 6: Aplicar Migrations (Criar Tabelas)**

Após o deploy concluir, execute:

**Via Railway Dashboard:**

1. Vá em **"Deployments"**
2. Clique no último deploy
3. Clique em **"Shell"** ou **"Open Shell"**
4. Execute:

```bash
npm run db:push
```

**OU via Railway CLI (se tiver instalado):**

```bash
railway run npm run db:push
```

---

### **PASSO 7: Atualizar VITE_TRPC_URL**

1. No Railway, vá em **"Settings" → "Domains"**
2. Copie a URL fornecida (ex: `https://ez-clip-ai-production.up.railway.app`)
3. Vá em **"Variables"**
4. Adicione/atualize:

```env
VITE_TRPC_URL=https://ez-clip-ai-production.up.railway.app
```

5. Railway faz redeploy automático! (~2-3 minutos)

---

### **PASSO 8: Testar o Site!**

Acesse a URL fornecida pelo Railway:

```
https://seu-projeto.up.railway.app
```

---

## ✅ CHECKLIST FINAL:

- [ ] Push para GitHub feito
- [ ] Projeto criado no Railway
- [ ] Banco MySQL adicionado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy concluído com sucesso
- [ ] Migrations aplicadas
- [ ] VITE_TRPC_URL configurada
- [ ] Site acessível

---

## 🎉 PRONTO!

Seu site estará no ar! 🚀

---

## 📝 NOTAS:

- ✅ Railway fornece HTTPS automaticamente
- ✅ Deploy automático a cada push no GitHub
- ✅ MySQL é gerenciado pelo Railway
- ✅ FFmpeg já está no Dockerfile
- ✅ PORT é detectado automaticamente

---

## 🐛 TROUBLESHOOTING:

### Erro: "Cannot connect to database"
- Verifique se `DATABASE_URL` está correta
- Verifique se o MySQL foi criado

### Erro: "Build failed"
- Verifique os logs no Railway
- Verifique se todas as dependências estão no `package.json`

### Site não carrega
- Verifique se `VITE_TRPC_URL` está configurada
- Verifique se o deploy concluiu
- Verifique os logs de erro

---

**Boa sorte com o deploy!** 🚀

