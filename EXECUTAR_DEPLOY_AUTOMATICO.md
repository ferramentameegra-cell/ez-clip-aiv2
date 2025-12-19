# 🚀 Executar Deploy Automático Railway - Gentle Fulfillment

## ✅ Tudo Configurado!

O projeto está **100% pronto** para deploy automático no Railway. Basta executar um dos scripts abaixo.

---

## 🎯 Opção 1: Deploy Totalmente Automático (Recomendado)

Este script faz **TUDO** automaticamente sem perguntas:

```bash
./deploy-railway-automatico.sh
```

**O que ele faz:**
- ✅ Instala Railway CLI (se necessário)
- ✅ Faz login no Railway
- ✅ Linka projeto
- ✅ Configura todas variáveis básicas
- ✅ Tenta obter DATABASE_URL e REDIS_URL automaticamente
- ✅ Aplica migrations
- ✅ Configura domínio
- ✅ Faz deploy

---

## 🎯 Opção 2: Configuração Interativa Completa

Este script te guia passo a passo com perguntas:

```bash
./configurar-railway-completo.sh
```

**O que ele faz:**
- ✅ Cria ou linka projeto
- ✅ Pergunta sobre MySQL e Redis
- ✅ Configura domínio
- ✅ Configura variáveis opcionais (OpenAI, AWS, Stripe)
- ✅ Aplica migrations
- ✅ Faz deploy

---

## 📋 Pré-requisitos

### 1. Instalar Railway CLI (se ainda não tiver)

```bash
npm install -g @railway/cli
```

### 2. Fazer Login no Railway

```bash
railway login
```

Isso abrirá o navegador para autenticação.

---

## 🚀 Executar Agora

### Passo 1: Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### Passo 2: Executar Script Automático

```bash
cd /Users/josyasborba/Desktop/viral-clips-ai
./deploy-railway-automatico.sh
```

O script vai:
1. Verificar se Railway CLI está instalado
2. Fazer login (se necessário)
3. Linkar projeto
4. Configurar tudo automaticamente
5. Fazer deploy

---

## 📝 O Que Você Precisa Fazer Manualmente

### 1. Criar MySQL no Railway Dashboard

1. Acesse: https://railway.app
2. Seu Projeto → **"+ New"** → **"Database"** → **"Add MySQL"**
3. Aguarde MySQL ser criado
4. O script tentará obter `DATABASE_URL` automaticamente

### 2. Criar Redis no Railway Dashboard (Opcional mas Recomendado)

1. Railway → **"+ New"** → **"Database"** → **"Add Redis"**
2. Aguarde Redis ser criado
3. O script tentará obter `REDIS_URL` automaticamente

### 3. Gerar Domínio

1. Railway → Settings → **Domains**
2. Clique em **"Generate Domain"**
3. O script tentará configurar `FRONTEND_URL` automaticamente

---

## ✅ Após Executar o Script

O script vai mostrar:
- ✅ Status do projeto
- ✅ URLs do deploy
- ✅ Próximos passos

**Verificar logs:**
```bash
railway logs --follow
```

**Ver status:**
```bash
railway status
```

**Acessar site:**
- O script mostrará a URL do domínio gerado
- Exemplo: `https://seu-projeto.railway.app`

---

## 🔧 Comandos Úteis

### Ver todas variáveis
```bash
railway variables
```

### Adicionar variável
```bash
railway variables set NOME_VARIAVEL=valor
```

### Ver logs
```bash
railway logs
railway logs --follow
```

### Conectar ao MySQL
```bash
railway connect mysql
```

### Fazer redeploy
```bash
railway up
```

---

## 🐛 Problemas Comuns

### Erro: "railway: command not found"
**Solução:**
```bash
npm install -g @railway/cli
```

### Erro: "Not logged in"
**Solução:**
```bash
railway login
```

### Erro: "Project not linked"
**Solução:**
```bash
railway link
```

### Erro: "DATABASE_URL not found"
**Solução:**
1. Crie MySQL no Railway Dashboard
2. Copie `DATABASE_URL` do MySQL
3. Configure: `railway variables set DATABASE_URL=mysql://...`

---

## 📚 Documentação Completa

Veja `RAILWAY_GENTLE_FULFILLMENT.md` para documentação completa.

---

## 🎯 Pronto para Executar!

Tudo está configurado. Basta executar:

```bash
./deploy-railway-automatico.sh
```

E o Railway vai fazer o resto! 🚀
