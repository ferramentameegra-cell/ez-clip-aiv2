# 📍 ONDE ADICIONAR MYSQL NO RAILWAY - Passo a Passo Visual

## 🎯 Passo a Passo Detalhado

### Passo 1: Acessar o Dashboard do Railway

1. Abra seu navegador (Chrome, Firefox, Safari)
2. Acesse: **https://railway.app**
3. Faça login se necessário

---

### Passo 2: Entrar no Projeto

1. Você verá uma lista de projetos no dashboard
2. **Procure e clique no projeto:** `gentle-fulfillment`
   - Ou pode aparecer como `ez-clip-ai`
   - É o projeto que você acabou de conectar

---

### Passo 3: Encontrar o Botão "+ New"

1. **Olhe no canto superior direito** da tela
2. Você verá um botão grande que diz:
   - **"+ New"** 
   - Ou **"+ Add"**
   - Ou um ícone **"+"** verde/azul

**📸 Onde está:**
```
┌─────────────────────────────────────────┐
│ Railway Dashboard                       │
│                                         │
│  [Projeto: gentle-fulfillment]          │
│                                         │
│                           [+ New] ← AQUI│
└─────────────────────────────────────────┘
```

---

### Passo 4: Adicionar MySQL

1. **Clique no botão "+ New"** (canto superior direito)
2. Vai abrir um menu com opções:
   - "Database" ← **Clique aqui**
   - "Empty Service"
   - "Template"
   - etc.
3. **Clique em "Database"**
4. Vai aparecer uma lista de bancos de dados:
   - **MySQL** ← **Clique aqui**
   - PostgreSQL
   - MongoDB
   - Redis
   - etc.
5. **Clique em "MySQL"**

---

### Passo 5: Aguardar

1. Railway vai começar a criar o MySQL
2. **Aguarde 1-2 minutos**
3. Você verá uma barra de progresso ou "Provisioning..."
4. Quando terminar, aparecerá:
   - ✅ "MySQL provisioned"
   - Ou um card verde com o MySQL criado

**✅ Railway cria automaticamente a variável `DATABASE_URL`!**

---

### Passo 6: Adicionar Redis (Mesmo Processo)

1. **Clique em "+ New"** novamente (mesmo lugar - canto superior direito)
2. **Clique em "Database"**
3. **Escolha "Redis"**
4. **Aguarde 1-2 minutos**

**✅ Railway cria automaticamente a variável `REDIS_URL`!**

---

## 🔍 SE NÃO ENCONTRAR O BOTÃO "+ New"

### Alternativa 1: Menu Lateral

1. **Olhe no menu lateral esquerdo**
2. Pode haver um botão **"+ Add Service"** ou **"+ New Service"**
3. Clique nele

### Alternativa 2: Tab "Services"

1. **Clique na aba "Services"** (no topo)
2. Lá pode haver um botão **"+ New"** ou **"Add Service"**

### Alternativa 3: URL Direta

Se estiver no projeto, tente:
- **https://railway.app/project/[seu-project-id]/databases/new**

---

## 📸 O QUE VOCÊ DEVE VER

### Após Clicar em "+ New":

```
┌─────────────────────────────┐
│ Add Service to Project      │
├─────────────────────────────┤
│                             │
│  [Database]  ← Clique aqui  │
│                             │
│  Empty Service              │
│  Template                   │
│  GitHub Repo                │
│                             │
└─────────────────────────────┘
```

### Após Clicar em "Database":

```
┌─────────────────────────────┐
│ Select Database             │
├─────────────────────────────┤
│                             │
│  [MySQL]  ← Clique aqui     │
│                             │
│  PostgreSQL                 │
│  MongoDB                    │
│  Redis                      │
│                             │
└─────────────────────────────┘
```

---

## ✅ VERIFICAR SE FUNCIONOU

### Opção 1: No Dashboard

Você deve ver:
- Um novo card/box com o nome "MySQL"
- Status "Running" ou "Active"
- Variáveis criadas automaticamente

### Opção 2: Via Terminal (Depois que eu fizer)

```bash
railway variables | grep DATABASE_URL
```

Se aparecer `DATABASE_URL=mysql://...`, está funcionando! ✅

---

## 🆘 SE DER ERRO

### "No permission to add database"
- Verifique se está no projeto correto
- Verifique se está logado

### "Database already exists"
- Perfeito! O MySQL já existe! ✅
- Só precisa adicionar Redis

### Não consigo encontrar "+ New"
- Me diga o que aparece na sua tela
- Tire uma captura de tela se possível
- Ou descreva o que você vê

---

## 📝 RESUMO RÁPIDO

1. **Acesse:** https://railway.app
2. **Clique no projeto:** `gentle-fulfillment`
3. **Clique em "+ New"** (canto superior direito)
4. **Clique em "Database"**
5. **Escolha "MySQL"**
6. **Aguarde 1-2 minutos**

**Depois repita para Redis!**

---

**Avise quando terminar ou se tiver alguma dúvida! 🚀**

