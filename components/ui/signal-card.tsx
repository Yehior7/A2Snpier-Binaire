'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Clock, Star, Copy, ExternalLink, Check, X, Target, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface Signal {
  id: string;
  pair: string;
  direction: 'CALL' | 'PUT';
  confidence: number;
  entry_price: number;
  expiration: number;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'EXPIRED';
  timestamp: Date;
  result_price?: number;
  profit_loss?: number;
}

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const { updateSignalStatus } = useAppStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpiring, setIsExpiring] = useState(false);

  // Calcul du temps restant
  useEffect(() => {
    if (signal.status === 'ACTIVE') {
      const interval = setInterval(() => {
        const elapsed = Date.now() - signal.timestamp.getTime();
        const remaining = (signal.expiration * 60 * 1000) - elapsed;
        
        if (remaining <= 0) {
          setTimeLeft(0);
          if (signal.status === 'ACTIVE') {
            // Auto-expiration du signal
            updateSignalStatus(signal.id, 'EXPIRED');
          }
        } else {
          setTimeLeft(remaining);
          setIsExpiring(remaining < 30000); // Dernières 30 secondes
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [signal, updateSignalStatus]);

  // Auto-résolution des signaux actifs (simulation)
  useEffect(() => {
    if (signal.status === 'ACTIVE') {
      const autoResolveTimer = setTimeout(() => {
        const isWin = Math.random() > 0.1; // 90% de chance de gagner
        const resultPrice = signal.entry_price + (Math.random() - 0.5) * 0.01;
        const profitLoss = isWin ? 50 + Math.random() * 100 : -(20 + Math.random() * 50);
        
        updateSignalStatus(
          signal.id, 
          isWin ? 'WON' : 'LOST',
          { result_price: resultPrice, profit_loss: profitLoss }
        );
      }, signal.expiration * 60 * 1000);

      return () => clearTimeout(autoResolveTimer);
    }
  }, [signal, updateSignalStatus]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCopySignal = () => {
    const signalText = `🎯 SIGNAL TRADING - TradeAlgo.AI
📊 Paire: ${signal.pair}
📈 Direction: ${signal.direction} ${signal.direction === 'CALL' ? '⬆️' : '⬇️'}
⏰ Expiration: ${signal.expiration} minutes
🎯 Confiance: ${signal.confidence}%
💰 Prix d'entrée: ${signal.entry_price.toFixed(4)}
📍 Timestamp: ${signal.timestamp.toLocaleString('fr-FR')}
#${signal.pair.replace('/', '')} #${signal.direction} #${signal.expiration}MIN`;

    navigator.clipboard.writeText(signalText);
    
    // Notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Signal copié dans le presse-papier !';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleTrade = () => {
    // Redirection vers Pocket Option
    window.open('https://po.trade', '_blank');
    
    // Notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Redirection vers Pocket Option...';
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const handleMarkResult = (result: 'WON' | 'LOST') => {
    const profitLoss = result === 'WON' ? 50 + Math.random() * 100 : -(20 + Math.random() * 50);
    const resultPrice = signal.entry_price + (Math.random() - 0.5) * 0.01;
    
    updateSignalStatus(signal.id, result, { result_price: resultPrice, profit_loss: profitLoss });
    
    // Notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${result === 'WON' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
    notification.textContent = `Signal marqué comme ${result === 'WON' ? 'gagné' : 'perdu'} !`;
    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  };

  const getRiskLevel = () => {
    if (signal.confidence >= 90) return { level: 'Faible', color: 'text-green-500', bg: 'bg-green-100' };
    if (signal.confidence >= 75) return { level: 'Moyen', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { level: 'Élevé', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const risk = getRiskLevel();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-xl shadow-lg border-l-4 p-6 cursor-pointer transition-all ${
          signal.direction === 'CALL' ? 'border-l-green-500' : 'border-l-red-500'
        } ${isExpiring ? 'ring-2 ring-orange-500 ring-opacity-50' : ''}`}
        onClick={() => setShowDetails(true)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              signal.direction === 'CALL' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {signal.direction === 'CALL' ? 
                <TrendingUp className={`w-5 h-5 ${signal.direction === 'CALL' ? 'text-green-600' : 'text-red-600'}`} /> :
                <TrendingDown className={`w-5 h-5 ${signal.direction === 'CALL' ? 'text-green-600' : 'text-red-600'}`} />
              }
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{signal.pair}</h3>
              <p className="text-sm text-gray-600">{signal.direction}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`p-1 rounded ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              signal.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
              signal.status === 'WON' ? 'bg-green-100 text-green-800' :
              signal.status === 'LOST' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {signal.status}
            </span>
          </div>
        </div>

        {/* Confiance et temps */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Confiance</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    signal.confidence >= 90 ? 'bg-green-500' :
                    signal.confidence >= 75 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${signal.confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium">{signal.confidence}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {signal.status === 'ACTIVE' ? 'Temps restant' : 'Expiration'}
            </p>
            <div className="flex items-center space-x-1">
              <Clock className={`w-4 h-4 ${isExpiring ? 'text-orange-500' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${isExpiring ? 'text-orange-500' : 'text-gray-900'}`}>
                {signal.status === 'ACTIVE' ? formatTime(timeLeft) : `${signal.expiration}min`}
              </span>
            </div>
          </div>
        </div>

        {/* Prix et résultat */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Prix d'entrée</p>
            <p className="font-medium text-gray-900">{signal.entry_price.toFixed(4)}</p>
          </div>
          
          {signal.result_price && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Prix de sortie</p>
              <p className="font-medium text-gray-900">{signal.result_price.toFixed(4)}</p>
            </div>
          )}
        </div>

        {/* Profit/Perte */}
        {signal.profit_loss && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Résultat</p>
            <p className={`font-bold ${signal.profit_loss > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {signal.profit_loss > 0 ? '+' : ''}${signal.profit_loss.toFixed(2)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopySignal();
            }}
            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
          >
            <Copy className="w-4 h-4" />
            <span>Copier</span>
          </button>
          
          {signal.status === 'ACTIVE' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrade();
                }}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Trader</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkResult('WON');
                }}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkResult('LOST');
                }}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Modal de détails */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Détails du Signal</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    signal.direction === 'CALL' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {signal.direction === 'CALL' ? 
                      <TrendingUp className="w-6 h-6 text-green-600" /> :
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{signal.pair}</h3>
                    <p className="text-sm text-gray-600">{signal.direction}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-1">Confiance</p>
                    <p className="text-lg font-bold text-blue-900">{signal.confidence}%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 mb-1">Expiration</p>
                    <p className="text-lg font-bold text-purple-900">{signal.expiration}min</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Prix d'entrée</p>
                  <p className="text-lg font-bold text-gray-900">{signal.entry_price.toFixed(4)}</p>
                </div>

                <div className={`p-3 rounded-lg ${risk.bg}`}>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-4 h-4 ${risk.color}`} />
                    <p className="text-sm font-medium">Niveau de risque: <span className={risk.color}>{risk.level}</span></p>
                  </div>
                </div>

                {signal.result_price && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Prix de sortie</p>
                    <p className="text-lg font-bold text-gray-900">{signal.result_price.toFixed(4)}</p>
                  </div>
                )}

                {signal.profit_loss && (
                  <div className={`p-3 rounded-lg ${signal.profit_loss > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className={`text-sm mb-1 ${signal.profit_loss > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Résultat
                    </p>
                    <p className={`text-lg font-bold ${signal.profit_loss > 0 ? 'text-green-900' : 'text-red-900'}`}>
                      {signal.profit_loss > 0 ? '+' : ''}${signal.profit_loss.toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Timestamp</p>
                  <p className="text-sm font-medium text-gray-900">
                    {signal.timestamp.toLocaleString('fr-FR')}
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleCopySignal}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copier Signal</span>
                  </button>
                  
                  {signal.status === 'ACTIVE' && (
                    <button
                      onClick={handleTrade}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Trader</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}