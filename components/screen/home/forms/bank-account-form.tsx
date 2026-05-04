import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner-native';
import { Landmark } from 'lucide-react-native';

import { Icon, CloseIcon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Box } from '@/components/ui/box';

import SelectBank from '@/components/custom/select/select-bank';
import SelectCurrency from '@/components/custom/select/select-currency';

import { useBankAccounts } from '@/context/bank-accounts-context';
import { Bank, Currency } from '@/database/types';

const schema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  account_number: z.string().optional(),
  initial_balance: z.string().refine((v) => !isNaN(parseFloat(v)), 'Debe ser un número'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_BANK: Bank = { id: 0, name: 'Seleccionar banco', abbreviation: '' };
const DEFAULT_CURRENCY: Currency = { code: 'PEN', name: 'Sol peruano', symbol: 'S/' };

export default function BankAccountForm({ isOpen, onClose }: Props) {
  const { addBankAccount } = useBankAccounts();

  const [showBankSheet, setShowBankSheet] = useState(false);
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank>(DEFAULT_BANK);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(DEFAULT_CURRENCY);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { initial_balance: '0' },
  });

  const handleClose = () => {
    reset();
    setSelectedBank(DEFAULT_BANK);
    setSelectedCurrency(DEFAULT_CURRENCY);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    if (selectedBank.id === 0) return toast.error('Selecciona un banco');
    try {
      await addBankAccount({
        bank_id: selectedBank.id,
        name: data.name,
        account_number: data.account_number ?? '',
        currency: selectedCurrency.code,
        initial_balance: parseFloat(data.initial_balance),
      });
      toast.success('Cuenta agregada');
      handleClose();
    } catch (e) {
      toast.error('Error al guardar la cuenta');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalBackdrop />
        <ModalContent className="border-0 rounded-2xl">
          <ModalHeader>
            <HStack space="xs" className="items-center flex-1">
              <Landmark size={18} color="#4B5563" />
              <Heading size="md">Nueva cuenta</Heading>
            </HStack>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" className="stroke-background-400" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <VStack space="sm">
              {/* Bank selector */}
              <Button variant="outline" onPress={() => setShowBankSheet(true)}>
                <ButtonText>
                  {selectedBank.id !== 0
                    ? `${selectedBank.name} (${selectedBank.abbreviation})`
                    : 'Seleccionar banco'}
                </ButtonText>
              </Button>

              {/* Currency + initial balance side by side */}
              <HStack space="sm">
                <Box className="flex-1">
                  <Button variant="outline" onPress={() => setShowCurrencySheet(true)}>
                    <ButtonText>{selectedCurrency.symbol} {selectedCurrency.code}</ButtonText>
                  </Button>
                </Box>
                <Box className="flex-1">
                  <Controller
                    control={control}
                    name="initial_balance"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input variant="outline" size="md">
                        <InputField
                          placeholder="Saldo inicial"
                          keyboardType="decimal-pad"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={String(value ?? '')}
                        />
                      </Input>
                    )}
                  />
                </Box>
              </HStack>
              {errors.initial_balance && (
                <Text size="xs" className="text-error-600">{errors.initial_balance.message}</Text>
              )}

              {/* Account name */}
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="Nombre de la cuenta"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
              {errors.name && (
                <Text size="xs" className="text-error-600">{errors.name.message}</Text>
              )}

              {/* Account number (optional) */}
              <Controller
                control={control}
                name="account_number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input variant="outline" size="md">
                    <InputField
                      placeholder="Número de cuenta (opcional)"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                )}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" action="secondary" onPress={handleClose}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={handleSubmit(onSubmit)} isDisabled={isSubmitting}>
              <ButtonText>{isSubmitting ? 'Guardando...' : 'Agregar cuenta'}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SelectBank isOpen={showBankSheet} onClose={() => setShowBankSheet(false)} onSelect={setSelectedBank} />
      <SelectCurrency isOpen={showCurrencySheet} onClose={() => setShowCurrencySheet(false)} onSelect={setSelectedCurrency} />
    </>
  );
}
