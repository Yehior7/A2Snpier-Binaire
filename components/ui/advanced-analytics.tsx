'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Zap, Clock, Target, RefreshCw, Download } from 'lucide-react';

export function AdvancedAnalytics() {
  const [liveData, setLiveData] = useState({
    signalsGenerated: 247,
    aiAccuracy: 90.2,
    avgProfit: 67.50,
    avgExecutionTime: 28
  });

  const [performanceByHour, setPerformanceByHour] = useState([
    { hour: '00:00', signals: 12, accuracy: 88 },
    { hour: '02:00', signals: 8, accuracy: 92 },
    { hour: '04:00', signals: 15, accuracy: 87 },
    { hour: '06:00', signals: 23, accuracy: 91 },
    { hour: '08:00', signals: 35, accuracy: 93 },
    { hour: '10:00', signals: 42, accuracy: 89 },
    { hour: '12:00', signals: 38, accuracy: 94 },
    { hour: '14:00', signals: 45, accuracy: 88 },
    { hour: '16:00', signals: 41, accuracy: 92 },
    { hour: '18:00', signals: 29, accuracy: 90 },
    { hour: '20:00', signals: 18, accuracy: 86 },
    { hour: '22:00', signals: 14, accuracy: 89 }
  ]);

  const [timeframeDistribution, setTimeframeDistribution] = useState([
    { name: '1 min', value: 35, color: '#3B82F6' },
    { name: '3 min', value: 45, color: '#10B981' },
    { name: '5 min', value: 20, color: '#F59E0B' }
  ]);

  const [pairPerformance, setPairPerformance] = useState([
    { pair: 'EUR/USD', trades: 45, winRate: 92, profit: 234.50 },
    { pair: 'GBP/USD', trades: 38, winRate: 89, profit: 187.20 },
    { pair: 'USD/JPY', trades: 42, winRate: 91, profit: 201.80 },
    { pair: 'AUD/USD', trades: 29, winRate: 87, profit: 156.40 },
    { pair: 'USD/CHF', trades: 33, winRate: 90, profit: 178.90 }
  ]);

  // Mise à jour temps réel des données
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        signalsGenerated: prev.signalsGenerated + Math.floor(Math.random() * 3),
        aiAccuracy: Math.max(85, Math.min(95, prev.aiAccuracy + (Math.random() - 0.5) * 0.5)),
        avgProfit: Math.max(50, Math.min(100, prev.avgProfit + (Math.random() - 0.5) * 5)),
        avgExecutionTime: Math.max(20, Math.min(40, prev.avgExecutionTime + (Math.random() - 0.5) * 2))
      }));

      // Mise à jour des données de performance par heure
      setPerformanceByHour(prev => prev.map(item => ({
        ...item,
        signals: Math.max(5, item.signals + Math.floor((Math.random() - 0.5) * 4)),
        accuracy: Math.max(80, Math.min(98, item.accuracy + (Math.random() - 0.5) * 2))
      })));

      // Mise à jour des performances par paire
      setPairPerformance(prev => prev.map(item => ({
        ...item,
        trades: item.trades + Math.floor(Math.random() * 2),
        winRate: Math.max(80, Math.min(98, item.winRate + (Math.random() - 0.5) * 1)),
        profit: Math.max(100, item.profit + (Math.random() - 0.3) * 20)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    // Simulation de rafraîchissement
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Analytics mis à jour !';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      liveData,
      performanceByHour,
      timeframeDistribution,
      pairPerformance
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Analytics exportées !';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Métriques temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Signaux Générés</p>
              <p className="text-2xl font-bold text-blue-600">{liveData.signalsGenerated}</p>
              <p className="text-xs text-green-600">+12 dernière heure</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Précision IA</p>
              <p className="text-2xl font-bold text-green-600">{liveData.aiAccuracy.toFixed(1)}%</p>
              <p className="text-xs text-green-600">+0.3% aujourd'hui</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Profit Moyen</p>
              <p className="text-2xl font-bold text-purple-600">${liveData.avgProfit.toFixed(2)}</p>
              <p className="text-xs text-green-600">+5.2% cette semaine</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Temps Moyen</p>
              <p className="text-2xl font-bold text-orange-600">{liveData.avgExecutionTime.toFixed(0)}s</p>
              <p className="text-xs text-green-600">-2s optimisé</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance par heure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance par Heure</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signals" fill="#3B82F6" name="Signaux" />
              <Bar dataKey="accuracy" fill="#10B981" name="Précision %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribution des timeframes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribution des Timeframes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={timeframeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {timeframeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance par paire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance par Paire de Devises</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Paire</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trades</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Taux Réussite</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Profit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tendance</th>
              </tr>
            </thead>
            <tbody>
              {pairPerformance.map((pair, index) => (
                <motion.tr
                  key={pair.pair}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {pair.pair.split('/')[0]}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{pair.pair}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{pair.trades}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        pair.winRate >= 90 ? 'text-green-600' :
                        pair.winRate >= 85 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {pair.winRate.toFixed(1)}%
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            pair.winRate >= 90 ? 'bg-green-500' :
                            pair.winRate >= 85 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${pair.winRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-green-600">
                      ${pair.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <ResponsiveContainer width={60} height={30}>
                      <LineChart data={[
                        { value: pair.profit * 0.8 },
                        { value: pair.profit * 0.9 },
                        { value: pair.profit * 1.1 },
                        { value: pair.profit }
                      ]}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}