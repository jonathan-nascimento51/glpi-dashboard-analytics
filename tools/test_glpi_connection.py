#!/usr/bin/env python3
"""
GLPI Dashboard Analytics - Connection Test Tool
Este script testa a conectividade com a API do GLPI
"""

import os
import sys
import requests
import json
from datetime import datetime

# Adicionar o diretório pai ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.glpi_service import GLPIService
from backend.config.settings import GLPI_CONFIG

def print_header(title):
    """Imprime um cabeçalho formatado"""
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)

def print_status(message, status):
    """Imprime uma mensagem com status colorido"""
    if status:
        print(f"✅ {message}")
    else:
        print(f"❌ {message}")

def test_basic_connection():
    """Testa conexão básica com a API do GLPI"""
    print_header("TESTE DE CONEXÃO BÁSICA")
    
    try:
        url = GLPI_CONFIG['api_url']
        print(f"🔗 URL da API: {url}")
        
        # Teste de conectividade básica
        response = requests.get(url, timeout=10)
        print_status(f"Conectividade HTTP: {response.status_code}", response.status_code == 200)
        
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print_status(f"Erro de conexão: {e}", False)
        return False

def test_authentication():
    """Testa autenticação com a API do GLPI"""
    print_header("TESTE DE AUTENTICAÇÃO")
    
    try:
        service = GLPIService()
        
        # Testar autenticação
        success = service.authenticate()
        print_status("Autenticação", success)
        
        if success:
            print(f"🔑 Session Token: {service.session_token[:20]}...")
            
            # Testar uma requisição simples
            try:
                response = service._make_request('GET', 'getMyProfiles')
                print_status("Requisição de teste (getMyProfiles)", True)
                print(f"📊 Perfis encontrados: {len(response)}")
            except Exception as e:
                print_status(f"Erro na requisição de teste: {e}", False)
        
        return success
    except Exception as e:
        print_status(f"Erro na autenticação: {e}", False)
        return False

def test_data_retrieval():
    """Testa recuperação de dados básicos"""
    print_header("TESTE DE RECUPERAÇÃO DE DADOS")
    
    try:
        service = GLPIService()
        
        if not service.authenticate():
            print_status("Falha na autenticação", False)
            return False
        
        # Testar contagem de tickets
        try:
            total_tickets = service.count_tickets()
            print_status(f"Contagem de tickets: {total_tickets}", total_tickets >= 0)
        except Exception as e:
            print_status(f"Erro ao contar tickets: {e}", False)
        
        # Testar busca de usuários
        try:
            users = service._make_request('GET', 'User', params={'range': '0-4'})
            print_status(f"Busca de usuários: {len(users)} encontrados", len(users) > 0)
        except Exception as e:
            print_status(f"Erro ao buscar usuários: {e}", False)
        
        # Testar busca de grupos
        try:
            groups = service._make_request('GET', 'Group', params={'range': '0-4'})
            print_status(f"Busca de grupos: {len(groups)} encontrados", len(groups) >= 0)
        except Exception as e:
            print_status(f"Erro ao buscar grupos: {e}", False)
        
        return True
    except Exception as e:
        print_status(f"Erro geral: {e}", False)
        return False

def test_dashboard_functions():
    """Testa funções específicas do dashboard"""
    print_header("TESTE DE FUNÇÕES DO DASHBOARD")
    
    try:
        service = GLPIService()
        
        if not service.authenticate():
            print_status("Falha na autenticação", False)
            return False
        
        # Testar métricas do dashboard
        try:
            metrics = service.get_dashboard_metrics()
            print_status("Métricas do dashboard", metrics is not None)
            if metrics:
                print(f"📊 Total de tickets: {metrics.get('total_tickets', 'N/A')}")
                print(f"📊 Novos tickets: {metrics.get('new_tickets', 'N/A')}")
        except Exception as e:
            print_status(f"Erro nas métricas: {e}", False)
        
        # Testar ranking de técnicos
        try:
            ranking = service.get_technician_ranking()
            print_status(f"Ranking de técnicos: {len(ranking)} técnicos", len(ranking) >= 0)
        except Exception as e:
            print_status(f"Erro no ranking: {e}", False)
        
        # Testar novos tickets
        try:
            new_tickets = service.get_new_tickets()
            print_status(f"Novos tickets: {len(new_tickets)} encontrados", len(new_tickets) >= 0)
        except Exception as e:
            print_status(f"Erro nos novos tickets: {e}", False)
        
        return True
    except Exception as e:
        print_status(f"Erro geral: {e}", False)
        return False

def print_configuration():
    """Imprime a configuração atual"""
    print_header("CONFIGURAÇÃO ATUAL")
    
    print(f"🔗 URL da API: {GLPI_CONFIG['api_url']}")
    print(f"🔑 App Token: {'*' * 20 if GLPI_CONFIG['app_token'] else 'NÃO CONFIGURADO'}")
    print(f"👤 User Token: {'*' * 20 if GLPI_CONFIG['user_token'] else 'NÃO CONFIGURADO'}")
    print(f"⏱️  Timeout: {GLPI_CONFIG['timeout']}s")
    print(f"🔄 Max Retries: {GLPI_CONFIG['max_retries']}")

def main():
    """Função principal"""
    print("🧪 GLPI Dashboard Analytics - Teste de Conexão")
    print(f"⏰ Executado em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Verificar configuração
    print_configuration()
    
    if not GLPI_CONFIG['app_token'] or not GLPI_CONFIG['user_token']:
        print("\n❌ ERRO: Tokens não configurados!")
        print("Configure os tokens no arquivo .env:")
        print("- GLPI_APP_TOKEN=seu_app_token")
        print("- GLPI_USER_TOKEN=seu_user_token")
        return False
    
    # Executar testes
    tests = [
        ("Conexão Básica", test_basic_connection),
        ("Autenticação", test_authentication),
        ("Recuperação de Dados", test_data_retrieval),
        ("Funções do Dashboard", test_dashboard_functions)
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_status(f"Erro no teste {test_name}: {e}", False)
            results.append((test_name, False))
    
    # Resumo dos resultados
    print_header("RESUMO DOS TESTES")
    
    passed = 0
    for test_name, result in results:
        print_status(test_name, result)
        if result:
            passed += 1
    
    print(f"\n📊 Resultado: {passed}/{len(results)} testes passaram")
    
    if passed == len(results):
        print("\n🎉 Todos os testes passaram! O GLPI Dashboard está pronto para uso.")
        return True
    else:
        print("\n⚠️  Alguns testes falharam. Verifique a configuração e conectividade.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)