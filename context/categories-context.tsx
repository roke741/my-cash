import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { categoriesDB } from '@/database/models/categories';
import { ExpenseCategory } from '@/database/types';

interface CategoriesContextType {
  categories: ExpenseCategory[];
  refresh: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  removeCategory: (id: number) => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  const refresh = useCallback(async () => {
    setCategories(await categoriesDB.all());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addCategory = useCallback(async (name: string) => {
    await categoriesDB.create(name);
    await refresh();
  }, [refresh]);

  const removeCategory = useCallback(async (id: number) => {
    await categoriesDB.delete(id);
    await refresh();
  }, [refresh]);

  return (
    <CategoriesContext.Provider value={{ categories, refresh, addCategory, removeCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used inside CategoriesProvider');
  return ctx;
};
