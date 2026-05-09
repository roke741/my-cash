import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import '@/global.css';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ThemeProvider, useTheme } from '@/components/ui/ThemeProvider/ThemeProvider';
import { DATABASE_NAME } from '@/database/config-db';
import { initializeDB } from '@/database/db';
import { BankAccountsProvider } from '@/context/bank-accounts-context';
import { TransactionsProvider } from '@/context/transactions-context';
import { CategoriesProvider } from '@/context/categories-context';
import { BankProvider } from '@/context/bank-context';
import { SubscriptionsProvider } from '@/context/subscriptions-context';
import { UserProvider } from '@/context/user-context';

SplashScreen.preventAutoHideAsync();

function ThemedApp() {
  const { resolvedTheme } = useTheme();
  const appBackground = resolvedTheme === 'dark' ? '#1C141E' : '#F2F2F7';

  return (
    <GluestackUIProvider mode={resolvedTheme}>
      <StatusBar
        style={resolvedTheme === 'dark' ? 'light' : 'dark'}
        translucent={false}
        backgroundColor={appBackground}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: appBackground }} edges={['top']}>
        <View className="flex-1 bg-background-50">
          <Slot />
        </View>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/Cabin-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <UserProvider>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDB}>
        <BankProvider>
          <BankAccountsProvider>
            <TransactionsProvider>
              <CategoriesProvider>
                <SubscriptionsProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <ThemeProvider>
                    <ThemedApp />
                    <Toaster visibleToasts={2} richColors />
                  </ThemeProvider>
                </GestureHandlerRootView>
                </SubscriptionsProvider>
              </CategoriesProvider>
            </TransactionsProvider>
          </BankAccountsProvider>
        </BankProvider>
      </SQLiteProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
