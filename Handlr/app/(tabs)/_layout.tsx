import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react-native';
import { Platform, View } from 'react-native';
import theme from '@/constants/theme';

export default function TabLayout() {
  // Calculate tab bar height based on platform
  const tabBarHeight = Platform.OS === 'ios' ? 88 : 60;
  const tabBarPaddingBottom = Platform.OS === 'ios' ? 28 : 8;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.light.primary,
        tabBarInactiveTintColor: theme.colors.light.inactive,
        tabBarStyle: {
          borderTopColor: theme.colors.light.border,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
        },
        headerShown: false,
        tabBarBackground: () => (
          <View 
            style={{ 
              backgroundColor: theme.colors.light.background,
              borderTopWidth: 1,
              borderTopColor: theme.colors.light.border,
              height: '100%',
            }} 
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
          tabBarButton: (props) => (
            <Tabs.Screen
              name="task/create"
              options={{
                title: 'Create Task',
                tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} />,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}