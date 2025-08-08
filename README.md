# GLPI Dashboard Analytics

🚀 **Sistema avançado de análise e métricas para GLPI** - Dashboard interativo com visualizações em tempo real, análise de tendências e relatórios detalhados.

## ✨ Características Principais

### 📊 Dashboard Interativo
- **Métricas em tempo real** com dados atualizados automaticamente
- **Gráficos de tendência** para análise temporal
- **Indicadores de performance** com comparações percentuais
- **Filtros avançados** por data, status, prioridade e técnico

### 👥 Análise de Técnicos
- **Ranking de performance** com métricas detalhadas
- **Análise por grupos técnicos** com visualizações comparativas
- **Estatísticas individuais** de resolução e produtividade
- **Filtros por nível** (Junior, Pleno, Senior)

### 🎫 Gestão de Tickets
- **Lista interativa** com busca e filtros avançados
- **Visualização por status** e prioridade
- **Detalhes completos** de cada ticket
- **Exportação de dados** para análise externa

### ⚙️ Configurações Avançadas
- **Status do sistema** em tempo real
- **Configuração GLPI** com teste de conectividade
- **Gerenciamento de cache** e performance
- **Logs de auditoria** e monitoramento

## 🏗️ Arquitetura Técnica

### Backend (Python/Flask)
```
backend/
├── api/                 # Endpoints da API REST
├── config/             # Configurações do sistema
├── services/           # Lógica de negócio e integração GLPI
├── schemas/            # Validação de dados (Marshmallow)
├── utils/              # Utilitários e formatadores
└── data/               # Cache e dados temporários
```

**Tecnologias:**
- **Flask** - Framework web minimalista
- **Requests** - Cliente HTTP para GLPI API
- **Marshmallow** - Serialização e validação
- **APScheduler** - Tarefas agendadas
- **Redis** - Cache de alta performance (opcional)

### Frontend (React/TypeScript)
```
frontend/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas principais
│   ├── services/       # Integração com API
│   ├── types/          # Definições TypeScript
│   └── utils/          # Utilitários frontend
└── public/             # Assets estáticos
```

**Tecnologias:**
- **React 18** - Interface de usuário moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool otimizado
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Python 3.8+**
- **Node.js 16+**
- **GLPI 9.5+** com API REST habilitada
- **Git**

### 1. Clone do Repositório
```bash
git clone https://github.com/jonathan-nascimento51/glpi-dashboard-analytics.git
cd glpi-dashboard-analytics
```

### 2. Configuração Automática

**Linux/macOS:**
```bash
chmod +x install.sh start.sh
./install.sh
./start.sh
```

**Windows:**
```cmd
install.bat
start.bat
```

### 3. Configuração Manual

#### Backend
```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações GLPI

# Iniciar servidor
python app.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Configuração GLPI

#### Habilitar API REST
1. Acesse **Configurar → Geral → API**
2. Ative **Habilitar API REST**
3. Configure **URL da API REST**

#### Criar Tokens
1. **App Token**: Configurar → Geral → API → Adicionar Token de Aplicação
2. **User Token**: Preferências do usuário → Tokens de API

#### Arquivo .env
```env
# Configuração GLPI
GLPI_API_URL=http://seu-glpi.com/apirest.php
GLPI_APP_TOKEN=seu_app_token_aqui
GLPI_USER_TOKEN=seu_user_token_aqui

# Configuração Flask
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=sua_chave_secreta_aqui

# Cache e Performance
CACHE_TYPE=simple
CACHE_DEFAULT_TIMEOUT=300
ENABLE_CACHE=true

# Logs
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
```

## 🐳 Deploy com Docker

### Desenvolvimento
```bash
docker-compose up -d
```

### Produção
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Configuração Nginx (Produção)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Ferramentas de Desenvolvimento

### Teste de Conectividade
```bash
python tools/test_glpi_connection.py
```

### Geração de Dados de Exemplo
```bash
python tools/generate_sample_data.py
```

### Debug de Métricas
```bash
python backend/debug_metrics.py
```

### Teste de Tendências
```bash
python debug_trends.py
```

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard/metrics` - Métricas principais
- `GET /api/dashboard/metrics/advanced` - Métricas avançadas
- `GET /api/dashboard/trends` - Dados de tendência

### Técnicos
- `GET /api/technicians/ranking` - Ranking de técnicos
- `GET /api/technicians/groups` - Análise por grupos
- `GET /api/technicians/{id}/stats` - Estatísticas individuais

### Tickets
- `GET /api/tickets/new` - Novos tickets
- `GET /api/tickets/search` - Busca avançada
- `GET /api/tickets/{id}` - Detalhes do ticket

### Sistema
- `GET /api/system/status` - Status do sistema
- `GET /api/system/health` - Health check
- `POST /api/system/cache/clear` - Limpar cache

## 🔒 Segurança

### Autenticação
- **Tokens GLPI** para acesso à API
- **Validação de sessão** automática
- **Renovação de tokens** transparente

### Proteções
- **Rate limiting** para prevenir abuso
- **Validação de entrada** em todos os endpoints
- **Sanitização de dados** para prevenir XSS
- **Headers de segurança** configurados

### Logs de Auditoria
- **Acesso à API** registrado
- **Operações críticas** logadas
- **Erros e exceções** monitorados

## ⚡ Performance

### Cache Inteligente
- **Cache em memória** para dados frequentes
- **TTL configurável** por tipo de dado
- **Invalidação automática** quando necessário

### Otimizações
- **Lazy loading** de componentes
- **Paginação** de resultados grandes
- **Compressão** de respostas API
- **CDN ready** para assets estáticos

### Monitoramento
- **Métricas de performance** em tempo real
- **Alertas** para problemas de conectividade
- **Dashboard de saúde** do sistema

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o repositório
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código
- **Python**: PEP 8
- **TypeScript**: ESLint + Prettier
- **Commits**: Conventional Commits
- **Documentação**: Docstrings e comentários

### Testes
```bash
# Backend
pytest tests/

# Frontend
npm test
```

## 📝 Changelog

Veja [CHANGELOG.md](CHANGELOG.md) para detalhes das versões.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Problemas Comuns

**Erro de Conectividade GLPI:**
- Verifique se a API REST está habilitada
- Confirme os tokens no arquivo .env
- Teste a conectividade com `test_glpi_connection.py`

**Problemas de Performance:**
- Habilite o cache Redis
- Ajuste os timeouts no .env
- Monitore os logs de performance

**Erros de Build:**
- Limpe o cache: `npm run build:clean`
- Reinstale dependências: `rm -rf node_modules && npm install`
- Verifique a versão do Node.js

### Contato
- **Issues**: [GitHub Issues](https://github.com/jonathan-nascimento51/glpi-dashboard-analytics/issues)
- **Discussões**: [GitHub Discussions](https://github.com/jonathan-nascimento51/glpi-dashboard-analytics/discussions)
- **Email**: jonathan.nascimento51@example.com

---

**Desenvolvido com ❤️ para a comunidade GLPI**

*Sistema de Dashboard Analytics para GLPI - Transformando dados em insights acionáveis*