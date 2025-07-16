'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield, Crown, X, CreditCard, Smartphone } from 'lucide-react';

const plans = [
  {
    name: 'Standard',
    price: 198,
    originalPrice: 298,
    discount: 33,
    description: 'Parfait pour débuter avec les signaux IA',
    features: [
      'Jusqu\'à 50 signaux/jour',
      'Bot Telegram privé',
      'Indicateurs techniques de base',
      'Support par email',
      'Historique 30 jours',
      'Accès communauté Discord'
    ],
    limitations: [
      'Pas d\'accès API',
      'Pas de backtesting avancé'
    ],
    color: 'blue',
    popular: false
  },
  {
    name: 'Premium',
    price: 298,
    originalPrice: 398,
    discount: 25,
    description: 'Le choix des traders sérieux',
    features: [
      'Signaux illimités',
      'Dashboard web complet',
      'Indicateurs avancés (50+)',
      'Historique 90 jours',
      'Support chat en direct',
      'Notifications push',
      'Analyses de marché quotidiennes',
      'Webinaires exclusifs',
      'Backtesting de base'
    ],
    limitations: [],
    color: 'purple',
    popular: true
  },
  {
    name: 'Professional',
    price: 398,
    originalPrice: 598,
    discount: 33,
    description: 'Pour les traders professionnels',
    features: [
      'Toutes les fonctionnalités Premium',
      'Accès API complet',
      'Backtesting avancé',
      'Coaching personnalisé (2h/mois)',
      'Historique illimité',
      'Signaux multi-timeframes',
      'Alertes personnalisées',
      'Rapports détaillés',
      'Support téléphonique prioritaire',
      'Accès bêta nouvelles fonctionnalités'
    ],
    limitations: [],
    color: 'gold',
    popular: false
  }
];

const paymentMethods = [
  { id: 'card', name: 'Carte bancaire', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
  { id: 'paypal', name: 'PayPal', icon: Smartphone, description: 'Paiement sécurisé' },
  { id: 'crypto', name: 'Crypto', icon: Zap, description: 'Bitcoin, Ethereum' }
];

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const getBillingMultiplier = () => {
    switch (billingCycle) {
      case 'quarterly': return 3 * 0.9; // 10% de réduction
      case 'yearly': return 12 * 0.8; // 20% de réduction
      default: return 1;
    }
  };

  const handleSelectPlan = (planIndex: number) => {
    setSelectedPlan(planIndex);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulation du processus de paiement
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setShowPaymentModal(false);
    
    alert(`Paiement réussi ! Bienvenue dans le plan ${plans[selectedPlan!].name} !`);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre plan
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Des plans adaptés à tous les niveaux de trading
            </p>
            
            {/* Cycle de facturation */}
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('quarterly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'quarterly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trimestriel
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">-10%</span>
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annuel
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">-20%</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                plan.popular 
                  ? 'border-purple-500 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Plus populaire</span>
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Header du plan */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${Math.round(plan.price * getBillingMultiplier())}
                      </span>
                      <div className="text-left">
                        <div className="text-sm text-gray-500 line-through">
                          ${Math.round(plan.originalPrice * getBillingMultiplier())}
                        </div>
                        <div className="text-sm text-gray-600">
                          /{billingCycle === 'monthly' ? 'mois' : billingCycle === 'quarterly' ? '3 mois' : 'an'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Économisez {plan.discount}%
                    </div>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start space-x-3 opacity-60">
                      <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* Bouton d'action */}
                <button
                  onClick={() => handleSelectPlan(index)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Choisir {plan.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Garanties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantie 30 jours</h3>
              <p className="text-gray-600">Remboursement intégral si vous n'êtes pas satisfait</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activation instantanée</h3>
              <p className="text-gray-600">Accès immédiat après paiement</p>
            </div>
            <div className="flex flex-col items-center">
              <Crown className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support premium</h3>
              <p className="text-gray-600">Équipe dédiée pour vous accompagner</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && selectedPlan !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Finaliser l'abonnement
              </h3>
              <p className="text-gray-600">
                Plan {plans[selectedPlan].name} - ${Math.round(plans[selectedPlan].price * getBillingMultiplier())}
              </p>
            </div>

            {/* Méthodes de paiement */}
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                    selectedPayment === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.icon className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <span>Confirmer le paiement</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}