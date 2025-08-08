# GLPI Dashboard Analytics - Guia de Deployment

Este documento fornece instruções detalhadas para fazer o deployment do GLPI Dashboard Analytics em diferentes ambientes.

## 📋 Pré-requisitos

### Ambiente de Desenvolvimento
- Python 3.8+
- Node.js 16+
- npm ou yarn
- Redis (opcional, mas recomendado)

### Ambiente de Produção
- Docker 20.10+
- Docker Compose 2.0+
- Servidor GLPI acessível
- Certificados SSL (para HTTPS)

## 🚀 Deployment em Desenvolvimento

### 1. Clonagem e Configuração

```bash
# Clonar o repositório
git clone https://github.com/jonathan-nascimento51/glpi-dashboard-analytics.git
cd glpi-dashboard-analytics

# Executar script de instalação
# Linux/Mac
./scripts/install.sh

# Windows
scripts\install.bat
```

### 2. Configuração do Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env
cp frontend/.env.example frontend/.env

# Editar configurações
nano .env
```

**Configurações obrigatórias no .env:**
```env
GLPI_API_URL=http://seu-servidor-glpi.com/apirest.php
GLPI_APP_TOKEN=seu_app_token
GLPI_USER_TOKEN=seu_user_token
```

### 3. Inicialização

```bash
# Linux/Mac
./scripts/start.sh

# Windows
scripts\start.bat
```

### 4. Verificação

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Documentação da API: http://localhost:5000/api/docs

## 🐳 Deployment com Docker (Produção)

### 1. Preparação do Ambiente

```bash
# Clonar o repositório
git clone https://github.com/jonathan-nascimento51/glpi-dashboard-analytics.git
cd glpi-dashboard-analytics

# Configurar ambiente de produção
cp .env.production .env
nano .env
```

### 2. Configuração de Produção

**Editar .env com suas configurações:**
```env
# GLPI
GLPI_API_URL=https://seu-glpi-producao.com/apirest.php
GLPI_APP_TOKEN=token_producao
GLPI_USER_TOKEN=user_token_producao

# Segurança
SECRET_KEY=chave_muito_segura_aqui
REDIS_PASSWORD=senha_redis_segura

# Domínio
CORS_ORIGINS=https://seu-dominio.com
```

### 3. Build e Deploy

```bash
# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Iniciar serviços
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps
```

### 4. Configuração SSL (HTTPS)

```bash
# Criar diretório para certificados
mkdir -p nginx/ssl

# Copiar certificados
cp seu-certificado.crt nginx/ssl/cert.pem
cp sua-chave-privada.key nginx/ssl/key.pem

# Ajustar permissões
chmod 600 nginx/ssl/*
```

## 🔧 Configurações Avançadas

### Nginx Reverse Proxy

Para usar um Nginx externo como proxy reverso:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Monitoramento

```bash
# Logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Status dos serviços
docker-compose -f docker-compose.prod.yml ps

# Métricas de recursos
docker stats
```

### Backup

```bash
# Script de backup
#!/bin/bash
BACKUP_DIR="/backup/glpi-dashboard/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup Redis
docker exec glpi-dashboard-redis redis-cli BGSAVE
docker cp glpi-dashboard-redis:/data/dump.rdb $BACKUP_DIR/

# Backup logs
docker cp glpi-dashboard-backend:/app/logs $BACKUP_DIR/

# Backup configurações
cp .env $BACKUP_DIR/
cp docker-compose.prod.yml $BACKUP_DIR/
```

## 🔍 Troubleshooting

### Problemas Comuns

**1. Erro de conexão com GLPI**
```bash
# Testar conectividade
python tools/test_glpi_connection.py

# Verificar logs
docker-compose logs backend
```

**2. Redis não conecta**
```bash
# Verificar status do Redis
docker-compose exec redis redis-cli ping

# Verificar configuração
echo $REDIS_URL
```

**3. Frontend não carrega**
```bash
# Verificar build
docker-compose logs frontend

# Verificar nginx
docker-compose logs nginx
```

### Logs e Debugging

```bash
# Logs detalhados
export LOG_LEVEL=DEBUG
docker-compose -f docker-compose.prod.yml up -d

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

## 📊 Monitoramento de Performance

### Métricas Importantes

- **Response Time**: < 2s para dashboard
- **Memory Usage**: Backend < 512MB, Frontend < 128MB
- **CPU Usage**: < 50% em operação normal
- **Cache Hit Rate**: > 80%

### Alertas Recomendados

```bash
# Script de monitoramento
#!/bin/bash
API_URL="http://localhost:5000/api/dashboard/system-status"
RESPONSE=$(curl -s $API_URL)

if [[ $? -ne 0 ]]; then
    echo "ALERT: API não está respondendo"
    # Enviar notificação
fi
```

## 🔄 Atualizações

### Processo de Atualização

```bash
# 1. Backup
./scripts/backup.sh

# 2. Parar serviços
docker-compose -f docker-compose.prod.yml down

# 3. Atualizar código
git pull origin main

# 4. Rebuild
docker-compose -f docker-compose.prod.yml build --no-cache

# 5. Iniciar
docker-compose -f docker-compose.prod.yml up -d

# 6. Verificar
docker-compose -f docker-compose.prod.yml ps
```

## 🛡️ Segurança

### Checklist de Segurança

- [ ] Tokens GLPI seguros e únicos
- [ ] SECRET_KEY forte e único
- [ ] Redis com senha
- [ ] HTTPS configurado
- [ ] Firewall configurado
- [ ] Logs de acesso habilitados
- [ ] Backup automatizado
- [ ] Monitoramento ativo

### Hardening

```bash
# Limitar recursos
docker update --memory=512m --cpus=1 glpi-dashboard-backend
docker update --memory=128m --cpus=0.5 glpi-dashboard-frontend

# Configurar firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 5000/tcp  # Bloquear acesso direto ao backend
```

## 📞 Suporte

Para suporte e dúvidas:

1. Verifique os logs primeiro
2. Consulte a documentação
3. Teste a conectividade com GLPI
4. Verifique as configurações
5. Abra uma issue no GitHub se necessário

---

**Nota**: Este guia assume conhecimento básico de Docker, Linux e administração de sistemas. Para ambientes críticos, recomenda-se teste em ambiente de homologação primeiro.