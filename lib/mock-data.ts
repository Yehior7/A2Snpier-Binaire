export interface Signal {
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

export interface PerformanceData {
  date: string;
  winRate: number;
  totalTrades: number;
  profit: number;
}

export interface UserStats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  todaySignals: number;
  performance: number;
}

export const mockSignals: Signal[] = [
  {
    id: '1',
    pair: 'EUR/USD',
    direction: 'CALL',
    confidence: 92,
    entry_price: 1.0825,
    expiration: 5,
    status: 'WON',
    timestamp: new Date(Date.now() - 300000),
    result_price: 1.0837,
    profit_loss: 45.60
  },
  {
    id: '2',
    pair: 'GBP/USD',
    direction: 'PUT',
    confidence: 89,
    entry_price: 1.2456,
    expiration: 3,
    status: 'WON',
    timestamp: new Date(Date.now() - 180000),
    result_price: 1.2441,
    profit_loss: 38.20
  },
  {
    id: '3',
    pair: 'USD/JPY',
    direction: 'CALL',
    confidence: 87,
    entry_price: 149.25,
    expiration: 5,
    status: 'ACTIVE',
    timestamp: new Date(),
  },
  {
    id: '4',
    pair: 'AUD/USD',
    direction: 'PUT',
    confidence: 94,
    entry_price: 0.6789,
    expiration: 4,
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '5',
    pair: 'USD/CHF',
    direction: 'CALL',
    confidence: 85,
    entry_price: 0.9145,
    expiration: 3,
    status: 'LOST',
    timestamp: new Date(Date.now() - 600000),
    result_price: 0.9132,
    profit_loss: -25.30
  },
  {
    id: '6',
    pair: 'EUR/GBP',
    direction: 'PUT',
    confidence: 91,
    entry_price: 0.8654,
    expiration: 5,
    status: 'WON',
    timestamp: new Date(Date.now() - 900000),
    result_price: 0.8641,
    profit_loss: 52.10
  },
  // Ajout de signaux supplémentaires pour enrichir les données
  {
    id: '7',
    pair: 'BTC/USD',
    direction: 'CALL',
    confidence: 88,
    entry_price: 43250.00,
    expiration: 5,
    status: 'WON',
    timestamp: new Date(Date.now() - 1200000),
    result_price: 43380.00,
    profit_loss: 67.50
  },
  {
    id: '8',
    pair: 'ETH/USD',
    direction: 'PUT',
    confidence: 86,
    entry_price: 2650.00,
    expiration: 3,
    status: 'LOST',
    timestamp: new Date(Date.now() - 1500000),
    result_price: 2675.00,
    profit_loss: -32.80
  },
  {
    id: '9',
    pair: 'USD/CAD',
    direction: 'CALL',
    confidence: 90,
    entry_price: 1.3456,
    expiration: 4,
    status: 'WON',
    timestamp: new Date(Date.now() - 1800000),
    result_price: 1.3478,
    profit_loss: 41.20
  },
  {
    id: '10',
    pair: 'NZD/USD',
    direction: 'PUT',
    confidence: 83,
    entry_price: 0.6234,
    expiration: 5,
    status: 'ACTIVE',
    timestamp: new Date(Date.now() - 120000),
  }
];

export const mockPerformanceData: PerformanceData[] = [
  { date: '2024-01-01', winRate: 88, totalTrades: 25, profit: 450 },
  { date: '2024-01-02', winRate: 91, totalTrades: 32, profit: 678 },
  { date: '2024-01-03', winRate: 85, totalTrades: 28, profit: 523 },
  { date: '2024-01-04', winRate: 93, totalTrades: 35, profit: 789 },
  { date: '2024-01-05', winRate: 87, totalTrades: 29, profit: 612 },
  { date: '2024-01-06', winRate: 90, totalTrades: 33, profit: 701 },
  { date: '2024-01-07', winRate: 92, totalTrades: 38, profit: 856 }
];

export const mockUserStats: UserStats = {
  totalTrades: 1247,
  winRate: 90,
  totalProfit: 2847,
  todaySignals: 47,
  performance: 15.3
};

export const tradingPairs = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'forex' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex' },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'forex' },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto' }
];

export const pricingPlans = [
  {
    name: 'Standard',
    price: 198,
    quarterly: 178, // -10%
    annual: 159, // -20%
    features: [
      'Jusqu\'à 50 signaux/jour',
      'Indicateurs techniques de base',
      'Support par email',
      'Historique 30 jours',
      'Accès au bot Telegram'
    ],
    brokers: ['Pocket Option', 'Quotex'],
    assets: ['Forex (6 paires)', 'Indices (2)'],
    support: 'Email (24h)',
    api_access: false
  },
  {
    name: 'Premium',
    price: 298,
    quarterly: 268, // -10%
    annual: 238, // -20%
    features: [
      'Signaux illimités',
      'Dashboard web complet',
      'Indicateurs avancés',
      'Historique 90 jours',
      'Support chat en direct',
      'Notifications push'
    ],
    popular: true,
    brokers: ['Pocket Option', 'Quotex', 'IQ Option', 'Deriv'],
    assets: ['Forex (12 paires)', 'Indices (5)', 'Crypto (3)'],
    support: 'Chat en direct',
    api_access: false
  },
  {
    name: 'Professional',
    price: 398,
    quarterly: 358, // -10%
    annual: 318, // -20%
    features: [
      'Toutes les fonctionnalités Premium',
      'Accès API complet',
      'Backtesting avancé',
      'Coaching personnalisé',
      'Historique illimité',
      'Signaux multi-timeframes'
    ],
    brokers: ['Tous les courtiers supportés'],
    assets: ['Tous les actifs disponibles'],
    support: 'Support prioritaire + Coaching',
    api_access: true
  }
];

