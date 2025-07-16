'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Candlestick {
  id: string;
  x: number;
  y: number;
  open: number;
  high: number;
  low: number;
  close: number;
  isGreen: boolean;
  size: 'small' | 'medium' | 'large';
}

export function CandlestickAnimation() {
  const [candlesticks, setCandlesticks] = useState<Candlestick[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Générer une nouvelle bougie
      const newCandlestick: Candlestick = {
        id: `candle_${Date.now()}_${Math.random()}`,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        open: 1.0800 + (Math.random() - 0.5) * 0.01,
        high: 1.0800 + Math.random() * 0.005,
        low: 1.0800 - Math.random() * 0.005,
        close: 1.0800 + (Math.random() - 0.5) * 0.01,
        isGreen: Math.random() > 0.5,
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large'
      };

      setCandlesticks(prev => [...prev, newCandlestick].slice(-20)); // Garder seulement 20 bougies
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSizeMultiplier = (size: string) => {
    switch (size) {
      case 'small': return 0.6;
      case 'medium': return 1;
      case 'large': return 1.4;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {candlesticks.map((candle) => {
          const sizeMultiplier = getSizeMultiplier(candle.size);
          const bodyHeight = Math.abs(candle.close - candle.open) * 10000 * sizeMultiplier;
          const wickTop = (candle.high - Math.max(candle.open, candle.close)) * 10000 * sizeMultiplier;
          const wickBottom = (Math.min(candle.open, candle.close) - candle.low) * 10000 * sizeMultiplier;
          
          return (
            <motion.div
              key={candle.id}
              initial={{ opacity: 0, scale: 0, y: candle.y + 100 }}
              animate={{ 
                opacity: 0.3, 
                scale: 1, 
                y: candle.y,
                x: candle.x
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.5, 
                y: candle.y - 100 
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                left: candle.x,
                top: candle.y,
              }}
            >
              {/* Mèche supérieure */}
              <div
                className="w-0.5 bg-gray-400 dark:bg-gray-500 mx-auto"
                style={{ height: `${wickTop}px` }}
              />
              
              {/* Corps de la bougie */}
              <div
                className={`w-3 border ${
                  candle.isGreen 
                    ? 'bg-green-500 border-green-600' 
                    : 'bg-red-500 border-red-600'
                }`}
                style={{ 
                  height: `${Math.max(bodyHeight, 2)}px`,
                  transform: `scale(${sizeMultiplier})`
                }}
              />
              
              {/* Mèche inférieure */}
              <div
                className="w-0.5 bg-gray-400 dark:bg-gray-500 mx-auto"
                style={{ height: `${wickBottom}px` }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}