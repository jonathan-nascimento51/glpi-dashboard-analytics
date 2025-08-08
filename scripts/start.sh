#!/bin/bash

# GLPI Dashboard Analytics - Start Script
# Este script inicia tanto o backend quanto o frontend

echo "🚀 Iniciando GLPI Dashboard Analytics..."

# Verificar se estamos no diretório correto
if [ ! -f "app.py" ]; then
    echo "❌ Erro: Execute este script a partir do diretório raiz do projeto"
    exit 1
fi

# Função para verificar se uma porta está em uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta $port já está em uso"
        return 1
    fi
    return 0
fi

# Verificar portas
echo "🔍 Verificando portas..."
check_port 5000 || echo "   Backend pode não iniciar corretamente"
check_port 5173 || echo "   Frontend pode não iniciar corretamente"

# Verificar dependências do Python
echo "📦 Verificando dependências do Python..."
if [ ! -f "venv/bin/activate" ] && [ ! -f "venv/Scripts/activate" ]; then
    echo "⚠️  Ambiente virtual não encontrado. Criando..."
    python -m venv venv
fi

# Ativar ambiente virtual
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    echo "❌ Erro: Não foi possível ativar o ambiente virtual"
    exit 1
fi

# Instalar dependências Python se necessário
if [ ! -f ".deps_installed" ]; then
    echo "📦 Instalando dependências do Python..."
    pip install -r requirements.txt
    touch .deps_installed
fi

# Verificar dependências do Node.js
echo "📦 Verificando dependências do Node.js..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do Node.js..."
    npm install
fi
cd ..

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "⚙️  Criando arquivo .env..."
    cp .env.example .env
    echo "   ✅ Arquivo .env criado. Configure suas credenciais GLPI!"
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚙️  Criando arquivo .env do frontend..."
    cp frontend/.env.example frontend/.env
fi

# Função para cleanup ao sair
cleanup() {
    echo "\n🛑 Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serviços parados"
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Iniciar backend
echo "🔧 Iniciando backend..."
python app.py &
BACKEND_PID=$!

# Aguardar um pouco para o backend inicializar
sleep 3

# Verificar se o backend está rodando
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Erro: Backend falhou ao iniciar"
    exit 1
fi

echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Iniciar frontend
echo "🎨 Iniciando frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Aguardar um pouco para o frontend inicializar
sleep 3

# Verificar se o frontend está rodando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Erro: Frontend falhou ao iniciar"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

echo ""
echo "🎉 GLPI Dashboard Analytics iniciado com sucesso!"
echo ""
echo "📊 Dashboard: http://localhost:5173"
echo "🔧 API Backend: http://localhost:5000"
echo ""
echo "💡 Dicas:"
echo "   - Configure suas credenciais GLPI no arquivo .env"
echo "   - Pressione Ctrl+C para parar os serviços"
echo "   - Logs do backend e frontend aparecerão abaixo"
echo ""
echo "📝 Logs:"
echo "----------------------------------------"

# Aguardar os processos
wait