'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Download, Calendar, TrendingUp } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';
import { BacktestResults } from '@/components/ui/backtest-results';
import { BacktestEngine, BacktestConfig, BacktestResult } from '@/lib/backtesting';
import { AITradingEngine } from '@/lib/ai-engine';
import { tradingPairs } from '@/lib/mock-data';

export default function BacktestingPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [config, setConfig] = useState<BacktestConfig>({
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 jours
    endDate: new Date(),
    initialBalance: 10000,
    commission: 0.001, // 0.1%
    slippage: 0.0005, // 0.05%
    riskPerTrade: 0.02, // 2%
    minConfidence: 75,
    pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY']
  });

  const backtestEngine = new BacktestEngine();
  const aiEngine = new AITradingEngine();

  const runBacktest = async () => {
    setIsRunning(true);
    
    try {
      // Notification de début
      const startNotification = document.createElement('div');
      startNotification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      startNotification.textContent = 'Backtesting en cours...';
      document.body.appendChild(startNotification);
      
      // Génération de signaux simulés pour le backtest
      const signals = await generateMockSignals();
      
      // Exécution du backtest
      const result = await backtestEngine.runBacktest(signals, config);
      
      setResults(result);
      setShowResults(true);
      
      // Notification de fin
      document.body.removeChild(startNotification);
      const endNotification = document.createElement('div');
      endNotification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      endNotification.textContent = 'Backtesting terminé avec succès !';
      document.body.appendChild(endNotification);
      setTimeout(() => document.body.removeChild(endNotification), 3000);
    } catch (error) {
      console.error('Erreur lors du backtesting:', error);
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorNotification.textContent = 'Erreur lors du backtesting';
      document.body.appendChild(errorNotification);
      setTimeout(() => document.body.removeChild(errorNotification), 3000);
    } finally {
      setIsRunning(false);
    }
  };

  // Génération de signaux mock pour le backtest
  const generateMockSignals = async () => {
    const signals = [];
    const startTime = config.startDate.getTime();
    const endTime = config.endDate.getTime();
    const interval = 15 * 60 * 1000; // 15 minutes
    
    for (let time = startTime; time < endTime; time += interval) {
      // Probabilité de génération d'un signal (30%)
      if (Math.random() < 0.3) {
        const pair = config.pairs[Math.floor(Math.random() * config.pairs.length)];
        const basePrice = 1.0800 + (Math.random() - 0.5) * 0.1;
        
        // Génération de données de marché simulées
        const marketData = Array.from({ length: 50 }, (_, i) => ({
          symbol: pair,
          timestamp: new Date(time - (49 - i) * 60000),
          open: basePrice + (Math.random() - 0.5) * 0.01,
          high: basePrice + Math.random() * 0.01,
          low: basePrice - Math.random() * 0.01,
          close: basePrice + (Math.random() - 0.5) * 0.01,
          volume: 1000000 + Math.random() * 500000,
          bid: basePrice - 0.0001,
          ask: basePrice + 0.0001,
          spread: 0.0002
        }));
        
        const signal = await aiEngine.generateSignal(pair, marketData);
        if (signal && signal.confidence >= config.minConfidence) {
          signals.push(signal);
        }
      }
    }
    
    return signals;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Backtesting Avancé
              </h1>
              <p className="text-gray-600">
                Testez vos stratégies sur des données historiques
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Configuration */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Configuration
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Période */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Période de test
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={config.startDate.toISOString().split('T')[0]}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          startDate: new Date(e.target.value)
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="date"
                        value={config.endDate.toISOString().split('T')[0]}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          endDate: new Date(e.target.value)
                        }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Capital initial */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capital initial ($)
                    </label>
                    <input
                      type="number"
                      value={config.initialBalance}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        initialBalance: Number(e.target.value)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Risque par trade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risque par trade (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.riskPerTrade * 100}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        riskPerTrade: Number(e.target.value) / 100
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Confiance minimum */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confiance minimum (%)
                    </label>
                    <input
                      type="number"
                      value={config.minConfidence}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        minConfidence: Number(e.target.value)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Commission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={config.commission * 100}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        commission: Number(e.target.value) / 100
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Paires de devises */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paires de devises
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {tradingPairs.map(pair => (
                        <label key={pair.symbol} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={config.pairs.includes(pair.symbol)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setConfig(prev => ({
                                  ...prev,
                                  pairs: [...prev.pairs, pair.symbol]
                                }));
                              } else {
                                setConfig(prev => ({
                                  ...prev,
                                  pairs: prev.pairs.filter(p => p !== pair.symbol)
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{pair.symbol}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Bouton de lancement */}
                  <button
                    onClick={runBacktest}
                    disabled={isRunning}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isRunning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Lancer le backtest</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Résultats rapides */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Aperçu des Résultats
                    </h2>
                  </div>
                  {results && (
                    <button
                      onClick={() => setShowResults(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Voir détails
                    </button>
                  )}
                </div>

                {results ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-700">
                        ${results.netProfit.toFixed(2)}
                      </div>
                      <div className="text-sm text-green-600">Profit Net</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">
                        {results.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-600">Taux de Réussite</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">
                        {results.totalTrades}
                      </div>
                      <div className="text-sm text-purple-600">Total Trades</div>
                    </div>
                    
                    <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-700">
                        {results.sharpeRatio.toFixed(2)}
                      </div>
                      <div className="text-sm text-yellow-600">Ratio Sharpe</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-700">
                        {results.maxDrawdown.toFixed(1)}%
                      </div>
                      <div className="text-sm text-red-600">Drawdown Max</div>
                    </div>
                    
                    <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="text-2xl font-bold text-indigo-700">
                        {results.profitFactor.toFixed(2)}
                      </div>
                      <div className="text-sm text-indigo-600">Facteur Profit</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun backtest exécuté
                    </h3>
                    <p className="text-gray-600">
                      Configurez les paramètres et lancez un backtest pour voir les résultats
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal des résultats détaillés */}
      {showResults && results && (
        <BacktestResults
          result={results}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}