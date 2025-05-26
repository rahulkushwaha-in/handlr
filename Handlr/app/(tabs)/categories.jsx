import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Platform,
} from 'react-native';
import { router, Stack, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import originalTheme from '@/constants/theme';
import SearchInput from '@/components/SearchInput';
import Button from '@/components/Button';
import {
  House,
  Droplets,
  Nut,
  Paintbrush,
  Leaf,
  Package as MovingIcon,
  Car,
  Dog,
  Laptop,
  CookingPot,
  Scissors,
  Baby,
  Wrench,
  Zap,
  Hammer,
  Flower,
  ShoppingBag,
  Truck,
  Palette,
  Sprout,
  PawPrint,
  Monitor,
  ChefHat,
  PartyPopper,
  Camera,
  Dumbbell,
  Book,
} from 'lucide-react-native';
import { categories as mockCategories } from '@/mocks/categories';

const iconMap = {
  cleaning: House,
  plumbing: Droplets,
  electrical: Zap,
  carpentry: Hammer,
  painting: Paintbrush,
  gardening: Leaf,
  errands: ShoppingBag,
  moving: Truck,
  babysitting: Baby,
  handyman: Wrench,
  pestControl: Sprout,
  hvac: Nut,
  petCare: PawPrint,
  roofing: House,
  masonry: Nut,
  windowCleaning: House,
  carpetCleaning: House,
  pressureWashing: Droplets,
  applianceRepair: Wrench,
  furnitureAssembly: Hammer,
  drywallRepair: Palette,
  flooring: Hammer,
  homeSecurity: Monitor,
  gutterCleaning: House,
  poolMaintenance: Droplets,
  chimneySweep: House,
  junkRemoval: Truck,
  personalChef: ChefHat,
  eventPlanning: PartyPopper,
  photography: Camera,
  tutoring: Book,
  personalTraining: Dumbbell,
};

const CategoryGridItem = ({ item, onPress, colors, itemStyle, isSelected }) => {
  const styles = dynamicStyles(colors, originalTheme);
  const IconComponent = iconMap[item.id] || House;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[itemStyle.card, isSelected && styles.selectedCategoryItem]}
    >
      <IconComponent size={24} color={colors.text} />
      <Text style={itemStyle.text} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default function CategoriesScreen() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('popular');
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchInputRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { autoFocus } = useLocalSearchParams();
  const isSelectionMode = !!params.fromCreateTask;

  useEffect(() => {
    let filtered = mockCategories.filter(cat =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    switch (activeFilter) {
      case 'popular':
        filtered.sort((a, b) => (b.activeTasks || 0) - (a.activeTasks || 0));
        break;
      case 'nearby':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'price':
        filtered.sort((a, b) => (a.averagePrice || 0) - (b.averagePrice || 0));
        break;
    }
    setCategories(filtered);
  }, [searchQuery, activeFilter]);

  useFocusEffect(
    useCallback(() => {
      if (autoFocus === '1') {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          searchInputRef.current?.focus();
        });
      }
    }, [autoFocus])
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (!isSelectionMode) {
      router.push({
        pathname: '/task/create',
        params: { selectedCategory: JSON.stringify(category) },
      });
    }
  };

  const handleConfirm = () => {
    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: isSelectionMode ? 'Select Category' : 'Categories',
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
          }}
        />
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }}
        >
          <View style={styles.searchContainer}>
            <SearchInput
              value={searchQuery}
              ref={searchInputRef}
              onChangeText={setSearchQuery}
              placeholder="Search categories or services"
            />
          </View>
        </Animated.View>
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'popular' && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter('popular')}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 'popular' && styles.activeFilterText,
              ]}
            >
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'nearby' && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter('nearby')}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 'nearby' && styles.activeFilterText,
              ]}
            >
              Nearby
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'price' && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter('price')}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === 'price' && styles.activeFilterText,
              ]}
            >
              Price
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitleText}>All Categories</Text>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <CategoryGridItem
              item={item}
              onPress={() => handleCategorySelect(item)}
              colors={colors}
              itemStyle={{
                card: styles.categoryGridItemCard,
                text: styles.categoryGridItemText,
              }}
              isSelected={selectedCategory?.id === item.id}
            />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContentContainer}
          showsVerticalScrollIndicator={false}
        />
        {isSelectionMode && (
          <Button
            title="Confirm Selection"
            onPress={handleConfirm}
            fullWidth
            disabled={!selectedCategory}
            style={styles.confirmButton}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const dynamicStyles = (colors, currentTheme) =>
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
    activeFilterButton: {
      backgroundColor: colors.primary + '20',
    },
    activeFilterText: {
      color: colors.primary,
      fontWeight: '600',
    },
    sectionTitleText: {
      ...currentTheme.typography.h3,
      color: colors.text,
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
      marginTop: currentTheme.spacing.l,
    },
    gridContentContainer: {
      paddingBottom: currentTheme.spacing.xl,
    },
    gridRow: {
      justifyContent: 'space-between',
      gap: currentTheme.spacing.m,
      marginBottom: currentTheme.spacing.m,
      paddingHorizontal: currentTheme.spacing.l,
    },
    categoryGridItemCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: currentTheme.spacing.m,
      borderRadius: currentTheme.radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      gap: currentTheme.spacing.m,
    },
    categoryGridItemText: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text,
      flexShrink: 1,
    },
    selectedCategoryItem: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    confirmButton: {
      padding: currentTheme.spacing.l,
    },
  });