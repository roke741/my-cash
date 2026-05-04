import React, { createContext, useContext, useState, useCallback } from 'react';
import { transactionsDB } from '@/database/models/transactions';
import { CreateTransaction, Transaction } from '@/database/types';

interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  addTransaction: (data: CreateTransaction) => Promise<void>;
  editTransaction: (id: number, data: Partial<CreateTransaction>) => Promise<void>;
  removeTransaction: (id: number) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setTransactions(await transactionsDB.all());
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = useCallback(async (data: CreateTransaction) => {
    await transactionsDB.create(data);
    await refresh();
  }, [refresh]);

  const editTransaction = useCallback(async (id: number, data: Partial<CreateTransaction>) => {
    await transactionsDB.update(id, data);
    await refresh();
  }, [refresh]);

  const removeTransaction = useCallback(async (id: number) => {
    await transactionsDB.delete(id);
    await refresh();
  }, [refresh]);

  return (
    <TransactionsContext.Provider value={{ transactions, isLoading, refresh, addTransaction, editTransaction, removeTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error('useTransactions must be used inside TransactionsProvider');
  return ctx;
};
