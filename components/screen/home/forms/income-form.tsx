import React, { useState } from 'react';
import { Platform, Pressable, View, TextInput, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TrendingUp, ChevronRight } from 'lucide-react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner-native';

import { Icon, CloseIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { Box } from '@/components/ui/box';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';

import SelectExpenseCategory from '@/components/custom/select/select-expense-category';
import SelectBankAccounts from '@/components/custom/select/select-bank-accounts';

import { useTransactions } from '@/context/transactions-context';
import { useBankAccounts } from '@/context/bank-accounts-context';
import { BankAccount, ExpenseCategory, TRANSACTION_TYPE } from '@/database/types';

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Ingresa un monto')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Debe ser mayor a 0'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function IncomeForm({ isOpen, onClose }: Props) {
  const { addTransaction } = useTransactions();
  const { refresh: refreshAccounts } = useBankAccounts();

  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [date, setDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleClose = () => {
    reset();
    setSelectedCategory(null);
    setSelectedAccount(null);
    setDate(new Date());
    setHasAttemptedSubmit(false);
    setShowDatePicker(false);
    onClose();
  };

  const handleSave = () => {
    setHasAttemptedSubmit(true);
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedAccount) return toast.error('Selecciona una cuenta');
    if (!selectedCategory) return toast.error('Selecciona una categoría');

    try {
      await addTransaction({
        bank_account_id: selectedAccount.id,
        category_id: selectedCategory.id,
        amount: parseFloat(data.amount),
        description: data.description ?? '',
        transaction_type_id: TRANSACTION_TYPE.INCOME,
        transaction_date: date.toISOString().split('T')[0],
      });
      await refreshAccounts();
      toast.success('Ingreso registrado');
      handleClose();
    } catch {
      toast.error('Error al guardar el ingreso');
    }
  };

  const accountInvalid = hasAttemptedSubmit && !selectedAccount;
  const categoryInvalid = hasAttemptedSubmit && !selectedCategory;
  const formattedDate = date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalBackdrop />
        <ModalContent className="border-0 rounded-2xl">
          <ModalHeader>
            <HStack space="xs" className="items-center flex-1">
              <TrendingUp size={18} color="#16a34a" />
              <Heading size="md">Registrar ingreso</Heading>
            </HStack>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" className="stroke-background-400" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <Box className="rounded-2xl overflow-hidden bg-background-0" style={styles.card}>
              {/* Cuenta */}
              <Pressable
                onPress={() => setShowAccountSheet(true)}
                style={[styles.row, accountInvalid && styles.rowInvalid]}
              >
                <Text size="sm" className="text-typography-900 font-medium">Cuenta</Text>
                <HStack className="items-center" style={styles.rowRight}>
                  <Text
                    size="sm"
                    className={selectedAccount ? 'text-typography-600' : 'text-typography-300'}
                    numberOfLines={1}
                    style={styles.rowValue}
                  >
                    {selectedAccount
                      ? `${selectedAccount.name} · ${selectedAccount.currency}`
                      : 'Seleccionar'}
                  </Text>
                  <ChevronRight size={15} color="#C7C7CC" />
                </HStack>
              </Pressable>

              <Divider />

              {/* Categoría */}
              <Pressable
                onPress={() => setShowCategorySheet(true)}
                style={[styles.row, categoryInvalid && styles.rowInvalid]}
              >
                <Text size="sm" className="text-typography-900 font-medium">Categoría</Text>
                <HStack className="items-center" style={styles.rowRight}>
                  <Text
                    size="sm"
                    className={selectedCategory ? 'text-typography-600' : 'text-typography-300'}
                    numberOfLines={1}
                    style={styles.rowValue}
                  >
                    {selectedCategory ? selectedCategory.name : 'Seleccionar'}
                  </Text>
                  <ChevronRight size={15} color="#C7C7CC" />
                </HStack>
              </Pressable>

              <Divider />

              {/* Monto */}
              <View style={styles.row}>
                <Text size="sm" className="text-typography-900 font-medium">Monto</Text>
                <HStack className="items-center flex-1 justify-end" style={{ gap: 6 }}>
                  {selectedAccount && (
                    <Text size="sm" className="text-typography-400">
                      {selectedAccount.currency}
                    </Text>
                  )}
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="text-typography-900"
                        placeholder="0.00"
                        placeholderTextColor="#C7C7CC"
                        keyboardType="decimal-pad"
                        textAlign="right"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.textInput, errors.amount && styles.textInputError]}
                      />
                    )}
                  />
                </HStack>
              </View>
              {errors.amount && (
                <Text size="xs" className="text-error-600 pb-2" style={{ paddingHorizontal: 16 }}>
                  {errors.amount.message}
                </Text>
              )}

              <Divider />

              {/* Descripción */}
              <View style={styles.row}>
                <Text size="sm" className="text-typography-900 font-medium">Descripción</Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="text-typography-900"
                      placeholder="Opcional"
                      placeholderTextColor="#C7C7CC"
                      textAlign="right"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[styles.textInput, { flex: 1, marginLeft: 12 }]}
                    />
                  )}
                />
              </View>

              <Divider />

              {/* Fecha */}
              <Pressable
                onPress={() => setShowDatePicker((v) => !v)}
                style={styles.row}
              >
                <Text size="sm" className="text-typography-900 font-medium">Fecha</Text>
                <HStack className="items-center" style={styles.rowRight}>
                  <Text size="sm" className="text-typography-600" style={styles.rowValue}>
                    {formattedDate}
                  </Text>
                  <ChevronRight size={15} color="#C7C7CC" />
                </HStack>
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(_, d) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (d) setDate(d);
                  }}
                />
              )}
            </Box>

            {hasAttemptedSubmit && (accountInvalid || categoryInvalid) && (
              <Text size="xs" className="text-error-600 text-center mt-2">
                {accountInvalid && categoryInvalid
                  ? 'Selecciona una cuenta y una categoría'
                  : accountInvalid
                  ? 'Selecciona una cuenta'
                  : 'Selecciona una categoría'}
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" action="secondary" onPress={handleClose}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={handleSave} isDisabled={isSubmitting} className="bg-success-600">
              <ButtonText>{isSubmitting ? 'Guardando...' : 'Guardar ingreso'}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SelectExpenseCategory
        isOpen={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSelect={setSelectedCategory}
      />
      <SelectBankAccounts
        isOpen={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        onSelect={setSelectedAccount}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(60,60,67,0.15)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowInvalid: {
    backgroundColor: 'rgba(255,59,48,0.06)',
  },
  rowRight: {
    gap: 4,
    maxWidth: '60%',
    justifyContent: 'flex-end',
  },
  rowValue: {
    textAlign: 'right',
    flexShrink: 1,
  },
  textInput: {
    fontSize: 14,
    minWidth: 80,
    maxWidth: 160,
  },
  textInputError: {
    color: '#dc2626',
  },
});
