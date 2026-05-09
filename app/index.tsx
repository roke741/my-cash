import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUser } from '@/context/user-context';

export default function Index() {
  const { isLoading, isOnboardingComplete } = useUser();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-50">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return <Redirect href={isOnboardingComplete ? '/(home)' : '/onboarding'} />;
}
