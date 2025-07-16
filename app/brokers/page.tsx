'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, DollarSign, TrendingUp, Shield, Users } from 'lucide-react';
import { Navigation } from '@/components/ui/navigation';
import { supportedBrokers } from '@/lib/mock-data';

export default function BrokersPage() {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  const handleBrokerSelect = (brokerName: string, url: string) => {
    setSelectedBroker(brokerName);
    
    // Notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = `Redirection vers ${brokerName}...`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      window.open(url, '_blank');
      document.body.removeChild(notification);
      setSelectedBroker(null);
    }, 1500);
  };

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
                Courtiers Partenaires
              </h1>
              <p className="text-gray-600">
                Plateformes de trading compatibles avec TradeAlgo.AI
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Courtiers supportés</p>
                  <p className="text-2xl font-bold text-blue-600">{supportedBrokers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dépôt minimum</p>
                  <p className="text-2xl font-bold text-green-600">$5</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
                  <p className="text-2xl font-bold text-yellow-600">4.2/5</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Traders actifs</p>
                  <p className="text-2xl font-bold text-purple-600">10K+</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Brokers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedBrokers.map((broker, index) => (
              <motion.div
                key={broker.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={broker.logo} 
                    alt={broker.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{broker.name}</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(broker.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{broker.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dépôt minimum</span>
                    <span className="text-sm font-medium text-gray-900">${broker.min_deposit}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600 block mb-2">Fonctionnalités</span>
                    <div className="flex flex-wrap gap-1">
                      {broker.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBrokerSelect(broker.name, broker.url)}
                  disabled={selectedBroker === broker.name}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {selectedBroker === broker.name ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Redirection...</span>
                    </>
                  ) : (
                    <>
                      <span>Trader maintenant</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
          >
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold mb-4">Sécurité et Conformité</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Tous nos courtiers partenaires sont régulés et offrent une sécurité maximale pour vos fonds. 
                TradeAlgo.AI ne stocke aucune information financière personnelle.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-blue-100">Sécurisé</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-blue-100">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">0%</div>
                  <div className="text-blue-100">Commission</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}