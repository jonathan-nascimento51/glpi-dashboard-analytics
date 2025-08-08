#!/usr/bin/env python3
"""
Teste específico para dados de tendência do dashboard
"""

import sys
import os
from datetime import datetime, timedelta
import json

# Adicionar o diretório do backend ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from services.glpi_service import GLPIService

def test_dashboard_trends():
    """Testa especificamente os dados de tendência"""
    print("📈 Testando Dados de Tendência do Dashboard")
    print("=" * 50)
    
    try:
        service = GLPIService()
        
        # Testar com diferentes períodos
        periods = [
            {'days': 7, 'name': '7 dias'},
            {'days': 14, 'name': '14 dias'},
            {'days': 30, 'name': '30 dias'}
        ]
        
        for period in periods:
            print(f"\n🔍 Testando período: {period['name']}")
            
            end_date = datetime.now()
            start_date = end_date - timedelta(days=period['days'])
            
            filters = {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            }
            
            try:
                metrics = service.get_dashboard_metrics_with_filters(filters)
                
                if 'trend_data' in metrics:
                    trend_data = metrics['trend_data']
                    print(f"  📊 {len(trend_data)} pontos de dados")
                    
                    # Mostrar primeiros e últimos pontos
                    if trend_data:
                        first = trend_data[0]
                        last = trend_data[-1]
                        print(f"  📅 Primeiro: {first['date']} - {first['tickets']} tickets")
                        print(f"  📅 Último: {last['date']} - {last['tickets']} tickets")
                        
                        # Calcular tendência
                        if len(trend_data) > 1:
                            growth = last['tickets'] - first['tickets']
                            print(f"  📈 Crescimento: {growth:+d} tickets")
                else:
                    print("  ❌ Dados de tendência não encontrados")
                    
            except Exception as e:
                print(f"  ❌ Erro no período {period['name']}: {e}")
    
    except Exception as e:
        print(f"❌ Erro geral: {e}")
        import traceback
        traceback.print_exc()

def validate_trend_data_structure(trend_data):
    """Valida a estrutura dos dados de tendência"""
    print("\n🔍 Validando estrutura dos dados...")
    
    required_fields = ['date', 'tickets', 'resolved']
    
    for i, point in enumerate(trend_data):
        print(f"  Ponto {i+1}:")
        
        for field in required_fields:
            if field in point:
                print(f"    ✅ {field}: {point[field]}")
            else:
                print(f"    ❌ {field}: AUSENTE")
        
        # Validar tipos
        if 'date' in point:
            try:
                datetime.strptime(point['date'], '%Y-%m-%d')
                print(f"    ✅ Data válida")
            except:
                print(f"    ❌ Formato de data inválido")
        
        if 'tickets' in point and 'resolved' in point:
            if point['resolved'] <= point['tickets']:
                print(f"    ✅ Consistência numérica OK")
            else:
                print(f"    ❌ Resolvidos > Total")

if __name__ == "__main__":
    print("🧪 Teste de Dados de Tendência")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    test_dashboard_trends()
    
    print("\n✅ Teste concluído!")
