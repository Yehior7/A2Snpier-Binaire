// Gestionnaire de risques unifié pour OANDA et Deriv
import { UnifiedSignal, Account, TradeValidation, RiskCheck } from './unified-signal';

export interface RiskParameters {
  maxRiskPerTrade: number; // Pourcentage du capital
  maxDailyRisk: number;
  maxDrawdown: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  maxConcurrentTrades: number;
  minConfidenceLevel: number;
}

export interface PositionSize {
  amount: number;
  percentage: number;
  riskAmount: number;
  kellyPercentage: number;
}

export interface AccountStatus {
  platform: 'OANDA' | 'DERIV';
  balance: number;
  equity: number;
  margin_used: number;
  drawdown: number;
  daily_pnl: number;
  open_positions: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  can_trade: boolean;
}

export class UnifiedRiskManager {
  private defaultParameters: RiskParameters = {
    maxRiskPerTrade: 0.02, // 2% par trade
    maxDailyRisk: 0.10, // 10% par jour
    maxDrawdown: 0.15, // 15% drawdown max
    stopLossPercentage: 0.015, // 1.5%
    takeProfitPercentage: 0.025, // 2.5%
    maxConcurrentTrades: 5,
    minConfidenceLevel: 75
  };

  constructor(private parameters: RiskParameters = {}) {
    this.parameters = { ...this.defaultParameters, ...parameters };
  }

  // Calcul de la taille de position optimale (Critère de Kelly adapté)
  async calculatePositionSize(
    account: Account,
    signal: UnifiedSignal,
    platform: 'OANDA' | 'DERIV'
  ): Promise<PositionSize> {
    const winRate = await this.getHistoricalWinRate(account.id, signal.symbol_display);
    const avgWin = await this.getAverageWin(account.id, signal.symbol_display);
    const avgLoss = await this.getAverageLoss(account.id, signal.symbol_display);
    
    // Formule de Kelly adaptée
    const p = winRate / 100;
    const q = 1 - p;
    const b = avgWin / Math.abs(avgLoss);
    
    const kellyPercentage = (b * p - q) / b;
    const adjustedKelly = Math.max(0, Math.min(kellyPercentage * 0.5, 0.1)); // Limité et réduit
    
    // Ajustement basé sur la confiance du signal
    const confidenceMultiplier = signal.confidence / 100;
    const finalPercentage = adjustedKelly * confidenceMultiplier;
    
    // Application des limites de risque
    const maxRiskAmount = account.balance * this.parameters.maxRiskPerTrade;
    const kellyAmount = account.balance * finalPercentage;
    const finalAmount = Math.min(kellyAmount, maxRiskAmount);
    
    if (platform === 'OANDA') {
      // Conversion en unités OANDA
      const pipValue = this.calculatePipValue(signal.instrument, account.currency);
      const stopLossDistance = Math.abs(signal.entry_price - signal.stop_loss);
      const riskInPips = stopLossDistance / pipValue;
      const units = Math.floor(finalAmount / riskInPips);
      
      return {
        amount: units,
        percentage: (finalAmount / account.balance) * 100,
        riskAmount: finalAmount * this.parameters.stopLossPercentage,
        kellyPercentage: kellyPercentage * 100
      };
    } else {
      // Pour Deriv (montant direct)
      const leverage = signal.platform_specific.deriv?.leverage || 1;
      const maxAmount = account.balance * 0.1; // Max 10% par trade
      const adjustedAmount = Math.min(finalAmount * leverage, maxAmount);
      
      return {
        amount: adjustedAmount,
        percentage: (adjustedAmount / account.balance) * 100,
        riskAmount: adjustedAmount / leverage,
        kellyPercentage: kellyPercentage * 100
      };
    }
  }

  // Évaluation complète du risque d'un trade
  async validateTrade(
    userId: string,
    signal: UnifiedSignal,
    platform: 'OANDA' | 'DERIV'
  ): Promise<TradeValidation> {
    const account = await this.getAccount(userId, platform);
    const riskChecks = await this.performRiskChecks(account, signal);
    
    return {
      canTrade: riskChecks.every(check => check.passed || check.severity !== 'error'),
      riskChecks: riskChecks,
      recommendedSize: (await this.calculatePositionSize(account, signal, platform)).amount,
      warnings: riskChecks
        .filter(check => !check.passed && check.severity === 'warning')
        .map(check => check.message)
    };
  }

