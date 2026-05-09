import { Fragment, useState } from 'react';
import {
  ScrollView, Alert, Pressable, View, TextInput,
  Platform, StyleSheet, Text as RNText,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  RefreshCw, Plus, ChevronRight, Repeat,
  TrendingUp, TrendingDown, AlertCircle, X,
} from 'lucide-react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner-native';

import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Modal, ModalBackdrop, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
} from '@/components/ui/modal';

import SelectExpenseCategory from '@/components/custom/select/select-expense-category';
import SelectBankAccounts from '@/components/custom/select/select-bank-accounts';
import SelectFrequency from '@/components/custom/select/select-frequency';

import { useSubscriptions } from '@/context/subscriptions-context';
import { useBankAccounts } from '@/context/bank-accounts-context';
import { BankAccount, ExpenseCategory, Frequency, Subscription, TRANSACTION_TYPE } from '@/database/types';

const BLUE   = '#8B5CF6';
const GREEN  = '#34C759';
const RED    = '#FF3B30';
const ORANGE = '#FF9500';
const GRAY   = '#8E8E93';

const CARD: { borderWidth: 1; borderColor: string } = {
  borderWidth: 1,
  borderColor: 'rgba(60,60,67,0.15)',
};

// ─── Helpers ─────────────────────────────────────────────────────

