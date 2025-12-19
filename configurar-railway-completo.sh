#!/bin/bash

# 🚀 Configuração Completa do Railway - Gentle Fulfillment
# Este script configura TUDO automaticamente no Railway

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 Configuração Completa Railway - Gentle Fulfillment ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando Railway CLI...${NC}"
    npm install -g @railway/cli
fi

# Login
echo -e "${BLUE}🔐 Fazendo login no Railway...${NC}"
railway login || {
    echo -e "${RED}❌ Erro ao fazer login${NC}"
    exit 1
}

echo ""

# Criar novo projeto ou linkar existente
echo -e "${BLUE}📋 Escolha uma opção:${NC}"
echo "1. Criar novo projeto no Railway"
echo "2. Linkar a projeto existente"
read -p "Opção (1 ou 2): " OPTION

if [ "$OPTION" = "1" ]; then
    echo -e "${YELLOW}📦 Criando novo projeto...${NC}"
    railway init
else
    echo -e "${YELLOW}🔗 Linkando a projeto existente...${NC}"
    railway link
fi

echo ""

# Ler configurações
if [ -f ".novo-projeto-config.txt" ]; then
    JWT_SECRET=$(grep "JWT_SECRET=" .novo-projeto-config.txt | cut -d'=' -f2)
else
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
fi

echo -e "${BLUE}📋 Configurando variáveis de ambiente...${NC}"

# Variáveis obrigatórias
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET="$JWT_SECRET"

echo -e "${GREEN}✅ Variáveis básicas configuradas${NC}"

# Criar MySQL
echo ""
echo -e "${BLUE}🗄️  Criando MySQL...${NC}"
read -p "Criar MySQL automaticamente? (s/n): " CREATE_MYSQL

if [ "$CREATE_MYSQL" = "s" ] || [ "$CREATE_MYSQL" = "S" ]; then
    echo -e "${YELLOW}⚠️  MySQL deve ser criado via Railway Dashboard${NC}"
    echo -e "${YELLOW}   Acesse: Railway → + New → Database → Add MySQL${NC}"
    read -p "Pressione ENTER quando MySQL estiver criado..."
    
    # Obter DATABASE_URL
    echo -e "${BLUE}📋 Obtendo DATABASE_URL do MySQL...${NC}"
    DATABASE_URL=$(railway variables --service mysql 2>/dev/null | grep DATABASE_URL | cut -d'=' -f2- || echo "")
    
    if [ -n "$DATABASE_URL" ]; then
        railway variables set DATABASE_URL="$DATABASE_URL"
        echo -e "${GREEN}✅ DATABASE_URL configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  Não foi possível obter DATABASE_URL automaticamente${NC}"
        read -p "Cole o DATABASE_URL manualmente: " DATABASE_URL
        railway variables set DATABASE_URL="$DATABASE_URL"
    fi
fi

# Criar Redis
echo ""
echo -e "${BLUE}🔴 Criando Redis...${NC}"
read -p "Criar Redis automaticamente? (s/n): " CREATE_REDIS

if [ "$CREATE_REDIS" = "s" ] || [ "$CREATE_REDIS" = "S" ]; then
    echo -e "${YELLOW}⚠️  Redis deve ser criado via Railway Dashboard${NC}"
    echo -e "${YELLOW}   Acesse: Railway → + New → Database → Add Redis${NC}"
    read -p "Pressione ENTER quando Redis estiver criado..."
    
    # Obter REDIS_URL
    echo -e "${BLUE}📋 Obtendo REDIS_URL do Redis...${NC}"
    REDIS_URL=$(railway variables --service redis 2>/dev/null | grep REDIS_URL | cut -d'=' -f2- || echo "")
    
    if [ -n "$REDIS_URL" ]; then
        railway variables set REDIS_URL="$REDIS_URL"
        echo -e "${GREEN}✅ REDIS_URL configurado${NC}"
    else
        echo -e "${YELLOW}⚠️  Não foi possível obter REDIS_URL automaticamente${NC}"
        read -p "Cole o REDIS_URL manualmente: " REDIS_URL
        railway variables set REDIS_URL="$REDIS_URL"
    fi
fi

# Configurar domínio
echo ""
echo -e "${BLUE}🌐 Configurando domínio...${NC}"
DOMAIN=$(railway domain 2>/dev/null || echo "")

