import React from 'react';
import { Tabs, router } from 'expo-router'; // Added router for custom create button
import { Home, Search, PlusCircle, MessageSquare, User, LayoutGrid } from 'lucide-react-native'; // Added LayoutGrid
import { Platform, View } from 'react-native';
import originalTheme from '@/constants/theme'; // Renamed theme to originalTheme
import { useTheme } from '../../context/ThemeContext'; // Added useTheme

export default function TabLayout() {
  const { colors } = useTheme(); // Accessed theme colors

  const tabBarHeight = Platform.OS === 'ios' ? 88 : 60;
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 28 : 8;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.subtext, 
        tabBarStyle: {
          borderTopColor: colors.border, 
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
        },
        headerShown: false,
        tabBarBackground: () => ( 
          <View 
            style={{ 
              backgroundColor: colors.card, 
              borderTopWidth: 1,
              borderTopColor: colors.border,
              height: '100%',
            }} 
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index" // Home
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Home size={focused ? 26 : 24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="categories" // New Categories Tab
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid size={focused ? 26 : 24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <Search size={focused ? 26 : 24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="create" // Placeholder name for the tab item itself
        options={{
          title: 'Create', // This title won't be visible due to tabBarLabel: () => null
          tabBarIcon: ({ focused }) => ( 
            <View style={{
              backgroundColor: colors.primary,
              padding: originalTheme.spacing.s,
              borderRadius: originalTheme.radius.xl, 
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{ translateY: Platform.OS === 'ios' ? -15 : -10 }], 
              shadowColor: colors.black, 
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            }}>
              <PlusCircle size={28} color={originalTheme.colors.common.white} />
            </View>
          ),
          tabBarLabel: () => null, 
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); 
            router.push('/task/create'); 
          },
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => <MessageSquare size={focused ? 26 : 24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <User size={focused ? 26 : 24} color={color} strokeWidth={focused ? 2.5 : 2} />,
        }}
      />
    </Tabs>
  );
}
