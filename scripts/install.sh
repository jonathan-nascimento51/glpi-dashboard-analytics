#!/bin/bash

# GLPI Dashboard Analytics - Installation Script
# Este script configura o ambiente de desenvolvimento

echo "📦 GLPI Dashboard Analytics - Instalação"
echo "======================================="

# Verificar se estamos no diretório correto
if [ ! -f "app.py" ]; then
    echo "❌ Erro: Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

# Verificar dependências do sistema
echo "🔍 Verificando dependências do sistema..."

# Verificar Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python não está instalado"
    echo "   Instale Python 3.8+ antes de continuar"
    exit 1
fi

# Usar python3 se disponível, senão python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

echo "✅ Python encontrado: $($PYTHON_CMD --version)"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado"
    echo "   Instale Node.js 16+ antes de continuar"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado"
    echo "   Instale npm antes de continuar"
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Criar ambiente virtual Python
echo "\n🐍 Configurando ambiente Python..."
if [ -d "venv" ]; then
    echo "⚠️  Ambiente virtual já existe. Removendo..."
    rm -rf venv
fi

echo "📦 Criando ambiente virtual..."
$PYTHON_CMD -m venv venv

# Ativar ambiente virtual
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "❌ Erro: Não foi possível criar o ambiente virtual"
    exit 1
fi

echo "✅ Ambiente virtual criado e ativado"

# Atualizar pip
echo "📦 Atualizando pip..."
pip install --upgrade pip

# Instalar dependências Python
echo "📦 Instalando dependências Python..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependências Python instaladas"
    touch .deps_installed
else
    echo "❌ Erro ao instalar dependências Python"
    exit 1
fi

# Configurar frontend
echo "\n🎨 Configurando frontend..."
cd frontend

# Instalar dependências Node.js
echo "📦 Instalando dependências Node.js..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências Node.js instaladas"
else
    echo "❌ Erro ao instalar dependências Node.js"
    exit 1
fi

cd ..

# Criar arquivos de configuração
echo "\n⚙️  Configurando arquivos de ambiente..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado"
else
    echo "⚠️  Arquivo .env já existe"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Arquivo .env do frontend criado"
else
    echo "⚠️  Arquivo .env do frontend já existe"
fi

# Tornar scripts executáveis
echo "\n🔧 Configurando permissões..."
chmod +x scripts/*.sh
echo "✅ Permissões configuradas"

# Verificar instalação
echo "\n🧪 Verificando instalação..."

# Testar importações Python
echo "📝 Testando dependências Python..."
$PYTHON_CMD -c "import flask, requests, redis, marshmallow; print('✅ Dependências Python OK')" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Algumas dependências Python podem estar com problemas"
fi

# Testar Node.js
echo "📝 Testando dependências Node.js..."
cd frontend
node -e "console.log('✅ Node.js OK')" 2>/dev/null
cd ..

echo "\n🎉 Instalação concluída!"
echo "========================"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure suas credenciais GLPI no arquivo .env"
echo "   2. Execute: ./scripts/start.sh (Linux/Mac) ou scripts/start.bat (Windows)"
echo "   3. Acesse: http://localhost:5173"
echo ""
echo "📁 Arquivos importantes:"
echo "   - .env: Configurações do backend"
echo "   - frontend/.env: Configurações do frontend"
echo "   - README.md: Documentação completa"
echo ""
echo "🆘 Precisa de ajuda?"
echo "   - Verifique o README.md"
echo "   - Confira os logs de erro"
echo "   - Certifique-se de que o GLPI está acessível"
echo ""