if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  Nenhum domínio configurado${NC}"
    echo -e "${YELLOW}   Configure no Railway Dashboard: Settings → Domains → Generate Domain${NC}"
    read -p "Digite o domínio (ou pressione ENTER para pular): " DOMAIN
    
    if [ -n "$DOMAIN" ]; then
        railway domain "$DOMAIN"
        railway variables set FRONTEND_URL="https://${DOMAIN}"
        echo -e "${GREEN}✅ Domínio configurado${NC}"
    fi
else
    railway variables set FRONTEND_URL="https://${DOMAIN}"
    echo -e "${GREEN}✅ Domínio já configurado: ${DOMAIN}${NC}"
fi

# Aplicar migrations
if railway variables get DATABASE_URL &> /dev/null; then
    echo ""
    echo -e "${BLUE}🗄️  Aplicar migrations agora?${NC}"
    read -p "Aplicar migrations? (s/n): " APPLY_MIGRATIONS
    
    if [ "$APPLY_MIGRATIONS" = "s" ] || [ "$APPLY_MIGRATIONS" = "S" ]; then
        echo -e "${YELLOW}📦 Aplicando migrations...${NC}"
        railway connect mysql -- npm run db:push || {
            echo -e "${YELLOW}⚠️  Execute manualmente: railway connect mysql${NC}"
            echo -e "${YELLOW}   Depois: npm run db:push${NC}"
        }
    fi
fi

# Variáveis opcionais
echo ""
echo -e "${BLUE}📋 Configurar variáveis opcionais?${NC}"
read -p "Configurar variáveis adicionais (OpenAI, AWS, Stripe)? (s/n): " CONFIG_OPTIONAL

if [ "$CONFIG_OPTIONAL" = "s" ] || [ "$CONFIG_OPTIONAL" = "S" ]; then
    echo ""
    echo -e "${CYAN}Configuração de variáveis opcionais:${NC}"
    echo ""
    
    read -p "OPENAI_API_KEY (ou ENTER para pular): " OPENAI_KEY
    if [ -n "$OPENAI_KEY" ]; then
        railway variables set OPENAI_API_KEY="$OPENAI_KEY"
    fi
    
    read -p "ANTHROPIC_API_KEY (ou ENTER para pular): " ANTHROPIC_KEY
    if [ -n "$ANTHROPIC_KEY" ]; then
        railway variables set ANTHROPIC_API_KEY="$ANTHROPIC_KEY"
    fi
    
    read -p "AWS_ACCESS_KEY_ID (ou ENTER para pular): " AWS_KEY
    if [ -n "$AWS_KEY" ]; then
        railway variables set AWS_ACCESS_KEY_ID="$AWS_KEY"
        read -p "AWS_SECRET_ACCESS_KEY: " AWS_SECRET
        railway variables set AWS_SECRET_ACCESS_KEY="$AWS_SECRET"
        read -p "AWS_S3_BUCKET: " AWS_BUCKET
        railway variables set AWS_S3_BUCKET="$AWS_BUCKET"
        read -p "AWS_REGION (padrão: us-east-1): " AWS_REGION
        railway variables set AWS_REGION="${AWS_REGION:-us-east-1}"
    fi
    
    read -p "STRIPE_SECRET_KEY (ou ENTER para pular): " STRIPE_KEY
    if [ -n "$STRIPE_KEY" ]; then
        railway variables set STRIPE_SECRET_KEY="$STRIPE_KEY"
    fi
fi

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Configuração completa!"
echo "========================================${NC}"
echo ""

# Fazer deploy
echo -e "${BLUE}🚀 Fazer deploy agora?${NC}"
read -p "Fazer deploy? (s/n): " DO_DEPLOY

if [ "$DO_DEPLOY" = "s" ] || [ "$DO_DEPLOY" = "S" ]; then
    echo -e "${YELLOW}📦 Fazendo deploy...${NC}"
    railway up
fi

echo ""
echo -e "${CYAN}📋 Resumo da Configuração:${NC}"
echo ""
railway status
echo ""

if [ -n "$DOMAIN" ]; then
    echo -e "${CYAN}🔗 URLs:${NC}"
    echo -e "   Frontend: ${GREEN}https://${DOMAIN}${NC}"
    echo -e "   Health: ${GREEN}https://${DOMAIN}/health${NC}"
fi

echo ""
echo -e "${GREEN}✅ Tudo configurado! 🚀${NC}"
