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
