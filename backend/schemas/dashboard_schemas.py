# -*- coding: utf-8 -*-
from marshmallow import Schema, fields, validate

class DashboardMetricsSchema(Schema):
    """Schema para validação de métricas do dashboard"""
    
    start_date = fields.DateTime(allow_none=True, format='iso')
    end_date = fields.DateTime(allow_none=True, format='iso')
    level = fields.String(allow_none=True, validate=validate.OneOf(['N1', 'N2', 'N3', 'N4', 'Geral']))
    group_by = fields.String(allow_none=True, validate=validate.OneOf(['level', 'status', 'date']))

class TechnicianRankingSchema(Schema):
    """Schema para validação de ranking de técnicos"""
    
    limit = fields.Integer(missing=10, validate=validate.Range(min=1, max=50))
    start_date = fields.DateTime(allow_none=True, format='iso')
    end_date = fields.DateTime(allow_none=True, format='iso')
    level = fields.String(allow_none=True, validate=validate.OneOf(['N1', 'N2', 'N3', 'N4', 'Geral']))

class NewTicketsSchema(Schema):
    """Schema para validação de tickets novos"""
    
    limit = fields.Integer(missing=10, validate=validate.Range(min=1, max=100))
    priority = fields.String(allow_none=True, validate=validate.OneOf(['Muito baixa', 'Baixa', 'Média', 'Alta', 'Muito alta']))
    technician = fields.String(allow_none=True)
    start_date = fields.DateTime(allow_none=True, format='iso')
    end_date = fields.DateTime(allow_none=True, format='iso')

class AdvancedFiltersSchema(Schema):
    """Schema para validação de filtros avançados"""
    
    start_date = fields.DateTime(allow_none=True, format='iso')
    end_date = fields.DateTime(allow_none=True, format='iso')
    level = fields.String(allow_none=True, validate=validate.OneOf(['N1', 'N2', 'N3', 'N4', 'Geral']))
    status = fields.String(allow_none=True, validate=validate.OneOf([
        'Novo', 'Processando (atribuído)', 'Processando (planejado)', 
        'Pendente', 'Solucionado', 'Fechado'
    ]))
    group_by = fields.String(missing='level', validate=validate.OneOf(['level', 'status', 'date']))
    technician_id = fields.Integer(allow_none=True)
    priority = fields.String(allow_none=True, validate=validate.OneOf(['Muito baixa', 'Baixa', 'Média', 'Alta', 'Muito alta']))
