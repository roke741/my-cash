import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { useState, useEffect } from "react";
import { banksDB } from "@/database/models/banks";
import { BankType } from "@/database/types";

interface SelectBankProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBank: (bank: BankType) => void;
}

export default function SelectBank({
  isOpen,
  onClose,
  onSelectBank,
}: SelectBankProps) {
  const [banks, setBanks] = useState<BankType[]>([]);
  const handleClose = () => {
    onClose();
  };
  useEffect(() => {
    async function fetchBanks() {
      setBanks(await banksDB.all());
    }
    fetchBanks();
  }, []);

  return (
    <Actionsheet isOpen={isOpen} onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {banks.map((bank) => (
          <ActionsheetItem
            key={bank.id}
            onPress={() => {
              onSelectBank(bank); 
              handleClose();
            }}
          >
            <ActionsheetItemText>{bank.name}</ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
}
