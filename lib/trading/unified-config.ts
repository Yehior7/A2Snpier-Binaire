// Configuration unifiée pour OANDA et Deriv
export const unifiedConfig = {
  platforms: {
    oanda: {
      apiUrl: process.env.NEXT_PUBLIC_OANDA_API_URL || 'https://api-fxpractice.oanda.com',
      token: process.env.OANDA_API_TOKEN || '',
      accountId: process.env.OANDA_ACCOUNT_ID || '',
      environment: (process.env.OANDA_ENV as 'practice' | 'live') || 'practice',
      maxPositions: 10,
      supportedInstruments: [
        'EUR_USD', 'GBP_USD', 'USD_JPY', 'AUD_USD', 'USD_CHF', 'EUR_GBP',
        'USD_CAD', 'NZD_USD', 'EUR_JPY', 'GBP_JPY', 'AUD_JPY', 'CHF_JPY',
        'XAU_USD', 'XAG_USD', 'US30_USD', 'SPX500_USD', 'NAS100_USD'
      ]
    },
    deriv: {
      apiUrl: 'wss://ws.binaryws.com/websockets/v3',
      appId: process.env.NEXT_PUBLIC_DERIV_APP_ID || '1089',
      apiToken: process.env.DERIV_API_TOKEN || '',
      environment: (process.env.DERIV_ENV as 'demo' | 'real') || 'demo',
      supportedAssets: {
        forex: ['frxEURUSD', 'frxGBPUSD', 'frxUSDJPY', 'frxAUDUSD', 'frxUSDCHF'],
        commodities: ['XAUUSD', 'XAGUSD', 'OILUSD'],
        indices: ['US30', 'SPX500', 'NAS100', 'UK100', 'GER40'],
        synthetic: ['R_10', 'R_25', 'R_50', 'R_75', 'R_100']
      }
    }
  },
  
  riskManagement: {
    maxRiskPerTrade: 2, // 2% par trade
    maxDailyRisk: 10, // 10% par jour
    maxDrawdown: 15, // 15% de drawdown maximum
    stopTradingOnDrawdown: true,
    maxConcurrentTrades: 5,
    minConfidenceLevel: 75
  },
  
  signals: {
    minConfidence: 75, // Minimum 75% de confiance
    maxSignalsPerDay: 20,
    supportedTimeframes: ['1m', '5m', '15m', '1h', '4h', '1d'] as const,
    technicalIndicators: {
      RSI: { period: 14, oversold: 30, overbought: 70 },
      MACD: { fast: 12, slow: 26, signal: 9 },
      BollingerBands: { period: 20, stdDev: 2 },
      EMA: { periods: [9, 21] },
      ADX: { period: 14, threshold: 25 }
    }
  },
  
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || '',
    allowedUsers: process.env.TELEGRAM_ALLOWED_USERS?.split(',') || [],
    commands: {
      '/start': 'Démarrer le bot',
      '/help': 'Aide et commandes',
      '/status': 'Statut de tous les comptes',
      '/settings': 'Paramètres généraux',
      '/connect_oanda': 'Connecter compte OANDA',
      '/connect_deriv': 'Connecter compte Deriv',
      '/accounts': 'Voir tous les comptes',
      '/balance': 'Solde de tous les comptes',
      '/signals': 'Signaux actifs',
      '/trades': 'Trades en cours',
      '/history': 'Historique des trades',
      '/performance': 'Performance globale',
      '/risk_settings': 'Paramètres de risque',
      '/pause_trading': 'Mettre en pause le trading',
      '/resume_trading': 'Reprendre le trading'
    }
  },
  
  monitoring: {
    healthCheckInterval: 30000, // 30 secondes
    alertThresholds: {
      drawdown: 0.10, // 10%
      dailyLoss: 0.05, // 5%
      apiResponseTime: 5000, // 5 secondes
      consecutiveLosses: 5
    },
    notifications: {
      email: process.env.NOTIFICATION_EMAIL || '',
      webhook: process.env.NOTIFICATION_WEBHOOK || '',
      telegram: true
    }
  },
  
  database: {
    url: process.env.DATABASE_URL || '',
    redis: {
      url: process.env.REDIS_URL || '',
      ttl: 3600 // 1 heure
    }
  },
  
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
    apiRateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limite de 100 requêtes par fenêtre
    },
    twoFactorAuth: {
      enabled: true,
      issuer: 'A2Sniper Binaire'
    }
  },
  
  legal: {
    disclaimer: `
⚠️ AVERTISSEMENT SUR LES RISQUES

Le trading de devises, CFDs et instruments financiers comporte un risque élevé de perte. 
Les performances passées ne garantissent pas les résultats futurs.

• Vous pourriez perdre tout votre capital investi
• L'effet de levier augmente les gains potentiels mais aussi les pertes
• Assurez-vous de comprendre les risques avant de trader
• Ne tradez qu'avec de l'argent que vous pouvez vous permettre de perdre

A2Sniper Binaire fournit des signaux à titre informatif uniquement. 
Les décisions de trading relèvent entièrement de votre responsabilité.

Plateformes supportées: OANDA et Deriv sont des marques déposées de leurs propriétaires respectifs.
`,
    termsOfService: 'https://a2sniper-binaire.com/terms',
    privacyPolicy: 'https://a2sniper-binaire.com/privacy'
  }
};

