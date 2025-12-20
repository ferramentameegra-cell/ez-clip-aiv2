#!/bin/bash

# 🚀 Script Completo: Criar Repositório GitHub + Deploy Railway
# Este script guia você através de TODO o processo

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 Criar Repositório GitHub + Deploy Railway          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Verificar status do Git
echo -e "${BLUE}📋 Verificando status do Git...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Há mudanças não commitadas.${NC}"
    read -p "Fazer commit agora? (s/n): " COMMIT_NOW
    
    if [ "$COMMIT_NOW" = "s" ] || [ "$COMMIT_NOW" = "S" ]; then
        git add -A
        git commit -m "chore: Preparar para novo repositório"
        echo -e "${GREEN}✅ Mudanças commitadas${NC}"
    fi
fi

echo ""

# Passo 1: Criar repositório no GitHub
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  PASSO 1: Criar Repositório no GitHub${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 Informações necessárias:${NC}"
echo ""
read -p "Digite seu usuário do GitHub: " GITHUB_USER
read -p "Digite o nome do novo repositório: " REPO_NAME
read -p "Repositório será privado? (s/n): " IS_PRIVATE

if [ "$IS_PRIVATE" = "s" ] || [ "$IS_PRIVATE" = "S" ]; then
    VISIBILITY="private"
else
    VISIBILITY="public"
fi

echo ""
echo -e "${BLUE}🌐 Abrindo GitHub para criar repositório...${NC}"
echo ""
echo -e "${YELLOW}📝 Instruções:${NC}"
echo "1. Acesse: https://github.com/new"
echo "2. Repository name: ${CYAN}${REPO_NAME}${NC}"
echo "3. Description: (opcional)"
echo "4. Visibility: ${CYAN}${VISIBILITY}${NC}"
echo "5. ⚠️  NÃO marque nenhuma opção de inicialização"
echo "6. Clique em 'Create repository'"
echo ""
read -p "Pressione ENTER quando o repositório estiver criado..."

echo ""
echo -e "${BLUE}📋 Escolha o tipo de URL:${NC}"
echo "1. HTTPS (mais fácil)"
echo "2. SSH (mais seguro)"
read -p "Opção (1 ou 2): " URL_TYPE

if [ "$URL_TYPE" = "2" ]; then
    REPO_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
    echo -e "${YELLOW}⚠️  Certifique-se de ter chave SSH configurada${NC}"
else
    REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
fi

echo ""
echo -e "${GREEN}✅ URL do repositório: ${CYAN}${REPO_URL}${NC}"
echo ""

# Passo 2: Fazer push para GitHub
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  PASSO 2: Enviar Código para GitHub${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo ""

REMOTE_NAME="novo-origin"

# Verificar se remote já existe
if git remote | grep -q "^${REMOTE_NAME}$"; then
    echo -e "${YELLOW}⚠️  Remote '${REMOTE_NAME}' já existe. Removendo...${NC}"
    git remote remove $REMOTE_NAME
fi

echo -e "${BLUE}📤 Adicionando remote...${NC}"
git remote add $REMOTE_NAME $REPO_URL

echo -e "${BLUE}📋 Verificando remotes:${NC}"
git remote -v

echo ""
echo -e "${YELLOW}🚀 Fazendo push para GitHub...${NC}"

if git push -u $REMOTE_NAME main; then
    echo ""
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    echo ""
    echo -e "${YELLOW}Possíveis soluções:${NC}"
    echo "1. Se usar HTTPS: Configure Personal Access Token"
    echo "   https://github.com/settings/tokens"
    echo ""
    echo "2. Se usar SSH: Configure chave SSH"
    echo "   https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    echo ""
    echo "3. Verifique se o repositório existe no GitHub"
    exit 1
fi

echo ""

# Passo 3: Deploy no Railway
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  PASSO 3: Deploy no Railway${NC}"
echo -e "${CYAN}════════════════════════════════════════════════════════${NC}"
echo ""

read -p "Fazer deploy no Railway agora? (s/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "s" ] || [ "$DEPLOY_NOW" = "S" ]; then
    echo ""
    echo -e "${BLUE}🚀 Iniciando deploy no Railway...${NC}"
    echo ""
    
    # Verificar se Railway CLI está instalado
    if ! command -v railway &> /dev/null; then
        echo -e "${YELLOW}⚠️  Railway CLI não encontrado. Instalando...${NC}"
        npm install -g @railway/cli || {
            echo -e "${RED}❌ Erro ao instalar Railway CLI${NC}"
            echo -e "${YELLOW}Instale manualmente: npm install -g @railway/cli${NC}"
            exit 1
        }
    fi
    
    # Verificar se está logado
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}⚠️  Não está logado. Fazendo login...${NC}"
        railway login
    fi
    
    echo ""
    echo -e "${BLUE}📋 Criar novo projeto no Railway ou linkar existente?${NC}"
    echo "1. Criar novo projeto"
    echo "2. Linkar a projeto existente"
    read -p "Opção (1 ou 2): " RAILWAY_OPTION
    
    if [ "$RAILWAY_OPTION" = "1" ]; then
        echo -e "${YELLOW}📦 Criando novo projeto...${NC}"
        railway init
    else
        echo -e "${YELLOW}🔗 Linkando a projeto existente...${NC}"
        railway link
    fi
    
    echo ""
    echo -e "${BLUE}🚀 Executando script de deploy automático...${NC}"
    
    if [ -f "./deploy-railway-automatico.sh" ]; then
        ./deploy-railway-automatico.sh
    else
        echo -e "${YELLOW}⚠️  Script de deploy não encontrado.${NC}"
        echo -e "${YELLOW}Execute manualmente: railway up${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}📋 Para fazer deploy depois, execute:${NC}"
    echo ""
    echo "1. Instalar Railway CLI:"
    echo "   npm install -g @railway/cli"
    echo ""
    echo "2. Fazer login:"
    echo "   railway login"
    echo ""
    echo "3. Criar projeto:"
    echo "   railway init"
    echo ""
    echo "4. Executar deploy automático:"
    echo "   ./deploy-railway-automatico.sh"
    echo ""
fi

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Processo concluído!"
echo "========================================${NC}"
echo ""

# Resumo final
echo -e "${CYAN}📋 Resumo:${NC}"
echo ""
echo -e "Repositório GitHub: ${GREEN}${REPO_URL}${NC}"
echo -e "Remote configurado: ${GREEN}${REMOTE_NAME}${NC}"
echo ""

if [ "$DEPLOY_NOW" = "s" ] || [ "$DEPLOY_NOW" = "S" ]; then
    echo -e "${GREEN}✅ Deploy no Railway iniciado${NC}"
else
    echo -e "${YELLOW}⚠️  Deploy no Railway pendente${NC}"
fi

echo ""
echo -e "${CYAN}📚 Próximos Passos:${NC}"
echo ""
echo "1. Verifique o repositório no GitHub:"
echo "   ${REPO_URL}"
echo ""
echo "2. Se ainda não fez deploy no Railway:"
echo "   ./deploy-railway-automatico.sh"
echo ""
echo "3. Configure MySQL e Redis no Railway Dashboard"
echo ""
echo "4. Acompanhe o deploy:"
echo "   railway logs --follow"
echo ""

echo -e "${GREEN}✅ Tudo pronto! 🚀${NC}"
