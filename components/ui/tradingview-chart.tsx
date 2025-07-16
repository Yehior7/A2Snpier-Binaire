'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TradingViewChartProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TradingViewChart({ symbol, isOpen, onClose }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Simulation d'un graphique TradingView
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `FX:${symbol.replace('/', '')}`,
        interval: "1",
        timezone: "Europe/Paris",
        theme: "dark",
        style: "1",
        locale: "fr",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: "tradingview_chart"
      });

      // Nettoyage du conteneur
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(script);
      }
    }
  }, [isOpen, symbol]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${
            isFullscreen ? 'w-full h-full' : 'w-full max-w-6xl h-[80vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {symbol.split('/')[0]}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {symbol}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Graphique en temps réel
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="flex-1 p-4">
            <div 
              ref={containerRef}
              id="tradingview_chart"
              className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center"
            >
              {/* Simulation d'un graphique */}
              <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-lg">
                {/* Grille */}
                <div className="absolute inset-0">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={`h-${i}`}
                      className="absolute w-full border-t border-gray-700/30"
                      style={{ top: `${i * 10}%` }}
                    />
                  ))}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={`v-${i}`}
                      className="absolute h-full border-l border-gray-700/30"
                      style={{ left: `${i * 10}%` }}
                    />
                  ))}
                </div>

                {/* Simulation de bougies */}
                <div className="absolute inset-0 p-4">
                  <svg className="w-full h-full">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const x = (i / 50) * 100;
                      const basePrice = 50 + Math.sin(i * 0.1) * 20;
                      const open = basePrice + (Math.random() - 0.5) * 10;
                      const close = basePrice + (Math.random() - 0.5) * 10;
                      const high = Math.max(open, close) + Math.random() * 5;
                      const low = Math.min(open, close) - Math.random() * 5;
                      const isGreen = close > open;

                      return (
                        <g key={i}>
                          {/* Mèche */}
                          <line
                            x1={`${x}%`}
                            y1={`${100 - high}%`}
                            x2={`${x}%`}
                            y2={`${100 - low}%`}
                            stroke={isGreen ? '#10b981' : '#ef4444'}
                            strokeWidth="1"
                          />
                          {/* Corps */}
                          <rect
                            x={`${x - 0.5}%`}
                            y={`${100 - Math.max(open, close)}%`}
                            width="1%"
                            height={`${Math.abs(close - open)}%`}
                            fill={isGreen ? '#10b981' : '#ef4444'}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Prix actuel */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-white">
                    <div className="text-2xl font-bold">1.0825</div>
                    <div className="text-green-400 text-sm">+0.0012 (+0.11%)</div>
                  </div>
                </div>

                {/* Indicateurs */}
                <div className="absolute bottom-4 left-4 flex space-x-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-white text-xs">RSI: 67.3</div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2">
                    <div className="text-white text-xs">MACD: 0.0023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}