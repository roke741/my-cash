import React, { useEffect, createContext, useContext, useState } from "react";
import { bankAccountsDB } from "@/database/models/bank-accounts";
import { BankAccount, CreateBankAccount } from "@/database/types";

interface BankAccountsContextType {
  balance: number;
  bankAccounts: BankAccount[];
  addBankAccount: ({
    name,
    bank_id,
    account_number,
    balance,
  }: CreateBankAccount) => Promise<void>;
  deleteBankAccount: (id: number) => Promise<void>;
}

export const BankAccountsContext = createContext<
  BankAccountsContextType | undefined
>(undefined);

export const BankAccountsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const refreshBankAccounts = async () => { 
    try {
      const accounts = await bankAccountsDB.all();
      setBankAccounts(accounts);
    } catch (error) {
      console.error("Error al cargar las cuentas bancarias:", error);
    }
  };

  useEffect(() => {
    refreshBankAccounts();
  }, []);


  useEffect(() => {
    const totalBalance = bankAccounts.reduce((acc, account) => {
      return acc + account.balance;
    }, 0);
    setBalance(Number(totalBalance.toFixed(2)));
  }, [bankAccounts]);


  const addBankAccount = async ({
    name,
    bank_id,
    account_number,
    balance,
    }: CreateBankAccount) => {
    try {
      await bankAccountsDB.create({ name, bank_id, account_number, balance });  
      await refreshBankAccounts();
    } catch (error) {
      console.error("Error al agregar la cuenta bancaria:", error);
    }
  };

  const deleteBankAccount = async (id: number) => {
    try {
      await bankAccountsDB.delete(id);
      await refreshBankAccounts();
    } catch (error) {
      console.error("Error al eliminar la cuenta bancaria:", error);
    }
  };

  const contextValue: BankAccountsContextType = {
    balance,
    bankAccounts,
    addBankAccount,
    deleteBankAccount,
  };

  return (
    <BankAccountsContext.Provider value={contextValue}>
      {children}
    </BankAccountsContext.Provider>
  );
};

export const useBankAccounts = () => {
  const context = useContext(BankAccountsContext);
  if (!context) {
    throw new Error(
      "useBankAccounts debe usarse dentro de un BankAccountsProvider"
    );
  }
  return context;
};
