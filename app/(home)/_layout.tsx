import { StyleSheet, View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { LayoutDashboard, History, Settings, Repeat } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSubscriptions } from '@/context/subscriptions-context';

function DueBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View style={{
      position: 'absolute', top: -4, right: -8,
      minWidth: 16, height: 16, borderRadius: 8,
      backgroundColor: '#FF3B30',
      alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 4,
    }}>
      <Text style={{ color: 'white', fontSize: 10, fontWeight: '800' }}>
        {count > 9 ? '9+' : count}
      </Text>
    </View>
  );
}

export default function HomeLayout() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { dueCount } = useSubscriptions();

  const activeTint   = '#8B5CF6';
  const inactiveTint = dark ? '#636366' : '#8E8E93';
  const tabBg        = dark ? '#241827'  : '#FFFFFF';
  const borderColor  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.18)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: borderColor,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: 'Recurrentes',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Repeat color={color} size={size} />
              <DueBadge count={dueCount} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
