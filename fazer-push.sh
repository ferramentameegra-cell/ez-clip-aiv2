#!/bin/bash

# Script para fazer push para o GitHub
# Execute: bash fazer-push.sh

echo "🚀 Fazer Push para GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar se está no diretório correto
if [ ! -d ".git" ]; then
  echo "❌ Erro: Execute este script dentro da pasta do projeto!"
  exit 1
fi

echo "📋 Escolha uma opção:"
echo ""
echo "1. Fazer push (você vai colar o token quando pedir)"
echo "2. Ver instruções para criar token do GitHub"
echo ""
read -p "Digite 1 ou 2: " opcao

if [ "$opcao" = "2" ]; then
  echo ""
  echo "📝 COMO CRIAR TOKEN DO GITHUB:"
  echo ""
  echo "1. Acesse: https://github.com/settings/tokens/new"
  echo "2. Note: digite 'ez-clip-ai-push'"
  echo "3. Expiration: escolha quanto tempo quer (ou No expiration)"
  echo "4. Marque a permissão: ✅ repo (todas as permissões)"
  echo "5. Clique: Generate token (botão verde no final)"
  echo "6. COPIE o token que aparece (começa com ghp_...)"
  echo ""
  echo "⚠️  IMPORTANTE: Você só verá o token uma vez!"
  echo ""
  echo "Depois execute este script novamente e escolha opção 1!"
  exit 0
fi

if [ "$opcao" = "1" ]; then
  echo ""
  read -sp "Cole seu GitHub Personal Access Token: " token
  echo ""
  
  if [ -z "$token" ]; then
    echo "❌ Token não fornecido!"
    exit 1
  fi
  
  echo ""
  echo "📤 Fazendo push com token..."
  echo ""
  
  # Configurar remote com token (temporário)
  git remote set-url origin https://${token}@github.com/ferramentameegra-cell/ez-clip-ai.git
  
  # Fazer push
  echo "Enviando código para GitHub..."
  git push origin main
  
  # Verificar resultado
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push concluído com sucesso!"
    echo ""
    echo "🎯 Próximos passos:"
    echo "1. Acesse: https://github.com/ferramentameegra-cell/ez-clip-ai"
    echo "2. Verifique se o código está lá"
    echo "3. Railway detectará as mudanças automaticamente"
    echo "4. Deploy iniciará em alguns minutos"
    echo ""
    echo "Acompanhe o deploy em: https://railway.app"
  else
    echo ""
    echo "❌ Erro ao fazer push. Verifique:"
    echo "- Token está correto?"
    echo "- Tem acesso ao repositório?"
    echo "- Token tem permissão 'repo'?"
  fi
  
  # Remover token do remote (segurança)
  echo ""
  echo "🔒 Removendo token do remote (segurança)..."
  git remote set-url origin https://github.com/ferramentameegra-cell/ez-clip-ai.git
  
  echo "✅ Token removido!"
fi
