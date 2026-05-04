import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { useBanks } from '@/context/bank-context';
import { Bank } from '@/database/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bank: Bank) => void;
}

export default function SelectBank({ isOpen, onClose, onSelect }: Props) {
  const { banks } = useBanks();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {banks.map((bank) => (
          <ActionsheetItem key={bank.id} onPress={() => { onSelect(bank); onClose(); }}>
            <ActionsheetItemText>{bank.name}</ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
}
