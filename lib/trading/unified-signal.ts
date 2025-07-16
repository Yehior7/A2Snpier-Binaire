// Types et interfaces pour les signaux unifiés
export interface UnifiedSignal {
  id: string;
  timestamp: Date;
  platform: 'OANDA' | 'DERIV';
  
  // Informations du signal
  instrument: string;
  symbol_display: string;
  action: 'BUY' | 'SELL';
  
  // Prix et niveaux
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  
  // Gestion de position
  position_size: number;
  risk_percentage: number;
  
  // Métriques
  confidence: number;
  risk_reward_ratio: number;
  expected_pips: number;
  
  // Analyse technique
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  technical_analysis: {
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
    support_resistance: {
      support: number;
      resistance: number;
    };
    trend_direction: 'UP' | 'DOWN' | 'SIDEWAYS';
  };
  
  // Spécifique à la plateforme
  platform_specific: {
    oanda?: {
      lot_size: number;
      swap_rates: number;
      pip_value: number;
    };
    deriv?: {
      leverage: number;
      margin_required: number;
      trade_type: 'cfd' | 'forex' | 'commodities' | 'synthetic';
      contract_size: number;
    };
  };
}

export interface TechnicalAnalysis {
  symbol: string;
  currentPrice: number;
  trend_direction: 'UP' | 'DOWN' | 'SIDEWAYS';
  primaryTimeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  indicators: UnifiedSignal['technical_analysis'];
  volume: number;
  volatility: number;
}

export interface Account {
  id: string;
  platform: 'OANDA' | 'DERIV';
  balance: number;
  currency: string;
  equity: number;
  margin_used: number;
  margin_available: number;
  unrealized_pnl: number;
  is_demo: boolean;
}

export interface TradeValidation {
  canTrade: boolean;
  riskChecks: RiskCheck[];
  recommendedSize: number;
  warnings: string[];
}

export interface RiskCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export class UnifiedSignalGenerator {
  private oandaClient: any;
  private derivClient: any;

  constructor(oandaClient: any, derivClient: any) {
    this.oandaClient = oandaClient;
    this.derivClient = derivClient;
  }

  async generateSignal(symbol: string, platforms: ('OANDA' | 'DERIV')[]): Promise<UnifiedSignal[]> {
    const analysis = await this.analyzeInstrument(symbol);
    const signals: UnifiedSignal[] = [];
    
    for (const platform of platforms) {
      const signal = await this.createSignalForPlatform(analysis, platform);
      if (signal) {
        signals.push(signal);
      }
    }
    
    return signals;
  }

  private async analyzeInstrument(symbol: string): Promise<TechnicalAnalysis> {
    // Simulation d'analyse technique - en production, utiliser des données réelles
    const currentPrice = 1.0800 + (Math.random() - 0.5) * 0.01;
    const volatility = 0.001 + Math.random() * 0.002;
    
    const rsi = 30 + Math.random() * 40; // RSI entre 30 et 70
    const macdValue = (Math.random() - 0.5) * 0.001;
    const signalValue = macdValue * 0.8;
    const histogram = macdValue - signalValue;
    
    const support = currentPrice - volatility * 2;
    const resistance = currentPrice + volatility * 2;
    
    const trendDirection: 'UP' | 'DOWN' | 'SIDEWAYS' = 
      rsi > 60 ? 'UP' : rsi < 40 ? 'DOWN' : 'SIDEWAYS';

    return {
      symbol,
      currentPrice,
      trend_direction: trendDirection,
      primaryTimeframe: '15m',
      indicators: {
        rsi,
        macd: {
          macd: macdValue,
          signal: signalValue,
          histogram
        },
        bollinger: {
          upper: currentPrice + volatility,
          middle: currentPrice,
          lower: currentPrice - volatility
        },
        support_resistance: {
          support,
          resistance
        },
        trend_direction: trendDirection
      },
      volume: 1000000 + Math.random() * 500000,
      volatility
    };
  }

  private async createSignalForPlatform(
    analysis: TechnicalAnalysis, 
    platform: 'OANDA' | 'DERIV'
  ): Promise<UnifiedSignal | null> {
    const baseSignal = this.createBaseSignal(analysis);
    
    if (platform === 'OANDA') {
      return {
        ...baseSignal,
        platform: 'OANDA',
        instrument: this.formatOandaSymbol(analysis.symbol),
        position_size: this.calculateOandaUnits(baseSignal),
        platform_specific: {
          oanda: {
            lot_size: this.calculateLotSize(baseSignal.position_size),
            swap_rates: await this.getOandaSwapRates(analysis.symbol),
            pip_value: this.calculatePipValue(analysis.symbol, baseSignal.position_size)
          }
        }
      };
    } else {
      const tradeType = this.getDerivTradeType(analysis.symbol);
      return {
        ...baseSignal,
        platform: 'DERIV',
        instrument: this.formatDerivSymbol(analysis.symbol, tradeType),
        position_size: this.calculateDerivAmount(baseSignal),
        platform_specific: {
          deriv: {
            leverage: this.getDerivLeverage(analysis.symbol),
            margin_required: this.calculateMarginRequired(baseSignal),
            trade_type: tradeType,
            contract_size: 100000 // Standard pour Forex
          }
        }
      };
    }
  }

