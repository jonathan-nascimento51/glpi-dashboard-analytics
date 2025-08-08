# GLPI Dashboard Analytics

Dashboard moderno para análise de tickets GLPI com React, Flask e sistema de métricas avançado.

## Características

- **Frontend React**: Interface moderna e responsiva
- **Backend Flask**: API robusta com cache inteligente
- **Métricas Avançadas**: Análise por níveis de serviço e tendências
- **Sistema de Fallback**: Dados simulados quando API não retorna dados
- **Autenticação Automática**: Gerenciamento inteligente de tokens GLPI
- **Cache Otimizado**: Performance melhorada com cache em múltiplas camadas

## Tecnologias

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Python 3.11, Flask, Redis (opcional)
- **API**: GLPI REST API
- **Containerização**: Docker e Docker Compose

## Instalação

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- GLPI com API REST habilitada

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/jonathan-nascimento51/glpi-dashboard-analytics.git
cd glpi-dashboard-analytics
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações GLPI
```

3. Instale as dependências do backend:
```bash
pip install -r requirements.txt
```

4. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

### Execução

#### Desenvolvimento

1. Backend:
```bash
python app.py
```

2. Frontend:
```bash
cd frontend
npm run dev
```

#### Produção com Docker

```bash
docker-compose up -d
```

## Funcionalidades

### Métricas Principais
- Contagem de tickets por status
- Análise por níveis de serviço (N1, N2, N3, N4)
- Tendências temporais
- Ranking de técnicos

### Sistema de Fallback
- Dados simulados quando GLPI não retorna informações
- Garantia de funcionamento mesmo sem dados reais
- Logs detalhados para debugging

### Cache Inteligente
- Cache em múltiplas camadas
- TTL configurável por tipo de dados
- Invalidação automática

## Estrutura do Projeto

```
glpi-dashboard-analytics/
├── backend/
│   ├── services/
│   │   ├── glpi_service.py      # Serviço principal GLPI
│   │   └── ...
│   ├── api/
│   │   └── routes.py            # Rotas da API
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── pages/              # Páginas da aplicação
│   │   └── services/           # Serviços de API
│   └── ...
├── docker-compose.yml          # Configuração Docker
└── README.md
```

## Configuração GLPI

### Variáveis de Ambiente

```env
GLPI_URL=http://seu-glpi.com/apirest.php
GLPI_APP_TOKEN=seu_app_token
GLPI_USER_TOKEN=seu_user_token
```

### Permissões Necessárias
- Leitura de tickets
- Leitura de usuários
- Leitura de grupos
- Acesso à API REST

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT License - veja o arquivo LICENSE para detalhes.
