import { useEffect, useState } from 'react';
import {
  Actionsheet, ActionsheetBackdrop, ActionsheetContent,
  ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator,
  ActionsheetItem, ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { frequenciesDB } from '@/database/models/frequencies';
import { Frequency } from '@/database/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (frequency: Frequency) => void;
}

export default function SelectFrequency({ isOpen, onClose, onSelect }: Props) {
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);

  useEffect(() => {
    frequenciesDB.all().then(setFrequencies);
  }, []);

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {frequencies.map((f) => (
          <ActionsheetItem key={f.id} onPress={() => { onSelect(f); onClose(); }}>
            <ActionsheetItemText>{f.name}</ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
}
