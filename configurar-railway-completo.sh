#!/bin/bash

echo "🚀 Configurando EZ CLIP AI no Railway..."
echo ""

# Gerar JWT_SECRET aleatório
JWT_SECRET=$(openssl rand -hex 32)

echo "✅ JWT_SECRET gerado: $JWT_SECRET"
echo ""
echo "📋 Próximos comandos para executar após instalar Railway CLI:"
echo ""
echo "1. Fazer login:"
echo "   railway login"
echo ""
echo "2. Conectar ao projeto:"
echo "   cd /Users/danielmarczukbraun/Downloads/viral-clips-ai"
echo "   railway link"
echo ""
echo "3. Configurar variáveis (após adicionar MySQL/Redis no dashboard):"
echo "   railway variables set JWT_SECRET=\"$JWT_SECRET\""
echo "   railway variables set NODE_ENV=production"
echo "   railway variables set PORT=3001"
echo "   railway variables set BUILT_IN_FORGE_API_URL=https://api.manus.im"
echo "   railway variables set AWS_REGION=us-east-1"
echo "   railway variables set AWS_S3_BUCKET=ez-clip-ai"
echo ""
echo "4. Aplicar migrations:"
echo "   railway run npm run db:push"
echo ""
echo "✅ Script preparado!"