// Types pour la configuration
export type UnifiedConfig = typeof unifiedConfig;
export type PlatformConfig = UnifiedConfig['platforms']['oanda'] | UnifiedConfig['platforms']['deriv'];
export type RiskConfig = UnifiedConfig['riskManagement'];
export type SignalConfig = UnifiedConfig['signals'];
export type TelegramConfig = UnifiedConfig['telegram'];

// Validation de la configuration
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Vérification des tokens requis
  if (!unifiedConfig.platforms.oanda.token && process.env.NODE_ENV === 'production') {
    errors.push('OANDA API token is required in production');
  }
  
  if (!unifiedConfig.platforms.deriv.apiToken && process.env.NODE_ENV === 'production') {
    errors.push('Deriv API token is required in production');
  }
  
  if (!unifiedConfig.telegram.botToken && process.env.NODE_ENV === 'production') {
    errors.push('Telegram bot token is required in production');
  }
  
  if (!unifiedConfig.database.url && process.env.NODE_ENV === 'production') {
    errors.push('Database URL is required in production');
  }
  
  // Vérification des paramètres de risque
  if (unifiedConfig.riskManagement.maxRiskPerTrade > 10) {
    errors.push('Max risk per trade should not exceed 10%');
  }
  
  if (unifiedConfig.riskManagement.maxDailyRisk > 20) {
    errors.push('Max daily risk should not exceed 20%');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Helper pour obtenir la configuration d'une plateforme
export function getPlatformConfig(platform: 'OANDA' | 'DERIV'): PlatformConfig {
  return platform === 'OANDA' 
    ? unifiedConfig.platforms.oanda 
    : unifiedConfig.platforms.deriv;
}

// Helper pour formater les symboles selon la plateforme
export function formatSymbolForPlatform(symbol: string, platform: 'OANDA' | 'DERIV'): string {
  if (platform === 'OANDA') {
    return symbol.replace('/', '_'); // EUR/USD -> EUR_USD
  } else {
    // Pour Deriv, le format dépend du type d'actif
    if (symbol.includes('/')) {
      return `frx${symbol.replace('/', '')}`; // EUR/USD -> frxEURUSD
    }
    return symbol;
  }
}

// Helper pour obtenir les instruments supportés
export function getSupportedInstruments(platform: 'OANDA' | 'DERIV'): string[] {
  if (platform === 'OANDA') {
    return unifiedConfig.platforms.oanda.supportedInstruments;
  } else {
    const deriv = unifiedConfig.platforms.deriv.supportedAssets;
    return [
      ...deriv.forex,
      ...deriv.commodities,
      ...deriv.indices,
      ...deriv.synthetic
    ];
  }
}