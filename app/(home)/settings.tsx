import { Fragment, useState } from 'react';
import { ScrollView, Alert, Pressable, TextInput, View, ActivityIndicator, Text as RNText } from 'react-native';
import {
  Landmark, Tag, Plus, Sun, Moon, Smartphone,
  ChevronRight, Trash2, SlidersHorizontal,
  FileDown, FileJson, FileSpreadsheet,
} from 'lucide-react-native';
import { toast } from 'sonner-native';

import { exportTransactionsCSV, exportBackupJSON } from '@/utils/export';

import { useTheme, ThemeMode } from '@/components/ui/ThemeProvider/ThemeProvider';
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

import BankAccountForm from '@/components/screen/home/forms/bank-account-form';
import { useCategories } from '@/context/categories-context';
import { useBankAccounts } from '@/context/bank-accounts-context';
import { BankAccount, ExpenseCategory } from '@/database/types';

const BLUE = '#8B5CF6';
const RED  = '#FF3B30';
const GRAY = '#8E8E93';
const GREEN = '#34C759';

const CARD: { borderWidth: 1; borderColor: string } = {
  borderWidth: 1,
  borderColor: 'rgba(60,60,67,0.15)',
};

const THEME_OPTIONS: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: 'light',  label: 'Claro',   Icon: Sun },
  { value: 'dark',   label: 'Oscuro',  Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: Smartphone },
];

