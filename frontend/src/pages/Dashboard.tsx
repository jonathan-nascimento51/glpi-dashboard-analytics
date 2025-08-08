import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Ticket, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DateRangePicker from '../components/DateRangePicker';
import { dashboardService } from '../services/dashboardService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardMetrics {
  total_tickets: number;
  new_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  closed_tickets: number;
  pending_tickets: number;
  average_resolution_time: number;
  tickets_by_priority: Record<string, number>;
  tickets_by_status: Record<string, number>;
  trend_data: Array<{
    date: string;
    tickets: number;
    resolved: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardMetrics({
        start_date: startDate,
        end_date: endDate
      });
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [startDate, endDate]);

  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

  const priorityData = metrics ? Object.entries(metrics.tickets_by_priority).map(([name, value]) => ({
    name,
    value
  })) : [];

  const statusData = metrics ? Object.entries(metrics.tickets_by_status).map(([name, value]) => ({
    name,
    value
  })) : [];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <ErrorMessage message={error} onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Tickets"
          value={metrics?.total_tickets || 0}
          icon={Ticket}
          iconColor="text-blue-600"
          loading={loading}
        />
        <MetricCard
          title="Novos Tickets"
          value={metrics?.new_tickets || 0}
          icon={AlertTriangle}
          iconColor="text-orange-600"
          loading={loading}
        />
        <MetricCard
          title="Em Andamento"
          value={metrics?.in_progress_tickets || 0}
          icon={Clock}
          iconColor="text-yellow-600"
          loading={loading}
        />
        <MetricCard
          title="Resolvidos"
          value={metrics?.resolved_tickets || 0}
          icon={CheckCircle}
          iconColor="text-green-600"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tendência de Tickets</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics?.trend_data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Tickets Criados"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Tickets Resolvidos"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Distribuição por Prioridade</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Distribuição por Status</h3>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Tickets Pendentes"
          value={metrics?.pending_tickets || 0}
          icon={XCircle}
          iconColor="text-red-600"
          loading={loading}
        />
        <MetricCard
          title="Tickets Fechados"
          value={metrics?.closed_tickets || 0}
          icon={CheckCircle}
          iconColor="text-gray-600"
          loading={loading}
        />
        <MetricCard
          title="Tempo Médio de Resolução"
          value={metrics ? `${metrics.average_resolution_time.toFixed(1)}h` : '0h'}
          icon={Clock}
          iconColor="text-purple-600"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;