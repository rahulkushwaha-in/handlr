import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { Category } from '@/types';
import theme from '@/constants/theme';
import { MapPin, Zap, Wrench, Hammer, PaintBucket, Flower, ShoppingBag, Truck } from 'lucide-react-native';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  style?: ViewStyle;
  selected?: boolean;
}

// Map category icons to Lucide icons
const getCategoryIcon = (iconName: string, color: string, size: number) => {
  switch (iconName) {
    case 'spray-can':
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
    default:
      return <MapPin size={size} color={color} style={styles.icon} />;
  }
};

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  style,
  selected = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: selected ? category.color : theme.colors.light.card },
        style,
      ]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      {getCategoryIcon(
        category.icon,
        selected ? theme.colors.common.white : category.color,
        24
      )}
      <Text
        style={[
          styles.name,
          { color: selected ? theme.colors.common.white : theme.colors.light.text },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    margin: theme.spacing.xs,
  },
  icon: {
    marginBottom: theme.spacing.s,
  },
  name: {
    ...theme.typography.bodySmall,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryCard;