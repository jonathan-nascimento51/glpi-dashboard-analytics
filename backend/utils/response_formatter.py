# -*- coding: utf-8 -*-
from typing import Dict, List, Any, Optional
import time
import logging

logger = logging.getLogger('response_formatter')

class ResponseFormatter:
    """Classe para formatação unificada de respostas da API"""
    
    @staticmethod
    def format_dashboard_response(data: Dict[str, Any], filters: Optional[Dict] = None, start_time: Optional[float] = None) -> Dict[str, Any]:
        """Formata resposta das métricas do dashboard"""
        try:
            # Extrair dados por nível e gerais
            level_metrics = data.get('by_level', {})
            general_metrics = data.get('general', {})
            
            # Calcular totais gerais
            total_tickets = sum(general_metrics.values())
            
            # Calcular breakdown por nível
            level_totals = {}
            for level_name, level_data in level_metrics.items():
                level_totals[level_name] = sum(level_data.values())
            
            # Calcular tendências básicas (placeholder)
            trends = {
                "new_tickets": "+5.2%",
                "pending_tickets": "-2.1%",
                "in_progress_tickets": "+8.7%",
                "resolved_tickets": "+12.3%"
            }
            
            # Estrutura da resposta
            response = {
                "success": True,
                "data": {
                    "summary": {
                        "total_tickets": total_tickets,
                        "new_tickets": general_metrics.get('Novo', 0),
                        "pending_tickets": general_metrics.get('Pendente', 0),
                        "in_progress_tickets": (
                            general_metrics.get('Processando (atribuído)', 0) + 
                            general_metrics.get('Processando (planejado)', 0)
                        ),
                        "resolved_tickets": general_metrics.get('Solucionado', 0),
                        "closed_tickets": general_metrics.get('Fechado', 0)
                    },
                    "by_status": general_metrics,
                    "by_level": level_metrics,
                    "level_totals": level_totals,
                    "trends": trends
                },
                "metadata": {
                    "timestamp": time.time(),
                    "filters_applied": filters or {},
                    "response_time": time.time() - start_time if start_time else None
                }
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Erro ao formatar resposta do dashboard: {e}")
            return ResponseFormatter.format_error_response(f"Erro na formatação: {str(e)}", [str(e)])
    
    @staticmethod
    def format_technician_response(technicians: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Formata resposta do ranking de técnicos"""
        try:
            # Calcular estatísticas
            total_technicians = len(technicians)
            total_tickets = sum(tech.get('ticket_count', 0) for tech in technicians)
            avg_tickets = total_tickets / total_technicians if total_technicians > 0 else 0
            
            # Agrupar por nível
            by_level = {}
            for tech in technicians:
                level = tech.get('level', 'Geral')
                if level not in by_level:
                    by_level[level] = []
                by_level[level].append(tech)
            
            response = {
                "success": True,
                "data": {
                    "ranking": technicians,
                    "statistics": {
                        "total_technicians": total_technicians,
                        "total_tickets": total_tickets,
                        "average_tickets_per_technician": round(avg_tickets, 2)
                    },
                    "by_level": by_level
                },
                "metadata": {
                    "timestamp": time.time(),
                    "total_count": total_technicians
                }
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Erro ao formatar resposta de técnicos: {e}")
            return ResponseFormatter.format_error_response(f"Erro na formatação: {str(e)}", [str(e)])
    
    @staticmethod
    def format_tickets_response(tickets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Formata resposta de tickets"""
        try:
            # Agrupar por prioridade
            by_priority = {}
            for ticket in tickets:
                priority = ticket.get('priority', 'Não informado')
                if priority not in by_priority:
                    by_priority[priority] = []
                by_priority[priority].append(ticket)
            
            # Estatísticas
            total_tickets = len(tickets)
            priorities_count = {priority: len(tickets_list) for priority, tickets_list in by_priority.items()}
            
            response = {
                "success": True,
                "data": {
                    "tickets": tickets,
                    "statistics": {
                        "total_tickets": total_tickets,
                        "by_priority": priorities_count
                    },
                    "by_priority": by_priority
                },
                "metadata": {
                    "timestamp": time.time(),
                    "total_count": total_tickets
                }
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Erro ao formatar resposta de tickets: {e}")
            return ResponseFormatter.format_error_response(f"Erro na formatação: {str(e)}", [str(e)])
    
    @staticmethod
    def format_error_response(message: str, errors: List[str], status_code: int = 500) -> Dict[str, Any]:
        """Formata resposta de erro padronizada"""
        return {
            "success": False,
            "error": {
                "message": message,
                "details": errors,
                "code": status_code
            },
            "data": None,
            "metadata": {
                "timestamp": time.time()
            }
        }
    
    @staticmethod
    def format_success_response(data: Any, message: str = "Operação realizada com sucesso") -> Dict[str, Any]:
        """Formata resposta de sucesso padronizada"""
        return {
            "success": True,
            "message": message,
            "data": data,
            "metadata": {
                "timestamp": time.time()
            }
        }
