#!/bin/bash

echo "🚀 Iniciando EZ Clips AI localmente..."
echo ""

# Matar processos anteriores nas portas 3000 e 3001
echo "🧹 Limpando processos anteriores..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Iniciar servidores
echo "📦 Iniciando servidores..."
echo ""
echo "Frontend será acessível em: http://localhost:3000"
echo "Backend será acessível em: http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

# Iniciar ambos os servidores
npm run dev:all

