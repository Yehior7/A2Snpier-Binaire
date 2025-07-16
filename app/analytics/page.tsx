'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Download, TrendingUp, Target, Zap, Clock } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';
import { AdvancedAnalytics } from '@/components/ui/advanced-analytics';

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExport = () => {
    const data = {
      timeframe: selectedTimeframe,
      exportDate: new Date().toISOString(),
      analytics: 'Advanced analytics data would be here'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradealgo-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Header avec contrôles */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Analyses Avancées
              </h1>
              <p className="text-gray-600">
                Analyses détaillées des performances et métriques en temps réel
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1H">1 Heure</option>
                <option value="24H">24 Heures</option>
                <option value="7D">7 Jours</option>
                <option value="30D">30 Jours</option>
              </select>
              
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
            </div>
          </div>

          <AdvancedAnalytics />
        </div>
      </div>
    </div>
  );
}