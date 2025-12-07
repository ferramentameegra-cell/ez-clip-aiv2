# 🚀 DEPLOY AGORA - GUIA RÁPIDO

## ✅ TUDO PRONTO!

- ✅ Build passou com sucesso
- ✅ Código corrigido
- ✅ Nome alterado para "EZ clip ai"
- ✅ Headers corrigidos

---

## 🚀 3 PASSOS PARA DEPLOY:

### **1. Fazer Push para GitHub**

Execute no terminal:

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
git add .
git commit -m "Deploy: EZ clip ai pronto"
git push origin main
```

**Se precisar autenticar:**
```bash
bash fazer-push.sh
```

---

### **2. Criar Projeto no Railway**

1. Acesse: **https://railway.app**
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Autorize Railway
5. Escolha o repositório: **"ez-clip-ai"**

Railway faz deploy automático! 🚀

---

### **3. Configurar Variáveis**

No Railway, vá em **"Variables"** e adicione:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=mysql://... (Railway fornece quando você criar MySQL)
JWT_SECRET=seu_secret_aleatorio

# Cloudflare R2 (você já tem)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_S3_ENDPOINT=...

# OpenAI (você já tem)
OPENAI_API_KEY=...
```

**Depois adicione MySQL:**
- Clique em **"New" → "Database" → "MySQL"**
- Railway cria e fornece `DATABASE_URL`

---

## 🌐 ACESSAR:

Após deploy, Railway fornece:
```
https://seu-projeto.up.railway.app
```

---

## 📝 DEPOIS DO DEPLOY:

1. Aplicar migrations: `railway run npm run db:push`
2. Atualizar `VITE_TRPC_URL` com a URL do Railway
3. Testar o site!

---

**Pronto para fazer deploy!** 🎉

Veja o guia completo em: `DEPLOY_RAILWAY_COMPLETO.md`

