import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native'; // Added FlatList
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import originalTheme from '@/constants/theme'; 
import SearchInput from '../../../components/SearchInput';
import { 
  CaretDown,
  House, 
  Droplets, 
  Nut, // Using Nut for Electrician and Carpentry as a general "fixing" icon
  Package as MovingIcon, // Renamed to avoid conflict with React.Package
  Car, 
  PaintBrush, 
  Leaf, 
  Dog, 
  Laptop, 
  CookingPot, 
  Scissors, 
  Baby 
} from 'lucide-react-native';
import { categories as mockCategories } from '../../../mocks/categories'; // Import mock categories

type AppColorsType = ReturnType<typeof useTheme>['colors'];
type CategoryType = typeof mockCategories[0]; // Infer type from mock data

// Icon mapping using string keys (category IDs from mock data)
const iconMap: { [key: string]: React.ElementType } = {
  '1': House,        // Cleaning (Spray can in mock, using House as generic home service)
  '2': Droplets,     // Plumbing (Wrench in mock)
  '3': Nut,          // Electrician (Zap in mock)
  '4': Nut,          // Carpentry (Hammer in mock)
  '5': PaintBrush,   // Painting
  '6': Leaf,         // Gardening (Flower in mock)
  '7': MovingIcon,   // Errands (Shopping bag in mock, Package for delivery/errands)
  '8': MovingIcon,   // Moving (Truck in mock, Package can also represent moving boxes)
  // Add more based on your actual mockCategories IDs and desired icons
  // Default can be set in CategoryGridItem
};

interface CategoryGridItemProps {
  item: CategoryType;
  onPress: () => void;
  colors: AppColorsType;
  itemStyle: {
    card: any; // Consider more specific style types if needed
    text: any;
  };
}

const CategoryGridItem: React.FC<CategoryGridItemProps> = ({ item, onPress, colors, itemStyle }) => {
  const IconComponent = iconMap[String(item.id)] || House; // Default to House icon
  return (
    <TouchableOpacity onPress={onPress} style={itemStyle.card}>
      <IconComponent size={24} color={colors.text} />
      <Text style={itemStyle.text} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Implement Filter Logic
  // TODO: Implement actual navigation for category press

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search categories or services"
            />
          </View>

          <View style={styles.filtersContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Popular</Text>
              <CaretDown size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Nearby</Text>
              <CaretDown size={18} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Price</Text>
              <CaretDown size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionTitleText}>All Categories</Text>
          <FlatList
            data={mockCategories}
            renderItem={({ item }) => (
              <CategoryGridItem 
                item={item} 
                onPress={() => console.log('Pressed Category:', item.name, item.id)} 
                colors={colors} 
                itemStyle={{ card: styles.categoryGridItemCard, text: styles.categoryGridItemText }}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContentContainer}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false} // Disable FlatList scrolling, rely on parent ScrollView
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const dynamicStyles = (colors: AppColorsType, currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
      paddingTop: currentTheme.spacing.l, 
    },
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
      gap: currentTheme.spacing.s, 
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card, 
      paddingVertical: currentTheme.spacing.s,
      paddingHorizontal: currentTheme.spacing.m,
      borderRadius: 20, 
    },
    filterButtonText: {
      ...currentTheme.typography.bodySmall, 
      color: colors.text,
      marginRight: currentTheme.spacing.xs,
    },
    sectionTitleText: { // New style for section title
      ...currentTheme.typography.h3, 
      color: colors.text,
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
      marginTop: currentTheme.spacing.l, // Added margin top
    },
    gridContentContainer: { // Style for FlatList content
      // paddingHorizontal: currentTheme.spacing.l, // Horizontal padding handled by parent ScrollView or this
      paddingBottom: currentTheme.spacing.l,
    },
    gridRow: { // Style for FlatList columnWrapperStyle
      justifyContent: 'space-between',
      gap: currentTheme.spacing.m, 
      marginBottom: currentTheme.spacing.m,
      paddingHorizontal: currentTheme.spacing.l, // Add horizontal padding to the row itself
    },
    categoryGridItemCard: {
      flex: 1, // Essential for numColumns
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: currentTheme.spacing.m,
      borderRadius: currentTheme.radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      gap: currentTheme.spacing.m, // Space between icon and text
    },
    categoryGridItemText: {
      ...currentTheme.typography.body, // Or bodySmall if preferred
      fontWeight: '600',
      color: colors.text,
      flexShrink: 1, // Allow text to wrap and shrink if icon takes space
    },
    // placeholderText style removed as placeholder View is removed
  });
