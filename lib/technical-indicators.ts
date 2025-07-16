// Indicateurs techniques pour l'analyse de marché
export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  ema: {
    ema9: number;
    ema21: number;
  };
  adx: number;
  volume_sma: number;
  stochastic: {
    k: number;
    d: number;
  };
}

export interface MarketData {
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  bid: number;
  ask: number;
  spread: number;
}

export class TechnicalAnalysis {
  // Calcul RSI (Relative Strength Index)
  static calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // Calcul MACD (Moving Average Convergence Divergence)
  static calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    const emaFast = this.calculateEMA(prices, fastPeriod);
    const emaSlow = this.calculateEMA(prices, slowPeriod);
    const macd = emaFast - emaSlow;
    
    // Calcul de la ligne de signal (EMA du MACD)
    const macdHistory = [macd]; // Simplifié pour la démo
    const signal = this.calculateEMA(macdHistory, signalPeriod);
    const histogram = macd - signal;
    
    return { macd, signal, histogram };
  }

  // Calcul EMA (Exponential Moving Average)
  static calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  // Calcul Bollinger Bands
  static calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
    const sma = prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
    
    const variance = prices.slice(-period).reduce((sum, price) => {
      return sum + Math.pow(price - sma, 2);
    }, 0) / period;
    
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  // Calcul ADX (Average Directional Index)
  static calculateADX(highs: number[], lows: number[], closes: number[], period: number = 14): number {
    if (highs.length < period + 1) return 25;
    
    // Calcul simplifié pour la démo
    let trueRanges = [];
    let plusDMs = [];
    let minusDMs = [];
    
    for (let i = 1; i < highs.length; i++) {
      const tr = Math.max(
        highs[i] - lows[i],
        Math.abs(highs[i] - closes[i - 1]),
        Math.abs(lows[i] - closes[i - 1])
      );
      trueRanges.push(tr);
      
      const plusDM = highs[i] - highs[i - 1] > lows[i - 1] - lows[i] ? 
        Math.max(highs[i] - highs[i - 1], 0) : 0;
      const minusDM = lows[i - 1] - lows[i] > highs[i] - highs[i - 1] ? 
        Math.max(lows[i - 1] - lows[i], 0) : 0;
      
      plusDMs.push(plusDM);
      minusDMs.push(minusDM);
    }
    
    // Calcul des moyennes mobiles
    const avgTR = trueRanges.slice(-period).reduce((sum, tr) => sum + tr, 0) / period;
    const avgPlusDM = plusDMs.slice(-period).reduce((sum, dm) => sum + dm, 0) / period;
    const avgMinusDM = minusDMs.slice(-period).reduce((sum, dm) => sum + dm, 0) / period;
    
    const plusDI = (avgPlusDM / avgTR) * 100;
    const minusDI = (avgMinusDM / avgTR) * 100;
    
    const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100;
    
    return dx; // Simplifié, normalement on calcule la moyenne mobile du DX
  }

  // Calcul Stochastic
  static calculateStochastic(highs: number[], lows: number[], closes: number[], kPeriod: number = 14, dPeriod: number = 3) {
    if (closes.length < kPeriod) return { k: 50, d: 50 };
    
    const recentHighs = highs.slice(-kPeriod);
    const recentLows = lows.slice(-kPeriod);
    const currentClose = closes[closes.length - 1];
    
    const highestHigh = Math.max(...recentHighs);
    const lowestLow = Math.min(...recentLows);
    
    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    
    // Calcul de %D (moyenne mobile de %K)
    const kValues = [k]; // Simplifié pour la démo
    const d = kValues.slice(-dPeriod).reduce((sum, val) => sum + val, 0) / Math.min(dPeriod, kValues.length);
    
    return { k, d };
  }

  // Analyse complète des indicateurs techniques
  static analyzeMarket(marketData: MarketData[]): TechnicalIndicators {
    const closes = marketData.map(d => d.close);
    const highs = marketData.map(d => d.high);
    const lows = marketData.map(d => d.low);
    const volumes = marketData.map(d => d.volume);
    
    return {
      rsi: this.calculateRSI(closes),
      macd: this.calculateMACD(closes),
      bollinger: this.calculateBollingerBands(closes),
      ema: {
        ema9: this.calculateEMA(closes, 9),
        ema21: this.calculateEMA(closes, 21)
      },
      adx: this.calculateADX(highs, lows, closes),
      volume_sma: volumes.slice(-20).reduce((sum, vol) => sum + vol, 0) / 20,
      stochastic: this.calculateStochastic(highs, lows, closes)
    };
  }
}