// Courtiers supportés selon le cahier des charges
export const supportedBrokers = [
  {
    name: 'Pocket Option',
    url: 'https://po.trade',
    logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50',
    rating: 4.5,
    features: ['Options binaires', 'Forex', 'Crypto'],
    min_deposit: 50
  },
  {
    name: 'Quotex',
    url: 'https://qxbroker.com',
    logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50',
    rating: 4.3,
    features: ['Options binaires', 'Trading digital'],
    min_deposit: 10
  },
  {
    name: 'IQ Option',
    url: 'https://iqoption.com',
    logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50',
    rating: 4.2,
    features: ['Options binaires', 'Forex', 'CFD'],
    min_deposit: 10
  },
  {
    name: 'Deriv',
    url: 'https://deriv.com',
    logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50',
    rating: 4.1,
    features: ['Options binaires', 'CFD', 'Multipliers'],
    min_deposit: 5
  },
  {
    name: 'Nadex',
    url: 'https://nadex.com',
    logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50',
    rating: 4.0,
    features: ['Options binaires US', 'Spreads'],
    min_deposit: 250
  },
  {
    name: 'Olymp Trade',
    url: 'https://olymptrade.com',
    logo: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=50',
    rating: 3.9,
    features: ['Options binaires', 'Forex'],
    min_deposit: 10
  }
];

// Types d'actifs supportés
export const supportedAssets = {
  forex: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF', 'EUR/GBP',
    'USD/CAD', 'NZD/USD', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CHF/JPY'
  ],
  indices: [
    'S&P 500', 'DAX 30', 'FTSE 100', 'Nikkei 225', 'Nasdaq 100'
  ],
  commodities: [
    'Gold (XAU/USD)', 'Silver (XAG/USD)', 'Oil (WTI)', 'Oil (Brent)'
  ],
  crypto: [
    'Bitcoin (BTC/USD)', 'Ethereum (ETH/USD)', 'Litecoin (LTC/USD)'
  ]
};

// Métriques de performance selon le cahier des charges
export const performanceMetrics = {
  accuracy: 90, // 90% de précision
  verified_success_rate: 97.8, // Taux vérifié
  signals_per_day: { min: 30, max: 80 }, // 30-80 signaux/jour
  execution_time: 40, // < 40 secondes
  profit_loss_ratio: 1.8, // Ratio 1.8:1
  uptime: 99.9, // 99.9% de disponibilité
  response_time: 200 // < 200ms API
};

// Nouvelles données selon spécifications du document
export const technicalIndicatorsConfig = {
  RSI: { period: 14, oversold: 30, overbought: 70 },
  MACD: { fast: 12, slow: 26, signal: 9 },
  BollingerBands: { period: 20, stdDev: 2 },
  EMA: { periods: [9, 21] },
  ADX: { period: 14, threshold: 25 },
  Volume: { threshold: 1.5 } // 1.5x moyenne
};

// Modèles d'apprentissage automatique selon spécifications
export const mlModelsConfig = {
  RandomForest: {
    type: 'classification',
    target: 'Call vs Put',
    validation: 'k-fold cross-validation',
    features: ['price_momentum', 'volume_ratio', 'volatility', 'technical_indicators']
  },
  XGBoost: {
    type: 'gradient_boosting',
    target: 'success_probability',
    optimization: 'probability_refinement'
  },
  LSTM: {
    type: 'recurrent_neural_network',
    target: 'temporal_dynamics',
    features: ['time_series_correlations', 'long_term_patterns']
  }
};

// Configuration de génération et diffusion des signaux
export const signalConfig = {
  frequency: {
    calculation: '1_minute', // Calcul toutes les minutes
    diffusion: 'instantaneous' // Diffusion instantanée
  },
  format: '[HH:MM:SS] – Actif: [EUR/USD] – Direction: [Call/Put] – Expiration: [1–5 min] – Confiance: [85%]',
  scoring: {
    confidence_based: true,
    model_ensemble: true,
    user_adjustable_thresholds: true
  },
  filtering: {
    minimum_threshold: true,
    profit_loss_ratio_priority: true
  }
};

// Interface Telegram selon spécifications
export const telegramInterface = {
  commands: {
    '/start': 'onboarding_and_authentication',
    '/signals': 'latest_received_signals',
    '/performance': 'success_statistics_ratio_history',
    '/settings': 'assets_timeframes_confidence_thresholds',
    '/help': 'usage_guide'
  },
  user_management: {
    authentication_tokens: true,
    two_step_validation: true,
    subscription_plan_ACL: true
  }
};

// Dashboards web selon spécifications
export const webDashboards = {
  main_dashboard: {
    chronological_signals_view: true,
    cumulative_performance_charts: true
  },
  reports: {
    csv_pdf_export: true,
    custom_backtesting: true,
    portfolio_simulation: true
  },
  dynamic_filters: {
    by_asset: true,
    by_period: true,
    by_confidence_score: true,
    by_broker: true
  }
};

// Support du risque et backtesting selon spécifications
export const riskAndBacktesting = {
  risk_management: {
    stop_loss_take_profit_settings: true,
    optimal_position_size_kelly_formula: true
  },
  backtesting: {
    historical_data_years: 5,
    performance_report_generation: true,
    continuous_learning_periodic_retraining: true
  }
};