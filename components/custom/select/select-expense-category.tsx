import { View, Text as RNText } from 'react-native';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
} from '@/components/ui/actionsheet';
import { Text } from '@/components/ui/text';
import { useCategories } from '@/context/categories-context';
import { ExpenseCategory } from '@/database/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: ExpenseCategory) => void;
}

function splitName(name: string): [string, string] {
  const i = name.indexOf(' ');
  return i === -1 ? ['', name] : [name.slice(0, i), name.slice(i + 1)];
}

export default function SelectExpenseCategory({ isOpen, onClose, onSelect }: Props) {
  const { categories } = useCategories();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {categories.map((cat) => {
          const [emoji, label] = splitName(cat.name);
          return (
            <ActionsheetItem key={cat.id} onPress={() => { onSelect(cat); onClose(); }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                {emoji ? <RNText style={{ fontSize: 20 }}>{emoji}</RNText> : null}
                <Text size="md" className="text-typography-900">{label}</Text>
              </View>
            </ActionsheetItem>
          );
        })}
      </ActionsheetContent>
    </Actionsheet>
  );
}
