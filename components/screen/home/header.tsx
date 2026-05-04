import { Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useUser } from '@/context/user-context';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function Header() {
  const { userName } = useUser();
  const name = userName.trim() || 'tú';

  return (
    <Box className="flex-row justify-between items-center pt-2 pb-4">
      <Box style={{ flex: 1, marginRight: 12 }}>
        <Text size="sm" className="text-typography-500 mb-0.5">{greeting()},</Text>
        <Heading size="2xl" className="text-typography-900 font-bold" numberOfLines={1}>
          {name} 👋
        </Heading>
      </Box>
      <Pressable
        onPress={() => router.push('/(home)/settings')}
        hitSlop={8}
        style={{ transform: [{ rotate: '-12deg' }] }}
      >
        <Image
          source={require('@/assets/images/money_bag.png')}
          style={{ width: 52, height: 52 }}
          resizeMode="contain"
        />
      </Pressable>
    </Box>
  );
}
