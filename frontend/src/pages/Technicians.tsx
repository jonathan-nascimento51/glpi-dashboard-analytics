import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Star, 
  Filter,
  Search,
  TrendingUp,
  Award
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DateRangePicker from '../components/DateRangePicker';
import { dashboardService } from '../services/dashboardService';

interface Technician {
  id: number;
  name: string;
  email: string;
  total_tickets: number;
  resolved_tickets: number;
  pending_tickets: number;
  average_resolution_time: number;
  resolution_rate: number;
  level: string;
  rank: number;
}

const Technicians: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getTechnicianRanking({
        start_date: startDate,
        end_date: endDate,
        level: levelFilter || undefined
      });
      setTechnicians(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados dos técnicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnicians();
  }, [startDate, endDate, levelFilter]);

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'senior':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pleno':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'junior':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Award className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Star className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Ranking de Técnicos</h1>
        </div>
        <ErrorMessage message={error} onRetry={loadTechnicians} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Ranking de Técnicos</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar técnicos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os níveis</option>
              <option value="senior">Senior</option>
              <option value="pleno">Pleno</option>
              <option value="junior">Junior</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technicians List */}
      {loading ? (
        <div className="card">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTechnicians.map((technician) => (
            <div key={technician.id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    {getRankIcon(technician.rank)}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{technician.name}</h3>
                    <p className="text-sm text-gray-600">{technician.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${getLevelColor(technician.level)}
                      `}>
                        {technician.level}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{technician.total_tickets}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{technician.resolved_tickets}</p>
                    <p className="text-xs text-gray-600">Resolvidos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{technician.pending_tickets}</p>
                    <p className="text-xs text-gray-600">Pendentes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{technician.resolution_rate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">Taxa Resolução</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Tempo médio de resolução: {technician.average_resolution_time.toFixed(1)}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>Posição:</span>
                    <span className="font-semibold text-gray-900">#{technician.rank}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTechnicians.length === 0 && !loading && (
            <div className="card text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum técnico encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros de busca.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Technicians;