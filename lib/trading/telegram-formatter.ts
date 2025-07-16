// Formateur de messages Telegram pour les signaux unifiés
import { UnifiedSignal } from './unified-signal';

export class TelegramMessageFormatter {
  // Format principal des signaux
  formatUnifiedSignal(signal: UnifiedSignal): string {
    const platformEmoji = signal.platform === 'OANDA' ? '🏦' : '🔷';
    const actionEmoji = signal.action === 'BUY' ? '📈⬆️' : '📉⬇️';
    const confidenceEmoji = this.getConfidenceEmoji(signal.confidence);
    
    return `
${platformEmoji} **SIGNAL ${signal.platform}** ${confidenceEmoji}

📊 **Paire:** ${signal.symbol_display}
${actionEmoji} **Action:** ${signal.action}
💰 **Prix d'entrée:** ${signal.entry_price.toFixed(5)}
🎯 **Take Profit:** ${signal.take_profit.toFixed(5)}
⛔ **Stop Loss:** ${signal.stop_loss.toFixed(5)}
📏 **Taille:** ${this.formatPositionSize(signal)}
💎 **Risque:** ${signal.risk_percentage}% du capital
🔥 **Confiance:** ${signal.confidence}%

📈 **R:R Ratio:** ${signal.risk_reward_ratio.toFixed(2)}:1
📊 **Pips attendus:** ${signal.expected_pips.toFixed(1)}
⏰ **Timeframe:** ${signal.timeframe}
🔗 **Trader maintenant sur ${signal.platform}**

${this.formatTechnicalAnalysis(signal.technical_analysis)}

${this.formatPlatformSpecific(signal)}

#${signal.symbol_display.replace('/', '')} #${signal.action} #${signal.platform}
`;
  }

  // Format pour les mises à jour de signaux
  formatSignalUpdate(signal: UnifiedSignal, status: 'FILLED' | 'PARTIAL' | 'CANCELLED' | 'CLOSED', details?: any): string {
    const statusEmoji = {
      'FILLED': '✅',
      'PARTIAL': '🔄',
      'CANCELLED': '❌',
      'CLOSED': '🏁'
    };

    let message = `
${statusEmoji[status]} **MISE À JOUR SIGNAL**

📊 **Paire:** ${signal.symbol_display}
🏦 **Plateforme:** ${signal.platform}
📈 **Action:** ${signal.action}
📊 **Statut:** ${status}
`;

    if (details) {
      if (details.fill_price) {
        message += `💰 **Prix d'exécution:** ${details.fill_price.toFixed(5)}\n`;
      }
      if (details.profit_loss) {
        const profitEmoji = details.profit_loss > 0 ? '💚' : '❤️';
        message += `${profitEmoji} **P&L:** ${details.profit_loss > 0 ? '+' : ''}$${details.profit_loss.toFixed(2)}\n`;
      }
      if (details.close_reason) {
        message += `📝 **Raison:** ${details.close_reason}\n`;
      }
    }

    return message;
  }

  // Format pour le résumé de performance
  formatPerformanceSummary(platform: 'OANDA' | 'DERIV', stats: any): string {
    const platformEmoji = platform === 'OANDA' ? '🏦' : '🔷';
    
    return `
${platformEmoji} **RÉSUMÉ ${platform}**

💰 **Balance:** $${stats.balance.toFixed(2)}
📈 **Equity:** $${stats.equity.toFixed(2)}
💎 **P&L Aujourd'hui:** ${stats.daily_pnl > 0 ? '+' : ''}$${stats.daily_pnl.toFixed(2)}
🎯 **Taux de réussite:** ${stats.win_rate.toFixed(1)}%
📊 **Positions ouvertes:** ${stats.open_positions}
⚠️ **Drawdown:** ${(stats.drawdown * 100).toFixed(1)}%
🔥 **Niveau de risque:** ${stats.risk_level}

${this.getRiskLevelMessage(stats.risk_level)}
`;
  }

  // Format pour les alertes de risque
  formatRiskAlert(platform: 'OANDA' | 'DERIV', alertType: string, message: string): string {
    const alertEmojis = {
      'HIGH_DRAWDOWN': '🚨',
      'MARGIN_CALL': '⚠️',
      'DAILY_LIMIT': '🛑',
      'SYSTEM_ERROR': '❌'
    };

    const emoji = alertEmojis[alertType as keyof typeof alertEmojis] || '⚠️';
    
    return `
${emoji} **ALERTE ${platform}**

📊 **Type:** ${alertType}
📝 **Message:** ${message}
⏰ **Heure:** ${new Date().toLocaleString('fr-FR')}

🔧 **Actions recommandées:**
${this.getRecommendedActions(alertType)}
`;
  }

