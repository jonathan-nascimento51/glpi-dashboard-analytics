import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TechnicalGroup {
  name: string;
  total_tickets: number;
  resolved_tickets: number;
  pending_tickets: number;
  resolution_rate: number;
}

interface TechnicalGroupsAnalysisProps {
  groups: TechnicalGroup[];
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const TechnicalGroupsAnalysis: React.FC<TechnicalGroupsAnalysisProps> = ({ groups, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Análise por Grupos Técnicos</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Análise por Grupos Técnicos</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum grupo técnico encontrado</p>
        </div>
      </div>
    );
  }

  // Preparar dados para o gráfico de barras
  const barData = groups.map(group => ({
    name: group.name.length > 15 ? group.name.substring(0, 15) + '...' : group.name,
    fullName: group.name,
    total: group.total_tickets,
    resolvidos: group.resolved_tickets,
    pendentes: group.pending_tickets,
    taxa: group.resolution_rate
  }));

  // Preparar dados para o gráfico de pizza (top 5 grupos)
  const pieData = groups
    .slice(0, 5)
    .map(group => ({
      name: group.name.length > 20 ? group.name.substring(0, 20) + '...' : group.name,
      value: group.total_tickets,
      fullName: group.name
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-blue-600">Total: {data.total}</p>
          <p className="text-green-600">Resolvidos: {data.resolvidos}</p>
          <p className="text-yellow-600">Pendentes: {data.pendentes}</p>
          <p className="text-purple-600">Taxa: {data.taxa.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.fullName}</p>
          <p className="text-blue-600">Tickets: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-6">Análise por Grupos Técnicos</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Performance por Grupo */}
        <div>
          <h4 className="text-md font-medium mb-4 text-gray-700">Performance por Grupo</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="resolvidos" fill="#10B981" name="Resolvidos" />
              <Bar dataKey="pendentes" fill="#F59E0B" name="Pendentes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Distribuição de Tickets */}
        <div>
          <h4 className="text-md font-medium mb-4 text-gray-700">Distribuição de Tickets (Top 5)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela Resumo */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-4 text-gray-700">Resumo Detalhado</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolvidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pendentes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa de Resolução
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.map((group, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {group.total_tickets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {group.resolved_tickets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                    {group.pending_tickets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${group.resolution_rate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{group.resolution_rate.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TechnicalGroupsAnalysis;