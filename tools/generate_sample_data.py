#!/usr/bin/env python3
"""
GLPI Dashboard Analytics - Sample Data Generator
Este script gera dados de exemplo para desenvolvimento e testes
"""

import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any

def generate_sample_tickets(count: int = 100) -> List[Dict[str, Any]]:
    """Gera tickets de exemplo"""
    statuses = ['Novo', 'Processando (atribuído)', 'Processando (planejado)', 'Pendente', 'Solucionado', 'Fechado']
    priorities = ['Muito baixa', 'Baixa', 'Média', 'Alta', 'Muito alta']
    categories = ['Hardware', 'Software', 'Rede', 'Impressora', 'Email', 'Sistema', 'Acesso']
    
    technicians = [
        {'id': 1, 'name': 'João Silva', 'email': 'joao.silva@empresa.com', 'level': 'Senior'},
        {'id': 2, 'name': 'Maria Santos', 'email': 'maria.santos@empresa.com', 'level': 'Pleno'},
        {'id': 3, 'name': 'Pedro Costa', 'email': 'pedro.costa@empresa.com', 'level': 'Junior'},
        {'id': 4, 'name': 'Ana Oliveira', 'email': 'ana.oliveira@empresa.com', 'level': 'Senior'},
        {'id': 5, 'name': 'Carlos Ferreira', 'email': 'carlos.ferreira@empresa.com', 'level': 'Pleno'},
    ]
    
    requesters = [
        'Alice Pereira', 'Bruno Almeida', 'Carla Rodrigues', 'Daniel Souza', 'Elena Martins',
        'Fernando Lima', 'Gabriela Nunes', 'Henrique Barbosa', 'Isabela Rocha', 'José Cardoso'
    ]
    
    tickets = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(1, count + 1):
        # Data de criação aleatória nos últimos 30 dias
        created_date = base_date + timedelta(
            days=random.randint(0, 30),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59)
        )
        
        # Data de atualização após a criação
        updated_date = created_date + timedelta(
            hours=random.randint(0, 48),
            minutes=random.randint(0, 59)
        )
        
        status = random.choice(statuses)
        priority = random.choice(priorities)
        category = random.choice(categories)
        technician = random.choice(technicians) if status != 'Novo' else None
        
        ticket = {
            'id': i,
            'title': f'Ticket #{i:04d} - {category}',
            'content': f'Descrição do problema relacionado a {category.lower()}. '
                      f'Usuário reportou dificuldades com o sistema.',
            'status': status,
            'priority': priority,
            'category': category,
            'requester': random.choice(requesters),
            'technician': technician['name'] if technician else None,
            'technician_id': technician['id'] if technician else None,
            'created_date': created_date.isoformat(),
            'updated_date': updated_date.isoformat(),
            'resolution_time': random.randint(1, 48) if status in ['Solucionado', 'Fechado'] else None
        }
        
        tickets.append(ticket)
    
    return tickets

def generate_sample_technicians() -> List[Dict[str, Any]]:
    """Gera dados de técnicos de exemplo"""
    technicians = [
        {
            'id': 1,
            'name': 'João Silva',
            'email': 'joao.silva@empresa.com',
            'level': 'Senior',
            'total_tickets': random.randint(80, 120),
            'resolved_tickets': random.randint(70, 100),
            'pending_tickets': random.randint(5, 15),
            'average_resolution_time': round(random.uniform(2.5, 8.0), 1),
            'resolution_rate': round(random.uniform(85, 95), 1),
            'rank': 1
        },
        {
            'id': 2,
            'name': 'Maria Santos',
            'email': 'maria.santos@empresa.com',
            'level': 'Pleno',
            'total_tickets': random.randint(60, 90),
            'resolved_tickets': random.randint(50, 75),
            'pending_tickets': random.randint(8, 18),
            'average_resolution_time': round(random.uniform(3.0, 10.0), 1),
            'resolution_rate': round(random.uniform(80, 90), 1),
            'rank': 2
        },
        {
            'id': 3,
            'name': 'Pedro Costa',
            'email': 'pedro.costa@empresa.com',
            'level': 'Junior',
            'total_tickets': random.randint(40, 70),
            'resolved_tickets': random.randint(30, 55),
            'pending_tickets': random.randint(10, 20),
            'average_resolution_time': round(random.uniform(4.0, 12.0), 1),
            'resolution_rate': round(random.uniform(75, 85), 1),
            'rank': 3
        },
        {
            'id': 4,
            'name': 'Ana Oliveira',
            'email': 'ana.oliveira@empresa.com',
            'level': 'Senior',
            'total_tickets': random.randint(75, 110),
            'resolved_tickets': random.randint(65, 95),
            'pending_tickets': random.randint(6, 16),
            'average_resolution_time': round(random.uniform(2.8, 9.0), 1),
            'resolution_rate': round(random.uniform(83, 93), 1),
            'rank': 4
        },
        {
            'id': 5,
            'name': 'Carlos Ferreira',
            'email': 'carlos.ferreira@empresa.com',
            'level': 'Pleno',
            'total_tickets': random.randint(55, 85),
            'resolved_tickets': random.randint(45, 70),
            'pending_tickets': random.randint(9, 19),
            'average_resolution_time': round(random.uniform(3.5, 11.0), 1),
            'resolution_rate': round(random.uniform(78, 88), 1),
            'rank': 5
        }
    ]
    
    # Reordenar por taxa de resolução para ranking correto
    technicians.sort(key=lambda x: x['resolution_rate'], reverse=True)
    for i, tech in enumerate(technicians, 1):
        tech['rank'] = i
    
    return technicians

