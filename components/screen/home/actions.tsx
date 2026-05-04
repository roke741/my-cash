import { useState } from 'react';
import { Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import ExpenseForm from './forms/expense-form';
import IncomeForm from './forms/income-form';

export default function Actions() {
  const [showExpense, setShowExpense] = useState(false);
  const [showIncome, setShowIncome] = useState(false);

  return (
    <>
      <HStack space="md" className="mb-6">
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setShowIncome(true)}
        >
          <Box
            className="rounded-2xl items-center py-3 bg-background-0 border border-outline-200/15"
          >
            <VStack space="xs" className="items-center">
              <ArrowUpRight size={20} color="#34C759" strokeWidth={2} />
              <Text size="xs" className="font-semibold text-typography-900">Ingreso</Text>
            </VStack>
          </Box>
        </Pressable>

        <Pressable
          style={{ flex: 1 }}
          onPress={() => setShowExpense(true)}
        >
          <Box
            className="rounded-2xl items-center py-3 bg-background-0 border border-outline-200/15"
          >
            <VStack space="xs" className="items-center">
              <ArrowDownLeft size={20} color="#FF3B30" strokeWidth={2} />
              <Text size="xs" className="font-semibold text-typography-900">Gasto</Text>
            </VStack>
          </Box>
        </Pressable>
      </HStack>

      <ExpenseForm isOpen={showExpense} onClose={() => setShowExpense(false)} />
      <IncomeForm  isOpen={showIncome}  onClose={() => setShowIncome(false)} />
    </>
  );
}