  private createBaseSignal(analysis: TechnicalAnalysis): Omit<UnifiedSignal, 'platform' | 'instrument' | 'position_size' | 'platform_specific'> {
    const entry = analysis.currentPrice;
    const stopLoss = this.calculateStopLoss(analysis);
    const takeProfit = this.calculateTakeProfit(analysis);
    
    return {
      id: this.generateId(),
      timestamp: new Date(),
      symbol_display: this.formatDisplaySymbol(analysis.symbol),
      action: analysis.trend_direction === 'UP' ? 'BUY' : 'SELL',
      entry_price: entry,
      stop_loss: stopLoss,
      take_profit: takeProfit,
      risk_percentage: 2,
      confidence: this.calculateConfidence(analysis),
      risk_reward_ratio: Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss),
      expected_pips: this.calculatePips(entry, takeProfit),
      timeframe: analysis.primaryTimeframe,
      technical_analysis: analysis.indicators
    };
  }

  private calculateStopLoss(analysis: TechnicalAnalysis): number {
    const atr = analysis.volatility * 2; // ATR simplifié
    return analysis.trend_direction === 'UP' 
      ? analysis.currentPrice - atr 
      : analysis.currentPrice + atr;
  }

  private calculateTakeProfit(analysis: TechnicalAnalysis): number {
    const atr = analysis.volatility * 2;
    return analysis.trend_direction === 'UP' 
      ? analysis.currentPrice + (atr * 1.5) 
      : analysis.currentPrice - (atr * 1.5);
  }

  private calculateConfidence(analysis: TechnicalAnalysis): number {
    let confidence = 50;
    
    // Facteurs d'analyse technique
    if (analysis.indicators.rsi < 30 && analysis.trend_direction === 'UP') confidence += 15;
    if (analysis.indicators.rsi > 70 && analysis.trend_direction === 'DOWN') confidence += 15;
    
    if (analysis.indicators.macd.histogram > 0 && analysis.trend_direction === 'UP') confidence += 10;
    if (analysis.indicators.macd.histogram < 0 && analysis.trend_direction === 'DOWN') confidence += 10;
    
    if (analysis.trend_direction !== 'SIDEWAYS') confidence += 10;
    
    if (analysis.volume > 1200000) confidence += 5; // Volume élevé
    
    return Math.min(95, Math.max(60, confidence));
  }

  private calculatePips(entry: number, target: number): number {
    return Math.abs(target - entry) * 10000; // Pour les paires majeures
  }

  private formatOandaSymbol(symbol: string): string {
    return symbol.replace('/', '_');
  }

  private formatDerivSymbol(symbol: string, tradeType: 'cfd' | 'forex' | 'commodities' | 'synthetic'): string {
    switch (tradeType) {
      case 'forex':
        return `frx${symbol.replace('/', '')}`;
      default:
        return symbol;
    }
  }

  private formatDisplaySymbol(symbol: string): string {
    return symbol;
  }

  private calculateOandaUnits(signal: any): number {
    // Calcul basé sur le risque de 2% du capital
    const accountBalance = 10000; // À récupérer du compte réel
    const riskAmount = accountBalance * (signal.risk_percentage / 100);
    const stopLossDistance = Math.abs(signal.entry_price - signal.stop_loss);
    const pipValue = 1; // À calculer selon la paire
    
    return Math.floor(riskAmount / (stopLossDistance * pipValue));
  }

  private calculateDerivAmount(signal: any): number {
    const accountBalance = 10000; // À récupérer du compte réel
    return accountBalance * (signal.risk_percentage / 100);
  }

  private calculateLotSize(units: number): number {
    return units / 100000; // Standard lot = 100,000 unités
  }

  private async getOandaSwapRates(symbol: string): Promise<number> {
    // Simulation - en production, récupérer les vrais taux de swap
    return Math.random() * 0.5 - 0.25;
  }

  private getDerivLeverage(symbol: string): number {
    // Leverage par défaut selon le type d'actif
    if (symbol.includes('USD') || symbol.includes('EUR')) return 30; // Forex
    return 10; // Autres actifs
  }

  private calculateMarginRequired(signal: any): number {
    return signal.position_size / 30; // Leverage 30:1 par défaut
  }

  private getDerivTradeType(symbol: string): 'cfd' | 'forex' | 'commodities' | 'synthetic' {
    if (symbol.includes('/')) return 'forex';
    if (symbol.includes('OIL') || symbol.includes('GOLD')) return 'commodities';
    if (symbol.startsWith('R_')) return 'synthetic';
    return 'cfd';
  }

  private generateId(): string {
    return `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}