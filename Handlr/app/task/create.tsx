import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  DollarSign,
  ChevronDown,
  ChevronRight
} from 'lucide-react-native';
import theme from '@/constants/theme';
import Button from '@/components/Button';
import { categories } from '@/mocks/categories';
import { taskers } from '@/mocks/taskers';
import { Category, Tasker } from '@/types';

export default function CreateTaskScreen() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTasker, setSelectedTasker] = useState<Tasker | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // If taskerId is provided in params, find and set the selected tasker
    if (params.taskerId) {
      const taskerId = typeof params.taskerId === 'string' ? params.taskerId : params.taskerId[0];
      const tasker = taskers.find(t => t.id === taskerId);
      if (tasker) {
        setSelectedTasker(tasker);
        
        // If tasker has categories, select the first one
        if (tasker.categories.length > 0) {
          const category = categories.find(c => c.id === tasker.categories[0]);
          if (category) {
            setSelectedCategory(category);
          }
        }
      }
    }
  }, [params]);

  const handleSelectCategory = () => {
    // In a real app, this would open a modal or navigate to a category selection screen
    Alert.alert(
      "Select Category",
      "This would open a category selection screen in a real app."
    );
  };

  const handleSelectTasker = () => {
    if (!selectedTasker) {
      router.push('/explore');
    }
  };

  const handleSelectDate = () => {
    // In a real app, this would open a date picker
    setDate('2023-06-15');
  };

  const handleSelectTime = () => {
    // In a real app, this would open a time picker
    setTime('10:00 AM');
  };

  const handleSelectLocation = () => {
    // In a real app, this would open a location picker
    setLocation('Indiranagar, Bangalore');
  };

  const handleCreateTask = () => {
    // Validate inputs
    if (!title || !description || !selectedCategory || !selectedTasker || !date || !time || !location || !price) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    // In a real app, this would create a task in the backend
    Alert.alert(
      "Task Created",
      "Your task has been created successfully!",
      [
        {
          text: "OK",
          onPress: () => router.push('/')
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Create Task',
        }} 
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.container}>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                value={title}
                onChangeText={setTitle}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your task in detail"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={handleSelectCategory}
              >
                {selectedCategory ? (
                  <View style={styles.selectedItem}>
                    <View 
                      style={[
                        styles.categoryIcon, 
                        { backgroundColor: selectedCategory.color }
                      ]}
                    />
                    <Text style={styles.selectedText}>{selectedCategory.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Select a category</Text>
                )}
                <ChevronRight size={20} color={theme.colors.light.subtext} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tasker</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={handleSelectTasker}
              >
                {selectedTasker ? (
                  <View style={styles.selectedItem}>
                    <View style={styles.taskerAvatarContainer}>
                      <Text style={styles.taskerAvatar}>
                        {selectedTasker.name.charAt(0)}
                      </Text>
                    </View>
                    <Text style={styles.selectedText}>{selectedTasker.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Select a tasker</Text>
                )}
                <ChevronRight size={20} color={theme.colors.light.subtext} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing.m }]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={handleSelectDate}
                >
                  {date ? (
                    <Text style={styles.selectedText}>{date}</Text>
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <CalendarIcon size={16} color={theme.colors.light.subtext} />
                      <Text style={styles.placeholderText}>Select</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color={theme.colors.light.subtext} />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={handleSelectTime}
                >
                  {time ? (
                    <Text style={styles.selectedText}>{time}</Text>
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Clock size={16} color={theme.colors.light.subtext} />
                      <Text style={styles.placeholderText}>Select</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color={theme.colors.light.subtext} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity 
                style={styles.selectButton}
                onPress={handleSelectLocation}
              >
                {location ? (
                  <View style={styles.selectedItem}>
                    <MapPin size={16} color={theme.colors.light.primary} />
                    <Text style={styles.selectedText}>{location}</Text>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <MapPin size={16} color={theme.colors.light.subtext} />
                    <Text style={styles.placeholderText}>Select location</Text>
                  </View>
                )}
                <ChevronRight size={20} color={theme.colors.light.subtext} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Budget (₹)</Text>
              <View style={styles.priceInputContainer}>
                <DollarSign size={16} color={theme.colors.light.subtext} />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Enter amount"
                  value={price}
                  onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
        </ScrollView>
        
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Button
            title="Create Task"
            onPress={handleCreateTask}
            fullWidth
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  formContainer: {
    padding: theme.spacing.l,
  },
  formGroup: {
    marginBottom: theme.spacing.l,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    ...theme.typography.body,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.light.placeholder,
    marginLeft: theme.spacing.xs,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    ...theme.typography.body,
    color: theme.colors.light.text,
    marginLeft: theme.spacing.xs,
  },
  categoryIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  taskerAvatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskerAvatar: {
    color: theme.colors.common.white,
    fontSize: 12,
    fontWeight: '600',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.m,
    paddingHorizontal: theme.spacing.m,
  },
  priceInput: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    ...theme.typography.body,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.border,
    backgroundColor: theme.colors.light.background,
  },
});