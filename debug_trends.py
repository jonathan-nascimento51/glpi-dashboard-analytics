#!/usr/bin/env python3
"""
Script para debug e teste dos dados de tendência
"""

import sys
import os
from datetime import datetime, timedelta
import json

# Adicionar o diretório do backend ao path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from services.glpi_service import GLPIService

def test_trend_data():
    """Testa a geração de dados de tendência"""
    print("🔍 Testando dados de tendência...")
    
    try:
        service = GLPIService()
        
        # Testar autenticação
        if service.authenticate():
            print("✅ Autenticação bem-sucedida")
        else:
            print("⚠️ Usando dados simulados (sem conexão GLPI)")
        
        # Obter métricas com dados de tendência
        metrics = service.get_dashboard_metrics()
        
        if 'trend_data' in metrics:
            trend_data = metrics['trend_data']
            print(f"\n📊 Dados de tendência ({len(trend_data)} pontos):")
            
            for point in trend_data:
                print(f"  {point['date']}: {point['tickets']} tickets, {point['resolved']} resolvidos")
            
            # Verificar consistência dos dados
            print("\n🔍 Verificando consistência:")
            for point in trend_data:
                if point['resolved'] > point['tickets']:
                    print(f"  ⚠️ Inconsistência em {point['date']}: resolvidos > total")
                else:
                    print(f"  ✅ {point['date']}: OK")
        else:
            print("❌ Dados de tendência não encontrados")
        
        # Salvar dados para análise
        with open('trend_debug.json', 'w') as f:
            json.dump(metrics, f, indent=2, default=str)
        print("\n💾 Dados salvos em trend_debug.json")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()

def generate_sample_trend():
    """Gera dados de tendência de exemplo"""
    print("\n🎲 Gerando dados de tendência de exemplo...")
    
    trend_data = []
    base_date = datetime.now() - timedelta(days=6)
    
    for i in range(7):
        date = (base_date + timedelta(days=i)).strftime('%Y-%m-%d')
        tickets = 10 + (i * 2)  # Crescimento linear
        resolved = max(1, tickets - 3)  # Sempre menor que total
        
        trend_data.append({
            'date': date,
            'tickets': tickets,
            'resolved': resolved
        })
    
    print("📊 Dados de exemplo gerados:")
    for point in trend_data:
        print(f"  {point['date']}: {point['tickets']} tickets, {point['resolved']} resolvidos")
    
    return trend_data

if __name__ == "__main__":
    print("🧪 Debug de Dados de Tendência")
    print("=" * 40)
    
    test_trend_data()
    generate_sample_trend()
    
    print("\n✅ Debug concluído!")
