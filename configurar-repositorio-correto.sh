#!/bin/bash

# 🔧 Script para Configurar Repositório Corretamente
# Configura o Git para usar ez-clips-aiv2

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🔧 Configurar Repositório: ez-clips-aiv2            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuração
REPO_OWNER="ferramentameegra-cell"
REPO_NAME="ez-clips-aiv2"

echo -e "${BLUE}📋 Configuração:${NC}"
echo "   Owner: ${REPO_OWNER}"
echo "   Repositório: ${REPO_NAME}"
echo ""

# Verificar remote atual
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
echo -e "${BLUE}📋 Remote atual:${NC}"
echo "   ${CURRENT_REMOTE}"
echo ""

# Opções de configuração
echo -e "${YELLOW}Escolha o método de autenticação:${NC}"
echo "1. HTTPS com Token (Recomendado se tiver token)"
echo "2. SSH (Recomendado se tiver chave SSH configurada)"
echo "3. HTTPS sem token (vai pedir credenciais)"
read -p "Opção (1, 2 ou 3): " AUTH_METHOD

case $AUTH_METHOD in
    1)
        if [ -f ".env.local" ]; then
            source .env.local
        fi
        
        if [ -z "$GITHUB_TOKEN" ]; then
            read -p "Digite seu GitHub Personal Access Token: " GITHUB_TOKEN
        fi
        
        NEW_REMOTE="https://${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"
        echo -e "${BLUE}🔐 Configurando com HTTPS + Token...${NC}"
        ;;
    2)
        NEW_REMOTE="git@github.com:${REPO_OWNER}/${REPO_NAME}.git"
        echo -e "${BLUE}🔐 Configurando com SSH...${NC}"
        ;;
    3)
        NEW_REMOTE="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"
        echo -e "${BLUE}🔐 Configurando com HTTPS (sem token)...${NC}"
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

# Configurar remote
git remote set-url origin "$NEW_REMOTE"

echo -e "${GREEN}✅ Remote configurado!${NC}"
echo ""

# Verificar
echo -e "${BLUE}📋 Verificando configuração:${NC}"
git remote -v
echo ""

# Testar conexão
echo -e "${BLUE}🔍 Testando conexão...${NC}"
if git ls-remote origin &> /dev/null; then
    echo -e "${GREEN}✅ Conexão OK!${NC}"
    echo ""
    echo -e "${GREEN}✅ Repositório configurado corretamente!${NC}"
    echo ""
    echo -e "${CYAN}📋 Próximos passos:${NC}"
    echo "1. Fazer push: git push origin main"
    echo "2. Ou usar script: ./automatizar-tudo.sh"
else
    echo -e "${YELLOW}⚠️  Não foi possível conectar. Verifique as credenciais.${NC}"
fi

echo ""
