import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { banksDB } from '@/database/models/banks';
import { Bank } from '@/database/types';

interface BankContextType {
  banks: Bank[];
  refresh: () => Promise<void>;
}

export const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);

  const refresh = useCallback(async () => {
    setBanks(await banksDB.all());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <BankContext.Provider value={{ banks, refresh }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBanks = () => {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error('useBanks must be used inside BankProvider');
  return ctx;
};
