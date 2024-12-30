import { Tabs } from 'expo-router';
import React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Tempo',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color={color} />,
          tabBarAccessibilityLabel: "Navegar para a tela de clima"
        }}
      />
      <Tabs.Screen
        name="luminosity"
        options={{
          title: 'Luminosidade',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sun.and.horizon.circle" color={color} />,
          tabBarAccessibilityLabel: "Navegar para a tela de luminosidade"
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          tabBarAccessibilityLabel: "Navegar para a tela de início"
        }}
      />
      <Tabs.Screen
        name="connection"
        options={{
          title: 'Conexão',
          tabBarIcon: ({ color }) => <Feather name="bluetooth" size={24} color={color} />,
          tabBarAccessibilityLabel: "Navegar para a tela de conexão com o dispositivo"
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <FontAwesome name="gear" size={28} color={color} />,
          tabBarAccessibilityLabel: "Navegar para a tela de configurações"
        }}
      />
    </Tabs>
  );
}
