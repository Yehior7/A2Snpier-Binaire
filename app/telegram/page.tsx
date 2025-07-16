'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { TelegramBotSimulator } from '@/components/ui/telegram-bot-simulator';
import { Bot, MessageCircle, Zap, Shield, Users, Star } from 'lucide-react';

export default function TelegramPage() {
  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Bot Intelligent",
      description: "Interface conversationnelle avancée avec commandes intuitives"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Signaux Instantanés",
      description: "Notifications push en temps réel dès qu'un signal est généré"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sécurisé",
      description: "Authentification à deux facteurs et chiffrement des données"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Communauté VIP",
      description: "Accès aux groupes privés de traders professionnels"
    }
  ];

  const commands = [
    { command: '/start', description: 'Initialisation et connexion au service' },
    { command: '/signals', description: 'Affichage des derniers signaux de trading' },
    { command: '/performance', description: 'Statistiques de performance détaillées' },
    { command: '/settings', description: 'Configuration des préférences utilisateur' },
    { command: '/help', description: 'Guide d\'utilisation complet' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="md:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bot Telegram TradeAlgo.AI
              </h1>
              <p className="text-gray-600">
                Interface principale pour recevoir vos signaux de trading en temps réel
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Simulateur Telegram */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TelegramBotSimulator />
              </motion.div>
            </div>

            {/* Informations et fonctionnalités */}
            <div className="lg:col-span-1 space-y-8">
              {/* Fonctionnalités */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Fonctionnalités du Bot
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-blue-600">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Commandes disponibles */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Commandes Disponibles
                </h3>
                <div className="space-y-4">
                  {commands.map((cmd, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">
                        {cmd.command}
                      </code>
                      <p className="text-sm text-gray-600 flex-1">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Format des signaux */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Format des Signaux
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                  <div className="mb-2">🎯 SIGNAL TRADING - TradeAlgo.AI</div>
                  <div className="mb-1">📊 Paire: EUR/USD</div>
                  <div className="mb-1">📈 Direction: CALL ⬆️</div>
                  <div className="mb-1">⏰ Expiration: 5 minutes</div>
                  <div className="mb-1">🎯 Confiance: 87%</div>
                  <div className="mb-1">💰 Prix d'entrée: 1.0825</div>
                  <div className="mb-2">📍 Target: 1.0835</div>
                  <div className="text-blue-400">#EURUSD #CALL #5MIN</div>
                </div>
              </motion.div>

              {/* Statistiques */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Performance du Bot
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">90.2%</div>
                    <div className="text-blue-100 text-sm">Taux de réussite</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">47</div>
                    <div className="text-blue-100 text-sm">Signaux/jour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">28s</div>
                    <div className="text-blue-100 text-sm">Temps moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-blue-100 text-sm">Disponibilité</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Instructions d'installation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 bg-white rounded-xl shadow-lg border border-gray-100 p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Comment commencer avec le Bot Telegram
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Rejoindre le Bot</h4>
                <p className="text-gray-600 text-sm">
                  Recherchez @TradeAlgoBot sur Telegram et cliquez sur "Démarrer"
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Authentification</h4>
                <p className="text-gray-600 text-sm">
                  Connectez votre compte TradeAlgo.AI pour accéder aux signaux
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Recevoir les Signaux</h4>
                <p className="text-gray-600 text-sm">
                  Configurez vos préférences et commencez à recevoir les signaux
                </p>
              </div>
            </div>
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                Rejoindre le Bot Maintenant
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}