import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Search, 
  Filter,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import DateRangePicker from '../components/DateRangePicker';
import { dashboardService } from '../services/dashboardService';

interface TicketItem {
  id: number;
  title: string;
  content: string;
  status: string;
  priority: string;
  requester: string;
  technician?: string;
  created_date: string;
  updated_date: string;
  category?: string;
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getNewTickets({
        start_date: startDate,
        end_date: endDate,
        priority: priorityFilter || undefined,
        technician: technicianFilter || undefined,
        status: statusFilter || undefined
      });
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [startDate, endDate, statusFilter, priorityFilter, technicianFilter]);

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.requester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        </div>
        <ErrorMessage message={error} onRetry={loadTickets} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os status</option>
                <option value="Novo">Novo</option>
                <option value="Processando (atribuído)">Processando (atribuído)</option>
                <option value="Processando (planejado)">Processando (planejado)</option>
                <option value="Pendente">Pendente</option>
                <option value="Solucionado">Solucionado</option>
                <option value="Fechado">Fechado</option>
              </select>
            </div>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as prioridades</option>
              <option value="Muito alta">Muito alta</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
              <option value="Muito baixa">Muito baixa</option>
            </select>
            
            <input
              type="text"
              placeholder="Filtrar por técnico"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <span>#{ticket.id}</span>
                      <span>{ticket.title}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </h3>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{truncateText(ticket.content)}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Solicitante: {ticket.requester}</span>
                    </div>
                    {ticket.technician && (
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Técnico: {ticket.technician}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Criado: {formatDate(ticket.created_date)}</span>
                    </div>
                  </div>
                  
                  {ticket.category && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {ticket.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Última atualização: {formatDate(ticket.updated_date)}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTickets.length === 0 && !loading && (
            <div className="card text-center py-12">
              <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ticket encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca ou o período selecionado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tickets;