function splitName(name: string): [string, string] {
  const i = name.indexOf(' ');
  return i === -1 ? ['', name] : [name.slice(0, i), name.slice(i + 1)];
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function DueBadge({ iso }: { iso: string }) {
  const days = daysUntil(iso);
  if (days < 0)  return <Box style={[styles.badge, { backgroundColor: `${RED}20` }]}><Text size="xs" style={{ color: RED,    fontWeight: '700' }}>Vencido</Text></Box>;
  if (days === 0) return <Box style={[styles.badge, { backgroundColor: `${ORANGE}20` }]}><Text size="xs" style={{ color: ORANGE, fontWeight: '700' }}>Hoy</Text></Box>;
  if (days <= 3)  return <Box style={[styles.badge, { backgroundColor: `${ORANGE}15` }]}><Text size="xs" style={{ color: ORANGE, fontWeight: '600' }}>En {days}d</Text></Box>;
  return <Text size="xs" style={{ color: GRAY }}>{formatDate(iso)}</Text>;
}

// ─── Subscription form ───────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Ingresa un nombre'),
  amount: z
    .string()
    .min(1, 'Ingresa un monto')
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, 'Debe ser mayor a 0'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function SubscriptionForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addSubscription } = useSubscriptions();
  const { refresh: refreshAccounts } = useBankAccounts();

  const [typeId, setTypeId] = useState<number>(TRANSACTION_TYPE.EXPENSE);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showFrequencySheet, setShowFrequencySheet] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    setTypeId(TRANSACTION_TYPE.EXPENSE);
    setSelectedCategory(null);
    setSelectedAccount(null);
    setSelectedFrequency(null);
    setStartDate(new Date());
    setEndDate(null);
    setHasEndDate(false);
    setHasAttemptedSubmit(false);
    onClose();
  };

  const handleSave = () => {
    setHasAttemptedSubmit(true);
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedAccount)   return toast.error('Selecciona una cuenta');
    if (!selectedFrequency) return toast.error('Selecciona una frecuencia');

    try {
      await addSubscription({
        name: data.name,
        transaction_type_id: typeId,
        bank_account_id: selectedAccount.id,
        category_id: selectedCategory?.id ?? null,
        amount: parseFloat(data.amount),
        description: data.description ?? '',
        start_date: startDate.toISOString().split('T')[0],
        end_date: hasEndDate && endDate ? endDate.toISOString().split('T')[0] : null,
        frequency_id: selectedFrequency.id,
      });
      await refreshAccounts();
      toast.success('Movimiento recurrente creado');
      handleClose();
    } catch {
      toast.error('Error al guardar');
    }
  };

  const isExpense = typeId === TRANSACTION_TYPE.EXPENSE;
  const accountInvalid   = hasAttemptedSubmit && !selectedAccount;
  const frequencyInvalid = hasAttemptedSubmit && !selectedFrequency;
  const accentColor = isExpense ? RED : GREEN;

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalBackdrop />
        <ModalContent className="border-0 rounded-2xl">
          <ModalHeader>
            <HStack space="xs" className="items-center flex-1">
              <Repeat size={18} color={accentColor} />
              <Heading size="md">Movimiento recurrente</Heading>
            </HStack>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" className="stroke-background-400" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>
            <VStack space="sm">
              {/* Tipo: Gasto / Ingreso */}
              <HStack style={{ gap: 8 }}>
                {([TRANSACTION_TYPE.EXPENSE, TRANSACTION_TYPE.INCOME] as const).map((t) => {
                  const active = typeId === t;
                  const isExp = t === TRANSACTION_TYPE.EXPENSE;
                  const color = isExp ? RED : GREEN;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setTypeId(t)}
                      style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        gap: 6, paddingVertical: 10, borderRadius: 12,
                        borderWidth: 1.5,
                        borderColor: active ? color : 'rgba(60,60,67,0.15)',
                        backgroundColor: active ? `${color}10` : 'transparent',
                      }}
                    >
                      {isExp
                        ? <TrendingDown size={15} color={active ? color : GRAY} />
                        : <TrendingUp   size={15} color={active ? color : GRAY} />}
                      <Text size="sm" style={{ color: active ? color : GRAY, fontWeight: active ? '700' : '400' }}>
                        {isExp ? 'Gasto' : 'Ingreso'}
                      </Text>
                    </Pressable>
                  );
                })}
              </HStack>

              {/* Field card */}
              <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
                {/* Nombre */}
                <View style={styles.row}>
                  <Text size="sm" className="text-typography-900 font-medium">Nombre</Text>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className="text-typography-900"
                        placeholder="Ej. Netflix, Sueldo..."
                        placeholderTextColor="#C7C7CC"
                        textAlign="right"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        style={[styles.textInput, { flex: 1, marginLeft: 12 }, errors.name && styles.textInputError]}
                      />
                    )}
                  />
                </View>

                <Divider />

                {/* Cuenta */}
                <Pressable
                  onPress={() => setShowAccountSheet(true)}
                  style={[styles.row, accountInvalid && styles.rowInvalid]}
                >
                  <Text size="sm" className="text-typography-900 font-medium">Cuenta</Text>
                  <HStack className="items-center" style={{ gap: 4, maxWidth: '60%', justifyContent: 'flex-end' }}>
                    <Text size="sm" className={selectedAccount ? 'text-typography-600' : 'text-typography-300'} numberOfLines={1} style={{ textAlign: 'right', flexShrink: 1 }}>
                      {selectedAccount ? `${selectedAccount.name} · ${selectedAccount.currency}` : 'Seleccionar'}
                    </Text>
                    <ChevronRight size={15} color="#C7C7CC" />
                  </HStack>
                </Pressable>

                <Divider />

                {/* Categoría */}
                <Pressable onPress={() => setShowCategorySheet(true)} style={styles.row}>
                  <Text size="sm" className="text-typography-900 font-medium">Categoría</Text>
                  <HStack className="items-center" style={{ gap: 4, maxWidth: '60%', justifyContent: 'flex-end' }}>
                    {selectedCategory ? (
                      <HStack style={{ gap: 4, alignItems: 'center', flexShrink: 1 }}>
                        {splitName(selectedCategory.name)[0] ? (
                          <RNText style={{ fontSize: 13 }}>{splitName(selectedCategory.name)[0]}</RNText>
                        ) : null}
                        <Text size="sm" className="text-typography-600" numberOfLines={1} style={{ textAlign: 'right', flexShrink: 1 }}>
                          {splitName(selectedCategory.name)[1]}
                        </Text>
                      </HStack>
                    ) : (
                      <Text size="sm" className="text-typography-300" style={{ textAlign: 'right' }}>Opcional</Text>
                    )}
                    <ChevronRight size={15} color="#C7C7CC" />
                  </HStack>
                </Pressable>

                <Divider />

                {/* Monto */}
                <View style={styles.row}>
                  <Text size="sm" className="text-typography-900 font-medium">Monto</Text>
                  <HStack className="items-center flex-1 justify-end" style={{ gap: 6 }}>
                    {selectedAccount && (
                      <Text size="sm" className="text-typography-400">{selectedAccount.currency}</Text>
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

                <Divider />

                {/* Frecuencia */}
                <Pressable
                  onPress={() => setShowFrequencySheet(true)}
                  style={[styles.row, frequencyInvalid && styles.rowInvalid]}
                >
                  <Text size="sm" className="text-typography-900 font-medium">Frecuencia</Text>
                  <HStack className="items-center" style={{ gap: 4 }}>
                    <Text size="sm" className={selectedFrequency ? 'text-typography-600' : 'text-typography-300'}>
                      {selectedFrequency ? selectedFrequency.name : 'Seleccionar'}
                    </Text>
                    <ChevronRight size={15} color="#C7C7CC" />
                  </HStack>
                </Pressable>

                <Divider />

                {/* Inicio */}
                <Pressable onPress={() => setShowStartPicker((v) => !v)} style={styles.row}>
                  <Text size="sm" className="text-typography-900 font-medium">Primer pago</Text>
                  <HStack className="items-center" style={{ gap: 4 }}>
                    <Text size="sm" className="text-typography-600">
                      {startDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                    <ChevronRight size={15} color="#C7C7CC" />
                  </HStack>
                </Pressable>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, d) => { setShowStartPicker(Platform.OS === 'ios'); if (d) setStartDate(d); }}
                  />
                )}

                <Divider />

                {/* Fin (opcional) */}
                <Pressable
                  onPress={() => {
                    setHasEndDate((v) => !v);
                    if (!hasEndDate && !endDate) setEndDate(new Date());
                  }}
                  style={styles.row}
                >
                  <Text size="sm" className="text-typography-900 font-medium">Fecha límite</Text>
                  <HStack className="items-center" style={{ gap: 6 }}>
                    {hasEndDate && endDate ? (
                      <>
                        <Text size="sm" className="text-typography-600">
                          {endDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                        <Pressable onPress={(e) => { e.stopPropagation(); setHasEndDate(false); setEndDate(null); }} hitSlop={8}>
                          <X size={14} color={GRAY} />
                        </Pressable>
                      </>
                    ) : (
                      <Text size="sm" className="text-typography-300">Sin límite</Text>
                    )}
                    <ChevronRight size={15} color="#C7C7CC" />
                  </HStack>
                </Pressable>
                {hasEndDate && endDate && (
                  <Pressable onPress={() => setShowEndPicker((v) => !v)} style={[styles.row, { paddingTop: 0 }]}>
                    {showEndPicker && (
                      <DateTimePicker
                        value={endDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={startDate}
                        onChange={(_, d) => { setShowEndPicker(Platform.OS === 'ios'); if (d) setEndDate(d); }}
                      />
                    )}
                  </Pressable>
                )}

                <Divider />

                {/* Descripción */}
                <View style={styles.row}>
                  <Text size="sm" className="text-typography-900 font-medium">Nota</Text>
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
              </Box>

              {errors.amount && (
                <Text size="xs" className="text-error-600">{errors.amount.message}</Text>
              )}
              {hasAttemptedSubmit && (accountInvalid || frequencyInvalid) && (
                <Text size="xs" className="text-error-600 text-center">
                  {accountInvalid && frequencyInvalid
                    ? 'Selecciona una cuenta y una frecuencia'
                    : accountInvalid ? 'Selecciona una cuenta'
                    : 'Selecciona una frecuencia'}
                </Text>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" action="secondary" onPress={handleClose}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button onPress={handleSave} isDisabled={isSubmitting} style={{ backgroundColor: accentColor }}>
              <ButtonText>{isSubmitting ? 'Guardando...' : 'Guardar'}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SelectExpenseCategory isOpen={showCategorySheet} onClose={() => setShowCategorySheet(false)} onSelect={setSelectedCategory} />
      <SelectBankAccounts    isOpen={showAccountSheet}   onClose={() => setShowAccountSheet(false)}   onSelect={setSelectedAccount} />
      <SelectFrequency       isOpen={showFrequencySheet} onClose={() => setShowFrequencySheet(false)} onSelect={setSelectedFrequency} />
    </>
  );
}

// ─── Subscription card ───────────────────────────────────────────

function SubscriptionCard({ sub }: { sub: Subscription }) {
  const { applyPayment, deactivateSubscription } = useSubscriptions();
  const { refresh: refreshAccounts } = useBankAccounts();

  const isIncome  = sub.transaction_type_id === TRANSACTION_TYPE.INCOME;
  const today     = new Date().toISOString().split('T')[0];
  const isDue     = sub.next_payment_date != null && sub.next_payment_date <= today;
  const color     = isIncome ? GREEN : RED;

  const handleApply = async () => {
    try {
      await applyPayment(sub);
      await refreshAccounts();
      toast.success(`${sub.name} registrado`);
    } catch {
      toast.error('Error al registrar el pago');
    }
  };

  const handleDeactivate = () =>
    Alert.alert(
      'Desactivar',
      `¿Desactivar "${sub.name}"? Ya no aparecerá en la lista.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Desactivar', style: 'destructive', onPress: () => deactivateSubscription(sub.id) },
      ]
    );

  return (
    <HStack className="px-4 py-3 items-center bg-background-0">
      {/* Type icon */}
      <Box style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: `${color}15`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        {isIncome
          ? <TrendingUp size={18} color={color} strokeWidth={1.6} />
          : <TrendingDown size={18} color={color} strokeWidth={1.6} />}
      </Box>

      {/* Info */}
      <VStack className="flex-1 mr-2">
        <HStack className="items-center" style={{ gap: 6 }}>
          <Text size="sm" className="font-semibold text-typography-900" numberOfLines={1} style={{ flexShrink: 1 }}>
            {sub.name}
          </Text>
          {isDue && <AlertCircle size={13} color={RED} />}
        </HStack>
        <HStack className="items-center" style={{ gap: 4 }}>
          <Text size="xs" style={{ color: GRAY }}>{sub.frequency_name}</Text>
          <Text size="xs" style={{ color: GRAY }}>·</Text>
          {sub.next_payment_date
            ? <DueBadge iso={sub.next_payment_date} />
            : <Text size="xs" style={{ color: GRAY }}>Sin fecha</Text>}
        </HStack>
      </VStack>

      {/* Amount + actions */}
      <VStack className="items-end" style={{ gap: 4 }}>
        <Text size="sm" style={{ color, fontWeight: '700' }}>
          {isIncome ? '+' : '-'}{sub.currency ?? ''} {sub.amount.toFixed(2)}
        </Text>
        <HStack style={{ gap: 6 }}>
          {isDue && (
            <Pressable
              onPress={handleApply}
              style={{ backgroundColor: color, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}
            >
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>Registrar</Text>
            </Pressable>
          )}
          <Pressable onPress={handleDeactivate} hitSlop={8} style={{ padding: 4 }}>
            <X size={14} color={GRAY} />
          </Pressable>
        </HStack>
      </VStack>
    </HStack>
  );
}

// ─── Main screen ─────────────────────────────────────────────────

export default function SubscriptionsScreen() {
  const { subscriptions, dueCount } = useSubscriptions();
  const [showForm, setShowForm] = useState(false);

  const today    = new Date().toISOString().split('T')[0];
  const due      = subscriptions.filter((s) => s.next_payment_date != null && s.next_payment_date <= today);
  const upcoming = subscriptions.filter((s) => !s.next_payment_date || s.next_payment_date > today);

  function Section({ title, items }: { title: string; items: Subscription[] }) {
    if (items.length === 0) return null;
    return (
      <VStack space="xs" className="mb-4">
        <Text size="xs" style={{ color: GRAY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Text>
        <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
          {items.map((sub, i) => (
            <Fragment key={sub.id}>
              {i > 0 && <Divider />}
              <SubscriptionCard sub={sub} />
            </Fragment>
          ))}
        </Box>
      </VStack>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
      >
        <HStack className="justify-between items-end mt-4 mb-6">
          <VStack>
            <Heading size="2xl" className="text-typography-900 font-bold">Recurrentes</Heading>
            {dueCount > 0 && (
              <Text size="sm" style={{ color: RED, fontWeight: '600', marginTop: 2 }}>
                {dueCount} pendiente{dueCount !== 1 ? 's' : ''} de registrar
              </Text>
            )}
          </VStack>
        </HStack>

        {subscriptions.length === 0 ? (
          <VStack className="items-center mt-16" style={{ gap: 12 }}>
            <Repeat size={48} color="#C7C7CC" strokeWidth={1} />
            <Text size="md" className="text-typography-400 text-center">
              Sin movimientos recurrentes
            </Text>
            <Text size="sm" className="text-typography-300 text-center">
              Agrega suscripciones, tu sueldo o{'\n'}cualquier pago que se repita
            </Text>
          </VStack>
        ) : (
          <>
            <Section title={`Pendientes (${due.length})`} items={due} />
            <Section title="Próximos" items={upcoming} />
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={() => setShowForm(true)}
        style={{
          position: 'absolute', bottom: 28, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: BLUE,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: BLUE, shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
        }}
      >
        <Plus size={26} color="white" strokeWidth={2.5} />
      </Pressable>

      <SubscriptionForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowInvalid: { backgroundColor: 'rgba(255,59,48,0.06)' },
  textInput: { fontSize: 14, minWidth: 80, maxWidth: 160 },
  textInputError: { color: '#dc2626' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
