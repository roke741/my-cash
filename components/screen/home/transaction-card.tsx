import { Text as RNText } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';
import { Transaction, TRANSACTION_TYPE } from '@/database/types';

function splitName(name: string): [string, string] {
  const i = name.indexOf(' ');
  return i === -1 ? ['', name] : [name.slice(0, i), name.slice(i + 1)];
}

interface Props {
  transaction: Transaction;
  currency?: string;
}

export default function TransactionCard({ transaction, currency }: Props) {
  const isIncome = transaction.transaction_type_id === TRANSACTION_TYPE.INCOME;
  const currencyCode = currency ?? (transaction as any).currency ?? '';

  const iconColor = isIncome ? '#34C759' : '#FF3B30';
  const amountClass = isIncome ? 'text-success-400' : 'text-error-400';

  return (
    <HStack className="px-4 py-3 items-center bg-background-0">
      <Box
        className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-background-100"
      >
        {isIncome
          ? <ArrowUpCircle size={18} color={iconColor} />
          : <ArrowDownCircle size={18} color={iconColor} />}
      </Box>

      <VStack className="flex-1 mr-2">
        <HStack style={{ alignItems: 'center', gap: 4 }}>
          {(() => {
            const raw = (transaction as any).category_name ?? 'Sin categoría';
            const [emoji, label] = splitName(raw);
            return emoji ? (
              <>
                <RNText style={{ fontSize: 13 }}>{emoji}</RNText>
                <Text size="sm" className="font-semibold text-typography-950" numberOfLines={1}>{label}</Text>
              </>
            ) : (
              <Text size="sm" className="font-semibold text-typography-950" numberOfLines={1}>{label}</Text>
            );
          })()}
        </HStack>
        <Text size="xs" className="text-typography-500" numberOfLines={1}>
          {transaction.description || transaction.transaction_date}
        </Text>
      </VStack>

      <Text size="sm" className={`font-semibold ${amountClass}`}>
        {isIncome ? '+' : '-'}{currencyCode} {transaction.amount.toFixed(2)}
      </Text>
    </HStack>
  );
}