def generate_dashboard_metrics(tickets: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Gera métricas do dashboard baseadas nos tickets"""
    total_tickets = len(tickets)
    new_tickets = len([t for t in tickets if t['status'] == 'Novo'])
    in_progress = len([t for t in tickets if 'Processando' in t['status']])
    resolved_tickets = len([t for t in tickets if t['status'] == 'Solucionado'])
    closed_tickets = len([t for t in tickets if t['status'] == 'Fechado'])
    pending_tickets = len([t for t in tickets if t['status'] == 'Pendente'])
    
    # Calcular tempo médio de resolução
    resolved_times = [t['resolution_time'] for t in tickets if t['resolution_time']]
    avg_resolution_time = sum(resolved_times) / len(resolved_times) if resolved_times else 0
    
    # Distribuição por prioridade
    priorities = {}
    for ticket in tickets:
        priority = ticket['priority']
        priorities[priority] = priorities.get(priority, 0) + 1
    
    # Distribuição por status
    statuses = {}
    for ticket in tickets:
        status = ticket['status']
        statuses[status] = statuses.get(status, 0) + 1
    
    # Dados de tendência (últimos 7 dias)
    trend_data = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime('%Y-%m-%d')
        daily_tickets = random.randint(5, 20)
        daily_resolved = random.randint(3, daily_tickets)
        
        trend_data.append({
            'date': date,
            'tickets': daily_tickets,
            'resolved': daily_resolved
        })
    
    return {
        'total_tickets': total_tickets,
        'new_tickets': new_tickets,
        'in_progress_tickets': in_progress,
        'resolved_tickets': resolved_tickets,
        'closed_tickets': closed_tickets,
        'pending_tickets': pending_tickets,
        'average_resolution_time': round(avg_resolution_time, 1),
        'tickets_by_priority': priorities,
        'tickets_by_status': statuses,
        'trend_data': trend_data
    }

def save_sample_data():
    """Salva os dados de exemplo em arquivos JSON"""
    print("🎲 Gerando dados de exemplo...")
    
    # Gerar dados
    tickets = generate_sample_tickets(150)
    technicians = generate_sample_technicians()
    metrics = generate_dashboard_metrics(tickets)
    
    # Criar diretório de dados se não existir
    import os
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'backend', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    # Salvar arquivos
    files = {
        'sample_tickets.json': tickets,
        'sample_technicians.json': technicians,
        'sample_metrics.json': metrics
    }
    
    for filename, data in files.items():
        filepath = os.path.join(data_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ {filename} criado com {len(data) if isinstance(data, list) else 'dados'} registros")
    
    print("\n📊 Resumo dos dados gerados:")
    print(f"   - {len(tickets)} tickets")
    print(f"   - {len(technicians)} técnicos")
    print(f"   - Métricas completas do dashboard")
    print(f"   - Dados salvos em: {data_dir}")

def main():
    """Função principal"""
    print("🎲 GLPI Dashboard Analytics - Gerador de Dados de Exemplo")
    print("=" * 60)
    
    try:
        save_sample_data()
        print("\n🎉 Dados de exemplo gerados com sucesso!")
        print("\n💡 Estes dados podem ser usados para:")
        print("   - Desenvolvimento sem conexão com GLPI")
        print("   - Testes de interface")
        print("   - Demonstrações")
        print("   - Desenvolvimento offline")
        
    except Exception as e:
        print(f"\n❌ Erro ao gerar dados: {e}")
        return False
    
    return True

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)