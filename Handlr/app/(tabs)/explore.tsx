import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Filter } from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../context/ThemeContext'; // Added
import { categories } from '@/mocks/categories';
import { taskers } from '@/mocks/taskers';
import { Category, Tasker } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import TaskerCard from '@/components/TaskerCard';
import SearchInput from '@/components/SearchInput';

export default function ExploreScreen() {
  const { colors } = useTheme(); // Accessed theme colors
  const styles = dynamicStyles(colors, originalTheme); // Generate styles dynamically

  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.category as string || null
  );
  const [filteredTaskers, setFilteredTaskers] = useState(taskers);

  useEffect(() => {
    filterTaskers();
  }, [selectedCategory, searchQuery]);

  const filterTaskers = () => {
    let filtered = [...taskers];
    
    if (selectedCategory) {
      filtered = filtered.filter(tasker => 
        tasker.categories.includes(selectedCategory)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tasker => 
        tasker.name.toLowerCase().includes(query) ||
        tasker.skills.some(skill => skill.toLowerCase().includes(query)) ||
        tasker.bio.toLowerCase().includes(query)
      );
    }
    
    setFilteredTaskers(filtered);
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(selectedCategory === category.id ? null : category.id);
  };

  const handleTaskerPress = (tasker: Tasker) => {
    router.push(`/tasker/${tasker.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.text} /> 
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search for taskers..."
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              onPress={handleCategoryPress}
              selected={selectedCategory === item.id}
            />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          {filteredTaskers.length} {filteredTaskers.length === 1 ? 'tasker' : 'taskers'} found
        </Text>
      </View>

      <FlatList
        data={filteredTaskers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskerCardContainer}>
            <TaskerCard tasker={item} onPress={handleTaskerPress} />
          </View>
        )}
        contentContainerStyle={styles.taskersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No taskers found</Text>
            <Text style={styles.emptyText}>
              Try changing your search criteria or category
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Converted styles to a function that accepts colors and originalTheme
const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Updated
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: currentTheme.spacing.l,
      paddingTop: currentTheme.spacing.l,
      paddingBottom: currentTheme.spacing.m,
    },
    title: {
      ...currentTheme.typography.h2, 
      color: colors.text, // Added color
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 20, 
      backgroundColor: colors.card, // Updated
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
    },
    categoriesContainer: {
      marginBottom: currentTheme.spacing.l,
    },
    categoriesList: {
      paddingHorizontal: currentTheme.spacing.l,
    },
    resultContainer: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
    },
    resultText: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext, // Updated
    },
    taskersList: {
      paddingHorizontal: currentTheme.spacing.l,
      paddingBottom: currentTheme.spacing.xl,
    },
    taskerCardContainer: { 
      marginBottom: currentTheme.spacing.m,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
      marginTop: currentTheme.spacing.xl,
    },
    emptyTitle: {
      ...currentTheme.typography.h3,
      color: colors.text, // Added color
      marginBottom: currentTheme.spacing.s,
    },
    emptyText: {
      ...currentTheme.typography.body,
      color: colors.subtext, // Updated
      textAlign: 'center',
    },
  });

export default ExploreScreen;
