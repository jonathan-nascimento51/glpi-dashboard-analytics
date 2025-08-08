# -*- coding: utf-8 -*-
from flask import Blueprint, request, jsonify
from backend.services.glpi_service import GLPIService
from backend.utils.response_formatter import ResponseFormatter
import logging

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')
logger = logging.getLogger('dashboard_routes')

# Instância global do serviço GLPI
glpi_service = GLPIService()

@dashboard_bp.route('/metrics', methods=['GET'])
def get_dashboard_metrics():
    """Endpoint para obter métricas do dashboard"""
    try:
        logger.info("Solicitação de métricas do dashboard recebida")
        
        # Obter parâmetros de filtro de data
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date or end_date:
            logger.info(f"Aplicando filtros de data: {start_date} até {end_date}")
            metrics = glpi_service.get_dashboard_metrics_with_date_filter(start_date, end_date)
        else:
            logger.info("Obtendo métricas sem filtros de data")
            metrics = glpi_service.get_dashboard_metrics()
        
        return jsonify(metrics)
        
    except Exception as e:
        logger.error(f"Erro ao obter métricas do dashboard: {e}")
        return jsonify(ResponseFormatter.format_error_response(
            f"Erro interno: {str(e)}",
            [str(e)]
        )), 500

@dashboard_bp.route('/technicians', methods=['GET'])
def get_technician_ranking():
    """Endpoint para obter ranking de técnicos"""
    try:
        logger.info("Solicitação de ranking de técnicos recebida")
        
        # Obter parâmetros
        limit = int(request.args.get('limit', 10))
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        level = request.args.get('level')
        
        if start_date or end_date or level:
            logger.info(f"Aplicando filtros: data={start_date}-{end_date}, level={level}")
            ranking = glpi_service.get_technician_ranking_with_filters(
                limit=limit,
                start_date=start_date,
                end_date=end_date,
                level=level
            )
        else:
            logger.info("Obtendo ranking sem filtros")
            ranking = glpi_service.get_technician_ranking(limit=limit)
        
        return jsonify(ResponseFormatter.format_technician_response(ranking))
        
    except Exception as e:
        logger.error(f"Erro ao obter ranking de técnicos: {e}")
        return jsonify(ResponseFormatter.format_error_response(
            f"Erro interno: {str(e)}",
            [str(e)]
        )), 500

@dashboard_bp.route('/tickets/new', methods=['GET'])
def get_new_tickets():
    """Endpoint para obter tickets novos"""
    try:
        logger.info("Solicitação de tickets novos recebida")
        
        # Obter parâmetros
        limit = int(request.args.get('limit', 10))
        priority = request.args.get('priority')
        technician = request.args.get('technician')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if priority or technician or start_date or end_date:
            logger.info(f"Aplicando filtros: priority={priority}, technician={technician}, data={start_date}-{end_date}")
            tickets = glpi_service.get_new_tickets_with_filters(
                limit=limit,
                priority=priority,
                technician=technician,
                start_date=start_date,
                end_date=end_date
            )
        else:
            logger.info("Obtendo tickets novos sem filtros")
            tickets = glpi_service.get_new_tickets(limit=limit)
        
        return jsonify(ResponseFormatter.format_tickets_response(tickets))
        
    except Exception as e:
        logger.error(f"Erro ao obter tickets novos: {e}")
        return jsonify(ResponseFormatter.format_error_response(
            f"Erro interno: {str(e)}",
            [str(e)]
        )), 500

@dashboard_bp.route('/system/status', methods=['GET'])
def get_system_status():
    """Endpoint para verificar status do sistema"""
    try:
        logger.info("Verificação de status do sistema solicitada")
        
        status = glpi_service.get_system_status()
        
        # Determinar código HTTP baseado no status
        if status['status'] == 'online':
            status_code = 200
        elif status['status'] == 'warning':
            status_code = 206  # Partial Content
        else:
            status_code = 503  # Service Unavailable
        
        return jsonify(status), status_code
        
    except Exception as e:
        logger.error(f"Erro ao verificar status do sistema: {e}")
        return jsonify({
            "status": "error",
            "message": f"Erro interno: {str(e)}",
            "response_time": None,
            "token_valid": False
        }), 500

@dashboard_bp.route('/metrics/advanced', methods=['GET'])
def get_advanced_metrics():
    """Endpoint para métricas avançadas com múltiplos filtros"""
    try:
        logger.info("Solicitação de métricas avançadas recebida")
        
        # Obter todos os parâmetros de filtro
        filters = {
            'start_date': request.args.get('start_date'),
            'end_date': request.args.get('end_date'),
            'level': request.args.get('level'),
            'status': request.args.get('status'),
            'group_by': request.args.get('group_by', 'level')  # level, status, date
        }
        
        # Remover filtros vazios
        filters = {k: v for k, v in filters.items() if v is not None}
        
        logger.info(f"Aplicando filtros avançados: {filters}")
        
        metrics = glpi_service.get_dashboard_metrics_with_filters(filters)
        
        return jsonify(metrics)
        
    except Exception as e:
        logger.error(f"Erro ao obter métricas avançadas: {e}")
        return jsonify(ResponseFormatter.format_error_response(
            f"Erro interno: {str(e)}",
            [str(e)]
        )), 500

# Cleanup ao encerrar a aplicação
@dashboard_bp.teardown_app_request
def cleanup_glpi_session(exception):
    """Limpa a sessão GLPI ao final da requisição se necessário"""
    # Não fechar sessão a cada requisição para melhor performance
    # A sessão será reutilizada e renovada automaticamente
    pass
