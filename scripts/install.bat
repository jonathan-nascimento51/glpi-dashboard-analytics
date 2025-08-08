@echo off
REM GLPI Dashboard Analytics - Installation Script for Windows
REM Este script configura o ambiente de desenvolvimento

echo 📦 GLPI Dashboard Analytics - Instalação
echo =======================================

REM Verificar se estamos no diretório correto
if not exist "app.py" (
    echo ❌ Erro: Execute este script a partir do diretório raiz do projeto
    pause
    exit /b 1
)

echo 🔍 Verificando dependências do sistema...

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não está instalado
    echo    Instale Python 3.8+ antes de continuar
    echo    Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python encontrado: %PYTHON_VERSION%

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não está instalado
    echo    Instale Node.js 16+ antes de continuar
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js encontrado: %NODE_VERSION%

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não está instalado
    echo    npm geralmente vem com Node.js
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm encontrado: %NPM_VERSION%

echo.
echo 🐍 Configurando ambiente Python...

REM Remover ambiente virtual existente
if exist "venv" (
    echo ⚠️  Ambiente virtual já existe. Removendo...
    rmdir /s /q venv
)

echo 📦 Criando ambiente virtual...
python -m venv venv

if not exist "venv\Scripts\activate.bat" (
    echo ❌ Erro: Não foi possível criar o ambiente virtual
    pause
    exit /b 1
)

echo ✅ Ambiente virtual criado

REM Ativar ambiente virtual
call venv\Scripts\activate.bat

echo 📦 Atualizando pip...
python -m pip install --upgrade pip

echo 📦 Instalando dependências Python...
pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências Python
    pause
    exit /b 1
)

echo ✅ Dependências Python instaladas
echo. > .deps_installed

echo.
echo 🎨 Configurando frontend...
cd frontend

echo 📦 Instalando dependências Node.js...
npm install

if errorlevel 1 (
    echo ❌ Erro ao instalar dependências Node.js
    pause
    exit /b 1
)

echo ✅ Dependências Node.js instaladas
cd ..

echo.
echo ⚙️  Configurando arquivos de ambiente...

if not exist ".env" (
    copy .env.example .env
    echo ✅ Arquivo .env criado
) else (
    echo ⚠️  Arquivo .env já existe
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo ✅ Arquivo .env do frontend criado
) else (
    echo ⚠️  Arquivo .env do frontend já existe
)

echo.
echo 🧪 Verificando instalação...

echo 📝 Testando dependências Python...
python -c "import flask, requests, redis, marshmallow; print('✅ Dependências Python OK')" 2>nul
if errorlevel 1 (
    echo ⚠️  Algumas dependências Python podem estar com problemas
)

echo 📝 Testando dependências Node.js...
cd frontend
node -e "console.log('✅ Node.js OK')" 2>nul
cd ..

echo.
echo 🎉 Instalação concluída!
echo ========================
echo.
echo 📋 Próximos passos:
echo    1. Configure suas credenciais GLPI no arquivo .env
echo    2. Execute: scripts\start.bat
echo    3. Acesse: http://localhost:5173
echo.
echo 📁 Arquivos importantes:
echo    - .env: Configurações do backend
echo    - frontend\.env: Configurações do frontend
echo    - README.md: Documentação completa
echo.
echo 🆘 Precisa de ajuda?
echo    - Verifique o README.md
echo    - Confira os logs de erro
echo    - Certifique-se de que o GLPI está acessível
echo.
echo Pressione qualquer tecla para sair...
pause >nul