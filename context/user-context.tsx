import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  NAME:        'user:name',
  ONBOARDING:  'user:onboarding_complete',
} as const;

interface UserContextType {
  userName: string;
  isOnboardingComplete: boolean;
  isLoading: boolean;
  setUserName: (name: string) => Promise<void>;
  completeOnboarding: (name: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState('');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [name, done] = await Promise.all([
        AsyncStorage.getItem(KEYS.NAME),
        AsyncStorage.getItem(KEYS.ONBOARDING),
      ]);
      if (name) setUserNameState(name);
      if (done === 'true') setIsOnboardingComplete(true);
      setIsLoading(false);
    })();
  }, []);

  const setUserName = async (name: string) => {
    setUserNameState(name);
    await AsyncStorage.setItem(KEYS.NAME, name);
  };

  const completeOnboarding = async (name: string) => {
    await Promise.all([
      AsyncStorage.setItem(KEYS.NAME, name),
      AsyncStorage.setItem(KEYS.ONBOARDING, 'true'),
    ]);
    setUserNameState(name);
    setIsOnboardingComplete(true);
  };

  return (
    <UserContext.Provider value={{
      userName,
      isOnboardingComplete,
      isLoading,
      setUserName,
      completeOnboarding,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
