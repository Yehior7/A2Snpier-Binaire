// Client OANDA pour l'intégration avec l'API OANDA v20
export interface OandaConfig {
  apiUrl: string;
  token: string;
  accountId: string;
  environment: 'practice' | 'live';
  maxPositions: number;
}

export interface OandaOrder {
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'MARKET_IF_TOUCHED';
  instrument: string;
  units: number;
  timeInForce: 'FOK' | 'IOC' | 'GTC';
  stopLossOnFill?: {
    price: string;
    timeInForce: 'GTC';
  };
  takeProfitOnFill?: {
    price: string;
    timeInForce: 'GTC';
  };
}

export interface OandaPosition {
  instrument: string;
  long: {
    units: string;
    averagePrice: string;
    pl: string;
    unrealizedPL: string;
  };
  short: {
    units: string;
    averagePrice: string;
    pl: string;
    unrealizedPL: string;
  };
}

export interface OandaAccount {
  id: string;
  balance: string;
  currency: string;
  marginUsed: string;
  marginAvailable: string;
  unrealizedPL: string;
  pl: string;
}

export class OandaClient {
  private config: OandaConfig;
  private baseUrl: string;

  constructor(config: OandaConfig) {
    this.config = config;
    this.baseUrl = config.apiUrl;
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.config.token}`,
      'Content-Type': 'application/json',
      'Accept-Datetime-Format': 'RFC3339'
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OANDA API Error: ${response.status} - ${errorData.errorMessage || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OANDA API Request failed:', error);
      throw error;
    }
  }

  // Récupération des informations du compte
  async getAccount(): Promise<OandaAccount> {
    const response = await this.makeRequest(`/v3/accounts/${this.config.accountId}`);
    return response.account;
  }

  // Récupération des instruments disponibles
  async getInstruments(): Promise<any[]> {
    const response = await this.makeRequest(`/v3/accounts/${this.config.accountId}/instruments`);
    return response.instruments;
  }

  // Récupération des prix en temps réel
  async getPricing(instruments: string[]): Promise<any[]> {
    const instrumentsParam = instruments.join(',');
    const response = await this.makeRequest(
      `/v3/accounts/${this.config.accountId}/pricing?instruments=${instrumentsParam}`
    );
    return response.prices;
  }

  // Placement d'un ordre
  async placeOrder(order: OandaOrder): Promise<any> {
    const response = await this.makeRequest(
      `/v3/accounts/${this.config.accountId}/orders`,
      'POST',
      { order }
    );
    return response;
  }

  // Récupération des positions
  async getPositions(): Promise<OandaPosition[]> {
    const response = await this.makeRequest(`/v3/accounts/${this.config.accountId}/positions`);
    return response.positions;
  }

  // Récupération des trades ouverts
  async getOpenTrades(): Promise<any[]> {
    const response = await this.makeRequest(`/v3/accounts/${this.config.accountId}/openTrades`);
    return response.trades;
  }

  // Fermeture d'un trade
  async closeTrade(tradeId: string, units?: string): Promise<any> {
    const body = units ? { units } : {};
    const response = await this.makeRequest(
      `/v3/accounts/${this.config.accountId}/trades/${tradeId}/close`,
      'PUT',
      body
    );
    return response;
  }

  // Récupération de l'historique des transactions
  async getTransactions(fromTime?: string, toTime?: string): Promise<any[]> {
    let endpoint = `/v3/accounts/${this.config.accountId}/transactions`;
    const params = new URLSearchParams();
    
    if (fromTime) params.append('from', fromTime);
    if (toTime) params.append('to', toTime);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await this.makeRequest(endpoint);
    return response.transactions;
  }

  // Conversion de symbole pour OANDA (EUR/USD -> EUR_USD)
  static formatSymbol(symbol: string): string {
    return symbol.replace('/', '_');
  }

  // Calcul de la valeur du pip
  calculatePipValue(instrument: string, units: number, accountCurrency: string = 'USD'): number {
    // Calcul simplifié - en production, utiliser les taux de change réels
    const baseCurrency = instrument.split('_')[0];
    const quoteCurrency = instrument.split('_')[1];
    
    if (quoteCurrency === accountCurrency) {
      return units * 0.0001; // Pour les paires comme EUR_USD
    } else if (baseCurrency === accountCurrency) {
      return units * 0.0001; // Pour les paires comme USD_JPY
    } else {
      // Conversion nécessaire via taux de change
      return units * 0.0001; // Simplifié
    }
  }
}