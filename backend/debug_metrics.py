#!/usr/bin/env python3
"""
Script de debug para métricas do GLPI Dashboard
Utilizado para testar e validar cálculos de métricas
"""

import sys
import os
from datetime import datetime, timedelta

# Adicionar o diretório pai ao path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.glpi_service import GLPIService
from backend.config.settings import GLPI_CONFIG

def debug_dashboard_metrics():
    """Debug das métricas do dashboard"""
    print("🔍 Debug - Métricas do Dashboard")
    print("=" * 50)
    
    try:
        service = GLPIService()
        
        # Testar autenticação
        if service.authenticate():
            print("✅ Autenticação bem-sucedida")
        else:
            print("❌ Falha na autenticação")
            return
        
        # Obter métricas
        metrics = service.get_dashboard_metrics()
        
        print("\n📊 Métricas obtidas:")
        for key, value in metrics.items():
            print(f"  {key}: {value}")
        
        # Testar filtros por data
        print("\n📅 Testando filtros por data...")
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        filtered_metrics = service.get_dashboard_metrics_with_filters({
            'start_date': start_date.strftime('%Y-%m-%d'),
            'end_date': end_date.strftime('%Y-%m-%d')
        })
        
        print("📊 Métricas filtradas:")
        for key, value in filtered_metrics.items():
            print(f"  {key}: {value}")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()

def debug_technician_ranking():
    """Debug do ranking de técnicos"""
    print("\n🏆 Debug - Ranking de Técnicos")
    print("=" * 50)
    
    try:
        service = GLPIService()
        
        if not service.authenticate():
            print("❌ Falha na autenticação")
            return
        
        # Obter ranking
        ranking = service.get_technician_ranking()
        
        print(f"\n👥 {len(ranking)} técnicos encontrados:")
        for i, tech in enumerate(ranking[:5], 1):
            print(f"  {i}. {tech.get('name', 'N/A')} - {tech.get('total_tickets', 0)} tickets")
        
        # Testar filtros
        print("\n🔍 Testando filtros...")
        filtered_ranking = service.get_technician_ranking_with_filters({
            'level': 'Senior'
        })
        
        print(f"👥 Técnicos Senior: {len(filtered_ranking)}")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()

def debug_new_tickets():
    """Debug dos novos tickets"""
    print("\n🎫 Debug - Novos Tickets")
    print("=" * 50)
    
    try:
        service = GLPIService()
        
        if not service.authenticate():
            print("❌ Falha na autenticação")
            return
        
        # Obter novos tickets
        tickets = service.get_new_tickets()
        
        print(f"\n📋 {len(tickets)} novos tickets encontrados:")
        for ticket in tickets[:3]:
            print(f"  #{ticket.get('id', 'N/A')}: {ticket.get('title', 'N/A')[:50]}...")
        
        # Testar filtros
        print("\n🔍 Testando filtros...")
        filtered_tickets = service.get_new_tickets_with_filters({
            'priority': 'Alta'
        })
        
        print(f"📋 Tickets de alta prioridade: {len(filtered_tickets)}")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        import traceback
        traceback.print_exc()

def main():
    """Função principal"""
    print("🧪 GLPI Dashboard - Debug de Métricas")
    print(f"⏰ Executado em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 GLPI URL: {GLPI_CONFIG['api_url']}")
    
    debug_dashboard_metrics()
    debug_technician_ranking()
    debug_new_tickets()
    
    print("\n✅ Debug concluído!")

if __name__ == "__main__":
    main()
