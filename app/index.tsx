import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUser } from '@/context/user-context';

export default function Index() {
  const { isLoading, isOnboardingComplete } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return <Redirect href={isOnboardingComplete ? '/(home)' : '/onboarding'} />;
}
