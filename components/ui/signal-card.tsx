'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Target, BarChart3 } from 'lucide-react';
import { Signal } from '@/lib/mock-data';
import { TradingViewChart } from './tradingview-chart';

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const [showChart, setShowChart] = useState(false);

  const getStatusColor = (status: Signal['status']) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case 'WON':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'LOST':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'EXPIRED':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs">
                {signal.pair.split('/')[0]}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{signal.pair}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {signal.timestamp.toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChart(true)}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Voir le graphique"
            >
              <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(signal.status)}`}>
              {signal.status}
            </span>
          </div>
        </div>

        {/* Direction et confiance */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              signal.direction === 'CALL' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {signal.direction === 'CALL' ? 
                <TrendingUp className="w-4 h-4" /> : 
                <TrendingDown className="w-4 h-4" />
              }
            </div>
            <span className="font-medium text-gray-900 dark:text-white">{signal.direction}</span>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{signal.confidence}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Confiance</div>
          </div>
        </div>

        {/* Barre de confiance */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${signal.confidence}%` }}
            ></div>
          </div>
        </div>

        {/* Détails */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400 mb-1">Prix d'entrée</div>
            <div className="font-medium text-gray-900 dark:text-white">{signal.entry_price.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400 mb-1">Expiration</div>
            <div className="font-medium text-gray-900 dark:text-white flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {signal.expiration}min
            </div>
          </div>
        </div>

        {/* Résultat si disponible */}
        {signal.result_price && signal.profit_loss && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">Prix de sortie</div>
                <div className="font-medium text-gray-900 dark:text-white">{signal.result_price.toFixed(4)}</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 dark:text-gray-400 text-sm">P&L</div>
                <div className={`font-bold ${
                  signal.profit_loss > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {signal.profit_loss > 0 ? '+' : ''}${signal.profit_loss.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <TradingViewChart
        symbol={signal.pair}
        isOpen={showChart}
        onClose={() => setShowChart(false)}
      />
    </>
  );
}