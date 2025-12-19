#!/bin/bash

# 🚀 Script Automatizado para Deploy no Railway
# Configura tudo automaticamente usando Railway CLI

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🚀 Deploy Automatizado Railway - Gentle Fulfillment ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI não encontrado. Instalando...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI instalado${NC}"
fi

# Verificar se está logado
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
echo -e "${BLUE}🔗 Verificando link com projeto...${NC}"
if [ ! -f ".railway/project.json" ]; then
    echo -e "${YELLOW}⚠️  Projeto não está linkado. Linkando...${NC}"
    railway link
else
    echo -e "${GREEN}✅ Projeto já está linkado${NC}"
    PROJECT_ID=$(cat .railway/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
    echo -e "   Project ID: ${CYAN}${PROJECT_ID}${NC}"
fi

echo ""

# Ler JWT_SECRET do arquivo de configuração
if [ -f ".novo-projeto-config.txt" ]; then
    JWT_SECRET=$(grep "JWT_SECRET=" .novo-projeto-config.txt | cut -d'=' -f2)
    echo -e "${GREEN}✅ JWT_SECRET encontrado no arquivo de configuração${NC}"
else
    # Gerar novo JWT_SECRET
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
    echo -e "${YELLOW}⚠️  Gerando novo JWT_SECRET...${NC}"
fi

echo ""

# Configurar variáveis de ambiente
echo -e "${BLUE}📋 Configurando variáveis de ambiente...${NC}"

# Variáveis básicas obrigatórias
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="$JWT_SECRET"

echo -e "${GREEN}✅ Variáveis básicas configuradas${NC}"

# Verificar se MySQL está configurado
echo ""
echo -e "${BLUE}🗄️  Verificando MySQL...${NC}"
MYSQL_SERVICES=$(railway status 2>/dev/null | grep -i mysql || echo "")

if [ -z "$MYSQL_SERVICES" ]; then
    echo -e "${YELLOW}⚠️  MySQL não encontrado.${NC}"
    echo -e "${YELLOW}   Você precisa criar MySQL manualmente no Railway Dashboard${NC}"
    echo -e "${YELLOW}   Depois execute: railway variables set DATABASE_URL=\$(railway variables --service mysql)${NC}"
else
    echo -e "${GREEN}✅ MySQL encontrado${NC}"
    # Tentar obter DATABASE_URL do MySQL
    DATABASE_URL=$(railway variables --service mysql 2>/dev/null | grep DATABASE_URL | cut -d'=' -f2- || echo "")
    if [ -n "$DATABASE_URL" ]; then
        railway variables set DATABASE_URL="$DATABASE_URL"
        echo -e "${GREEN}✅ DATABASE_URL configurado${NC}"
    fi
fi

# Verificar se Redis está configurado
echo ""
echo -e "${BLUE}🔴 Verificando Redis...${NC}"
REDIS_SERVICES=$(railway status 2>/dev/null | grep -i redis || echo "")

if [ -z "$REDIS_SERVICES" ]; then
    echo -e "${YELLOW}⚠️  Redis não encontrado.${NC}"
    echo -e "${YELLOW}   Você precisa criar Redis manualmente no Railway Dashboard${NC}"
    echo -e "${YELLOW}   Depois execute: railway variables set REDIS_URL=\$(railway variables --service redis)${NC}"
else
    echo -e "${GREEN}✅ Redis encontrado${NC}"
    # Tentar obter REDIS_URL do Redis
    REDIS_URL=$(railway variables --service redis 2>/dev/null | grep REDIS_URL | cut -d'=' -f2- || echo "")
    if [ -n "$REDIS_URL" ]; then
        railway variables set REDIS_URL="$REDIS_URL"
        echo -e "${GREEN}✅ REDIS_URL configurado${NC}"
    fi
fi

echo ""

# Aplicar migrations se DATABASE_URL estiver configurado
if railway variables get DATABASE_URL &> /dev/null; then
    echo -e "${BLUE}🗄️  Aplicando migrations...${NC}"
    echo -e "${YELLOW}   Conectando ao MySQL...${NC}"
    
    # Conectar e aplicar migrations
    railway connect mysql -- npm run db:push || {
        echo -e "${YELLOW}⚠️  Não foi possível aplicar migrations automaticamente${NC}"
        echo -e "${YELLOW}   Execute manualmente: railway connect mysql${NC}"
        echo -e "${YELLOW}   Depois: npm run db:push${NC}"
    }
else
    echo -e "${YELLOW}⚠️  DATABASE_URL não configurado. Pulando migrations${NC}"
fi

echo ""

# Verificar domínio
echo -e "${BLUE}🌐 Verificando domínio...${NC}"
DOMAIN=$(railway domain 2>/dev/null || echo "")

if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  Nenhum domínio configurado${NC}"
    echo -e "${YELLOW}   Configure no Railway Dashboard: Settings → Domains → Generate Domain${NC}"
else
    echo -e "${GREEN}✅ Domínio: ${CYAN}${DOMAIN}${NC}"
    
    # Atualizar FRONTEND_URL
    railway variables set FRONTEND_URL="https://${DOMAIN}"
    echo -e "${GREEN}✅ FRONTEND_URL atualizado${NC}"
fi

echo ""

# Fazer deploy
echo -e "${BLUE}🚀 Iniciando deploy...${NC}"
railway up

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Deploy automatizado concluído!"
echo "========================================${NC}"
echo ""

# Mostrar informações finais
echo -e "${CYAN}📋 Informações do Deploy:${NC}"
echo ""
railway status
echo ""

echo -e "${CYAN}🔗 URLs:${NC}"
if [ -n "$DOMAIN" ]; then
    echo -e "   Frontend: ${GREEN}https://${DOMAIN}${NC}"
    echo -e "   Health: ${GREEN}https://${DOMAIN}/health${NC}"
    echo -e "   API: ${GREEN}https://${DOMAIN}/api${NC}"
else
    echo -e "   ${YELLOW}Configure um domínio no Railway Dashboard${NC}"
fi

echo ""
echo -e "${CYAN}📚 Próximos Passos:${NC}"
echo ""
echo "1. Configure variáveis adicionais se necessário:"
echo "   railway variables set OPENAI_API_KEY=..."
echo "   railway variables set AWS_ACCESS_KEY_ID=..."
echo ""
echo "2. Verifique logs:"
echo "   railway logs"
echo ""
echo "3. Acompanhe o deploy:"
echo "   railway logs --follow"
echo ""

echo -e "${GREEN}✅ Tudo pronto! 🚀${NC}"
