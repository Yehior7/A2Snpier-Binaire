'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Users, 
  Zap, 
  Menu, 
  X, 
  User, 
  Bell, 
  LogOut, 
  Moon, 
  Sun, 
  Search,
  MessageCircle,
  Brain,
  DollarSign,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Signaux', href: '/signals', icon: TrendingUp },
  { name: 'Performance', href: '/performance', icon: BarChart3 },
  { name: 'Backtesting', href: '/backtesting', icon: TrendingUp },
  { name: 'Trading Unifié', href: '/trading', icon: TrendingUp },
  { name: 'Courtiers', href: '/brokers', icon: ExternalLink },
  { name: 'Paramètres', href: '/settings', icon: Settings },
  { name: 'Bot Telegram', href: '/telegram', icon: MessageCircle },
  { name: 'Analyses', href: '/analytics', icon: Brain },
  { name: 'Tarifs', href: '/pricing', icon: DollarSign }
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, setAuthenticated } = useAppStore();
  const pathname = usePathname();

  const notifications = [
    { id: 1, title: 'Nouveau signal EUR/USD', time: '2 min', type: 'signal' },
    { id: 2, title: 'Performance mise à jour', time: '5 min', type: 'performance' },
    { id: 3, title: 'Maintenance programmée', time: '1h', type: 'system' }
  ];

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    setShowUserMenu(false);
    // Redirection vers la page d'accueil
    window.location.href = '/';
  }, [setAuthenticated]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
    // Ici on pourrait implémenter le vrai dark mode
    document.documentElement.classList.toggle('dark');
  }, [isDarkMode]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simulation de recherche
      const searchResults = [
        { type: 'signal', title: 'EUR/USD CALL Signal', url: '/signals' },
        { type: 'performance', title: 'Performance Analytics', url: '/performance' },
        { type: 'backtest', title: 'Backtesting Results', url: '/backtesting' }
      ];
      
      const result = searchResults.find(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (result) {
        router.push(result.url);
      } else {
        router.push('/signals');
      }
      setSearchQuery('');
    }
  }, [searchQuery]);

  return (
    <>
      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
        <div className="flex flex-col flex-grow pt-5 bg-gradient-to-b from-slate-900 to-slate-800 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TradeAlgo</h1>
                <p className="text-xs text-blue-200">AI Trading Platform</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="ml-auto w-1 h-8 bg-blue-300 rounded-full"
                        layoutId="activeIndicator"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* User Profile */}
            <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900 px-4 py-3 flex items-center justify-between">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500">Il y a {notification.time}</p>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${
                            notification.type === 'signal' ? 'bg-green-500' :
                            notification.type === 'performance' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      Marquer tout comme lu
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">TradeAlgo</h1>
          </div>
        </div>
      </div>
    </>
  );
}