# 🔐 Guia Passo a Passo: Autorizar GitHub no Railway

Este guia te mostra **exatamente** como autorizar o Railway a acessar seus repositórios do GitHub para fazer deploy automático.

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter:
- ✅ Conta no GitHub (gratuita) - [github.com](https://github.com)
- ✅ Conta no Railway (gratuita) - [railway.app](https://railway.app)
- ✅ Código do projeto no GitHub (já commitado e enviado)

---

## 🚀 MÉTODO 1: Autorizar Durante a Criação do Projeto (Recomendado)

Este é o método mais simples e recomendado.

### Passo 1: Acessar o Railway

1. Abra seu navegador (Chrome, Firefox, Safari, etc.)
2. Acesse: **https://railway.app**
3. Faça login com sua conta Railway
   - Se não tiver conta, clique em **"Start a New Project"** e crie uma conta

### Passo 2: Iniciar Novo Projeto

1. No dashboard do Railway, clique no botão grande **"+ New Project"** (canto superior direito ou no centro)
2. Você verá algumas opções:
   - "Deploy from GitHub repo" ← **Clique nesta opção**
   - "Empty Project"
   - "Deploy a Template"

### Passo 3: Autorizar o GitHub (Primeira Vez)

Se esta é a primeira vez que você conecta GitHub ao Railway:

1. **Aparecerá uma tela pedindo autorização**
   - Você verá: "Authorize Railway to access your GitHub account?"
   - Ou: "GitHub Integration Required"

2. **Clique em "Authorize Railway"** ou **"Connect GitHub"**

3. **Você será redirecionado para o GitHub** (pode pedir login)
   - Faça login no GitHub se necessário
   - Você verá uma tela pedindo autorização

4. **Na tela de autorização do GitHub:**
   - Você verá: "Railway.app wants to access your account"
   - Abaixo terá uma lista de permissões:
     - ✅ "Access repositories" (padrão)
     - Opcional: "Update GitHub Action secrets"
   
5. **Escolha as permissões:**
   - **Opção A (Recomendada):** Deixe marcado apenas "Access repositories"
   - **Opção B:** Se quiser que Railway configure GitHub Actions automaticamente, marque também a segunda opção

6. **Escolha quais repositórios autorizar:**
   - **"All repositories"** - Autoriza TODOS os repositórios (mais simples)
   - **"Only select repositories"** - Autoriza apenas alguns específicos (mais seguro)
   
   **💡 Recomendação:** Se você é iniciante, escolha **"All repositories"** (você pode mudar depois)

7. **Clique em "Authorize Railway"** ou **"Authorize railwayapp"** (botão verde)

8. **Você será redirecionado de volta para o Railway** automaticamente

### Passo 4: Selecionar o Repositório

Após autorizar, você verá uma lista dos seus repositórios do GitHub:

1. **Use a barra de pesquisa** para encontrar seu repositório:
   - Digite: `ez-clip-ai` (ou o nome que você deu)
   
2. **Clique no repositório** que você quer fazer deploy

3. **Railway começará o deploy automaticamente!** ✅

---

## 🔄 MÉTODO 2: Autorizar Depois (Se já Criou Projeto)

Se você já criou um projeto vazio no Railway e quer conectar ao GitHub depois:

### Passo 1: Acessar Settings do Projeto

1. No Railway, abra seu projeto
2. Clique na aba **"Settings"** (no topo do dashboard)

### Passo 2: Ir para GitHub Integration

1. Role para baixo até a seção **"GitHub"** ou **"Source"**
2. Você verá: "Connect GitHub Repository"
3. Clique em **"Connect Repository"** ou **"Configure GitHub"**

### Passo 3: Autorizar (Mesmo processo do Método 1)

1. **Clique em "Authorize Railway"**
2. **Faça login no GitHub** (se necessário)
3. **Autorize o Railway** na tela do GitHub
4. **Escolha os repositórios** (All repositories ou selecionados)
5. **Clique em "Authorize"**

### Passo 4: Selecionar e Conectar

1. **Selecione seu repositório** da lista
2. **Clique em "Connect"** ou **"Deploy"**
3. Railway começará o deploy! ✅

---

## 🔧 MÉTODO 3: Atualizar Permissões (Se já Autorizou Antes)

Se você já autorizou antes, mas precisa dar mais permissões ou mudar quais repositórios:

### Passo 1: Acessar Configurações do GitHub

1. Acesse: **https://github.com/settings/connections/applications**
2. Faça login no GitHub
3. Procure por **"Railway"** na lista de aplicações

### Passo 2: Atualizar Permissões

1. **Clique em "Railway"** ou **"railwayapp"**
2. Você verá as permissões atuais
3. Clique em **"Configure"** ou **"Edit"**

### Passo 3: Ajustar Repositórios

1. **Role até "Repository access"**
2. Escolha:
   - **"All repositories"** - Acesso a todos
   - **"Only select repositories"** - Escolha quais autorizar
3. **Clique em "Save"** ou **"Update access"**

### Passo 4: Voltar ao Railway

1. Volte para o Railway
2. Se necessário, desconecte e reconecte o repositório nas Settings

---

## ✅ Como Verificar se Está Autorizado

### No Railway:

1. Vá em **"Settings" → "Source"** (ou "GitHub")
2. Você deve ver:
   - ✅ "Connected to GitHub"
   - O nome do repositório conectado
   - Opção "Disconnect" ou "Change Repository"

### No GitHub:

1. Acesse: **https://github.com/settings/connections/applications**
2. Procure por "Railway"
3. Se estiver na lista, está autorizado! ✅

---

## 🔒 Permissões Explicadas

### O que o Railway precisa?

- **"Access repositories"** (Obrigatório)
  - Para fazer deploy do código
  - Para ler o código do repositório
  - Para configurar webhooks automáticos

- **"Update GitHub Action secrets"** (Opcional)
  - Para configurar GitHub Actions automaticamente
  - Para gerenciar secrets do GitHub Actions
  - **Normalmente não é necessário** para deploy básico

### É Seguro?

✅ **Sim, é seguro!**
- Railway é uma plataforma confiável usada por milhares de desenvolvedores
- Você pode revogar o acesso a qualquer momento
- Você escolhe quais repositórios autorizar
- Railway não modifica seu código, apenas faz deploy

---

## 🆘 Problemas Comuns e Soluções

### ❌ "Railway não aparece na lista de repositórios"

**Solução:**
1. Verifique se autorizou corretamente
2. Vá em GitHub → Settings → Applications → Railway
3. Confirme que está autorizado
4. Verifique se escolheu "All repositories" ou incluiu seu repositório na lista
5. Tente desconectar e reconectar no Railway

### ❌ "Erro: Access Denied"

**Solução:**
1. Revogue o acesso no GitHub:
   - GitHub → Settings → Applications → Railway → "Revoke"
2. Tente autorizar novamente no Railway
3. Certifique-se de clicar em "Authorize" na tela do GitHub

### ❌ "Repositório não aparece na lista"

**Solução:**
1. Verifique se o repositório existe no GitHub
2. Verifique se você tem acesso a ele (não é de outra pessoa)
3. Verifique se não marcou "Only select repositories" sem incluir este
4. Tente atualizar as permissões no GitHub para incluir "All repositories"

### ❌ "Botão de autorizar não funciona"

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Delete ou Cmd+Shift+Delete)
2. Tente em outro navegador (Chrome, Firefox, Safari)
3. Desative bloqueadores de pop-up temporariamente
4. Tente em modo anônimo/privado

### ❌ "Fico preso na tela de autorização do GitHub"

**Solução:**
1. Certifique-se de clicar em "Authorize" (não apenas fechar a janela)
2. Verifique se não há bloqueador de pop-up impedindo
3. Tente autorizar diretamente em: https://github.com/settings/connections/applications
4. Depois volte ao Railway e tente conectar novamente

---

## 🔄 Revogar Acesso (Se Necessário)

Se você quiser remover a autorização:

### Método 1: Via GitHub

1. Acesse: **https://github.com/settings/connections/applications**
2. Procure por **"Railway"**
3. Clique em **"Revoke"** ou **"Delete"**
4. Confirme a ação

### Método 2: Via Railway

1. No Railway, vá em **"Settings" → "Source"**
2. Clique em **"Disconnect"** ou **"Remove GitHub Connection"**
3. Confirme

---

## 📝 Checklist Rápido

Use este checklist para garantir que fez tudo:

- [ ] Tenho conta no GitHub
- [ ] Tenho conta no Railway
- [ ] Meu código está no GitHub (commitado)
- [ ] Cliquei em "Deploy from GitHub repo" no Railway
- [ ] Autorizei o Railway no GitHub
- [ ] Escolhi os repositórios (All ou selecionados)
- [ ] Cliquei em "Authorize" no GitHub
- [ ] Fui redirecionado de volta ao Railway
- [ ] Selecionei meu repositório na lista
- [ ] Railway começou o deploy automaticamente

---

## 🎯 Próximos Passos

Após autorizar com sucesso:

1. ✅ **Railway começará o deploy automaticamente**
2. ⏳ **Aguarde 2-5 minutos** para o primeiro deploy
3. 📊 **Acompanhe os logs** na aba "Deployments"
4. ⚙️ **Configure variáveis de ambiente** (veja GUIA_PASSO_A_PASSO_RAILWAY.md)
5. 🗄️ **Adicione banco de dados** (MySQL, Redis)
6. 🌐 **Configure domínio** (Settings → Domains)

---

## 📚 Recursos Adicionais

- **Guia completo de deploy:** `GUIA_PASSO_A_PASSO_RAILWAY.md`
- **Documentação Railway:** https://docs.railway.app/deploy/github
- **Suporte Railway:** https://railway.app/discord

---

## 🎉 Pronto!

Agora você tem o Railway autorizado a acessar seu GitHub e fazer deploys automáticos!

**Dica:** A partir de agora, sempre que você fizer `git push` no GitHub, o Railway detectará automaticamente e fará um novo deploy! 🚀