  // Vérifications de risque complètes
  private async performRiskChecks(account: Account, signal: UnifiedSignal): Promise<RiskCheck[]> {
    const checks: RiskCheck[] = [];
    
    // 1. Vérification du niveau de confiance
    checks.push({
      name: 'Confidence Level',
      passed: signal.confidence >= this.parameters.minConfidenceLevel,
      message: signal.confidence >= this.parameters.minConfidenceLevel 
        ? `Confiance acceptable: ${signal.confidence}%`
        : `Confiance trop faible: ${signal.confidence}% (min: ${this.parameters.minConfidenceLevel}%)`,
      severity: signal.confidence >= this.parameters.minConfidenceLevel ? 'info' : 'error'
    });
    
    // 2. Vérification du ratio risque/récompense
    checks.push({
      name: 'Risk Reward Ratio',
      passed: signal.risk_reward_ratio >= 1.5,
      message: signal.risk_reward_ratio >= 1.5
        ? `Ratio R:R acceptable: ${signal.risk_reward_ratio.toFixed(2)}:1`
        : `Ratio R:R insuffisant: ${signal.risk_reward_ratio.toFixed(2)}:1 (min: 1.5:1)`,
      severity: signal.risk_reward_ratio >= 1.5 ? 'info' : 'warning'
    });
    
    // 3. Vérification du solde disponible
    const requiredMargin = await this.calculateRequiredMargin(account, signal);
    checks.push({
      name: 'Available Balance',
      passed: account.margin_available >= requiredMargin,
      message: account.margin_available >= requiredMargin
        ? `Marge suffisante disponible`
        : `Marge insuffisante: ${requiredMargin} requis, ${account.margin_available} disponible`,
      severity: account.margin_available >= requiredMargin ? 'info' : 'error'
    });
    
    // 4. Vérification du drawdown actuel
    const currentDrawdown = await this.calculateCurrentDrawdown(account);
    checks.push({
      name: 'Current Drawdown',
      passed: currentDrawdown < this.parameters.maxDrawdown,
      message: currentDrawdown < this.parameters.maxDrawdown
        ? `Drawdown acceptable: ${(currentDrawdown * 100).toFixed(1)}%`
        : `Drawdown trop élevé: ${(currentDrawdown * 100).toFixed(1)}% (max: ${(this.parameters.maxDrawdown * 100).toFixed(1)}%)`,
      severity: currentDrawdown < this.parameters.maxDrawdown ? 'info' : 'error'
    });
    
    // 5. Vérification du nombre de positions ouvertes
    const openPositions = await this.getOpenPositionsCount(account);
    checks.push({
      name: 'Open Positions',
      passed: openPositions < this.parameters.maxConcurrentTrades,
      message: openPositions < this.parameters.maxConcurrentTrades
        ? `Nombre de positions acceptable: ${openPositions}/${this.parameters.maxConcurrentTrades}`
        : `Trop de positions ouvertes: ${openPositions}/${this.parameters.maxConcurrentTrades}`,
      severity: openPositions < this.parameters.maxConcurrentTrades ? 'info' : 'warning'
    });
    
    // 6. Vérification du risque quotidien
    const dailyRisk = await this.calculateDailyRiskUsed(account);
    checks.push({
      name: 'Daily Risk',
      passed: dailyRisk < this.parameters.maxDailyRisk,
      message: dailyRisk < this.parameters.maxDailyRisk
        ? `Risque quotidien acceptable: ${(dailyRisk * 100).toFixed(1)}%`
        : `Risque quotidien dépassé: ${(dailyRisk * 100).toFixed(1)}% (max: ${(this.parameters.maxDailyRisk * 100).toFixed(1)}%)`,
      severity: dailyRisk < this.parameters.maxDailyRisk ? 'info' : 'error'
    });
    
    return checks;
  }

  // Surveillance continue des comptes
  async monitorAllAccounts(userId: string): Promise<AccountStatus[]> {
    const accounts = await this.getUserAccounts(userId);
    const statuses: AccountStatus[] = [];
    
    for (const account of accounts) {
      const status = await this.checkAccountStatus(account);
      statuses.push(status);
      
      // Actions automatiques basées sur le statut
      if (status.drawdown > 0.15) {
        await this.pauseTrading(account);
        await this.notifyUser(userId, `🚨 Trading pausé sur ${account.platform} - Drawdown: ${(status.drawdown * 100).toFixed(1)}%`);
      }
      
      if (status.risk_level === 'HIGH') {
        await this.notifyUser(userId, `⚠️ Niveau de risque élevé détecté sur ${account.platform}`);
      }
    }
    
    return statuses;
  }