// ─── Helpers ─────────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label }: { icon: typeof Tag; label: string }) {
  return (
    <HStack space="xs" className="items-center mb-3 mt-8">
      <Icon size={11} color={GRAY} />
      <Text size="xs" style={{ color: GRAY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Text>
    </HStack>
  );
}

function NavRow({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  onPress,
}: {
  icon: typeof Landmark;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    >
      <HStack className="px-4 py-3 items-center bg-background-0">
        <Box
          style={{
            width: 38, height: 38, borderRadius: 11,
            backgroundColor: iconBg,
            alignItems: 'center', justifyContent: 'center', marginRight: 13,
          }}
        >
          <Icon size={18} color={iconColor} strokeWidth={1.6} />
        </Box>
        <VStack className="flex-1">
          <Text size="sm" className="font-semibold text-typography-900">{title}</Text>
          <Text size="xs" style={{ color: GRAY }}>{subtitle}</Text>
        </VStack>
        <ChevronRight size={16} color="#C7C7CC" />
      </HStack>
    </Pressable>
  );
}

// ─── Export Modal ────────────────────────────────────────────────

function ExportModal({
  isOpen, onClose,
  bankAccounts, categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  bankAccounts: BankAccount[];
  categories: ExpenseCategory[];
}) {
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [loadingJSON, setLoadingJSON] = useState(false);

  const handleCSV = async () => {
    setLoadingCSV(true);
    try {
      await exportTransactionsCSV();
    } catch {
      toast.error('No se pudo exportar el CSV');
    } finally {
      setLoadingCSV(false);
    }
  };

  const handleJSON = async () => {
    setLoadingJSON(true);
    try {
      await exportBackupJSON(bankAccounts, categories);
    } catch {
      toast.error('No se pudo crear el backup');
    } finally {
      setLoadingJSON(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent className="border-0 rounded-2xl">
        <ModalHeader>
          <HStack space="sm" className="items-center flex-1">
            <Box style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,149,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <FileDown size={16} color="#FF9500" strokeWidth={1.6} />
            </Box>
            <Heading size="md">Exportar datos</Heading>
          </HStack>
          <ModalCloseButton>
            <Icon as={CloseIcon} size="md" className="stroke-background-400" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="sm">
            {/* CSV */}
            <Pressable
              onPress={handleCSV}
              disabled={loadingCSV || loadingJSON}
              style={({ pressed }) => ({
                opacity: pressed || loadingCSV ? 0.6 : 1,
                borderWidth: 1,
                borderColor: 'rgba(60,60,67,0.15)',
                borderRadius: 16,
                overflow: 'hidden',
              })}
            >
              <HStack className="px-4 py-4 items-center bg-background-0">
                <Box style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(52,199,89,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  {loadingCSV
                    ? <ActivityIndicator size="small" color={GREEN} />
                    : <FileSpreadsheet size={22} color={GREEN} strokeWidth={1.5} />}
                </Box>
                <VStack className="flex-1">
                  <Text size="sm" className="font-semibold text-typography-900">
                    Exportar transacciones
                  </Text>
                  <Text size="xs" style={{ color: GRAY, marginTop: 2 }}>
                    Archivo CSV · compatible con Excel y Numbers
                  </Text>
                </VStack>
                <ChevronRight size={16} color="#C7C7CC" />
              </HStack>
            </Pressable>

            {/* JSON */}
            <Pressable
              onPress={handleJSON}
              disabled={loadingCSV || loadingJSON}
              style={({ pressed }) => ({
                opacity: pressed || loadingJSON ? 0.6 : 1,
                borderWidth: 1,
                borderColor: 'rgba(60,60,67,0.15)',
                borderRadius: 16,
                overflow: 'hidden',
              })}
            >
              <HStack className="px-4 py-4 items-center bg-background-0">
                <Box style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(139,92,246,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  {loadingJSON
                    ? <ActivityIndicator size="small" color={BLUE} />
                    : <FileJson size={22} color={BLUE} strokeWidth={1.5} />}
                </Box>
                <VStack className="flex-1">
                  <Text size="sm" className="font-semibold text-typography-900">
                    Backup completo
                  </Text>
                  <Text size="xs" style={{ color: GRAY, marginTop: 2 }}>
                    Archivo JSON · cuentas, categorías y transacciones
                  </Text>
                </VStack>
                <ChevronRight size={16} color="#C7C7CC" />
              </HStack>
            </Pressable>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Text size="xs" className="text-typography-400 text-center flex-1">
            Los archivos se comparten mediante el menú nativo de iOS
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Bank Accounts Modal ─────────────────────────────────────────

function BankAccountsModal({
  isOpen, onClose, onAddNew,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddNew: () => void;
}) {
  const { bankAccounts, deleteBankAccount } = useBankAccounts();

  const confirmDelete = (acc: BankAccount) =>
    Alert.alert(
      'Eliminar cuenta',
      `¿Eliminar "${acc.name}"?\nSus transacciones no se borrarán.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteBankAccount(acc.id) },
      ]
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="border-0 rounded-2xl">
        <ModalHeader>
          <HStack space="sm" className="items-center flex-1">
            <Box style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(139,92,246,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={16} color={BLUE} strokeWidth={1.6} />
            </Box>
            <Heading size="md">Cuentas bancarias</Heading>
          </HStack>
          <ModalCloseButton>
            <Icon as={CloseIcon} size="md" className="stroke-background-400" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {bankAccounts.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 28 }}>
              <Landmark size={38} color="#C7C7CC" strokeWidth={1} />
              <Text size="sm" className="text-typography-400 text-center mt-3">
                Aún no tienes cuentas bancarias
              </Text>
            </View>
          ) : (
            <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
              {bankAccounts.map((acc, i) => (
                <Fragment key={acc.id}>
                  {i > 0 && <Divider />}
                  <HStack className="px-4 py-3 items-center bg-background-0">
                    <Box
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        backgroundColor: 'rgba(139,92,246,0.1)',
                        alignItems: 'center', justifyContent: 'center', marginRight: 12,
                      }}
                    >
                      <Landmark size={18} color={BLUE} strokeWidth={1.5} />
                    </Box>
                    <VStack className="flex-1 mr-2">
                      <Text size="sm" className="font-semibold text-typography-900" numberOfLines={1}>
                        {acc.name}
                      </Text>
                      <Text size="xs" style={{ color: GRAY }}>
                        {acc.currency} · {(acc.balance ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </Text>
                    </VStack>
                    <Pressable onPress={() => confirmDelete(acc)} hitSlop={8} style={{ padding: 6 }}>
                      <Trash2 size={16} color={RED} strokeWidth={1.8} />
                    </Pressable>
                  </HStack>
                </Fragment>
              ))}
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onPress={onAddNew} className="flex-1">
            <ButtonText>+ Nueva cuenta</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Categories Modal ────────────────────────────────────────────

function splitName(name: string): [string, string] {
  const i = name.indexOf(' ');
  return i === -1 ? ['', name] : [name.slice(0, i), name.slice(i + 1)];
}

function CategoriesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { categories, addCategory, removeCategory } = useCategories();
  const [newName, setNewName] = useState('');

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    await addCategory(name);
    setNewName('');
  };

  const confirmDelete = (cat: ExpenseCategory) =>
    Alert.alert(
      'Eliminar categoría',
      `¿Eliminar "${cat.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeCategory(cat.id) },
      ]
    );

  const custom = categories.filter(c => c.is_custom === 1);
  const preset = categories.filter(c => c.is_custom === 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent className="border-0 rounded-2xl">
        <ModalHeader>
          <HStack space="sm" className="items-center flex-1">
            <Box style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(52,199,89,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={15} color={GREEN} strokeWidth={1.6} />
            </Box>
            <Heading size="md">Categorías de gasto</Heading>
          </HStack>
          <ModalCloseButton>
            <Icon as={CloseIcon} size="md" className="stroke-background-400" />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            {/* Custom categories */}
            {custom.length > 0 && (
              <VStack space="xs">
                <Text size="xs" style={{ color: GRAY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Personalizadas
                </Text>
                <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
                  {custom.map((cat, i) => {
                    const [emoji, label] = splitName(cat.name);
                    return (
                      <Fragment key={cat.id}>
                        {i > 0 && <Divider />}
                        <HStack className="px-4 py-3 items-center justify-between bg-background-0">
                          <HStack style={{ alignItems: 'center', gap: 6, flex: 1, marginRight: 12 }}>
                            {emoji ? <RNText style={{ fontSize: 16 }}>{emoji}</RNText> : null}
                            <Text size="sm" className="text-typography-900" numberOfLines={1}>{label}</Text>
                          </HStack>
                          <Pressable onPress={() => confirmDelete(cat)} hitSlop={8} style={{ padding: 6 }}>
                            <Trash2 size={15} color={RED} strokeWidth={1.8} />
                          </Pressable>
                        </HStack>
                      </Fragment>
                    );
                  })}
                </Box>
              </VStack>
            )}

            {/* Preset categories */}
            <VStack space="xs">
              <Text size="xs" style={{ color: GRAY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Predefinidas
              </Text>
              <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
                {preset.map((cat, i) => {
                  const [emoji, label] = splitName(cat.name);
                  return (
                    <Fragment key={cat.id}>
                      {i > 0 && <Divider />}
                      <HStack className="px-4 py-3 items-center bg-background-0" style={{ gap: 6 }}>
                        {emoji ? <RNText style={{ fontSize: 16 }}>{emoji}</RNText> : null}
                        <Text size="sm" className="text-typography-900" numberOfLines={1}>{label}</Text>
                      </HStack>
                    </Fragment>
                  );
                })}
              </Box>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack className="flex-1 items-center" style={{ gap: 8 }}>
            <TextInput
              className="bg-background-0 text-typography-900"
              placeholder="Nueva categoría..."
              placeholderTextColor="#C7C7CC"
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              style={{
                flex: 1, fontSize: 14,
                borderWidth: 1, borderColor: 'rgba(60,60,67,0.2)',
                borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
              }}
            />
            <Pressable
              onPress={handleAdd}
              disabled={!newName.trim()}
              style={{
                backgroundColor: newName.trim() ? BLUE : '#C7C7CC',
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Agregar</Text>
            </Pressable>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Main settings screen ─────────────────────────────────────────

export default function SettingsScreen() {
  const { bankAccounts } = useBankAccounts();
  const { categories } = useCategories();
  const { themeMode, setThemeMode } = useTheme();

  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const customCategoriesCount = categories.filter(c => c.is_custom === 1).length;

  const accountSubtitle = bankAccounts.length === 0
    ? 'Sin cuentas configuradas'
    : `${bankAccounts.length} cuenta${bankAccounts.length !== 1 ? 's' : ''}`;

  const categorySubtitle = customCategoriesCount > 0
    ? `${customCategoriesCount} personalizada${customCategoriesCount !== 1 ? 's' : ''}`
    : 'Sin categorías personalizadas';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 52, paddingHorizontal: 16 }}
    >
      <Heading size="2xl" className="text-typography-900 font-bold mt-4">
        Ajustes
      </Heading>

      {/* ── Finanzas ──────────────────────────────────────────── */}
      <SectionLabel icon={Landmark} label="Finanzas" />

      <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
        <NavRow
          icon={Landmark}
          iconBg="rgba(139,92,246,0.1)"
          iconColor={BLUE}
          title="Cuentas bancarias"
          subtitle={accountSubtitle}
          onPress={() => setShowAccountsModal(true)}
        />
        <Divider />
        <NavRow
          icon={Tag}
          iconBg="rgba(52,199,89,0.1)"
          iconColor={GREEN}
          title="Categorías de gasto"
          subtitle={categorySubtitle}
          onPress={() => setShowCategoriesModal(true)}
        />
        <Divider />
        <NavRow
          icon={FileDown}
          iconBg="rgba(255,149,0,0.1)"
          iconColor="#FF9500"
          title="Exportar / Backup"
          subtitle="CSV para Excel · JSON para respaldo"
          onPress={() => setShowExportModal(true)}
        />
      </Box>

      {/* ── Preferencias ─────────────────────────────────────── */}
      <SectionLabel icon={SlidersHorizontal} label="Preferencias" />

      <Text size="xs" className="text-typography-500 mb-2">Apariencia</Text>
      <Box className="rounded-2xl overflow-hidden bg-background-0" style={CARD}>
        <HStack>
          {THEME_OPTIONS.map(({ value, label, Icon }, i) => {
            const active = themeMode === value;
            return (
              <Fragment key={value}>
                {i > 0 && <Box style={{ width: 1, backgroundColor: 'rgba(60,60,67,0.15)' }} />}
                <Pressable
                  onPress={() => setThemeMode(value)}
                  style={{
                    flex: 1, alignItems: 'center', paddingVertical: 16,
                    backgroundColor: active ? 'rgba(139,92,246,0.08)' : 'transparent',
                  }}
                >
                  <Icon size={20} color={active ? BLUE : GRAY} strokeWidth={active ? 2 : 1.5} />
                  <Text size="xs" style={{
                    marginTop: 6, color: active ? BLUE : GRAY,
                    fontWeight: active ? '700' : '400',
                  }}>
                    {label}
                  </Text>
                </Pressable>
              </Fragment>
            );
          })}
        </HStack>
      </Box>

      {/* ── Modals ───────────────────────────────────────────── */}
      <BankAccountsModal
        isOpen={showAccountsModal}
        onClose={() => setShowAccountsModal(false)}
        onAddNew={() => {
          setShowAccountsModal(false);
          setShowAccountForm(true);
        }}
      />
      <CategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
      />
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        bankAccounts={bankAccounts}
        categories={categories}
      />
      <BankAccountForm
        isOpen={showAccountForm}
        onClose={() => setShowAccountForm(false)}
      />
    </ScrollView>
  );
}
