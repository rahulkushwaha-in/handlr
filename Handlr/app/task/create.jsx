import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Switch,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, ChevronDown, ChevronRight } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import theme from '@/constants/theme';
import Button from '@/components/Button';
import { categories } from '@/mocks/categories';
import { taskers } from '@/mocks/taskers';
import colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import originalTheme from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { categoryConfig } from '@/config/categoryConfig';

export default function CreateTaskScreen() {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTasker, setSelectedTasker] = useState(null);
  const [mode, setMode] = useState('now');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dateDisplay, setDateDisplay] = useState('');
  const [timeDisplay, setTimeDisplay] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedLocationObj, setSelectedLocationObj] = useState(null);
  const [locationDisplay, setLocationDisplay] = useState('');
  const [price, setPrice] = useState('');
  const toggleAnim = useRef(new Animated.Value(0)).current;
  const [categoryFields, setCategoryFields] = useState({});
  const scrollViewRef = useRef(null);

  const maxToggleWidth = Math.min(Dimensions.get('window').width - 2 * theme.spacing.l, 400);
  const buttonWidth = maxToggleWidth / 2 - 2;

  const getCurrentDateTime = () => {
    // Get current date and time
    const now = new Date();
    
    // Adjust for local timezone offset to get correct local time
    const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localTime = new Date(now.getTime() - timezoneOffset);
    
    return now;
  };

  const formatDateDisplay = (date) => {
    return date?.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }) || '';
  };

  const formatTimeDisplay = (date) => {
    return date?.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) || '';
  };

  useEffect(() => {
    if (mode === 'now') {
      const now = getCurrentDateTime();
      setSelectedDate(now);
      setSelectedTime(now);
      setDateDisplay(formatDateDisplay(now));
      setTimeDisplay(formatTimeDisplay(now));
    }
  }, [mode]);

  useEffect(() => {
    if (params.selectedLocation) {
      try {
        const locationData = typeof params.selectedLocation === 'string'
          ? JSON.parse(params.selectedLocation)
          : params.selectedLocation;
        setSelectedLocationObj(locationData);
        setLocationDisplay(locationData.name || locationData.fullAddress);
      } catch (error) {
        console.error('Error parsing selected location:', error);
        Alert.alert('Error', 'Failed to load selected location.');
      }
    }
    if (params.selectedCategory) {
      try {
        const categoryData = typeof params.selectedCategory === 'string'
          ? JSON.parse(params.selectedCategory)
          : params.selectedCategory;
        setSelectedCategory(categoryData);
        const config = categoryConfig[categoryData.id] || {};
        const initialFields = {};
        config.fields?.forEach(field => {
          initialFields[field.id] = field.type === 'checkbox' ? [] : field.type === 'switch' ? field.defaultValue || false : '';
        });
        setCategoryFields(initialFields);
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 400, animated: true });
        }, 100);
      } catch (error) {
        console.error('Error parsing selected category:', error);
        Alert.alert('Error', 'Failed to load selected category.');
      }
    }
  }, [params.selectedLocation, params.selectedCategory]);

  useEffect(() => {
    if (params.taskerId) {
      const taskerId = typeof params.taskerId === 'string' ? params.taskerId : params.taskerId[0];
      const tasker = taskers.find((t) => t.id === taskerId);
      if (tasker) {
        setSelectedTasker(tasker);
        if (tasker.categories.length > 0) {
          const category = categories.find((c) => c.id === tasker.categories[0]);
          if (category) {
            setSelectedCategory(category);
            const config = categoryConfig[category.id] || {};
            const initialFields = {};
            config.fields?.forEach(field => {
              initialFields[field.id] = field.type === 'checkbox' ? [] : field.type === 'switch' ? field.defaultValue || false : '';
            });
            setCategoryFields(initialFields);
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ y: 400, animated: true });
            }, 100);
          }
        }
      }
    }
  }, [params.taskerId]);


  const handleToggleMode = (newMode) => {
    setMode(newMode);
    Animated.spring(toggleAnim, {
      toValue: newMode === 'now' ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  
    if (newMode === 'now') {
      const now = new Date(); // Use actual current time instead of fixed mock
      const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
      setSelectedDate(localNow);
      setSelectedTime(localNow);
      setDateDisplay(formatDateDisplay(localNow));
      setTimeDisplay(formatTimeDisplay(localNow));
      setShowDatePicker(false);
      setShowTimePicker(false);
    } else {
      // For 'later' mode, keep existing behavior
      setSelectedDate(null);
      setSelectedTime(null);
      setDateDisplay('');
      setTimeDisplay('');
    }
  };

  // const handleSelectDate = (event, pickedDate) => {
  //   setShowDatePicker(false);
  //   if (event.type === 'dismissed' || !pickedDate) {
  //     return;
  //   }
  //   try {
  //     let finalDate;
  //     if (selectedTime) {
  //       finalDate = new Date(pickedDate);
  //       finalDate.setHours(selectedTime.getHours());
  //       finalDate.setMinutes(selectedTime.getMinutes());
  //       finalDate.setSeconds(selectedTime.getSeconds());
  //     } else {
  //       finalDate = pickedDate;
  //     }
  //     setSelectedDate(finalDate);
  //     setDateDisplay(formatDateDisplay(finalDate));
  //     if (selectedTime) {
  //       setTimeDisplay(formatTimeDisplay(finalDate));
  //       setSelectedTime(finalDate);
  //     }
  //   } catch (error) {
  //     console.error('Date selection error:', error);
  //     Alert.alert('Error', 'Failed to select date. Please try again.');
  //   }
  // };

  const handleSelectDate = (event, pickedDate) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed' || !pickedDate) {
      return;
    }
  
    try {
      // Create a new date object to avoid reference issues
      const adjustedDate = new Date(pickedDate);
      
      // If time was already selected, combine them
      if (selectedTime) {
        adjustedDate.setHours(selectedTime.getHours());
        adjustedDate.setMinutes(selectedTime.getMinutes());
        adjustedDate.setSeconds(0); // Reset seconds for consistency
      } else {
        // Default to current time if no time selected
        const now = new Date();
        adjustedDate.setHours(now.getHours());
        adjustedDate.setMinutes(now.getMinutes());
      }
  
      // Update all states
      setSelectedDate(adjustedDate);
      setSelectedTime(adjustedDate);
      setDateDisplay(formatDateDisplay(adjustedDate));
      setTimeDisplay(formatTimeDisplay(adjustedDate));
      
    } catch (error) {
      console.error('Date selection error:', error);
      Alert.alert('Error', 'Failed to select date. Please try again.');
    }
  };

  const handleSelectTime = (event, pickedTime) => {
    setShowTimePicker(false);
    if (event.type === 'dismissed' || !pickedTime) {
      return;
    }
  
    try {
      let finalDate;
      
      if (selectedDate) {
        // Combine with existing date
        finalDate = new Date(selectedDate);
        finalDate.setHours(pickedTime.getHours());
        finalDate.setMinutes(pickedTime.getMinutes());
        finalDate.setSeconds(0); // Reset seconds for consistency
      } else {
        // Use today's date if no date selected
        finalDate = new Date();
        finalDate.setHours(pickedTime.getHours());
        finalDate.setMinutes(pickedTime.getMinutes());
        finalDate.setSeconds(0);
      }
  
      // Update all states
      setSelectedDate(finalDate);
      setSelectedTime(finalDate);
      setDateDisplay(formatDateDisplay(finalDate));
      setTimeDisplay(formatTimeDisplay(finalDate));
      
    } catch (error) {
      console.error('Time selection error:', error);
      Alert.alert('Error', 'Failed to select time. Please try again.');
    }
  };


  const handleSelectCategory = () => {
    router.navigate({
      pathname: '/categories',
      params: { 
        fromCreateTask: true,
        // Add a reference to where we came from
        // returnScreen: 'task/create' 
      }
    });
  };

  const handleCategoryFieldChange = (fieldId, value) => {
    setCategoryFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const showFieldOptions = (field) => {
    Alert.alert(
      field.label,
      'Select an option',
      [
        ...field.options.map(option => ({
          text: option.label,
          onPress: () => handleCategoryFieldChange(field.id, option.value)
        })),
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  };

  const toggleCheckbox = (fieldId, value) => {
    const currentValues = Array.isArray(categoryFields[fieldId])
      ? [...categoryFields[fieldId]]
      : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    handleCategoryFieldChange(fieldId, newValues);
  };

  const renderCategoryFields = () => {
    if (!selectedCategory) {
      return null;
    }
    const config = categoryConfig[selectedCategory.id];
    if (!config?.fields) {
      console.warn(`No fields found for category: ${selectedCategory.id}`);
      return (
        <View style={styles.categoryFieldsContainer}>
          <Text style={styles.sectionTitle}>{selectedCategory.name} Details</Text>
          <Text style={styles.errorText}>No additional details required for this category.</Text>
        </View>
      );
    }

    return (
      <View style={styles.categoryFieldsContainer}>
        <Text style={styles.sectionTitle}>{selectedCategory.name} Details</Text>
        {config.fields.map(field => {
          switch (field.type) {
            case 'select':
              return (
                <View key={field.id} style={styles.formGroup}>
                  <Text style={styles.label}>{field.label}{field.required ? ' *' : ''}</Text>
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => showFieldOptions(field)}
                  >
                    <Text style={categoryFields[field.id] ? styles.selectedText : styles.placeholderText}>
                      {categoryFields[field.id] || `Select ${field.label.toLowerCase()}`}
                    </Text>
                    <ChevronDown size={16} color={colors.subtext} />
                  </TouchableOpacity>
                </View>
              );
            case 'number':
              return (
                <View key={field.id} style={styles.formGroup}>
                  <Text style={styles.label}>{field.label}{field.required ? ' *' : ''}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    placeholderTextColor={colors.placeholder}
                    value={categoryFields[field.id]?.toString() || ''}
                    onChangeText={(text) => handleCategoryFieldChange(
                      field.id,
                      field.min !== undefined && field.max !== undefined
                        ? Math.max(field.min, Math.min(field.max, Number(text.replace(/[^0-9]/g, ''))))
                        : text.replace(/[^0-9]/g, '')
                    )}
                    keyboardType="number-pad"
                  />
                </View>
              );
            case 'checkbox':
              return (
                <View key={field.id} style={styles.formGroup}>
                  <Text style={styles.label}>{field.label}{field.required ? ' *' : ''}</Text>
                  <View style={styles.checkboxContainer}>
                    {field.options.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.checkboxOption}
                        onPress={() => toggleCheckbox(field.id, option.value)}
                      >
                        <View style={[
                          styles.checkbox,
                          categoryFields[field.id]?.includes(option.value) && styles.checkboxSelected
                        ]}>
                          {categoryFields[field.id]?.includes(option.value) && (
                            <Text style={styles.checkboxIcon}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.checkboxLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            case 'switch':
              return (
                <View key={field.id} style={[styles.formGroup, styles.switchContainer]}>
                  <Text style={styles.label}>{field.label}{field.required ? ' *' : ''}</Text>
                  <Switch
                    value={categoryFields[field.id] || false}
                    onValueChange={(value) => handleCategoryFieldChange(field.id, value)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.white}
                  />
                </View>
              );
            case 'textarea':
              return (
                <View key={field.id} style={styles.formGroup}>
                  <Text style={styles.label}>{field.label}{field.required ? ' *' : ''}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    placeholderTextColor={colors.placeholder}
                    value={categoryFields[field.id] || ''}
                    onChangeText={(text) => handleCategoryFieldChange(field.id, text)}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              );
            default:
              return null;
          }
        })}
      </View>
    );
  };

  const handleCreateTask = () => {
    // if (!title || !description || !selectedCategory || !selectedDate || !selectedTime || !selectedLocationObj) {
    //   Alert.alert('Error', 'Please fill in all required fields');
    //   return;
    // }

    const config = selectedCategory && categoryConfig[selectedCategory.id];
    if (config?.fields) {
      const missingFields = config.fields
        .filter(field => field.required && (!categoryFields[field.id] || (Array.isArray(categoryFields[field.id]) && categoryFields[field.id].length === 0)))
        .map(field => field.label);
      if (missingFields.length > 0) {
        Alert.alert(
          'Error',
          `Please fill in these required fields:\n${missingFields.join('\n')}`
        );
        return;
      }
    }

    const taskData = {
      title,
      description,
      category: selectedCategory,
      date: selectedDate,
      time: selectedTime,
      // location: selectedLocationObj,
      price,
      categoryDetails: categoryFields
    };

    console.log('Task created with:', taskData);
    
  
  };

  const getDatePickerValue = () => {
    return selectedDate || getCurrentDateTime();
  };

  const getTimePickerValue = () => {
    return selectedTime || getCurrentDateTime();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Task',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView style={styles.container} ref={scrollViewRef}>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter task title"
                placeholderTextColor={colors.placeholder}
                value={title}
                onChangeText={setTitle}
              />
            </View>


            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.selectButton} onPress={handleSelectCategory}>
                {selectedCategory ? (
                  <View style={styles.selectedItem}>
                    <View style={[styles.categoryIcon, { backgroundColor: selectedCategory.color || colors.primary }]} />
                    <Text style={styles.selectedText}>{selectedCategory.name}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Select a category</Text>
                )}
                <ChevronRight size={20} color={colors.subtext} />
              </TouchableOpacity>
            </View>

            {renderCategoryFields()}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Schedule</Text>
              <LinearGradient
                colors={[colors.card + 'F0', colors.card + 'FF']}
                style={[styles.toggleContainer, { width: maxToggleWidth }]}
              >
                <TouchableOpacity
                  style={[styles.toggleButton, { width: buttonWidth }, mode === 'now' ? styles.toggleButtonActive : {}]}
                  onPress={() => handleToggleMode('now')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === 'now' ? styles.toggleTextActive : {},
                    ]}
                  >
                    Now
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, { width: buttonWidth }, mode === 'later' ? styles.toggleButtonActive : {}]}
                  onPress={() => handleToggleMode('later')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      mode === 'later' ? styles.toggleTextActive : {},
                    ]}
                  >
                    Later
                  </Text>
                </TouchableOpacity>
                <Animated.View
                  style={[
                    styles.toggleIndicator,
                    {
                      width: buttonWidth,
                      transform: [
                        {
                          translateX: toggleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, buttonWidth],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              </LinearGradient>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing.m }]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={[styles.selectButton, mode === 'now' ? styles.disabledButton : {}]}
                  onPress={() => {
                    if (mode === 'later') {
                      setShowDatePicker(true);
                      setShowTimePicker(false);
                    }
                  }}
                  disabled={mode === 'now'}
                >
                  {dateDisplay ? (
                    <Text style={styles.selectedText}>{dateDisplay}</Text>
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <CalendarIcon size={16} color={colors.subtext} />
                      <Text style={styles.placeholderText}>Select</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color={colors.subtext} />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={getDatePickerValue()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleSelectDate}
                    minimumDate={getCurrentDateTime()}
                  />
                )}
              </View>

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={[styles.selectButton, mode === 'now' ? styles.disabledButton : {}]}
                  onPress={() => {
                    if (mode === 'later') {
                      setShowTimePicker(true);
                      setShowDatePicker(false);
                    }
                  }}
                  disabled={mode === 'now'}
                >
                  {timeDisplay ? (
                    <Text style={styles.selectedText}>{timeDisplay}</Text>
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Clock size={16} color={colors.subtext} />
                      <Text style={styles.placeholderText}>Select</Text>
                    </View>
                  )}
                  <ChevronDown size={16} color={colors.subtext} />
                </TouchableOpacity>
                {showTimePicker && (
                  <DateTimePicker
                    value={getTimePickerValue()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleSelectTime}
                  />
                )}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity style={styles.selectButton} onPress={() => router.push('/location-picker')}>
                {selectedLocationObj ? (
                  <View style={styles.selectedItem}>
                    <MapPin size={16} color={colors.primary} />
                    <Text style={styles.selectedText}>{locationDisplay}</Text>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <MapPin size={16} color={colors.subtext} />
                    <Text style={styles.placeholderText}>Select location</Text>
                  </View>
                )}
                <ChevronRight size={20} color={colors.subtext} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Budget (₹)</Text>
              <View style={styles.priceInputContainer}>
                <DollarSign size={16} color={colors.subtext} />
                <TextInput
                  style={styles.priceInput}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.placeholder}
                  value={price}
                  onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional Detail (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your task in detail"
                placeholderTextColor={colors.placeholder}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Button title="Create Task"
          //  onPress={handleCreateTask} 
          onPress={() => router.push('task/taskConfirm')}
           fullWidth />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const dynamicStyles = (colors, currentTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    formContainer: {
      padding: currentTheme.spacing.l,
    },
    formGroup: {
      marginBottom: currentTheme.spacing.l,
    },
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      ...currentTheme.typography.bodySmall,
      fontWeight: '600',
      marginBottom: currentTheme.spacing.xs,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
      paddingVertical: currentTheme.spacing.m,
      ...currentTheme.typography.body,
      color: colors.text,
      backgroundColor: colors.card,
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
      borderColor: colors.border,
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
      paddingVertical: currentTheme.spacing.m,
      backgroundColor: colors.card,
    },
    placeholderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    placeholderText: {
      ...currentTheme.typography.body,
      color: colors.placeholder,
      marginLeft: currentTheme.spacing.xs,
    },
    selectedItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedText: {
      ...currentTheme.typography.body,
      color: colors.text,
      marginLeft: currentTheme.spacing.xs,
    },
    categoryIcon: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    priceInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
      backgroundColor: colors.card,
    },
    priceInput: {
      flex: 1,
      paddingVertical: currentTheme.spacing.m,
      ...currentTheme.typography.body,
      marginLeft: currentTheme.spacing.xs,
      color: colors.text,
    },
    footer: {
      padding: currentTheme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
    },
    toggleContainer: {
      flexDirection: 'row',
      borderRadius: currentTheme.radius.m,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      position: 'relative',
      height: 48,
      marginTop: currentTheme.spacing.xs,
    },
    toggleButton: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: currentTheme.spacing.s,
      zIndex: 1,
    },
    toggleButtonActive: {
      backgroundColor: colors.primary + '20',
    },
    toggleText: {
      ...currentTheme.typography.body,
      color: colors.subtext,
      fontWeight: '600',
      fontSize: 16,
    },
    toggleTextActive: {
      color: colors.primary,
      fontWeight: '700',
    },
    toggleIndicator: {
      position: 'absolute',
      height: 44,
      backgroundColor: colors.primary + '10',
      borderRadius: currentTheme.radius.m,
      borderWidth: 1,
      borderColor: colors.primary + '33',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
      top: 2,
      left: 2,
    },
    disabledButton: {
      backgroundColor: colors.card + '80',
      opacity: 0.6,
    },
    categoryFieldsContainer: {
      marginTop: currentTheme.spacing.xl,
      paddingTop: currentTheme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    sectionTitle: {
      ...currentTheme.typography.subtitle,
      fontWeight: '600',
      marginBottom: currentTheme.spacing.m,
      color: colors.text,
    },
    checkboxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: currentTheme.spacing.xs,
    },
    checkboxOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.s,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: currentTheme.spacing.xs,
    },
    checkboxSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxIcon: {
      color: colors.white,
      fontSize: 12,
    },
    checkboxLabel: {
      ...currentTheme.typography.body,
      color: colors.text,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    errorText: {
      ...currentTheme.typography.body,
      color: colors.error || '#FF0000',
    },
  });