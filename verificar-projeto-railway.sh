#!/bin/bash

export PATH="$HOME/.local/bin:$PATH"

echo "🔍 Verificando projetos no Railway..."
echo ""

PROJECTS=("gentle-fulfillment" "profound-respect" "gleaming-enchantment")

for project in "${PROJECTS[@]}"; do
    echo "📊 Verificando projeto: $project"
    cd /Users/danielmarczukbraun/Downloads/viral-clips-ai
    railway link --project "$project" 2>&1 | head -3
    railway variables 2>&1 | grep -i "DATABASE_URL\|github" | head -2
    echo ""
done

