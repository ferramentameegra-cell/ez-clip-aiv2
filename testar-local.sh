#!/bin/bash

echo "🔍 Verificando ambiente..."
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js instalado: $(node --version)"
else
    echo "❌ Node.js NÃO encontrado!"
    echo "   Instale em: https://nodejs.org/"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    echo "✅ npm instalado: $(npm --version)"
else
    echo "❌ npm NÃO encontrado!"
    exit 1
fi

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Não está no diretório do projeto!"
    echo "   Execute: cd /Users/josyasborba/Desktop/viral-clips-ai"
    exit 1
fi

echo "✅ Diretório correto"
echo ""

# Verificar dependências
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependências não instaladas"
    echo "   Executando: npm install"
    npm install
else
    echo "✅ Dependências instaladas"
fi

echo ""
echo "🚀 Iniciando servidores..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar"
echo ""

# Limpar portas
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Iniciar
npm run dev:all

