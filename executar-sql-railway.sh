#!/bin/bash

# Script para executar SQL no Railway
# Execute: bash executar-sql-railway.sh

echo "🔧 Executando SQL no Railway..."
echo ""

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não está instalado."
    echo ""
    echo "Instale com:"
    echo "  npm i -g @railway/cli"
    echo ""
    echo "Depois execute:"
    echo "  railway login"
    echo "  railway link"
    echo ""
    exit 1
fi

# Verificar se está conectado ao projeto
if ! railway status &> /dev/null; then
    echo "⚠️  Não conectado ao projeto Railway."
    echo ""
    echo "Execute:"
    echo "  railway link"
    echo ""
    exit 1
fi

echo "✅ Railway CLI encontrado!"
echo ""
echo "📋 Executando SQL para adicionar colunas de onboarding..."
echo ""

# Executar SQL
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE <<EOF
ALTER TABLE users ADD COLUMN onboarding_use_case TEXT;
ALTER TABLE users ADD COLUMN onboarding_niche VARCHAR(255);
ALTER TABLE users ADD COLUMN onboarding_at TIMESTAMP NULL;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SQL executado com sucesso!"
    echo ""
    echo "🔍 Verificando se as colunas foram criadas..."
    echo ""
    
    railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE -e "SHOW COLUMNS FROM users LIKE 'onboarding%';"
    
    echo ""
    echo "✅ Concluído! Tente criar uma conta novamente."
else
    echo ""
    echo "❌ Erro ao executar SQL."
    echo ""
    echo "💡 Alternativa: Execute manualmente no Railway Dashboard:"
    echo "   1. Acesse: https://railway.app"
    echo "   2. Entre no projeto 'ez-clip-ai'"
    echo "   3. Clique no MySQL"
    echo "   4. Vá em 'Query'"
    echo "   5. Cole e execute o SQL do arquivo SQL_ADICIONAR_COLUNAS_ONBOARDING_SIMPLES.sql"
fi

