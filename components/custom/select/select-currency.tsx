import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { currenciesDB } from '@/database/models/currencies';
import { Currency } from '@/database/types';
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: Currency) => void;
}

export default function SelectCurrency({ isOpen, onClose, onSelect }: Props) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    currenciesDB.all().then(setCurrencies);
  }, []);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {currencies.map((c) => (
          <ActionsheetItem key={c.code} onPress={() => { onSelect(c); onClose(); }}>
            <ActionsheetItemText>{c.symbol} {c.code} — {c.name}</ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
}
