import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // We're using system fonts, so no custom fonts to load
  });
  
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/otp" options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="tasker/[id]" options={{ headerShown: true, title: 'Tasker Profile' }} />
            <Stack.Screen name="task/create" options={{ headerShown: true, title: 'Create Task' }} />
            <Stack.Screen name="task/[id]" options={{ headerShown: true, title: 'Task Details' }} />
            <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: 'Chat' }} />
          </>
        )}
      </Stack>
    </>
  );
}