@echo off
REM GLPI Dashboard Analytics - Start Script for Windows
REM Este script inicia tanto o backend quanto o frontend

echo 🚀 Iniciando GLPI Dashboard Analytics...

REM Verificar se estamos no diretório correto
if not exist "app.py" (
    echo ❌ Erro: Execute este script a partir do diretório raiz do projeto
    pause
    exit /b 1
)

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Erro: Python não está instalado ou não está no PATH
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Erro: Node.js não está instalado ou não está no PATH
    pause
    exit /b 1
)

echo 📦 Verificando dependências do Python...

REM Criar ambiente virtual se não existir
if not exist "venv" (
    echo ⚠️  Ambiente virtual não encontrado. Criando...
    python -m venv venv
)

REM Ativar ambiente virtual
call venv\Scripts\activate.bat

REM Instalar dependências Python se necessário
if not exist ".deps_installed" (
    echo 📦 Instalando dependências do Python...
    pip install -r requirements.txt
    echo. > .deps_installed
)

echo 📦 Verificando dependências do Node.js...
cd frontend
if not exist "node_modules" (
    echo 📦 Instalando dependências do Node.js...
    npm install
)
cd ..

REM Criar arquivo .env se não existir
if not exist ".env" (
    echo ⚙️  Criando arquivo .env...
    copy .env.example .env
    echo    ✅ Arquivo .env criado. Configure suas credenciais GLPI!
)

if not exist "frontend\.env" (
    echo ⚙️  Criando arquivo .env do frontend...
    copy frontend\.env.example frontend\.env
)

echo.
echo 🎉 Iniciando serviços...
echo.
echo 📊 Dashboard: http://localhost:5173
echo 🔧 API Backend: http://localhost:5000
echo.
echo 💡 Dicas:
echo    - Configure suas credenciais GLPI no arquivo .env
echo    - Feche esta janela para parar os serviços
echo    - Logs aparecerão nas janelas que se abrirem
echo.

REM Iniciar backend em nova janela
start "GLPI Dashboard - Backend" cmd /k "venv\Scripts\activate.bat && python app.py"

REM Aguardar um pouco para o backend inicializar
timeout /t 3 /nobreak >nul

REM Iniciar frontend em nova janela
start "GLPI Dashboard - Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ Serviços iniciados!
echo.
echo Pressione qualquer tecla para sair...
pause >nul