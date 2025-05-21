import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Search, X } from 'lucide-react-native';
import theme from '@/constants/theme';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  ...rest
}) => {
  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <Search size={20} color={theme.colors.light.subtext} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.light.placeholder}
        {...rest}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={16} color={theme.colors.light.subtext} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.light.text,
    ...theme.typography.body,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
});

export default SearchInput;