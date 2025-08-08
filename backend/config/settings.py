import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

class Config:
    """Configuração base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Configurações GLPI
    GLPI_URL = os.environ.get('GLPI_URL')
    GLPI_APP_TOKEN = os.environ.get('GLPI_APP_TOKEN')
    GLPI_USER_TOKEN = os.environ.get('GLPI_USER_TOKEN')
    
    # Configurações Flask
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    HOST = os.environ.get('FLASK_HOST', '0.0.0.0')
    PORT = int(os.environ.get('FLASK_PORT', 5000))
    
    # Configurações de Cache
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = int(os.environ.get('CACHE_TTL', 300))
    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CACHE_REDIS_URL = REDIS_URL
    CACHE_KEY_PREFIX = 'glpi_dashboard:'
    
    # Configurações de Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Configurações de Performance
    MAX_RETRIES = int(os.environ.get('MAX_RETRIES', 3))
    REQUEST_TIMEOUT = int(os.environ.get('REQUEST_TIMEOUT', 30))

class DevelopmentConfig(Config):
    """Configuração de desenvolvimento"""
    DEBUG = True
    ENV = 'development'

class ProductionConfig(Config):
    """Configuração de produção"""
    DEBUG = False
    ENV = 'production'

class TestingConfig(Config):
    """Configuração de testes"""
    TESTING = True
    DEBUG = True
    ENV = 'testing'

# Configuração ativa baseada na variável de ambiente
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}

active_config = config_map.get(os.environ.get('FLASK_ENV', 'development'), DevelopmentConfig)
