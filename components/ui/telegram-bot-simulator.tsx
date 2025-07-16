'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Settings, BarChart3, HelpCircle, Zap, Copy, Check } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'signal' | 'performance';
}

export function TelegramBotSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Nouvelles commandes selon spécifications du document
  const extendedCommands = {
    '/start': 'Onboarding et authentification - Initialisation du service',
    '/signals': 'Derniers signaux reçus avec format détaillé',
    '/performance': 'Statistiques de réussite, ratio et historique complet',
    '/settings': 'Configuration des actifs, timeframes, seuils de confiance',
    '/help': 'Guide d\'utilisation complet avec toutes les commandes',
    '/history': 'Historique des 7 derniers jours de signaux',
    '/pairs': 'Liste des paires de devises disponibles',
    '/alerts': 'Configuration des alertes push personnalisées',
    '/support': 'Contact avec l\'équipe de support technique',
    '/export': 'Export des données de performance (CSV/PDF)'
  };
  
  // Format de signal selon spécifications exactes du document
  const generateFormattedSignal = () => {
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'];
    const directions = ['Call', 'Put'];
    const expirations = [1, 3, 5];
    
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const expiration = expirations[Math.floor(Math.random() * expirations.length)];
    const confidence = 75 + Math.floor(Math.random() * 20); // 75-95%
    const time = new Date().toLocaleTimeString('fr-FR');
    
    return `🎯 SIGNAL TRADING - TradeAlgo.AI\n\n[${time}] – Actif: [${pair}] – Direction: [${direction}] – Expiration: [${expiration} min] – Confiance: [${confidence}%]\n\n📊 Analyse technique confirmée\n💰 Ratio gain/perte: 1.8:1\n⚡ Exécution recommandée sous 40 secondes\n\n#${pair.replace('/', '')} #${direction.toUpperCase()} #${expiration}MIN`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyToClipboard = useCallback(async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }, []);

  const addMessage = (content: string, sender: 'user' | 'bot', type: 'text' | 'signal' | 'performance' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (duration = 1500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  };

  const generateSignal = () => {
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'];
    const directions = ['CALL', 'PUT'];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const confidence = Math.floor(Math.random() * 20) + 75;
    const price = (1.0800 + (Math.random() - 0.5) * 0.1).toFixed(4);
    const expiration = Math.floor(Math.random() * 4) + 1;

    return `🎯 NOUVEAU SIGNAL - TradeAlgo.AI

📊 Paire: ${pair}
${direction === 'CALL' ? '📈' : '📉'} Direction: ${direction}
⏰ Expiration: ${expiration} minutes
🎯 Confiance: ${confidence}%
💰 Prix d'entrée: ${price}

⚡ Tradez maintenant sur votre plateforme!

#${pair.replace('/', '')} #${direction} #${expiration}MIN`;
  };

  const handleBotResponse = async (userMessage: string) => {
    await simulateTyping();

    if (userMessage.includes('/signals') || userMessage.includes('signaux')) {
      addMessage(generateSignal(), 'bot', 'signal');
    } else if (userMessage.includes('/performance') || userMessage.includes('performance')) {
      addMessage(`📈 STATISTIQUES DE PERFORMANCE

🎯 Taux de réussite: 87.3%
📊 Signaux aujourd'hui: 23
💰 Profit total: +$1,247
📈 Performance: +12.8%

🔥 Série gagnante: 5 trades
⚡ Temps d'exécution moyen: 28s
📊 Ratio gain/perte: 1.6:1`, 'bot', 'performance');
    } else if (userMessage.includes('/settings') || userMessage.includes('paramètres')) {
      addMessage(`⚙️ PARAMÈTRES DE CONFIGURATION

📱 Notifications: ✅ Activées
🎯 Confiance minimum: 75%
💱 Paires actives: EUR/USD, GBP/USD, USD/JPY
⏰ Timeframe: 1-5 minutes

Pour modifier vos paramètres, visitez:
🌐 https://tradealgo.ai/settings`, 'bot');
    } else if (userMessage.includes('/help') || userMessage.includes('aide')) {
      addMessage(`❓ GUIDE D'UTILISATION

📋 COMMANDES DISPONIBLES:

/signals - Afficher les derniers signaux
/performance - Voir les statistiques
/settings - Configuration des paramètres
/help - Afficher cette aide

💡 CONSEILS:
• Les signaux arrivent automatiquement
• Respectez toujours la gestion du risque
• Consultez le dashboard web pour plus de détails

🆘 Support: support@tradealgo.ai`, 'bot');
    } else {
      addMessage(`🤖 Bonjour ! Je suis votre assistant de trading.

Utilisez les commandes suivantes:
• /signals - Pour voir les signaux
• /performance - Pour les statistiques
• /settings - Pour les paramètres
• /help - Pour l'aide complète

Ou cliquez sur les boutons rapides ci-dessous !`, 'bot');
    }
  };

  const handleSendMessage = useCallback(() => {
    if (inputValue.trim()) {
      addMessage(inputValue, 'user');
      handleBotResponse(inputValue.toLowerCase());
      setInputValue('');
    }
  }, [inputValue]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // Simulation de signaux automatiques
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        addMessage(generateSignal(), 'bot', 'signal');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Message d'accueil initial
  useEffect(() => {
    const welcomeMessage = `🤖 Bienvenue sur TradeAlgo.AI !

Votre bot de signaux de trading est maintenant actif.

✅ Connexion établie
✅ Signaux en temps réel activés
✅ Notifications configurées

Utilisez les commandes ou les boutons rapides pour interagir avec moi !`;

    addMessage(welcomeMessage, 'bot');
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-white font-semibold">TradeAlgo Bot</h3>
            <p className="text-blue-100 text-sm flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              En ligne - Signaux actifs
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'signal'
                  ? 'bg-green-100 border border-green-200'
                  : message.type === 'performance'
                  ? 'bg-purple-100 border border-purple-200'
                  : 'bg-white border border-gray-200'
              }`}>
                {message.sender === 'bot' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-600">TradeAlgo Bot</span>
                    <button
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Copier le message"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}
                <div className="text-gray-800 whitespace-pre-line">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-blue-500 text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                setInputValue('/signals');
                setTimeout(handleSendMessage, 100);
              }}
              className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              📊 Signaux
            </button>
            <button 
              onClick={() => {
                setInputValue('/performance');
                setTimeout(handleSendMessage, 100);
              }}
              className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm hover:bg-green-200 transition-colors"
            >
              📈 Performance
            </button>
            <button 
              onClick={() => {
                setInputValue('/settings');
                setTimeout(handleSendMessage, 100);
              }}
              className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors"
            >
              ⚙️ Paramètres
            </button>
            <button 
              onClick={() => {
                setInputValue('/help');
                setTimeout(handleSendMessage, 100);
              }}
              className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
            >
              ❓ Aide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}