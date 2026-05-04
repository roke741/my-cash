import { useState, useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import TransactionCard from '@/components/screen/home/transaction-card';
import { transactionsDB } from '@/database/models/transactions';
import { Transaction, TRANSACTION_TYPE } from '@/database/types';

type Filter = 'all' | 'income' | 'expense';

const FILTER_LABELS: Record<Filter, string> = { all: 'Todos', income: 'Ingresos', expense: 'Gastos' };
const FILTER_COLOR:  Record<Filter, string>  = { all: '#8B5CF6', income: '#34C759', expense: '#FF3B30' };

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [filter, setFilter]             = useState<Filter>('all');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const typeId =
        filter === 'income'  ? TRANSACTION_TYPE.INCOME  :
        filter === 'expense' ? TRANSACTION_TYPE.EXPENSE : undefined;
      setTransactions(await transactionsDB.filter({ typeId }));
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const totalIncome  = transactions.filter(t => t.transaction_type_id === TRANSACTION_TYPE.INCOME).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.transaction_type_id === TRANSACTION_TYPE.EXPENSE).reduce((s, t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;

  return (
    <FlatList
      className='p-4'
      data={transactions}
      keyExtractor={(item) => String(item.id)}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#8B5CF6" />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => <TransactionCard transaction={item} />}

      ListHeaderComponent={
        <Box className="pt-4 pb-3">
          <Heading size="2xl" className="text-typography-900 font-bold mb-5">Historial</Heading>

          {/* Filter pills */}
          <HStack space="sm" className="mb-4">
            {(['all', 'income', 'expense'] as Filter[]).map((f) => {
              const active = filter === f;
              const color  = FILTER_COLOR[f];
              return (
                <Pressable key={f} onPress={() => setFilter(f)} style={{ flex: 1 }}>
                  <Box
                    className={`rounded-full py-2 items-center border ${
                      active ? '' : 'bg-background-0 border-outline-200/15'
                    }`}
                    style={active ? { backgroundColor: color, borderColor: color } : undefined}
                  >
                    <Text
                      size="sm"
                      className={`font-semibold ${active ? 'text-typography-white' : 'text-typography-900'}`}
                    >
                      {FILTER_LABELS[f]}
                    </Text>
                  </Box>
                </Pressable>
              );
            })}
          </HStack>

          {/* Summary */}
          <HStack space="sm" className="mb-4">
            {[
              { label: 'Ingresos', value: totalIncome,       className: 'text-success-400', prefix: '+' },
              { label: 'Gastos',   value: totalExpense,      className: 'text-error-400',   prefix: '-' },
              { label: 'Balance',  value: Math.abs(balance), className: balance >= 0 ? 'text-success-400' : 'text-error-400', prefix: balance >= 0 ? '+' : '-' },
            ].map(({ label, value, className, prefix }) => (
              <Box
                key={label}
                className="flex-1 rounded-2xl p-3 bg-background-0 border border-outline-200/15"
              >
                <Text size="xs" className="text-typography-500 mb-1">{label}</Text>
                <Text size="sm" className={`font-bold ${className}`}>
                  {prefix}{value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </Text>
              </Box>
            ))}
          </HStack>
        </Box>
      }

      ListEmptyComponent={
        !isLoading ? (
          <Box
            className="py-10 rounded-2xl bg-background-0 items-center border border-outline-200/15"
          >
            <Text size="sm" className="text-typography-500 text-center">
              Sin movimientos en este periodo
            </Text>
          </Box>
        ) : null
      }
    />
  );
}
