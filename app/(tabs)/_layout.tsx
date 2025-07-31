import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import {
  Clock,
  Headphones,
  Chrome as Home,
  Map,
  Search,
  User,
} from 'lucide-react-native';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ size, color }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="paradas"
        options={{
          title: 'Rutas',
          tabBarIcon: ({ size, color }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Boletos',
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Soporte',
          tabBarIcon: ({ size, color }) => (
            <Headphones size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
