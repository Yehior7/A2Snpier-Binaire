'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';
import { BacktestResult } from '@/lib/backtesting';

interface BacktestResultsProps {
  result: BacktestResult;
  onClose: () => void;
}

export function BacktestResults({ result, onClose }: BacktestResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleDownload = (format: 'pdf' | 'csv' | 'json') => {
    // Simulation du téléchargement
    const data = format === 'json' ? JSON.stringify(result, null, 2) : 
                 format === 'csv' ? convertToCSV(result) : 
                 'PDF export simulation';
    
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 
            format === 'csv' ? 'text/csv' : 
            'application/pdf' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest-results.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (result: BacktestResult): string => {
    const headers = ['Trade ID', 'Entry Time', 'Exit Time', 'Pair', 'Direction', 'Result', 'Profit'];
    const rows = result.trades.map(trade => [
      trade.id,
      trade.entryTime.toISOString(),
      trade.exitTime.toISOString(),
      trade.signal.pair,
      trade.direction,
      trade.result,
      trade.netProfit.toFixed(2)
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'trades', name: 'Trades', icon: TrendingUp },
    { id: 'metrics', name: 'Métriques', icon: Target }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Résultats du Backtest</h2>
            <p className="text-gray-600">Analyse détaillée des performances</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload('pdf')}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                PDF
              </button>
              <button
                onClick={() => handleDownload('csv')}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                CSV
              </button>
              <button
                onClick={() => handleDownload('json')}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                JSON
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 mb-1">Profit Net</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${result.netProfit.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {result.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 mb-1">Total Trades</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {result.totalTrades}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 mb-1">Ratio Sharpe</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {result.sharpeRatio.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 mb-1">Drawdown Max</p>
                    <p className="text-2xl font-bold text-red-700">
                      {result.maxDrawdown.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600 mb-1">Facteur Profit</p>
                    <p className="text-2xl font-bold text-indigo-700">
                      {result.profitFactor.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-indigo-600" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Gain Moyen</p>
                    <p className="text-2xl font-bold text-gray-700">
                      ${result.avgWin.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-600" />
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 mb-1">Perte Moyenne</p>
                    <p className="text-2xl font-bold text-orange-700">
                      ${result.avgLoss.toFixed(2)}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trades' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Paire</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Direction</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Entrée</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Sortie</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Résultat</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.slice(0, 50).map((trade, index) => (
                    <tr key={trade.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {trade.signal.pair}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.direction === 'CALL' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.direction}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {trade.entryPrice.toFixed(4)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {trade.exitPrice.toFixed(4)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trade.result === 'WIN' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.result}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`font-medium ${
                          trade.netProfit > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trade.netProfit > 0 ? '+' : ''}${trade.netProfit.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques de Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trades Gagnants</span>
                    <span className="font-medium">{result.winningTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trades Perdants</span>
                    <span className="font-medium">{result.losingTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plus Gros Gain</span>
                    <span className="font-medium text-green-600">${result.largestWin.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plus Grosse Perte</span>
                    <span className="font-medium text-red-600">${result.largestLoss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Série Gagnante Max</span>
                    <span className="font-medium">{result.consecutiveWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Série Perdante Max</span>
                    <span className="font-medium">{result.consecutiveLosses}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques de Risque</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit Total</span>
                    <span className="font-medium text-green-600">${result.totalProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Perte Totale</span>
                    <span className="font-medium text-red-600">${result.totalLoss.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ratio Gain/Perte</span>
                    <span className="font-medium">{(result.avgWin / result.avgLoss).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Facteur de Profit</span>
                    <span className="font-medium">{result.profitFactor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ratio de Sharpe</span>
                    <span className="font-medium">{result.sharpeRatio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drawdown Maximum</span>
                    <span className="font-medium text-red-600">{result.maxDrawdown.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}