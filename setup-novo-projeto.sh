#!/bin/bash

# 🚀 Script Automatizado para Criar Novo Projeto no GitHub e Railway
# Este script prepara tudo automaticamente para criar um novo projeto

set -e  # Parar em caso de erro

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  🚀 Setup Automatizado - Novo Projeto GitHub/Railway  ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Verificar se Git está inicializado
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Inicializando repositório Git...${NC}"
    git init
    git branch -M main
fi

echo -e "${GREEN}✅ Verificações iniciais concluídas${NC}"
echo ""

# Verificar status do Git
echo -e "${BLUE}📋 Status atual do Git:${NC}"
git status --short
echo ""

# Verificar remotes
echo -e "${BLUE}📋 Remotes configurados:${NC}"
git remote -v
echo ""

# Preparar arquivos para commit
echo -e "${YELLOW}📦 Preparando arquivos...${NC}"

# Adicionar todos os arquivos não rastreados (exceto .env e node_modules)
git add -A

# Verificar se há mudanças para commitar
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Nenhuma mudança pendente${NC}"
else
    echo -e "${YELLOW}💾 Criando commit preparatório...${NC}"
    git commit -m "chore: Preparar projeto para novo repositório" || echo -e "${YELLOW}⚠️  Nenhuma mudança para commitar${NC}"
fi

echo ""
echo -e "${GREEN}✅ ========================================"
echo "   Projeto preparado com sucesso!"
echo "========================================${NC}"
echo ""

# Gerar informações úteis
echo -e "${CYAN}📋 Informações do Projeto:${NC}"
echo ""
echo -e "Nome do projeto: ${BLUE}$(grep '"name"' package.json | cut -d'"' -f4)${NC}"
echo -e "Versão: ${BLUE}$(grep '"version"' package.json | cut -d'"' -f4)${NC}"
echo -e "Branch atual: ${BLUE}$(git branch --show-current)${NC}"
echo ""

# Gerar JWT_SECRET aleatório
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
echo -e "${CYAN}🔐 JWT_SECRET gerado (use no Railway):${NC}"
echo -e "${GREEN}${JWT_SECRET}${NC}"
echo ""

# Criar arquivo de configuração
CONFIG_FILE=".novo-projeto-config.txt"
cat > "$CONFIG_FILE" << EOF
# Configuração para Novo Projeto
# Gerado em: $(date)

## Informações do Projeto
NOME_PROJETO=$(grep '"name"' package.json | cut -d'"' -f4)
VERSAO=$(grep '"version"' package.json | cut -d'"' -f4)
BRANCH=$(git branch --show-current)

## JWT_SECRET Gerado
JWT_SECRET=${JWT_SECRET}

## Próximos Passos:
1. Criar repositório no GitHub: https://github.com/new
2. Executar: git remote add novo-origin [URL_DO_REPOSITORIO]
3. Executar: git push -u novo-origin main
4. Criar projeto no Railway: https://railway.app
5. Conectar ao repositório GitHub
6. Configurar variáveis de ambiente (veja ENV_VARIABLES.md)
7. Criar MySQL e Redis no Railway
8. Aplicar migrations: npm run db:push
EOF

echo -e "${GREEN}✅ Arquivo de configuração criado: ${CONFIG_FILE}${NC}"
echo ""

# Criar script de push rápido
PUSH_SCRIPT="push-novo-projeto.sh"
cat > "$PUSH_SCRIPT" << 'EOFSCRIPT'
#!/bin/bash
# Script para fazer push para novo repositório

if [ -z "$1" ]; then
    echo "❌ Uso: ./push-novo-projeto.sh [URL_DO_REPOSITORIO]"
    echo "Exemplo: ./push-novo-projeto.sh https://github.com/usuario/projeto.git"
    exit 1
fi

REPO_URL=$1
REMOTE_NAME="novo-origin"

# Verificar se remote já existe
if git remote | grep -q "^${REMOTE_NAME}$"; then
    echo "⚠️  Remote '${REMOTE_NAME}' já existe. Removendo..."
    git remote remove $REMOTE_NAME
fi

echo "📤 Adicionando remote: $REPO_URL"
git remote add $REMOTE_NAME $REPO_URL

echo "📋 Verificando remotes:"
git remote -v

echo ""
echo "🚀 Fazendo push para novo repositório..."
git push -u $REMOTE_NAME main

echo ""
echo "✅ Push concluído!"
EOFSCRIPT

chmod +x "$PUSH_SCRIPT"
echo -e "${GREEN}✅ Script de push criado: ${PUSH_SCRIPT}${NC}"
echo ""

# Instruções finais
echo -e "${CYAN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              🎯 Próximos Passos                        ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}1. Criar repositório no GitHub:${NC}"
echo "   → Acesse: https://github.com/new"
echo "   → Nome: escolha um nome para o projeto"
echo "   → NÃO marque nenhuma opção de inicialização"
echo ""
echo -e "${YELLOW}2. Fazer push para o novo repositório:${NC}"
echo "   → Opção A: Use o script criado:"
echo -e "     ${GREEN}./push-novo-projeto.sh [URL_DO_REPOSITORIO]${NC}"
echo ""
echo "   → Opção B: Comandos manuais:"
echo -e "     ${GREEN}git remote add novo-origin [URL_DO_REPOSITORIO]${NC}"
echo -e "     ${GREEN}git push -u novo-origin main${NC}"
echo ""
echo -e "${YELLOW}3. Criar projeto no Railway:${NC}"
echo "   → Acesse: https://railway.app"
echo "   → New Project → Deploy from GitHub repo"
echo "   → Selecione o repositório criado"
echo ""
echo -e "${YELLOW}4. Configurar variáveis no Railway:${NC}"
echo "   → Use o JWT_SECRET gerado acima"
echo "   → Veja ENV_VARIABLES.md para lista completa"
echo ""
echo -e "${YELLOW}5. Criar MySQL e Redis no Railway:${NC}"
echo "   → + New → Database → Add MySQL"
echo "   → + New → Database → Add Redis"
echo ""
echo -e "${YELLOW}6. Aplicar migrations:${NC}"
echo "   → Via CLI: railway connect mysql && npm run db:push"
echo "   → Ou via Railway Dashboard"
echo ""
echo -e "${CYAN}📚 Documentação completa:${NC}"
echo "   → CRIAR_NOVO_PROJETO_GITHUB_RAILWAY.md"
echo "   → COMANDOS_CRIAR_NOVO_PROJETO.md"
echo ""
echo -e "${GREEN}✅ Tudo pronto! Boa sorte com o novo projeto! 🚀${NC}"
echo ""
