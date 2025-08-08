import React from 'react';
import { Bell, Settings, User, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  systemStatus?: {
    glpi_connected: boolean;
    last_sync: string;
  };
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, systemStatus }) => {
  const getStatusColor = () => {
    if (!systemStatus) return 'bg-gray-400';
    return systemStatus.glpi_connected ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (!systemStatus) return 'Verificando...';
    return systemStatus.glpi_connected ? 'Conectado' : 'Desconectado';
  };

  const formatLastSync = (lastSync: string) => {
    if (!lastSync) return 'Nunca';
    try {
      const date = new Date(lastSync);
      return date.toLocaleString('pt-BR');
    } catch {
      return 'Inválido';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              GLPI Dashboard
            </h1>
            <p className="text-sm text-gray-500 hidden sm:block">
              Sistema de Análise e Métricas
            </p>
          </div>
        </div>

        {/* Right side - Status and actions */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm text-gray-600">
              GLPI: {getStatusText()}
            </span>
            {systemStatus?.last_sync && (
              <span className="text-xs text-gray-400 ml-2">
                Última sync: {formatLastSync(systemStatus.last_sync)}
              </span>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <User className="h-5 w-5" />
              <span className="hidden sm:block text-sm font-medium">
                Administrador
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile status bar */}
      <div className="md:hidden px-4 py-2 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm text-gray-600">
              GLPI: {getStatusText()}
            </span>
          </div>
          {systemStatus?.last_sync && (
            <span className="text-xs text-gray-400">
              Sync: {formatLastSync(systemStatus.last_sync)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;