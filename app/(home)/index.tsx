import { Fragment, useCallback, useEffect } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';

import Header from '@/components/screen/home/header';
import Actions from '@/components/screen/home/actions';
import TransactionCard from '@/components/screen/home/transaction-card';

import { useBankAccounts } from '@/context/bank-accounts-context';
import { useTransactions } from '@/context/transactions-context';

const RECENT_LIMIT = 10;

function BalanceSection({ balancesByCurrency }: { balancesByCurrency: { currency: string; total: number }[] }) {
  if (balancesByCurrency.length === 0) {
    return (
      <Box
        className="rounded-3xl p-5 mb-6 bg-background-0"
        style={{ borderWidth: 1, borderColor: 'rgba(60,60,67,0.12)' }}
      >
        <Text size="sm" className="text-typography-500 text-center">
          Sin cuentas. Agrega una en Ajustes.
        </Text>
      </Box>
    );
  }

  if (balancesByCurrency.length === 1) {
    const { currency, total } = balancesByCurrency[0];
    const positive = total >= 0;
    return (
      <Box
        className="rounded-3xl p-6 mb-6"
        style={{ backgroundColor: positive ? '#8B5CF6' : '#FF3B30' }}
      >
        <Text size="xs" style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
          Balance disponible
        </Text>
        <Heading
          size="3xl"
          style={{ color: '#FFFFFF', fontWeight: '700', letterSpacing: -0.5 }}
        >
          {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Heading>
        <Text size="sm" style={{ color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
          {currency}
        </Text>
      </Box>
    );
  }

  return (
    <HStack space="sm" className="mb-6 flex-wrap">
      {balancesByCurrency.map(({ currency, total }) => {
        const positive = total >= 0;
        return (
          <Box
            key={currency}
            className="flex-1 rounded-2xl p-4 bg-background-0"
            style={{ minWidth: 128, borderWidth: 1, borderColor: 'rgba(60,60,67,0.1)' }}
          >
            <HStack className="justify-between items-center mb-2">
              <Text size="xs" className="text-typography-500">{currency}</Text>
              <Box
                className="px-2 py-0.5 rounded-md"
                style={{ backgroundColor: positive ? '#E8FAF0' : '#FFF0EF' }}
              >
                <Text size="2xs" style={{ color: positive ? '#34C759' : '#FF3B30', fontWeight: '600' }}>
                  {positive ? '+' : '-'}
                </Text>
              </Box>
            </HStack>
            <Text
              size="lg"
              className={positive ? 'text-typography-900' : 'text-error-400'}
              style={{ fontWeight: '700' }}
            >
              {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </Text>
          </Box>
        );
      })}
    </HStack>
  );
}

export default function DashboardScreen() {
  const { balancesByCurrency, refresh: refreshAccounts } = useBankAccounts();
  const { transactions, isLoading, refresh: refreshTx } = useTransactions();

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshAccounts(), refreshTx()]);
  }, [refreshAccounts, refreshTx]);

  useEffect(() => { refreshTx(); }, [refreshTx]);

  const recent = transactions.slice(0, RECENT_LIMIT);

  return (
    <ScrollView
      className='p-4'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshAll} tintColor="#8B5CF6" />}
    >
      <Header />
      <BalanceSection balancesByCurrency={balancesByCurrency} />
      <Actions />

      {/* Recent transactions */}
      <HStack className="justify-between items-center mb-3">
        <Text size="xs" className="text-typography-500 font-semibold uppercase">
          Movimientos recientes
        </Text>
        {transactions.length > RECENT_LIMIT && (
          <Text size="xs" className="text-primary-600 font-medium">Ver todos</Text>
        )}
      </HStack>

      {recent.length === 0 ? (
        <Box
          className="rounded-2xl py-8 px-4 items-center bg-background-0 border border-outline-200/15"
        >
          <Text size="sm" className="text-typography-500 text-center">
            Sin movimientos aún.{'\n'}Registra tu primero usando los botones de arriba.
          </Text>
        </Box>
      ) : (
        <Box
          className="rounded-2xl overflow-hidden bg-background-0 border border-outline-200/15"
        >
          {recent.map((tx, i) => (
            <Fragment key={tx.id}>
              {i > 0 && <Divider />}
              <TransactionCard transaction={tx} />
            </Fragment>
          ))}
        </Box>
      )}
    </ScrollView>
  );
}
