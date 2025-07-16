import { create } from 'zustand';
import { Signal, mockSignals, mockUserStats, UserStats } from './mock-data';

interface AppState {
  signals: Signal[];
  userStats: UserStats;
  selectedPairs: string[];
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  } | null;
  
  // Actions
  setSignals: (signals: Signal[]) => void;
  updateUserStats: (stats: UserStats) => void;
  togglePair: (pair: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setUser: (user: any) => void;
  addSignal: (signal: Signal) => void;
  updateSignalStatus: (id: string, status: Signal['status'], result?: { result_price: number; profit_loss: number }) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  signals: mockSignals,
  userStats: mockUserStats,
  selectedPairs: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
  isAuthenticated: true,
  user: {
    id: '1',
    email: 'trader@tradealgo.ai',
    name: 'Alex Trader',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
  },

  setSignals: (signals) => set({ signals }),
  
  updateUserStats: (stats) => set({ userStats: stats }),
  
  togglePair: (pair) => set((state) => ({
    selectedPairs: state.selectedPairs.includes(pair)
      ? state.selectedPairs.filter(p => p !== pair)
      : [...state.selectedPairs, pair]
  })),
  
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  
  setUser: (user) => set({ user }),
  
  addSignal: (signal) => set((state) => ({
    signals: [signal, ...state.signals]
  })),
  
  updateSignalStatus: (id, status, result) => set((state) => ({
    signals: state.signals.map(signal => 
      signal.id === id 
        ? { ...signal, status, ...result }
        : signal
    )
  }))
}));