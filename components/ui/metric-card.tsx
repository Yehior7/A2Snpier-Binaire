import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    changePositive: 'text-blue-600',
    changeNegative: 'text-red-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    changePositive: 'text-green-600',
    changeNegative: 'text-red-600'
  }
};

export function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  const colors = colorClasses[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {change && (
            <div className={`flex items-center mt-2 ${
              change.type === 'increase' ? colors.changePositive : colors.changeNegative
            }`}>
              {change.type === 'increase' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
          <div className={colors.text}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}