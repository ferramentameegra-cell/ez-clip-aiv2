# 🔗 Como Conectar Railway ao GitHub - Passo a Passo

## ✅ Guia Completo e Visual

---

## 🎯 Passo 1: Acessar Railway

1. Abra seu navegador
2. Acesse: **https://railway.app**
3. **Faça login** (pode usar sua conta GitHub)

---

## 🎯 Passo 2: Criar Novo Projeto

1. No dashboard do Railway, clique no botão **"+ New Project"** 
   - (geralmente no canto superior direito ou no centro da tela)

2. Você verá várias opções. Selecione:
   **"Deploy from GitHub repo"**
   - (Deploy a partir de repositório GitHub)

---

## 🎯 Passo 3: Autorizar Railway no GitHub

### Se for a primeira vez:

1. GitHub vai pedir autorização
2. Você será redirecionado para uma página do GitHub
3. Clique em **"Authorize Railway"** ou **"Authorize railway-app"**

### Escolher Repositórios:

Você verá opções para escolher quais repositórios Railway pode acessar:

- ✅ **Opção 1:** Selecione apenas `ez-clip-aiv2` (mais seguro)
  - Procure por: `ferramentameegra-cell/ez-clip-aiv2`
  - Marque apenas este repositório

- ✅ **Opção 2:** Selecione "All repositories" (se preferir dar acesso total)
  - Railway terá acesso a todos seus repositórios

4. Clique em **"Install & Authorize"** ou **"Authorize"**

---

## 🎯 Passo 4: Selecionar Repositório

1. Depois de autorizar, você verá uma lista de seus repositórios GitHub

2. **Encontre e clique no repositório:**
   - `ferramentameegra-cell/ez-clip-aiv2`
   - Ou simplesmente: `ez-clip-aiv2`

3. Railway vai:
   - ✅ Detectar automaticamente que é um projeto Node.js
   - ✅ Configurar build: `npm install && npm run build`
   - ✅ Configurar start: `npm start`
   - ✅ Iniciar o deploy automaticamente

---

## 🎯 Passo 5: Aguardar Primeiro Deploy

1. Railway vai começar a fazer build automaticamente
2. Acompanhe o progresso em:
   - **"Deployments"** → Clique no deploy mais recente
   - **"View Logs"** para ver o que está acontecendo

3. O primeiro build pode levar **3-5 minutos**

4. Você verá logs como:
   ```
   Installing dependencies...
   Building...
   Starting...
   ```

---

## ✅ Pronto! Repositório Conectado

Após o deploy inicial:

- ✅ Railway está conectado ao seu repositório GitHub
- ✅ A cada `git push`, Railway fará deploy automaticamente
- ✅ Você pode acompanhar todos os deploys no dashboard

---

## 🔄 Como Funciona o Deploy Automático

Depois de conectar:

1. Você faz alterações no código localmente
2. Você faz commit: `git commit -m "sua mensagem"`
3. Você faz push: `git push origin main`
4. **Railway detecta o push automaticamente**
5. **Railway inicia um novo deploy automaticamente**
6. **Seu site é atualizado automaticamente!**

---

## 📋 Checklist de Conexão

- [ ] Logado no Railway
- [ ] Clicou em "+ New Project"
- [ ] Selecionou "Deploy from GitHub repo"
- [ ] Autorizou Railway no GitHub
- [ ] Selecionou o repositório `ez-clip-aiv2`
- [ ] Deploy iniciado
- [ ] Build completou

---

## 🐛 Problemas Comuns

### Erro: "Repository not found"
**Solução:**
- Verifique se autorizou Railway corretamente no GitHub
- Certifique-se de selecionar o repositório correto
- Verifique se o repositório existe no GitHub

### Erro: "Access denied"
**Solução:**
- Vá em GitHub → Settings → Applications → Railway
- Verifique se Railway está autorizado
- Tente revogar e autorizar novamente

### Erro: "Build failed"
**Solução:**
- Verifique os logs no Railway
- Certifique-se que `package.json` existe
- Verifique se há erros nos logs

---

## 🔗 Links Úteis

- **Railway Dashboard:** https://railway.app
- **Seu Repositório:** https://github.com/ferramentameegra-cell/ez-clip-aiv2
- **Railway Docs:** https://docs.railway.app

---

## 🚀 Próximos Passos Após Conectar

Depois que o repositório estiver conectado:

1. ✅ Configurar variáveis de ambiente
2. ✅ Criar MySQL e Redis
3. ✅ Aplicar migrations
4. ✅ Gerar domínio
5. ✅ Testar o site

Veja `DEPLOY_AGORA.md` para os próximos passos!

---

**Status:** ✅ **Guia completo para conectar Railway ao GitHub**
