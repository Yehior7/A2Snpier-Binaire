'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity, 
  RefreshCw, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';
import { UnifiedSignal, Account, AccountStatus } from '@/lib/trading/unified-signal';

interface UnifiedTradingDashboardProps {
  userId: string;
}

export const UnifiedTradingDashboard: React.FC<UnifiedTradingDashboardProps> = ({ userId }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [signals, setSignals] = useState<UnifiedSignal[]>([]);
  const [accountStatuses, setAccountStatuses] = useState<AccountStatus[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<'ALL' | 'OANDA' | 'DERIV'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulation de données - en production, récupérer via API
  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Mise à jour toutes les 30s
    return () => clearInterval(interval);
  }, [userId]);

  const loadDashboardData = async () => {
    // Simulation de chargement des données
    const mockAccounts: Account[] = [
      {
        id: 'oanda_123',
        platform: 'OANDA',
        balance: 10000,
        currency: 'USD',
        equity: 10250,
        margin_used: 1500,
        margin_available: 8750,
        unrealized_pnl: 250,
        is_demo: true
      },
      {
        id: 'deriv_456',
        platform: 'DERIV',
        balance: 5000,
        currency: 'USD',
        equity: 5150,
        margin_used: 800,
        margin_available: 4350,
        unrealized_pnl: 150,
        is_demo: true
      }
    ];

    const mockSignals: UnifiedSignal[] = [
      {
        id: 'signal_1',
        timestamp: new Date(),
        platform: 'OANDA',
        instrument: 'EUR_USD',
        symbol_display: 'EUR/USD',
        action: 'BUY',
        entry_price: 1.0825,
        stop_loss: 1.0800,
        take_profit: 1.0875,
        position_size: 100000,
        risk_percentage: 2,
        confidence: 87,
        risk_reward_ratio: 2.0,
        expected_pips: 50,
        timeframe: '15m',
        technical_analysis: {
          rsi: 65,
          macd: { macd: 0.0012, signal: 0.0008, histogram: 0.0004 },
          bollinger: { upper: 1.0850, middle: 1.0825, lower: 1.0800 },
          support_resistance: { support: 1.0800, resistance: 1.0875 },
          trend_direction: 'UP'
        },
        platform_specific: {
          oanda: {
            lot_size: 1.0,
            swap_rates: -0.25,
            pip_value: 10
          }
        }
      },
      {
        id: 'signal_2',
        timestamp: new Date(Date.now() - 300000),
        platform: 'DERIV',
        instrument: 'frxGBPUSD',
        symbol_display: 'GBP/USD',
        action: 'SELL',
        entry_price: 1.2456,
        stop_loss: 1.2486,
        take_profit: 1.2396,
        position_size: 2000,
        risk_percentage: 2,
        confidence: 82,
        risk_reward_ratio: 2.0,
        expected_pips: 60,
        timeframe: '15m',
        technical_analysis: {
          rsi: 72,
          macd: { macd: -0.0015, signal: -0.0010, histogram: -0.0005 },
          bollinger: { upper: 1.2480, middle: 1.2456, lower: 1.2432 },
          support_resistance: { support: 1.2396, resistance: 1.2486 },
          trend_direction: 'DOWN'
        },
        platform_specific: {
          deriv: {
            leverage: 30,
            margin_required: 66.67,
            trade_type: 'forex',
            contract_size: 100000
          }
        }
      }
    ];

    const mockStatuses: AccountStatus[] = [
      {
        platform: 'OANDA',
        balance: 10000,
        equity: 10250,
        margin_used: 1500,
        drawdown: 0.05,
        daily_pnl: 250,
        open_positions: 2,
        risk_level: 'LOW',
        can_trade: true
      },
      {
        platform: 'DERIV',
        balance: 5000,
        equity: 5150,
        margin_used: 800,
        drawdown: 0.03,
        daily_pnl: 150,
        open_positions: 1,
        risk_level: 'LOW',
        can_trade: true
      }
    ];

    setAccounts(mockAccounts);
    setSignals(mockSignals);
    setAccountStatuses(mockStatuses);
    setLastUpdate(new Date());
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredSignals = selectedPlatform === 'ALL' 
    ? signals 
    : signals.filter(s => s.platform === selectedPlatform);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalEquity = accounts.reduce((sum, acc) => sum + acc.equity, 0);
  const totalPnL = accounts.reduce((sum, acc) => sum + acc.unrealized_pnl, 0);
  const avgWinRate = accountStatuses.length > 0 
    ? accountStatuses.reduce((sum, status) => sum + (status.daily_pnl > 0 ? 1 : 0), 0) / accountStatuses.length * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              A2Sniper Binaire - Trading Unifié
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Toutes les plateformes</option>
              <option value="OANDA">OANDA</option>
              <option value="DERIV">Deriv</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Balance totale"
            value={`$${totalBalance.toLocaleString()}`}
            change={{ value: 5.2, type: 'increase' }}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Equity totale"
            value={`$${totalEquity.toLocaleString()}`}
            change={{ value: 2.8, type: 'increase' }}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="P&L Non réalisé"
            value={`${totalPnL > 0 ? '+' : ''}$${totalPnL.toFixed(2)}`}
            change={{ value: Math.abs(totalPnL), type: totalPnL > 0 ? 'increase' : 'decrease' }}
            icon={<Target className="w-6 h-6" />}
            color={totalPnL > 0 ? 'green' : 'red'}
          />
          <MetricCard
            title="Signaux actifs"
            value={filteredSignals.length.toString()}
            change={{ value: 3, type: 'increase' }}
            icon={<Activity className="w-6 h-6" />}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comptes */}
          <div className="lg:col-span-1">
            <AccountsOverview accounts={accounts} statuses={accountStatuses} />
          </div>

          {/* Signaux actifs */}
          <div className="lg:col-span-2">
            <ActiveSignals signals={filteredSignals} />
          </div>
        </div>

        {/* Graphiques de performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <PerformanceChart accounts={accounts} />
          <RiskDistribution statuses={accountStatuses} />
        </div>
      </div>
    </div>
  );
};

// Composant MetricCard
interface MetricCardProps {
  title: string;
  value: string;
  change: { value: number; type: 'increase' | 'decrease' };
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'red' | 'purple' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {change.type === 'increase' ? '+' : '-'}{change.value}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

// Composant AccountsOverview
const AccountsOverview: React.FC<{ accounts: Account[]; statuses: AccountStatus[] }> = ({ accounts, statuses }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Comptes de trading
      </h3>
      
      <div className="space-y-4">
        {accounts.map((account, index) => {
          const status = statuses.find(s => s.platform === account.platform);
          const platformColor = account.platform === 'OANDA' ? 'blue' : 'purple';
          
          return (
            <div key={account.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    account.platform === 'OANDA' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {account.platform}
                  </span>
                  {account.is_demo && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      DEMO
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {status?.can_trade ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    status?.risk_level === 'LOW' ? 'bg-green-100 text-green-800' :
                    status?.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status?.risk_level}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Balance</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${account.balance.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Equity</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    ${account.equity.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">P&L</div>
                  <div className={`font-medium ${
                    account.unrealized_pnl > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {account.unrealized_pnl > 0 ? '+' : ''}${account.unrealized_pnl.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Positions</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {status?.open_positions || 0}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Composant ActiveSignals
const ActiveSignals: React.FC<{ signals: UnifiedSignal[] }> = ({ signals }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Signaux actifs
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {signals.map((signal) => (
          <UnifiedSignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </motion.div>
  );
};

// Composant UnifiedSignalCard
const UnifiedSignalCard: React.FC<{ signal: UnifiedSignal }> = ({ signal }) => {
  const platformColor = signal.platform === 'OANDA' ? 'blue' : 'purple';
  const actionColor = signal.action === 'BUY' ? 'green' : 'red';
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            signal.platform === 'OANDA' ? 'bg-blue-500' : 'bg-purple-500'
          }`} />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {signal.symbol_display}
          </h4>
          <span className={`px-2 py-1 text-xs rounded ${
            signal.action === 'BUY' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {signal.action}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">{signal.platform}</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {signal.confidence}% confiance
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
        <div>
          <div className="text-gray-600 dark:text-gray-400">Entrée</div>
          <div className="font-medium text-gray-900 dark:text-white">
            {signal.entry_price.toFixed(5)}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400">Stop Loss</div>
          <div className="font-medium text-red-600">
            {signal.stop_loss.toFixed(5)}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400">Take Profit</div>
          <div className="font-medium text-green-600">
            {signal.take_profit.toFixed(5)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          R:R {signal.risk_reward_ratio.toFixed(2)}:1 • {signal.expected_pips.toFixed(1)} pips
        </div>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
          Trader
        </button>
      </div>
    </div>
  );
};

// Composants de graphiques (simplifiés)
const PerformanceChart: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance des comptes
      </h3>
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <BarChart3 className="w-16 h-16 mb-4" />
        <p>Graphique de performance</p>
      </div>
    </motion.div>
  );
};

const RiskDistribution: React.FC<{ statuses: AccountStatus[] }> = ({ statuses }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-slate-700/50 rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Distribution des risques
      </h3>
      <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <PieChart className="w-16 h-16 mb-4" />
        <p>Graphique de répartition des risques</p>
      </div>
    </motion.div>
  );
};