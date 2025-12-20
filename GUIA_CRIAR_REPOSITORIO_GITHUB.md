# 🚀 Guia Completo: Criar Repositório GitHub + Deploy Railway

## ✅ Tudo Preparado!

Este guia vai te ajudar a criar um novo repositório no GitHub e fazer o deploy no Railway **passo a passo**.

---

## 🎯 Opção 1: Script Automatizado (Recomendado)

Execute o script que guia você através de TODO o processo:

```bash
./criar-repositorio-e-deploy.sh
```

O script vai:
1. ✅ Verificar status do Git
2. ✅ Pedir informações do repositório
3. ✅ Abrir GitHub para criar repositório
4. ✅ Fazer push automaticamente
5. ✅ Fazer deploy no Railway (opcional)

---

## 🎯 Opção 2: Passo a Passo Manual

### Passo 1: Criar Repositório no GitHub

1. **Acesse:** https://github.com/new
2. **Preencha:**
   - Repository name: `nome-do-seu-projeto` (ex: `viral-clips-ai-v2`)
   - Description: (opcional)
   - Visibility: **Public** ou **Private**
   - ⚠️ **NÃO marque nenhuma opção** de inicialização
3. **Clique em:** "Create repository"
4. **Copie a URL** do repositório criado
   - HTTPS: `https://github.com/SEU-USUARIO/nome-do-projeto.git`
   - SSH: `git@github.com:SEU-USUARIO/nome-do-projeto.git`

---

### Passo 2: Enviar Código para GitHub

**Opção A: Usar Script Rápido**

```bash
./push-novo-projeto.sh https://github.com/SEU-USUARIO/nome-do-projeto.git
```

**Opção B: Comandos Manuais**

```bash
# Adicionar novo remote
git remote add novo-origin https://github.com/SEU-USUARIO/nome-do-projeto.git

# OU usar SSH (recomendado):
git remote add novo-origin git@github.com:SEU-USUARIO/nome-do-projeto.git

# Verificar
git remote -v

# Fazer push
git push -u novo-origin main
```

---

### Passo 3: Deploy no Railway

**Opção A: Script Automatizado (Recomendado)**

```bash
./deploy-railway-automatico.sh
```

**Opção B: Manual**

1. **Instalar Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Fazer login:**
   ```bash
   railway login
   ```

3. **Criar projeto no Railway:**
   - Acesse: https://railway.app
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Autorize Railway a acessar GitHub
   - Selecione o repositório criado
   - Clique em "Deploy Now"

4. **Configurar variáveis:**
   - Railway → Variables → Adicionar variáveis necessárias
   - Veja `ENV_VARIABLES.md` para lista completa

5. **Criar MySQL e Redis:**
   - Railway → "+ New" → "Database" → "Add MySQL"
   - Railway → "+ New" → "Database" → "Add Redis"

6. **Aplicar migrations:**
   ```bash
   railway connect mysql
   npm run db:push
   ```

---

## 🔐 Autenticação GitHub

### Se usar HTTPS:

GitHub não aceita mais senhas. Use **Personal Access Token**:

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Permissões: `repo` (acesso completo aos repositórios)
4. Copie o token gerado
5. Use o token como senha ao fazer push

### Se usar SSH:

Configure chave SSH:
- Guia: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Mais seguro e não precisa digitar token toda vez

---

## ✅ Checklist Completo

Antes de considerar tudo pronto:

- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub (`git push`)
- [ ] Projeto criado no Railway
- [ ] Serviço conectado ao repositório GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] MySQL criado e `DATABASE_URL` configurado
- [ ] Redis criado e `REDIS_URL` configurado (opcional)
- [ ] Migrations aplicadas
- [ ] Domínio gerado no Railway
- [ ] Site acessível e funcionando

---

## 🐛 Problemas Comuns

### Erro: "Authentication failed" (GitHub)
**Solução:**
- Use Personal Access Token em vez de senha
- Ou configure chave SSH

### Erro: "Repository not found"
**Solução:**
- Verifique se o repositório existe
- Verifique se você tem acesso
- Verifique se a URL está correta

### Erro: "Permission denied" (SSH)
**Solução:**
- Configure chave SSH no GitHub
- Verifique se a chave está adicionada ao ssh-agent

---

## 📚 Documentação Relacionada

- `RAILWAY_GENTLE_FULFILLMENT.md` - Configuração Railway completa
- `EXECUTAR_DEPLOY_AUTOMATICO.md` - Como executar deploy
- `ENV_VARIABLES.md` - Lista de variáveis de ambiente
- `CRIAR_NOVO_PROJETO_GITHUB_RAILWAY.md` - Guia detalhado

---

## 🚀 Executar Agora

**Opção mais fácil:**

```bash
./criar-repositorio-e-deploy.sh
```

O script vai guiar você através de TODO o processo! 🎉

---

**Status:** ✅ **Pronto para criar repositório e fazer deploy**
