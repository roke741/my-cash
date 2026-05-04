import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { subscriptionsDB } from '@/database/models/subscriptions';
import { CreateSubscription, Subscription } from '@/database/types';

interface SubscriptionsContextType {
  subscriptions: Subscription[];
  dueCount: number;
  addSubscription: (data: CreateSubscription) => Promise<void>;
  applyPayment: (sub: Subscription) => Promise<void>;
  deactivateSubscription: (id: number) => Promise<void>;
  refresh: () => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextType | undefined>(undefined);

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    const data = await subscriptionsDB.all();
    setSubscriptions(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addSubscription = async (data: CreateSubscription) => {
    await subscriptionsDB.create(data);
    await load();
  };

  const applyPayment = async (sub: Subscription) => {
    await subscriptionsDB.applyPayment(sub, today);
    await load();
  };

  const deactivateSubscription = async (id: number) => {
    await subscriptionsDB.deactivate(id);
    await load();
  };

  const dueCount = subscriptions.filter(
    (s) => s.next_payment_date != null && s.next_payment_date <= today
  ).length;

  return (
    <SubscriptionsContext.Provider value={{
      subscriptions,
      dueCount,
      addSubscription,
      applyPayment,
      deactivateSubscription,
      refresh: load,
    }}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx) throw new Error('useSubscriptions must be used within SubscriptionsProvider');
  return ctx;
}
