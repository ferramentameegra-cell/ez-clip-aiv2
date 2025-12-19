#!/bin/bash

# 🚀 Script para Criar Novo Projeto no GitHub e Railway
# Autor: Assistente AI
# Data: $(date)

echo "🚀 ========================================"
echo "   Criar Novo Projeto GitHub + Railway"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para perguntar ao usuário
ask() {
    local prompt="$1"
    local default="$2"
    local answer
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " answer
        answer=${answer:-$default}
    else
        read -p "$prompt: " answer
    fi
    
    echo "$answer"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado!${NC}"
    echo "Execute este script na raiz do projeto."
    exit 1
fi

echo -e "${BLUE}📋 Passo 1: Informações do Novo Repositório GitHub${NC}"
echo ""

GITHUB_USER=$(ask "Digite seu usuário do GitHub")
REPO_NAME=$(ask "Digite o nome do novo repositório")
USE_SSH=$(ask "Usar SSH? (s/n)" "n")

if [ "$USE_SSH" = "s" ] || [ "$USE_SSH" = "S" ]; then
    GITHUB_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
    echo -e "${GREEN}✅ Usando SSH: ${GITHUB_URL}${NC}"
else
    GITHUB_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    echo -e "${GREEN}✅ Usando HTTPS: ${GITHUB_URL}${NC}"
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "1. Certifique-se de que o repositório já foi criado no GitHub"
echo "2. Acesse: https://github.com/new"
echo "3. Crie o repositório: ${REPO_NAME}"
echo ""
read -p "Pressione ENTER quando o repositório estiver criado..."

echo ""
echo -e "${BLUE}📋 Passo 2: Configurando Git${NC}"
echo ""

# Verificar status do Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Inicializando repositório Git...${NC}"
    git init
    git branch -M main
fi

# Verificar remotes existentes
echo "Remotes atuais:"
git remote -v
echo ""

OPTION=$(ask "Escolha uma opção: (1) Adicionar novo remote, (2) Substituir remote atual" "1")

if [ "$OPTION" = "1" ]; then
    REMOTE_NAME=$(ask "Nome do novo remote" "novo-origin")
    git remote add $REMOTE_NAME $GITHUB_URL
    echo -e "${GREEN}✅ Remote '${REMOTE_NAME}' adicionado${NC}"
    PUSH_REMOTE=$REMOTE_NAME
else
    git remote remove origin 2>/dev/null
    git remote add origin $GITHUB_URL
    echo -e "${GREEN}✅ Remote 'origin' atualizado${NC}"
    PUSH_REMOTE="origin"
fi

echo ""
echo -e "${BLUE}📋 Passo 3: Preparando commit${NC}"
echo ""

# Verificar se há mudanças
if [ -n "$(git status --porcelain)" ]; then
    echo "Arquivos modificados/não rastreados encontrados:"
    git status --short
    echo ""
    
    COMMIT_MSG=$(ask "Mensagem do commit" "Initial commit - novo projeto")
    
    echo -e "${YELLOW}📦 Adicionando arquivos...${NC}"
    git add .
    
    echo -e "${YELLOW}💾 Fazendo commit...${NC}"
    git commit -m "$COMMIT_MSG"
    
    echo -e "${GREEN}✅ Commit criado${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar${NC}"
fi

echo ""
echo -e "${BLUE}📋 Passo 4: Enviando para GitHub${NC}"
echo ""

echo -e "${YELLOW}📤 Fazendo push para ${PUSH_REMOTE}...${NC}"
echo ""

if git push -u $PUSH_REMOTE main; then
    echo ""
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Se usar HTTPS: Configure um Personal Access Token"
    echo "   https://github.com/settings/tokens"
    echo ""
    echo "2. Se usar SSH: Configure chave SSH"
    echo "   https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    echo ""
    echo "3. Verifique se o repositório existe no GitHub"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Projeto configurado no GitHub!"
echo "========================================${NC}"
echo ""

echo -e "${BLUE}📋 Próximos Passos:${NC}"
echo ""
echo "1. Acesse: https://railway.app"
echo "2. Clique em 'New Project'"
echo "3. Selecione 'Deploy from GitHub repo'"
echo "4. Selecione o repositório: ${REPO_NAME}"
echo "5. Configure as variáveis de ambiente"
echo "6. Crie MySQL e Redis"
echo "7. Aplique as migrations"
echo ""
echo -e "${YELLOW}💡 Veja o guia completo em: CRIAR_NOVO_PROJETO_GITHUB_RAILWAY.md${NC}"
echo ""
