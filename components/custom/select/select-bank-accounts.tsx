import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import { BankAccount } from "@/database/types";  

interface BankAccountsSelectProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBank: (category: string) => void;
}

export default function SelectBankAccounts({
  isOpen,
  onClose,
  onSelectBank
}: BankAccountsSelectProps) {
  const db = useSQLiteContext();

  const [banks, setBanks] = useState<BankAccount[]>([]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    async function fetchBanks() {
      const banks = await db.getAllAsync<BankAccount>('SELECT * FROM bank_accounts'); // bank_accounts
      setBanks(banks);
    };
    fetchBanks();

  }, []);


  return (
    <Actionsheet 
    isOpen={isOpen}
    onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {!banks.length ? (
            <ActionsheetItem>
              <ActionsheetItemText>No bank accounts found</ActionsheetItemText>
            </ActionsheetItem>
          ) : (
            banks.map((bankAccount) => (
              <ActionsheetItem 
                key={bankAccount.id} 
                onPress={() => {
                  onSelectBank(bankAccount.name);
                  handleClose();
                }}>
                <ActionsheetItemText>{bankAccount.name}</ActionsheetItemText>
              </ActionsheetItem>
            ))
          )}
        </ActionsheetContent>
      </Actionsheet>
  );
}