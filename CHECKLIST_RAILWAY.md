# ✅ Checklist: Próximos Passos no Railway

Você já conectou o repositório! Agora precisa configurar o resto:

---

## 🔴 PRIORIDADE ALTA (Fazer AGORA)

### 1. ✅ Adicionar Banco de Dados MySQL

**No Railway:**
1. Clique no botão **"+ New"** (canto superior direito)
2. Clique em **"Database"**
3. Escolha **"MySQL"**
4. Aguarde 1-2 minutos

✅ Railway cria automaticamente a variável `DATABASE_URL`!

---

### 2. ✅ Adicionar Redis (Opcional mas Recomendado)

**No Railway:**
1. Clique novamente em **"+ New"**
2. Clique em **"Database"**
3. Escolha **"Redis"**
4. Aguarde 1-2 minutos

✅ Railway cria automaticamente a variável `REDIS_URL`!

---

### 3. ✅ Configurar Variáveis de Ambiente Essenciais

**No Railway, vá em "Variables" e adicione:**

#### OBRIGATÓRIAS (Precisa ter):

1. **JWT_SECRET**
   - Valor: Qualquer texto aleatório longo
   - Exemplo: `minhasenhasupersecreta123456789abcdefghijklmnop`

2. **NODE_ENV**
   - Valor: `production`

3. **PORT**
   - Valor: `3001`

#### OPCIONAIS (Pode deixar vazio por enquanto):

4. **BUILT_IN_FORGE_API_KEY**
   - Deixe vazio se não tiver (só precisa para transcrição)

5. **BUILT_IN_FORGE_API_URL**
   - Valor: `https://api.manus.im`

6. **AWS_ACCESS_KEY_ID**
   - Deixe vazio (só precisa para armazenar vídeos)

7. **AWS_SECRET_ACCESS_KEY**
   - Deixe vazio

8. **AWS_REGION**
   - Valor: `us-east-1`

9. **AWS_S3_BUCKET**
   - Valor: `ez-clip-ai`

10. **STRIPE_SECRET_KEY**
    - Deixe vazio (só precisa para pagamentos)

11. **VITE_STRIPE_PUBLISHABLE_KEY**
    - Deixe vazio

---

### 4. ✅ Aplicar Migrations (Criar Tabelas no Banco)

**Instalar Railway CLI:**

```bash
curl -fsSL https://railway.app/install.sh | sh
```

**Fazer login:**

```bash
railway login
```

**Conectar ao projeto:**

```bash
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
railway link
```

Escolha o projeto `ez-clip-ai` na lista.

**Criar tabelas:**

```bash
railway run npm run db:push
```

✅ **Se aparecer "✓ Push successful", está pronto!**

---

### 5. ✅ Configurar Domínio

**No Railway:**
1. Vá em **"Settings"** → **"Domains"**
2. Clique em **"Generate Domain"**
3. Railway cria um domínio tipo: `ez-clip-ai-production.up.railway.app`
4. **COPIE ESSE DOMÍNIO!**

**Atualizar variáveis:**
1. Volte para **"Variables"**
2. Adicione:
   - **FRONTEND_URL**: `https://seu-dominio.railway.app`
   - **VITE_TRPC_URL**: `https://seu-dominio.railway.app/trpc`

---

## 🟡 PRIORIDADE MÉDIA (Depois)

### 6. ⏳ Configurar APIs Externas (Quando precisar)

- **Manus Forge API** - Para transcrição de áudio
- **AWS S3** - Para armazenar vídeos
- **Stripe** - Para pagamentos

---

## ✅ Verificar se Funcionou

### Teste Básico:

1. Acesse seu domínio: `https://seu-dominio.railway.app`
2. Deve abrir a página do EZ CLIP AI!
3. Tente criar uma conta

---

## 🆘 Problemas Comuns

### "Site não abre"
- Verifique se o deploy está "Active" (verde)
- Veja os logs clicando no deploy
- Verifique se `PORT` está configurado

### "Erro de banco de dados"
- Verifique se MySQL foi criado
- Verifique se `DATABASE_URL` existe nas variáveis
- Rode novamente: `railway run npm run db:push`

### "Erro ao fazer build"
- Veja os logs do deploy
- Verifique se todas as dependências estão no `package.json`

---

## 📚 Documentação Completa

- **Guia completo:** `GUIA_PASSO_A_PASSO_RAILWAY.md`
- **Variáveis de ambiente:** `ENV_VARIABLES.md`

---

**Marque conforme for completando:**
- [ ] MySQL adicionado
- [ ] Redis adicionado
- [ ] Variáveis essenciais configuradas
- [ ] Migrations aplicadas
- [ ] Domínio gerado
- [ ] Site funcionando

---

**Boa sorte! 🚀**

