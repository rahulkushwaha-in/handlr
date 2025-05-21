import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Filter } from 'lucide-react-native';
import theme from '@/constants/theme';
import { categories } from '@/mocks/categories';
import { taskers } from '@/mocks/taskers';
import { Category, Tasker } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import TaskerCard from '@/components/TaskerCard';
import SearchInput from '@/components/SearchInput';

export default function ExploreScreen() {
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
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(tasker => 
        tasker.categories.includes(selectedCategory)
      );
    }
    
    // Filter by search query
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
          <Filter size={20} color={theme.colors.light.text} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.l,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.l,
  },
  resultContainer: {
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  resultText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
  },
  taskersList: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
  },
  taskerCardContainer: {
    marginBottom: theme.spacing.m,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.s,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
    textAlign: 'center',
  },
});