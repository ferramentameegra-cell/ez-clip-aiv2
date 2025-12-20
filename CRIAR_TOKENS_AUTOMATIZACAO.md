# 🔐 Criar Tokens para Automação Completa

## ✅ Tokens Necessários

Você precisa de **2 tokens**:
1. **GitHub Personal Access Token** - Para fazer push no código
2. **Railway Token** - Para deploy automático (opcional, pode usar CLI também)

---

## 1️⃣ Criar GitHub Personal Access Token

### Passo 1: Acessar Configurações
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**

### Passo 2: Configurar Token
- **Note:** `ez-clip-ai-automation` (nome descritivo)
- **Expiration:** Escolha o período (90 dias, 1 ano, ou sem expiração)
- **Scopes (permissões):** Marque:
  - ✅ **repo** (Full control of private repositories)
    - ✅ repo:status
    - ✅ repo_deployment
    - ✅ public_repo
    - ✅ repo:invite
    - ✅ security_events

### Passo 3: Gerar e Copiar Token
1. Clique em **"Generate token"**
2. **⚠️ IMPORTANTE:** Copie o token IMEDIATAMENTE (você só vê uma vez!)
   - Exemplo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Passo 4: Guardar Token com Segurança
Guarde o token em um local seguro. Você vai usar para:
- Fazer push no repositório
- Configurar scripts automatizados

---

## 2️⃣ Configurar Git com Token

### Opção A: Usar Token no URL (Temporário)

```bash
# Configurar remote com token
git remote set-url origin https://ghp_SEU_TOKEN_AQUI@github.com/ferramentameegra-cell/ez-clip-aiv2.git
```

### Opção B: Usar Token via Git Credential Helper (Recomendado)

```bash
# Configurar credential helper (macOS)
git config --global credential.helper osxkeychain

# Na primeira vez que fizer push, use o token como senha
git push
# Username: seu-usuario-github
# Password: ghp_SEU_TOKEN_AQUI
```

### Opção C: Usar SSH (Mais Seguro)

Se preferir usar SSH em vez de token:

1. **Gerar chave SSH:**
```bash
ssh-keygen -t ed25519 -C "seu-email@exemplo.com"
```

2. **Adicionar chave ao ssh-agent:**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. **Copiar chave pública:**
```bash
cat ~/.ssh/id_ed25519.pub
```

4. **Adicionar no GitHub:**
   - GitHub → Settings → SSH and GPG keys → New SSH key
   - Cole a chave pública
   - Salve

5. **Configurar remote:**
```bash
git remote set-url origin git@github.com:ferramentameegra-cell/ez-clip-aiv2.git
```

---

## 3️⃣ Script Automatizado Completo

Criei um script que faz TUDO automaticamente usando os tokens:

```bash
# Executar script de automação completa
./automatizar-tudo.sh
```

---

## 📋 Script de Automação Completa

Crie o arquivo `automatizar-tudo.sh`:

```bash
#!/bin/bash

# 🚀 Script de Automação Completa
# Faz push no GitHub e deploy no Railway automaticamente

set -e

GITHUB_TOKEN="ghp_SEU_TOKEN_AQUI"
REPO_URL="https://github.com/ferramentameegra-cell/ez-clip-aiv2.git"

echo "🚀 Iniciando automação completa..."

# 1. Configurar Git com token
git remote set-url origin https://${GITHUB_TOKEN}@github.com/ferramentameegra-cell/ez-clip-aiv2.git

# 2. Fazer commit de mudanças (se houver)
if [ -n "$(git status --porcelain)" ]; then
    git add -A
    git commit -m "chore: Atualização automática"
fi

# 3. Fazer push
echo "📤 Fazendo push para GitHub..."
git push origin main

# 4. Deploy no Railway (se Railway CLI estiver instalado)
if command -v railway &> /dev/null; then
    echo "🚂 Fazendo deploy no Railway..."
    railway up
else
    echo "⚠️  Railway CLI não instalado. Instale com: npm install -g @railway/cli"
fi

echo "✅ Automação completa!"
```

---

## 🔒 Guardar Token com Segurança

### Opção 1: Arquivo .env (Não commitar!)

Crie `.env.local` (já está no .gitignore):

```bash
# .env.local (NÃO COMMITAR!)
GITHUB_TOKEN=ghp_SEU_TOKEN_AQUI
RAILWAY_TOKEN=seu_railway_token_aqui
```

### Opção 2: Variáveis de Ambiente do Sistema

```bash
# Adicionar ao ~/.zshrc ou ~/.bashrc
export GITHUB_TOKEN="ghp_SEU_TOKEN_AQUI"
export RAILWAY_TOKEN="seu_railway_token_aqui"
```

---

## 🚀 Executar Agora

### 1. Criar Token GitHub
- https://github.com/settings/tokens
- Generate new token (classic)
- Permissões: `repo` (todas)

### 2. Configurar Git

**Opção A: Com Token no URL**
```bash
git remote set-url origin https://ghp_SEU_TOKEN@github.com/ferramentameegra-cell/ez-clip-aiv2.git
```

**Opção B: SSH (Recomendado)**
```bash
# Se já tem chave SSH configurada:
git remote set-url origin git@github.com:ferramentameegra-cell/ez-clip-aiv2.git
```

### 3. Fazer Push
```bash
git push origin main
```

---

## ✅ Checklist

- [ ] Token GitHub criado
- [ ] Token copiado e guardado com segurança
- [ ] Git configurado com token ou SSH
- [ ] Push testado com sucesso
- [ ] Railway conectado ao repositório
- [ ] Deploy automático funcionando

---

## 🐛 Problemas Comuns

### Erro: "Authentication failed"
**Solução:**
- Verifique se o token está correto
- Certifique-se que tem permissão `repo`

### Erro: "Token expired"
**Solução:**
- Crie um novo token
- Atualize a configuração

### Erro: "Permission denied" (SSH)
**Solução:**
- Verifique se chave SSH está adicionada no GitHub
- Teste: `ssh -T git@github.com`

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**
- ❌ **NUNCA** commite tokens no Git
- ❌ **NUNCA** compartilhe tokens publicamente
- ✅ Use `.env.local` ou variáveis de ambiente
- ✅ Revogue tokens antigos regularmente
- ✅ Use SSH quando possível (mais seguro)

---

**Próximo passo:** Criar o token GitHub e configurar o Git! 🚀
