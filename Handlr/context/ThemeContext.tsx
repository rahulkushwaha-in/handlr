import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appColors from '../constants/colors'; // Adjusted path

const THEME_PREFERENCE_KEY = 'themePreference';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: typeof appColors.light | typeof appColors.dark;
  isDark: boolean;
  toggleTheme: () => void;
  setThemePreference: (preference: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>('system');
  const [theme, setTheme] = useState<'light' | 'dark'>(Appearance.getColorScheme() || 'light');

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY) as 'light' | 'dark' | 'system' | null;
        if (storedPreference) {
          setThemePreference(storedPreference);
          if (storedPreference === 'system') {
            setTheme(Appearance.getColorScheme() || 'light');
          } else {
            setTheme(storedPreference);
          }
        } else {
          // If no preference stored, default to system and set current theme
          setTheme(Appearance.getColorScheme() || 'light');
          setThemePreference('system');
        }
      } catch (error) {
        console.error('Failed to load theme preference from AsyncStorage:', error);
        // Default to system theme if loading fails
        setTheme(Appearance.getColorScheme() || 'light');
        setThemePreference('system');
      }
    };

    loadThemePreference();
  }, []);

  const handleSystemThemeChange = useCallback((preferences: Appearance.AppearancePreferences) => {
    if (themePreference === 'system') {
      setTheme(preferences.colorScheme || 'light');
    }
  }, [themePreference]);

  useEffect(() => {
    if (themePreference === 'system') {
      const subscription = Appearance.addChangeListener(handleSystemThemeChange);
      // Ensure current system theme is applied when switching to 'system' preference
      setTheme(Appearance.getColorScheme() || 'light');
      return () => subscription.remove();
    }
  }, [themePreference, handleSystemThemeChange]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setThemePreference(newTheme); // When toggling, user makes a direct choice
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme preference to AsyncStorage:', error);
    }
  };

  const applyThemePreference = async (preference: 'light' | 'dark' | 'system') => {
    setThemePreference(preference);
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
    } catch (error) {
      console.error('Failed to save theme preference to AsyncStorage:', error);
    }

    if (preference === 'system') {
      setTheme(Appearance.getColorScheme() || 'light');
    } else {
      setTheme(preference);
    }
  };

  const currentColors = theme === 'dark' ? appColors.dark : appColors.light;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: currentColors,
        isDark,
        toggleTheme,
        setThemePreference: applyThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
