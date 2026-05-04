import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { useBankAccounts } from '@/context/bank-accounts-context';
import { BankAccount } from '@/database/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: BankAccount) => void;
}

export default function SelectBankAccounts({ isOpen, onClose, onSelect }: Props) {
  const { bankAccounts } = useBankAccounts();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {bankAccounts.length === 0 ? (
          <ActionsheetItem>
            <ActionsheetItemText>No hay cuentas. Agrégala en Ajustes.</ActionsheetItemText>
          </ActionsheetItem>
        ) : (
          bankAccounts.map((account) => (
            <ActionsheetItem key={account.id} onPress={() => { onSelect(account); onClose(); }}>
              <ActionsheetItemText>
                {account.name} · {account.currency} {(account.balance ?? 0).toFixed(2)}
              </ActionsheetItemText>
            </ActionsheetItem>
          ))
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
}
