// Client Deriv pour l'intégration avec l'API Deriv WebSocket
export interface DerivConfig {
  apiUrl: string;
  appId: string;
  apiToken?: string;
  environment: 'demo' | 'real';
}

export interface DerivTrade {
  action: 'BUY' | 'SELL';
  symbol: string;
  amount: number;
  stop_loss?: number;
  take_profit?: number;
  leverage?: number;
  trade_type: 'cfd' | 'forex' | 'commodities' | 'synthetic';
}

export interface DerivPosition {
  contract_id: string;
  symbol: string;
  contract_type: string;
  buy_price: number;
  current_spot: number;
  profit: number;
  is_expired: boolean;
}

export interface DerivAccount {
  loginid: string;
  balance: number;
  currency: string;
  is_virtual: boolean;
}

export class DerivClient {
  private config: DerivConfig;
  private ws: WebSocket | null = null;
  private requestId = 1;
  private pendingRequests = new Map<number, { resolve: Function; reject: Function }>();
  private isConnected = false;

  constructor(config: DerivConfig) {
    this.config = config;
  }

  // Connexion WebSocket
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.config.apiUrl}?app_id=${this.config.appId}`);
        
        this.ws.onopen = () => {
          this.isConnected = true;
          console.log('Connected to Deriv API');
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(JSON.parse(event.data));
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          console.log('Disconnected from Deriv API');
          // Tentative de reconnexion après 5 secondes
          setTimeout(() => this.connect(), 5000);
        };

        this.ws.onerror = (error) => {
          console.error('Deriv WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Gestion des messages reçus
  private handleMessage(message: any): void {
    if (message.req_id && this.pendingRequests.has(message.req_id)) {
      const { resolve, reject } = this.pendingRequests.get(message.req_id)!;
      this.pendingRequests.delete(message.req_id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message);
      }
    }
  }

  // Envoi d'une requête
  private async sendRequest(request: any): Promise<any> {
    if (!this.isConnected || !this.ws) {
      await this.connect();
    }

    return new Promise((resolve, reject) => {
      const reqId = this.requestId++;
      const requestWithId = { ...request, req_id: reqId };
      
      this.pendingRequests.set(reqId, { resolve, reject });
      
      this.ws!.send(JSON.stringify(requestWithId));
      
      // Timeout après 30 secondes
      setTimeout(() => {
        if (this.pendingRequests.has(reqId)) {
          this.pendingRequests.delete(reqId);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  // Authentification
  async authorize(): Promise<any> {
    if (!this.config.apiToken) {
      throw new Error('API token required for authorization');
    }

    return await this.sendRequest({
      authorize: this.config.apiToken
    });
  }

  // Récupération des comptes
  async getAccounts(): Promise<DerivAccount[]> {
    const response = await this.sendRequest({
      account_list: 1
    });
    return response.account_list;
  }

  // Récupération du solde
  async getBalance(): Promise<any> {
    return await this.sendRequest({
      balance: 1,
      subscribe: 1
    });
  }

  // Récupération des actifs disponibles
  async getAssets(): Promise<any[]> {
    const response = await this.sendRequest({
      asset_index: 1
    });
    return response.asset_index;
  }

  // Récupération des prix en temps réel
  async subscribeTicks(symbol: string): Promise<any> {
    return await this.sendRequest({
      ticks: symbol,
      subscribe: 1
    });
  }

  // Placement d'un trade CFD/Forex
  async placeTrade(trade: DerivTrade): Promise<any> {
    // Pour les CFDs et Forex sur Deriv
    const request: any = {
      buy: 1,
      price: trade.amount,
      parameters: {
        contract_type: trade.action.toLowerCase(), // 'buy' ou 'sell'
        symbol: trade.symbol,
        amount: trade.amount
      }
    };

    // Ajout des niveaux de stop loss et take profit si spécifiés
    if (trade.stop_loss) {
      request.parameters.stop_loss = trade.stop_loss;
    }
    
    if (trade.take_profit) {
      request.parameters.take_profit = trade.take_profit;
    }

    return await this.sendRequest(request);
  }

  // Récupération du portefeuille (positions ouvertes)
  async getPortfolio(): Promise<DerivPosition[]> {
    const response = await this.sendRequest({
      portfolio: 1
    });
    return response.portfolio.contracts || [];
  }

  // Fermeture d'une position
  async closePosition(contractId: string): Promise<any> {
    return await this.sendRequest({
      sell: contractId,
      price: 0 // Prix de marché
    });
  }

  // Récupération de l'historique des transactions
  async getTransactionHistory(limit: number = 50): Promise<any[]> {
    const response = await this.sendRequest({
      statement: 1,
      limit: limit
    });
    return response.statement.transactions || [];
  }

  // Récupération des informations sur un symbole
  async getSymbolInfo(symbol: string): Promise<any> {
    const response = await this.sendRequest({
      active_symbols: 'brief',
      product_type: 'basic'
    });
    
    return response.active_symbols.find((s: any) => s.symbol === symbol);
  }

  // Conversion de symbole pour Deriv
  static formatSymbol(symbol: string, tradeType: 'forex' | 'cfd' | 'commodities' | 'synthetic'): string {
    switch (tradeType) {
      case 'forex':
        return `frx${symbol.replace('/', '')}`;
      case 'cfd':
        return symbol;
      case 'commodities':
        return symbol;
      case 'synthetic':
        return symbol; // R_10, R_25, etc.
      default:
        return symbol;
    }
  }

  // Calcul de la marge requise
  calculateMarginRequired(amount: number, leverage: number): number {
    return amount / leverage;
  }

  // Déconnexion
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }
}