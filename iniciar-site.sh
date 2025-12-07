#!/bin/bash
echo "🧹 Limpando processos..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
echo "🧹 Limpando cache..."
rm -rf node_modules/.vite client/dist
echo "🚀 Iniciando servidor..."
npm run dev:all
