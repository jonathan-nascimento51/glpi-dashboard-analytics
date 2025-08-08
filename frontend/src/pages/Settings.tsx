import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Server, 
  Key, 
  Database,
  Bell,
  Palette,
  Shield,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { dashboardService } from '../services/dashboardService';

interface SystemStatus {
  glpi_connection: boolean;
  glpi_authentication: boolean;
  cache_status: boolean;
  last_sync: string;
}

const Settings: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [settings, setSettings] = useState({
    glpi_url: 'https://glpi.empresa.com/apirest.php',
    app_token: '',
    user_token: '',
    cache_ttl: 300,
    notifications_enabled: true,
    theme: 'light',
    auto_refresh: true,
    refresh_interval: 30
  });

  const testConnection = async () => {
    try {
      setTestingConnection(true);
      const status = await dashboardService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Configurações salvas com sucesso!');
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Conectado' : 'Desconectado';
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Salvar Configurações</span>
        </button>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Status do Sistema</span>
          </h2>
          <button
            onClick={testConnection}
            disabled={testingConnection}
            className="btn-secondary flex items-center space-x-2"
          >
            {testingConnection ? (
              <LoadingSpinner size="sm" />
            ) : (
              <TestTube className="h-4 w-4" />
            )}
            <span>Testar Conexão</span>
          </button>
        </div>
        
        {systemStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(systemStatus.glpi_connection)}
              <div>
                <p className="text-sm font-medium text-gray-900">Conexão GLPI</p>
                <p className={`text-sm ${getStatusColor(systemStatus.glpi_connection)}`}>
                  {getStatusText(systemStatus.glpi_connection)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(systemStatus.glpi_authentication)}
              <div>
                <p className="text-sm font-medium text-gray-900">Autenticação</p>
                <p className={`text-sm ${getStatusColor(systemStatus.glpi_authentication)}`}>
                  {getStatusText(systemStatus.glpi_authentication)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(systemStatus.cache_status)}
              <div>
                <p className="text-sm font-medium text-gray-900">Cache</p>
                <p className={`text-sm ${getStatusColor(systemStatus.cache_status)}`}>
                  {getStatusText(systemStatus.cache_status)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Última Sync</p>
                <p className="text-sm text-gray-600">
                  {new Date(systemStatus.last_sync).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GLPI Configuration */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Configuração GLPI</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da API GLPI
            </label>
            <input
              type="url"
              value={settings.glpi_url}
              onChange={(e) => setSettings({...settings, glpi_url: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://glpi.empresa.com/apirest.php"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Token
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={settings.app_token}
                  onChange={(e) => setSettings({...settings, app_token: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Token da aplicação"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Token
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={settings.user_token}
                  onChange={(e) => setSettings({...settings, user_token: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Token do usuário"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <SettingsIcon className="h-5 w-5" />
          <span>Configurações da Aplicação</span>
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TTL do Cache (segundos)
              </label>
              <input
                type="number"
                value={settings.cache_ttl}
                onChange={(e) => setSettings({...settings, cache_ttl: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="60"
                max="3600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervalo de Atualização (segundos)
              </label>
              <input
                type="number"
                value={settings.refresh_interval}
                onChange={(e) => setSettings({...settings, refresh_interval: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                max="300"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Notificações</p>
                  <p className="text-sm text-gray-600">Receber notificações sobre novos tickets</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications_enabled}
                  onChange={(e) => setSettings({...settings, notifications_enabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Atualização Automática</p>
                  <p className="text-sm text-gray-600">Atualizar dados automaticamente</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.auto_refresh}
                  onChange={(e) => setSettings({...settings, auto_refresh: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Tema</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`} onClick={() => setSettings({...settings, theme: 'light'})}>
            <div className="w-full h-20 bg-white border border-gray-200 rounded mb-2"></div>
            <p className="text-sm font-medium text-center">Claro</p>
          </div>
          
          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`} onClick={() => setSettings({...settings, theme: 'dark'})}>
            <div className="w-full h-20 bg-gray-800 border border-gray-600 rounded mb-2"></div>
            <p className="text-sm font-medium text-center">Escuro</p>
          </div>
          
          <div className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            settings.theme === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`} onClick={() => setSettings({...settings, theme: 'auto'})}>
            <div className="w-full h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded mb-2"></div>
            <p className="text-sm font-medium text-center">Automático</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;