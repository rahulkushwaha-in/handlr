import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../context/ThemeContext'; // Added

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

// Define AppColorsType if it's not globally available or part of useTheme() already
// For this component, direct usage of `colors` from useTheme() is fine.
// type AppColorsType = ReturnType<typeof useTheme>['colors'];

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  ...rest
}) => {
  const { colors } = useTheme(); // Accessed theme colors
  const styles = dynamicStyles(colors, originalTheme); // Generate styles dynamically

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <Search size={20} color={colors.subtext} style={styles.searchIcon} /> 
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder} 
        {...rest}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={16} color={colors.subtext} /> 
        </TouchableOpacity>
      )}
    </View>
  );
};

// Converted styles to a function that accepts colors and originalTheme
const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card, // Updated
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
      height: 48,
    },
    searchIcon: {
      marginRight: currentTheme.spacing.s,
    },
    input: {
      flex: 1,
      height: '100%',
      color: colors.text, // Updated
      ...currentTheme.typography.body,
    },
    clearButton: {
      padding: currentTheme.spacing.xs,
    },
  });

export default SearchInput;
