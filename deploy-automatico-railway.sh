#!/bin/bash

# 🚀 Deploy Automático Completo no Railway
# Este script faz TUDO automaticamente

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     🚀 Deploy Automático Railway - EZ Clips AI       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Verificar Railway CLI
echo -e "${BLUE}🔍 Verificando Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI não encontrado${NC}"
    echo -e "${YELLOW}   Instale com: npm install -g @railway/cli${NC}"
    echo ""
    echo -e "${CYAN}📋 Como instalar:${NC}"
    echo "1. Abra um terminal"
    echo "2. Execute: npm install -g @railway/cli"
    echo "3. Execute este script novamente"
    echo ""
    echo -e "${YELLOW}Ou configure via Dashboard do Railway:${NC}"
    echo "1. Acesse: https://railway.app"
    echo "2. Seu projeto → Settings → Variables"
    echo "3. Configure as variáveis manualmente"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI encontrado${NC}"
echo ""

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
echo -e "${BLUE}🔗 Verificando link com projeto...${NC}"
if [ ! -f ".railway/project.json" ]; then
    echo -e "${YELLOW}⚠️  Projeto não está linkado${NC}"
    echo -e "${BLUE}Linkando ao projeto...${NC}"
    railway link
else
    echo -e "${GREEN}✅ Projeto já está linkado${NC}"
    PROJECT_ID=$(cat .railway/project.json 2>/dev/null | grep -o '"projectId":"[^"]*' | cut -d'"' -f4 || echo "")
    if [ -n "$PROJECT_ID" ]; then
        echo -e "   Project ID: ${CYAN}${PROJECT_ID}${NC}"
    fi
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
railway variables set NODE_ENV=production 2>/dev/null || echo -e "${YELLOW}⚠️  NODE_ENV já configurado${NC}"
railway variables set PORT=3001 2>/dev/null || echo -e "${YELLOW}⚠️  PORT já configurado${NC}"
railway variables set JWT_SECRET="$JWT_SECRET" 2>/dev/null || echo -e "${YELLOW}⚠️  JWT_SECRET já configurado${NC}"
echo -e "${GREEN}✅ Variáveis básicas configuradas${NC}"

# Verificar MySQL
echo ""
echo -e "${BLUE}🗄️  Verificando MySQL...${NC}"
MYSQL_URL=$(railway variables --service mysql 2>/dev/null | grep MYSQL_URL | cut -d'=' -f2- | head -1 || echo "")

if [ -n "$MYSQL_URL" ]; then
    echo -e "${GREEN}✅ MySQL encontrado${NC}"
    railway variables set DATABASE_URL="$MYSQL_URL" 2>/dev/null || echo -e "${YELLOW}⚠️  DATABASE_URL já configurado${NC}"
    echo -e "${GREEN}✅ DATABASE_URL configurado${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL não encontrado ou MYSQL_URL não disponível${NC}"
    echo -e "${YELLOW}   Configure manualmente no Railway Dashboard${NC}"
fi

# Verificar Redis
echo ""
echo -e "${BLUE}🔴 Verificando Redis...${NC}"
REDIS_URL=$(railway variables --service redis 2>/dev/null | grep REDIS_URL | cut -d'=' -f2- | head -1 || echo "")

if [ -n "$REDIS_URL" ]; then
    echo -e "${GREEN}✅ Redis encontrado${NC}"
    railway variables set REDIS_URL="$REDIS_URL" 2>/dev/null || echo -e "${YELLOW}⚠️  REDIS_URL já configurado${NC}"
    echo -e "${GREEN}✅ REDIS_URL configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Redis não encontrado (opcional)${NC}"
fi

# Verificar domínio
echo ""
echo -e "${BLUE}🌐 Verificando domínio...${NC}"
DOMAIN=$(railway domain 2>/dev/null || echo "")

if [ -n "$DOMAIN" ]; then
    echo -e "${GREEN}✅ Domínio encontrado: ${CYAN}${DOMAIN}${NC}"
    railway variables set FRONTEND_URL="https://${DOMAIN}" 2>/dev/null || echo -e "${YELLOW}⚠️  FRONTEND_URL já configurado${NC}"
    echo -e "${GREEN}✅ FRONTEND_URL configurado${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhum domínio configurado${NC}"
    echo -e "${YELLOW}   Configure no Railway Dashboard: Settings → Domains → Generate Domain${NC}"
fi

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
echo -e "${CYAN}📋 Status do Projeto:${NC}"
railway status 2>/dev/null || echo -e "${YELLOW}⚠️  Não foi possível obter status${NC}"

echo ""
echo -e "${CYAN}🔗 URLs:${NC}"
if [ -n "$DOMAIN" ]; then
    echo -e "   Site: ${GREEN}https://${DOMAIN}${NC}"
    echo -e "   Health: ${GREEN}https://${DOMAIN}/health${NC}"
    echo -e "   API: ${GREEN}https://${DOMAIN}/api${NC}"
else
    echo -e "   ${YELLOW}Configure domínio no Railway Dashboard${NC}"
    echo -e "   ${YELLOW}Settings → Domains → Generate Domain${NC}"
fi

echo ""
echo -e "${CYAN}📊 Comandos Úteis:${NC}"
echo "   Ver logs: railway logs --follow"
echo "   Ver status: railway status"
echo "   Conectar MySQL: railway connect mysql"
echo ""

echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS:${NC}"
echo "1. Aguarde o build completar (3-5 minutos)"
echo "2. Verifique logs: railway logs --follow"
echo "3. Se MySQL não foi configurado automaticamente:"
echo "   - Railway Dashboard → MySQL → Variables → Copiar MYSQL_URL"
echo "   - Service → Variables → Adicionar DATABASE_URL"
echo "4. Aplicar migrations: railway connect mysql && npm run db:push"
echo ""

echo -e "${GREEN}✅ Deploy automático concluído! 🚀${NC}"
