import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Erro do servidor';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Servidor não está respondendo. Verifique sua conexão.');
    } else {
      // Something else happened
      throw new Error('Erro inesperado: ' + error.message);
    }
  }
);

export interface DashboardMetrics {
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

export interface Technician {
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

export interface TicketItem {
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

export interface SystemStatus {
  glpi_connection: boolean;
  glpi_authentication: boolean;
  cache_status: boolean;
  last_sync: string;
}

export interface FilterParams {
  start_date?: string;
  end_date?: string;
  priority?: string;
  technician?: string;
  status?: string;
  level?: string;
}

class DashboardService {
  async getDashboardMetrics(filters: FilterParams = {}): Promise<DashboardMetrics> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/dashboard/metrics?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  async getTechnicianRanking(filters: FilterParams = {}): Promise<Technician[]> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/dashboard/technician-ranking?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching technician ranking:', error);
      throw error;
    }
  }

  async getNewTickets(filters: FilterParams = {}): Promise<TicketItem[]> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/dashboard/new-tickets?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching new tickets:', error);
      throw error;
    }
  }

  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await api.get('/dashboard/system-status');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }

  async getAdvancedMetrics(filters: FilterParams = {}): Promise<any> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/dashboard/advanced-metrics?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching advanced metrics:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;