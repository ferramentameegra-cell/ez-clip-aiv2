#!/bin/bash

export PATH="$HOME/.local/bin:$PATH"

echo "🔗 Conectando ao projeto no Railway..."
echo ""
echo "Escolha o projeto que corresponde ao ez-clip-ai:"
echo ""
echo "1. gentle-fulfillment"
echo "2. profound-respect"
echo "3. gleaming-enchantment"
echo ""
read -p "Digite o número do projeto (1, 2 ou 3): " escolha

case $escolha in
    1)
        PROJECT="gentle-fulfillment"
        ;;
    2)
        PROJECT="profound-respect"
        ;;
    3)
        PROJECT="gleaming-enchantment"
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "🔗 Conectando ao projeto: $PROJECT"
cd /Users/danielmarczukbraun/Downloads/viral-clips-ai

# Tentar conectar
railway link --project "$PROJECT" 2>&1 || railway link

echo ""
echo "✅ Pronto! Agora me avise e eu continuo configurando tudo!"

