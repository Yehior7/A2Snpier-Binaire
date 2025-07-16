'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Link2, Clock, TrendingUp, TrendingDown, MessageCircle, X, RefreshCw, Download, Settings, BarChart3, Target, DollarSign } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function DashboardPage() {
  const { user, signals, addSignal } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showChat, setShowChat] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(75);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    totalSignals: 247,
    activeSignals: 12,
    winRate: 90.2,
    todayProfit: 1247.50,
    avgResponseTime: 28
  });

  // Mise à jour temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulation de mise à jour des métriques en temps réel
      setLiveMetrics(prev => ({
        ...prev,
        totalSignals: prev.totalSignals + Math.floor(Math.random() * 2),
        activeSignals: Math.max(8, Math.min(15, prev.activeSignals + (Math.random() > 0.5 ? 1 : -1))),
        winRate: Math.max(85, Math.min(95, prev.winRate + (Math.random() - 0.5) * 0.5)),
        todayProfit: prev.todayProfit + (Math.random() - 0.3) * 50,
        avgResponseTime: Math.max(20, Math.min(40, prev.avgResponseTime + (Math.random() - 0.5) * 2))
      }));

      // Mise à jour du gauge
      setGaugeValue(prev => Math.max(60, Math.min(90, prev + (Math.random() - 0.5) * 5)));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Auto-génération de signaux
  useEffect(() => {
    const signalTimer = setInterval(() => {
      if (Math.random() > 0.7) { // 30% de chance de générer un signal
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'];
        const newSignal = {
          id: `signal_${Date.now()}`,
          pair: pairs[Math.floor(Math.random() * pairs.length)],
          direction: Math.random() > 0.5 ? 'CALL' : 'PUT' as 'CALL' | 'PUT',
          confidence: 75 + Math.floor(Math.random() * 20),
          entry_price: 1.0800 + (Math.random() - 0.5) * 0.1,
          expiration: [1, 3, 5][Math.floor(Math.random() * 3)],
          status: 'ACTIVE' as const,
          timestamp: new Date()
        };
        addSignal(newSignal);
      }
    }, 15000); // Nouveau signal toutes les 15 secondes

    return () => clearInterval(signalTimer);
  }, [addSignal]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLiveMetrics(prev => ({
        ...prev,
        totalSignals: prev.totalSignals + Math.floor(Math.random() * 5),
        winRate: Math.max(85, Math.min(95, 90 + (Math.random() - 0.5) * 10)),
        todayProfit: prev.todayProfit + (Math.random() * 100 - 30)
      }));
      setIsRefreshing(false);
      
      // Notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Dashboard mis à jour !';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 3000);
    }, 1500);
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: liveMetrics,
      gaugeValue,
      user: user?.name,
      signals: signals.slice(0, 10)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Données exportées avec succès !';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  // Gauge component avec animation
  const TechnicalGauge = () => {
    const radius = 80;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    
    const angle = (gaugeValue / 100) * 180;
    const strokeDashoffset = circumference - (angle / 180) * (circumference / 2);

    const getGaugeColor = (value: number) => {
      if (value < 30) return '#ef4444';
      if (value < 45) return '#f97316';
      if (value < 55) return '#eab308';
      if (value < 70) return '#84cc16';
      return '#22c55e';
    };

    const getGaugeLabel = (value: number) => {
      if (value < 30) return 'Strong Bear';
      if (value < 45) return 'Bear';
      if (value < 55) return 'Neutral';
      if (value < 70) return 'Bull';
      return 'Strong Bull';
    };

    return (
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <path
              d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
              fill="none"
              stroke="#374151"
              strokeWidth={strokeWidth}
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="25%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            <path
              d={`M ${strokeWidth} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - strokeWidth} ${radius}`}
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out'
              }}
            />
            <line
              x1={radius}
              y1={radius}
              x2={radius + (normalizedRadius - 10) * Math.cos((angle - 90) * Math.PI / 180)}
              y2={radius + (normalizedRadius - 10) * Math.sin((angle - 90) * Math.PI / 180)}
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transition: 'all 0.5s ease-in-out'
              }}
            />
            <circle cx={radius} cy={radius} r="6" fill="white" />
          </svg>
        </div>
        
        <div className="mt-4 text-center">
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ${
            gaugeValue >= 70 ? 'bg-green-500 text-white' :
            gaugeValue >= 55 ? 'bg-blue-500 text-white' :
            gaugeValue >= 45 ? 'bg-yellow-500 text-black' :
            'bg-red-500 text-white'
          }`}>
            {getGaugeLabel(gaugeValue)}
          </div>
          <div className="mt-2 text-gray-400 text-sm">
            Force: {Math.round(gaugeValue * 10 / 100)}/10
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TradeAlgo.AI</span>
          </div>

          <nav className="space-y-2">
            <div className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium">
              Dashboard
            </div>
            <button 
              onClick={() => window.location.href = '/signals'}
              className="w-full text-left text-gray-400 px-4 py-3 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Signaux
            </button>
            <button 
              onClick={() => window.location.href = '/performance'}
              className="w-full text-left text-gray-400 px-4 py-3 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Performance
            </button>
            <button 
              onClick={() => window.location.href = '/analytics'}
              className="w-full text-left text-gray-400 px-4 py-3 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header avec boutons fonctionnels */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Bienvenue, {user?.name || 'Trader'}
            </h1>
            <p className="text-gray-400">
              Dernière mise à jour: {currentTime.toLocaleTimeString('fr-FR')}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleExport}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.location.href = '/settings'}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
          </div>
        </div>

        {/* Métriques temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Signaux</p>
                <p className="text-2xl font-bold text-white">{liveMetrics.totalSignals}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Signaux Actifs</p>
                <p className="text-2xl font-bold text-blue-400">{liveMetrics.activeSignals}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Taux Réussite</p>
                <p className="text-2xl font-bold text-green-400">{liveMetrics.winRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Profit Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-400">${liveMetrics.todayProfit.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Temps Moyen</p>
                <p className="text-2xl font-bold text-yellow-400">{liveMetrics.avgResponseTime.toFixed(0)}s</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Technical Analysis avec gauge animé */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Analyse Technique Temps Réel</h2>
              </div>
              
              <div className="flex justify-center">
                <TechnicalGauge />
              </div>
            </div>

            {/* Asset Realtime */}
            <div className="mt-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Actif Principal</h3>
                  <div className="text-2xl font-bold text-white mb-2">EUR/USD</div>
                  <div className="text-gray-400 text-sm mb-4">Position</div>
                  <div className="text-lg text-blue-400">
                    {gaugeValue > 60 ? 'Haussière' : 'Baissière'}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Heure Système</h3>
                  <div className="text-2xl font-bold text-white mb-2">
                    {currentTime.toLocaleTimeString('fr-FR')}
                  </div>
                  <div className="text-gray-400 text-sm mb-4">Prochaine Analyse</div>
                  <div className="text-lg text-white">
                    {Math.floor((60 - currentTime.getSeconds()) / 10) * 10}s
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Panel avec signaux temps réel */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Signaux Récents</h2>
                <button 
                  onClick={() => window.location.href = '/signals'}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Voir tout
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {signals.slice(0, 8).map((signal, index) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-700/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          signal.direction === 'CALL' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {signal.direction === 'CALL' ? 
                            <TrendingUp className="w-3 h-3 text-white" /> : 
                            <TrendingDown className="w-3 h-3 text-white" />
                          }
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          signal.status === 'ACTIVE' ? 'bg-blue-500 text-white' :
                          signal.status === 'WON' ? 'bg-green-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {signal.status}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs">
                        {signal.timestamp.toLocaleTimeString('fr-FR')}
                      </div>
                    </div>
                    
                    <div className="text-white font-medium mb-2">{signal.pair}</div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Confiance</span>
                      <span className="text-white text-sm">{signal.confidence}%</span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="w-full bg-slate-600 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${signal.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Assistant */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Assistant IA</span>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="text-gray-400 text-sm mb-4">
              Bonjour ! Comment puis-je vous aider avec votre trading aujourd'hui ?
            </div>
            <div className="bg-slate-700 p-3 rounded-lg text-sm text-white mb-4">
              Vos performances sont excellentes aujourd'hui avec un taux de réussite de {liveMetrics.winRate.toFixed(1)}% !
            </div>
          </div>
          <div className="p-4 border-t border-slate-700">
            <input
              type="text"
              placeholder="Tapez votre message..."
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>
      )}

      {/* Floating Chat Button */}
      {!showChat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-50 transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}