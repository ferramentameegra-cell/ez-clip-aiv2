#!/bin/bash

# 🚀 Deploy Rápido no Railway - Executar Agora
# Script simplificado para deploy imediato

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🚀 Deploy Railway - EZ Clips AI                  ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Railway CLI...${NC}"
    npm install -g @railway/cli || {
        echo -e "${RED}❌ Erro ao instalar Railway CLI${NC}"
        echo -e "${YELLOW}Instale manualmente: npm install -g @railway/cli${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Railway CLI instalado${NC}"
fi

# Login
echo -e "${BLUE}🔐 Verificando autenticação...${NC}"
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Não está logado. Fazendo login...${NC}"
    railway login
else
    echo -e "${GREEN}✅ Autenticado no Railway${NC}"
    railway whoami
fi

echo ""

# Verificar se projeto está linkado
if [ ! -f ".railway/project.json" ]; then
    echo -e "${YELLOW}⚠️  Projeto não está linkado${NC}"
    echo -e "${BLUE}Escolha uma opção:${NC}"
    echo "1. Criar novo projeto"
    echo "2. Linkar a projeto existente"
    read -p "Opção (1 ou 2): " OPTION
    
    if [ "$OPTION" = "1" ]; then
        railway init
    else
        railway link
    fi
else
    echo -e "${GREEN}✅ Projeto já está linkado${NC}"
fi

echo ""

# Ler JWT_SECRET
if [ -f ".novo-projeto-config.txt" ]; then
    JWT_SECRET=$(grep "JWT_SECRET=" .novo-projeto-config.txt | cut -d'=' -f2)
else
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
fi

# Configurar variáveis básicas
echo -e "${BLUE}📋 Configurando variáveis de ambiente...${NC}"
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="$JWT_SECRET"
echo -e "${GREEN}✅ Variáveis básicas configuradas${NC}"

# Deploy
echo ""
echo -e "${BLUE}🚀 Fazendo deploy...${NC}"
railway up

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Deploy iniciado!"
echo "========================================${NC}"
echo ""

# Mostrar informações
echo -e "${CYAN}📋 Informações:${NC}"
railway status

echo ""
echo -e "${CYAN}🔗 URLs:${NC}"
DOMAIN=$(railway domain 2>/dev/null || echo "")
if [ -n "$DOMAIN" ]; then
    echo -e "   Site: ${GREEN}https://${DOMAIN}${NC}"
    echo -e "   Health: ${GREEN}https://${DOMAIN}/health${NC}"
else
    echo -e "   ${YELLOW}Configure domínio no Railway Dashboard${NC}"
fi

echo ""
echo -e "${CYAN}📊 Acompanhar logs:${NC}"
echo "   railway logs --follow"
echo ""

echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS:${NC}"
echo "1. Criar MySQL no Railway Dashboard"
echo "2. Criar Redis no Railway Dashboard (opcional)"
echo "3. Configurar DATABASE_URL e REDIS_URL"
echo "4. Aplicar migrations: railway connect mysql && npm run db:push"
echo ""

echo -e "${GREEN}✅ Deploy concluído! 🚀${NC}"
