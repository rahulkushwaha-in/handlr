import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { Category } from '@/types';
import originalTheme from '@/constants/theme'; // Renamed to avoid conflict
import { useTheme } from '../context/ThemeContext'; // Added
import { MapPin, Zap, Wrench, Hammer, PaintBucket, Flower, ShoppingBag, Truck } from 'lucide-react-native';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  style?: ViewStyle;
  selected?: boolean;
}

// Map category icons to Lucide icons
// This function doesn't need theme context directly as color is passed as an argument.
const getCategoryIcon = (iconName: string, color: string, size: number) => {
  // styles.icon here only refers to marginBottom, which is fine from originalTheme.
  switch (iconName) {
    case 'map-pin': // Explicitly map 'map-pin' if it's a possible iconName
      return <MapPin size={size} color={color} style={styles.icon} />;
    case 'wrench':
      return <Wrench size={size} color={color} style={styles.icon} />;
    case 'zap':
      return <Zap size={size} color={color} style={styles.icon} />;
    case 'hammer':
      return <Hammer size={size} color={color} style={styles.icon} />;
    case 'paintbrush': 
      return <PaintBucket size={size} color={color} style={styles.icon} />;
    case 'flower':
      return <Flower size={size} color={color} style={styles.icon} />;
    case 'shopping-bag':
      return <ShoppingBag size={size} color={color} style={styles.icon} />;
    case 'truck':
      return <Truck size={size} color={color} style={styles.icon} />;
    default: // Defaulting to MapPin or a generic icon might be better
      // console.warn("Unknown category icon:", iconName); // Optional: for debugging
      return <MapPin size={size} color={color} style={styles.icon} />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  style,
  selected = false,
}) => {
  const { colors } = useTheme(); // Accessed theme colors

  return (
    <TouchableOpacity
      style={[
        styles.container,
        // Use colors from context for the unselected card background
        { backgroundColor: selected ? category.color : colors.card }, 
        style,
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      {getCategoryIcon(
        category.icon,
        // Use colors from context for selected icon color (white)
        // Unselected icon color remains category.color (data-driven)
        selected ? colors.white : category.color, 
        24
      )}
      <Text
        style={[
          styles.name,
          // Use colors from context for text color when unselected
          // Selected text color remains white (or could be a contrast color to category.color if needed)
          { color: selected ? colors.white : colors.text }, 
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

// StyleSheet uses originalTheme for spacing, radius, and typography, which is fine.
// No theme-dependent colors are defined here, so it doesn't need to be a dynamic function.
const styles = StyleSheet.create({
  container: {
    padding: originalTheme.spacing.m,
    borderRadius: originalTheme.radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    margin: originalTheme.spacing.xs,
  },
  icon: {
    marginBottom: originalTheme.spacing.s,
  },
  name: {
    ...originalTheme.typography.bodySmall,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryCard;
