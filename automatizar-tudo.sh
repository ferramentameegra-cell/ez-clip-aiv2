#!/bin/bash

# 🚀 Script de Automação Completa
# Faz push no GitHub e deploy no Railway automaticamente

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🚀 Automação Completa - GitHub + Railway          ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Configurar repositório
REPO_OWNER="ferramentameegra-cell"
REPO_NAME="ez-clips-aiv2"
GITHUB_TOKEN="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"

# Verificar se token está configurado no .env.local (prioridade)
if [ -f ".env.local" ]; then
    source .env.local
fi

# Verificar remote atual
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

echo -e "${BLUE}📋 Configuração atual:${NC}"
echo "   Repositório: ${REPO_OWNER}/${REPO_NAME}"
echo "   Remote atual: ${CURRENT_REMOTE}"
echo ""

# Verificar se precisa configurar token
if [[ "$CURRENT_REMOTE" != *"${REPO_NAME}"* ]]; then
    echo -e "${YELLOW}⚠️  Remote não está configurado para o repositório correto${NC}"
    echo ""
    read -p "Usar token GitHub? (s/n): " USE_TOKEN
    
    if [ "$USE_TOKEN" = "s" ] || [ "$USE_TOKEN" = "S" ]; then
        if [ -z "$GITHUB_TOKEN" ]; then
            read -p "Digite seu GitHub Personal Access Token: " GITHUB_TOKEN
        fi
        
        echo -e "${BLUE}🔐 Configurando Git com token...${NC}"
        git remote set-url origin https://${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git
        echo -e "${GREEN}✅ Git configurado${NC}"
    else
        echo -e "${BLUE}🔐 Configurando Git com SSH...${NC}"
        git remote set-url origin git@github.com:${REPO_OWNER}/${REPO_NAME}.git
        echo -e "${GREEN}✅ Git configurado${NC}"
    fi
fi

echo ""

# Verificar status do Git
echo -e "${BLUE}📋 Verificando status do Git...${NC}"
git status --short

# Fazer commit de mudanças (se houver)
if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Há mudanças não commitadas${NC}"
    read -p "Fazer commit? (s/n): " COMMIT_NOW
    
    if [ "$COMMIT_NOW" = "s" ] || [ "$COMMIT_NOW" = "S" ]; then
        git add -A
        COMMIT_MSG=$(date +"chore: Atualização automática - %Y-%m-%d %H:%M:%S")
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✅ Mudanças commitadas${NC}"
    fi
fi

# Fazer push
echo ""
echo -e "${BLUE}📤 Fazendo push para GitHub...${NC}"
if git push origin main; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    echo ""
    echo -e "${YELLOW}Possíveis soluções:${NC}"
    echo "1. Verifique se o token está correto"
    echo "2. Certifique-se que tem permissão no repositório"
    echo "3. Configure SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    exit 1
fi

# Deploy no Railway (se Railway CLI estiver instalado)
echo ""
if command -v railway &> /dev/null; then
    echo -e "${BLUE}🚂 Fazendo deploy no Railway...${NC}"
    
    # Verificar se está logado
    if railway whoami &> /dev/null; then
        railway up
        echo -e "${GREEN}✅ Deploy no Railway iniciado!${NC}"
    else
        echo -e "${YELLOW}⚠️  Não está logado no Railway${NC}"
        echo -e "${YELLOW}   Execute: railway login${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Railway CLI não instalado${NC}"
    echo -e "${YELLOW}   Instale com: npm install -g @railway/cli${NC}"
    echo -e "${YELLOW}   Ou faça deploy via Railway Dashboard${NC}"
fi

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Automação completa!"
echo "========================================${NC}"
echo ""

# Resumo
echo -e "${CYAN}📋 Resumo:${NC}"
echo ""
echo -e "✅ Código enviado para: ${GREEN}https://github.com/${REPO_OWNER}/${REPO_NAME}${NC}"
echo ""

if command -v railway &> /dev/null && railway whoami &> /dev/null; then
    echo -e "✅ Deploy no Railway iniciado"
    echo ""
    echo -e "${CYAN}🔗 Acompanhe o deploy:${NC}"
    echo "   railway logs --follow"
else
    echo -e "${YELLOW}⚠️  Deploy no Railway pendente${NC}"
    echo -e "   Acesse: https://railway.app"
fi

echo ""
echo -e "${GREEN}✅ Tudo pronto! 🚀${NC}"