  // Format pour les commandes d'aide
  formatHelpMessage(): string {
    return `
🤖 **COMMANDES DISPONIBLES**

**📊 Trading:**
/signals - Signaux actifs
/trades - Positions ouvertes
/history - Historique des trades
/performance - Performance globale

**🏦 Comptes:**
/accounts - Voir tous les comptes
/balance - Solde de tous les comptes
/connect_oanda - Connecter OANDA
/connect_deriv - Connecter Deriv

**⚙️ Paramètres:**
/settings - Paramètres généraux
/risk_settings - Gestion des risques
/notifications - Préférences notifications

**🎮 Contrôle:**
/pause_trading - Pause trading
/resume_trading - Reprendre trading
/status - Statut système

**ℹ️ Aide:**
/help - Cette aide
/support - Support technique

💡 **Astuce:** Utilisez /status pour un aperçu rapide de tous vos comptes !
`;
  }

  // Méthodes utilitaires privées
  private getConfidenceEmoji(confidence: number): string {
    if (confidence >= 90) return '🔥🔥🔥';
    if (confidence >= 80) return '🔥🔥';
    if (confidence >= 70) return '🔥';
    return '⚡';
  }

  private formatPositionSize(signal: UnifiedSignal): string {
    if (signal.platform === 'OANDA') {
      const lotSize = signal.platform_specific.oanda?.lot_size || 0;
      return `${signal.position_size} unités (${lotSize.toFixed(2)} lots)`;
    } else {
      const leverage = signal.platform_specific.deriv?.leverage || 1;
      return `$${signal.position_size.toFixed(2)} (Leverage ${leverage}:1)`;
    }
  }

  private formatTechnicalAnalysis(analysis: UnifiedSignal['technical_analysis']): string {
    const trendEmoji = {
      'UP': '📈',
      'DOWN': '📉',
      'SIDEWAYS': '➡️'
    };

    return `
📊 **Analyse technique:**
• **RSI:** ${analysis.rsi.toFixed(1)} ${this.getRSIStatus(analysis.rsi)}
• **Tendance:** ${trendEmoji[analysis.trend_direction]} ${analysis.trend_direction}
• **MACD:** ${analysis.macd.histogram > 0 ? '📈' : '📉'} ${analysis.macd.histogram.toFixed(5)}
• **Support:** ${analysis.support_resistance.support.toFixed(5)}
• **Résistance:** ${analysis.support_resistance.resistance.toFixed(5)}
`;
  }

  private formatPlatformSpecific(signal: UnifiedSignal): string {
    if (signal.platform === 'OANDA' && signal.platform_specific.oanda) {
      const oanda = signal.platform_specific.oanda;
      return `
🏦 **Spécifique OANDA:**
• **Valeur pip:** $${oanda.pip_value.toFixed(2)}
• **Swap:** ${oanda.swap_rates.toFixed(4)}
• **Lot size:** ${oanda.lot_size.toFixed(2)}
`;
    } else if (signal.platform === 'DERIV' && signal.platform_specific.deriv) {
      const deriv = signal.platform_specific.deriv;
      return `
🔷 **Spécifique Deriv:**
• **Type:** ${deriv.trade_type.toUpperCase()}
• **Leverage:** ${deriv.leverage}:1
• **Marge requise:** $${deriv.margin_required.toFixed(2)}
• **Taille contrat:** ${deriv.contract_size.toLocaleString()}
`;
    }
    return '';
  }

  private getRSIStatus(rsi: number): string {
    if (rsi > 70) return '(Surachat)';
    if (rsi < 30) return '(Survente)';
    return '(Neutre)';
  }

  private getRiskLevelMessage(riskLevel: string): string {
    switch (riskLevel) {
      case 'LOW':
        return '✅ **Risque faible** - Trading normal autorisé';
      case 'MEDIUM':
        return '⚠️ **Risque modéré** - Surveillance recommandée';
      case 'HIGH':
        return '🚨 **Risque élevé** - Réduction des positions conseillée';
      default:
        return '';
    }
  }

  private getRecommendedActions(alertType: string): string {
    switch (alertType) {
      case 'HIGH_DRAWDOWN':
        return '• Réduire la taille des positions\n• Revoir la stratégie de trading\n• Considérer une pause temporaire';
      case 'MARGIN_CALL':
        return '• Fermer des positions immédiatement\n• Déposer des fonds supplémentaires\n• Réduire l\'effet de levier';
      case 'DAILY_LIMIT':
        return '• Arrêter le trading pour aujourd\'hui\n• Analyser les trades perdants\n• Revoir les paramètres de risque';
      case 'SYSTEM_ERROR':
        return '• Vérifier la connexion internet\n• Redémarrer l\'application\n• Contacter le support si nécessaire';
      default:
        return '• Consulter le dashboard pour plus d\'informations';
    }
  }
}

// Instance globale du formateur
export const telegramFormatter = new TelegramMessageFormatter();