import React from 'react';
import { AlertTriangle, AlertCircle, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: string;
  showIcon?: boolean;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ 
  priority, 
  showIcon = true, 
  className = '' 
}) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'muito alta':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle
        };
      case 'alta':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: ArrowUp
        };
      case 'média':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Minus
        };
      case 'baixa':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: ArrowDown
        };
      case 'muito baixa':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: ArrowDown
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <span className={`
      inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${config.color} ${className}
    `}>
      {showIcon && <Icon className="h-3 w-3" />}
      <span>{priority}</span>
    </span>
  );
};

export default PriorityBadge;