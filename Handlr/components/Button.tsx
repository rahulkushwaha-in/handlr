import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, // StyleSheet is imported but not used directly for dynamic styles here
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import originalTheme from '@/constants/theme'; // Renamed to avoid conflict
import { useTheme } from '../context/ThemeContext'; // Added

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const { colors } = useTheme(); // Accessed theme colors

  const getButtonStyles = (): ViewStyle => { // Added return type for clarity
    const baseStyle: ViewStyle = {
      borderRadius: originalTheme.radius.m, // Uses originalTheme for radius
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    // Size styles - use originalTheme for spacing
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = originalTheme.spacing.s;
        baseStyle.paddingHorizontal = originalTheme.spacing.m;
        break;
      case 'large':
        baseStyle.paddingVertical = originalTheme.spacing.l;
        baseStyle.paddingHorizontal = originalTheme.spacing.xl;
        break;
      default: // medium
        baseStyle.paddingVertical = originalTheme.spacing.m;
        baseStyle.paddingHorizontal = originalTheme.spacing.l;
    }

    // Variant styles - use colors from context
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.secondary; // Updated
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.primary; // Updated
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // primary
        baseStyle.backgroundColor = colors.primary; // Updated
    }

    // Width style
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Disabled style
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyles = (): TextStyle => { // Added return type for clarity
    const baseStyle: TextStyle = {
      fontWeight: '600', // Typography aspect from original design
    };

    // Size styles - font sizes from original design
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default: // medium
        baseStyle.fontSize = 16;
    }

    // Variant styles - use colors from context
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseStyle.color = colors.primary; // Updated
        break;
      default: // primary, secondary
        baseStyle.color = originalTheme.colors.common.white; 
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]} // style prop allows overrides
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' 
            ? colors.primary 
            : originalTheme.colors.common.white} 
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={[
            getTextStyles(), 
            textStyle, // textStyle prop allows overrides
            leftIcon && { marginLeft: originalTheme.spacing.s }, // originalTheme for spacing
            rightIcon && { marginRight: originalTheme.spacing.s } // originalTheme for spacing
          ]}>
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