  // Calcul du statut d'un compte
  private async checkAccountStatus(account: Account): Promise<AccountStatus> {
    const drawdown = await this.calculateCurrentDrawdown(account);
    const dailyPnL = await this.getDailyPnL(account);
    const openPositions = await this.getOpenPositionsCount(account);
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (drawdown > 0.10 || dailyPnL < -account.balance * 0.05) riskLevel = 'HIGH';
    else if (drawdown > 0.05 || dailyPnL < -account.balance * 0.02) riskLevel = 'MEDIUM';
    
    const canTrade = drawdown < this.parameters.maxDrawdown && 
                    openPositions < this.parameters.maxConcurrentTrades &&
                    account.margin_available > account.balance * 0.1;
    
    return {
      platform: account.platform,
      balance: account.balance,
      equity: account.equity,
      margin_used: account.margin_used,
      drawdown: drawdown,
      daily_pnl: dailyPnL,
      open_positions: openPositions,
      risk_level: riskLevel,
      can_trade: canTrade
    };
  }

  // Méthodes utilitaires privées
  private async getHistoricalWinRate(accountId: string, symbol: string): Promise<number> {
    // Simulation - en production, récupérer les vraies données
    return 65 + Math.random() * 20; // 65-85%
  }

  private async getAverageWin(accountId: string, symbol: string): Promise<number> {
    return 50 + Math.random() * 30; // $50-80
  }

  private async getAverageLoss(accountId: string, symbol: string): Promise<number> {
    return -(20 + Math.random() * 20); // -$20-40
  }

  private async getAccount(userId: string, platform: 'OANDA' | 'DERIV'): Promise<Account> {
    // Simulation - en production, récupérer le vrai compte
    return {
      id: `${platform}_${userId}`,
      platform,
      balance: 10000,
      currency: 'USD',
      equity: 10000,
      margin_used: 1000,
      margin_available: 9000,
      unrealized_pnl: 0,
      is_demo: true
    };
  }

  private calculatePipValue(instrument: string, accountCurrency: string): number {
    // Calcul simplifié - en production, utiliser les vrais taux
    return 1; // $1 par pip pour un lot standard
  }

  private async calculateRequiredMargin(account: Account, signal: UnifiedSignal): Promise<number> {
    if (signal.platform === 'OANDA') {
      return signal.position_size * 0.02; // 2% de marge
    } else {
      const leverage = signal.platform_specific.deriv?.leverage || 1;
      return signal.position_size / leverage;
    }
  }

  private async calculateCurrentDrawdown(account: Account): Promise<number> {
    const peakBalance = await this.getPeakBalance(account.id);
    return Math.max(0, (peakBalance - account.equity) / peakBalance);
  }

  private async getPeakBalance(accountId: string): Promise<number> {
    // Simulation - en production, récupérer le vrai pic
    return 12000;
  }

  private async getOpenPositionsCount(account: Account): Promise<number> {
    // Simulation
    return Math.floor(Math.random() * 3);
  }

  private async calculateDailyRiskUsed(account: Account): Promise<number> {
    // Simulation
    return Math.random() * 0.05; // 0-5%
  }

  private async getUserAccounts(userId: string): Promise<Account[]> {
    // Simulation - retourner les comptes de l'utilisateur
    return [
      await this.getAccount(userId, 'OANDA'),
      await this.getAccount(userId, 'DERIV')
    ];
  }

  private async getDailyPnL(account: Account): Promise<number> {
    // Simulation
    return (Math.random() - 0.5) * 200; // -$100 à +$100
  }

  private async pauseTrading(account: Account): Promise<void> {
    console.log(`Trading paused for account ${account.id} on ${account.platform}`);
    // Implémentation de la pause de trading
  }

  private async notifyUser(userId: string, message: string): Promise<void> {
    console.log(`Notification to user ${userId}: ${message}`);
    // Implémentation de la notification (Telegram, email, etc.)
  }
}