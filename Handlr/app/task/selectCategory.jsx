import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories } from '@/mocks/categories';
import colors from '@/constants/colors';
import theme from '@/constants/theme';
import Button from '@/components/Button';

const SelectCategoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleConfirm = () => {
    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }
    // Navigate back to create-task with the selected category
    router.back();
    router.setParams({ selectedCategory: JSON.stringify(selectedCategory) });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory?.id === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => handleSelectCategory(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color || colors.primary }]} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Select Category',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
        }}
      />
      <Text style={styles.title}>Select a Category</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoryList}
      />
      <Button
        title="Confirm Selection"
        onPress={handleConfirm}
        fullWidth
        disabled={!selectedCategory}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: theme.spacing.l,
    color: colors.text,
  },
  categoryList: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.xl,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedCategoryItem: {
    backgroundColor: colors.primary + '20',
  },
  categoryIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: theme.spacing.m,
  },
  categoryText: {
    fontSize: 18,
    color: colors.text,
    ...theme.typography.body,
  },
});

export default SelectCategoryScreen;