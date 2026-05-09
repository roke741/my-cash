import { useState, useRef } from 'react';
import {
  View, TextInput, Pressable, KeyboardAvoidingView,
  Platform, ScrollView, Image, StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import BankAccountForm from '@/components/screen/home/forms/bank-account-form';
import { useUser } from '@/context/user-context';
import { useBankAccounts } from '@/context/bank-accounts-context';

const BLUE = '#8B5CF6';
const GRAY = '#8E8E93';

// ─── Step indicator ──────────────────────────────────────────────

function Steps({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i === current && styles.stepDotActive,
            i < current && styles.stepDotDone,
          ]}
        />
      ))}
    </View>
  );
}

// ─── Step 1: name ────────────────────────────────────────────────

function StepName({ onNext }: { onNext: (name: string) => void }) {
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.stepContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('@/assets/images/coin_3d.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <VStack style={styles.textBlock}>
          <Heading size="2xl" className="text-typography-900 font-bold text-center">
            Bienvenido a MyCash
          </Heading>
          <Text size="md" className="text-typography-500 text-center" style={{ marginTop: 8, lineHeight: 22 }}>
            Controla tus ingresos, gastos y{'\n'}suscripciones en un solo lugar
          </Text>
        </VStack>

        <VStack style={{ width: '100%', gap: 8 }}>
          <Text size="sm" className="text-typography-700 font-medium">¿Cómo te llamas?</Text>
          <TextInput
            ref={inputRef}
            className="bg-background-0 text-typography-900"
            placeholder="Tu nombre..."
            placeholderTextColor="#C7C7CC"
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => name.trim() && onNext(name.trim())}
            style={styles.nameInput}
          />
        </VStack>

        <Pressable
          onPress={() => onNext(name.trim())}
          disabled={!name.trim()}
          style={[styles.btn, !name.trim() && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>Continuar →</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 2: first account ───────────────────────────────────────

function StepAccount({ name, onFinish }: { name: string; onFinish: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const { bankAccounts } = useBankAccounts();
  const accountAdded = bankAccounts.length > 0;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.stepContainer}>
        <Image
          source={require('@/assets/images/bank.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <VStack style={styles.textBlock}>
          <Heading size="2xl" className="text-typography-900 font-bold text-center">
            Hola, {name} 👋
          </Heading>
          <Text size="md" className="text-typography-500 text-center" style={{ marginTop: 8, lineHeight: 22 }}>
            Agrega tu primera cuenta bancaria{'\n'}para empezar a registrar movimientos
          </Text>
        </VStack>

        {accountAdded ? (
          <Box style={styles.successBox}>
            <Text size="sm" style={{ color: '#34C759', fontWeight: '700', textAlign: 'center' }}>
              ✓ Cuenta agregada correctamente
            </Text>
          </Box>
        ) : null}

        <VStack style={{ width: '100%', gap: 12 }}>
          <Pressable
            onPress={() => setShowForm(true)}
            style={[styles.btn, accountAdded && { backgroundColor: '#34C759' }]}
          >
            <Text style={styles.btnText}>
              {accountAdded ? 'Agregar otra cuenta' : 'Agregar cuenta'}
            </Text>
          </Pressable>

          <Pressable onPress={onFinish} style={styles.skipBtn}>
            <Text size="sm" style={{ color: GRAY, fontWeight: '500' }}>
              {accountAdded ? 'Continuar →' : 'Ahora no, entrar a la app'}
            </Text>
          </Pressable>
        </VStack>
      </ScrollView>

      <BankAccountForm isOpen={showForm} onClose={() => setShowForm(false)} />
    </View>
  );
}

// ─── Onboarding root ─────────────────────────────────────────────

export default function OnboardingScreen() {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const handleNameNext = (n: string) => {
    setName(n);
    setStep(1);
  };

  const handleFinish = async () => {
    await completeOnboarding(name);
    router.replace('/(home)');
  };

  return (
    <View style={styles.root} className="bg-background-50">
      <View style={styles.stepsContainer}>
        <Steps current={step} total={2} />
      </View>

      {step === 0 && <StepName onNext={handleNameNext} />}
      {step === 1 && <StepAccount name={name} onFinish={handleFinish} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stepsContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  stepDotActive: {
    width: 24,
    backgroundColor: BLUE,
  },
  stepDotDone: {
    backgroundColor: `${BLUE}60`,
  },
  stepContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  illustration: {
    width: 180,
    height: 180,
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 0,
  },
  nameInput: {
    width: '100%',
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  btn: {
    width: '100%',
    backgroundColor: BLUE,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#C7C7CC',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  successBox: {
    width: '100%',
    backgroundColor: 'rgba(52,199,89,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,199,89,0.25)',
  },
});
