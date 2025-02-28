import React, { useEffect, createContext, useContext, useState } from "react";
import { banksDB } from "@/database/models/banks";
import { BankType } from "@/database/types";

export const BankContext = createContext({} as any);

export const BankProvider = ({ children }: any) => {
  const [banks, setBanks] = useState<BankType[]>([]);

  useEffect(() => {
    refreshBanks();
  }, []);

  const refreshBanks = async () => {
    setBanks(await banksDB.all());
  };

  const addBank = async (name: string, abbreviation: string) => {
    await banksDB.create(name, abbreviation);
  };

  const deleteBank = async (id: number) => {
    await banksDB.delete(id);
  };

  return (
    <BankContext.Provider value={{ banks, addBank, deleteBank }}>
      {children}
    </BankContext.Provider>
  );
};

export const useBankContext = () => {
  return useContext(BankContext);
};
