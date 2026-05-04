import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { bankAccountsDB } from '@/database/models/bank-accounts';
import { BankAccount, CreateBankAccount } from '@/database/types';

interface BalanceByCurrency {
  currency: string;
  total: number;
}

interface BankAccountsContextType {
  bankAccounts: BankAccount[];
  balancesByCurrency: BalanceByCurrency[];
  refresh: () => Promise<void>;
  addBankAccount: (data: CreateBankAccount) => Promise<void>;
  deleteBankAccount: (id: number) => Promise<void>;
}

export const BankAccountsContext = createContext<BankAccountsContextType | undefined>(undefined);

export const BankAccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [balancesByCurrency, setBalancesByCurrency] = useState<BalanceByCurrency[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [accounts, totals] = await Promise.all([
        bankAccountsDB.all(),
        bankAccountsDB.totalByCurrency(),
      ]);
      setBankAccounts(accounts);
      setBalancesByCurrency(totals);
    } catch (e) {
      console.error('BankAccountsContext refresh error:', e);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addBankAccount = useCallback(async (data: CreateBankAccount) => {
    await bankAccountsDB.create(data);
    await refresh();
  }, [refresh]);

  const deleteBankAccount = useCallback(async (id: number) => {
    await bankAccountsDB.delete(id);
    await refresh();
  }, [refresh]);

  return (
    <BankAccountsContext.Provider value={{ bankAccounts, balancesByCurrency, refresh, addBankAccount, deleteBankAccount }}>
      {children}
    </BankAccountsContext.Provider>
  );
};

export const useBankAccounts = () => {
  const ctx = useContext(BankAccountsContext);
  if (!ctx) throw new Error('useBankAccounts must be used inside BankAccountsProvider');
  return ctx;
};
