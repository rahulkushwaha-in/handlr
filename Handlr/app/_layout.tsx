import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import originalTheme from '@/constants/theme';
import { StyleSheet } from 'react-native';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDark, colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme); 
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* <StatusBar style={isDark ? 'light' : 'dark'} /> */}
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
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Your font declarations
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})