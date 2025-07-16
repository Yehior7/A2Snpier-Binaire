'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/navigation';
import { UnifiedTradingDashboard } from '@/components/ui/unified-trading-dashboard';
import { useAppStore } from '@/lib/store';

export default function TradingPage() {
  const { user } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Trading Unifié OANDA & Deriv
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez vos comptes OANDA et Deriv depuis une interface unifiée
              </p>
            </motion.div>
          </div>

          {/* Dashboard unifié */}
          <UnifiedTradingDashboard userId={user?.id || 'demo_user'} />
        </div>
      </div>
    </div>
  );
}