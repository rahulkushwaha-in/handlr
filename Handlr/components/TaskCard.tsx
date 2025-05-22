import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@/types';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../context/ThemeContext'; // Added
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { categories } from '@/mocks/categories'; // Data-driven colors from here are fine

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
}

// Define AppColorsType if not globally available, for use in dynamicStyles
// type AppColorsType = ReturnType<typeof useTheme>['colors'];

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const { colors } = useTheme(); // Accessed theme colors
  const styles = dynamicStyles(colors, originalTheme); // Generate styles dynamically

  const category = categories.find(c => c.id === task.category);
  
  // Updated to use theme context colors
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'accepted':
        return colors.info;
      case 'in-progress':
        return colors.primary; // Or a specific "in-progress" color if available
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.subtext;
    }
  };

  const formatStatus = (status: Task['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(task)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>{formatStatus(task.status)}</Text>
          </View>
        </View>
        {category && (
          // Category badge uses data-driven colors, this is fine
          <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {task.description}
      </Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Calendar size={14} color={colors.subtext} /> 
          <Text style={styles.detailText}>{task.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color={colors.subtext} /> 
          <Text style={styles.detailText}>{task.time.start}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={14} color={colors.subtext} /> 
          <Text style={styles.detailText} numberOfLines={1}>
            {task.location.address}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>₹{task.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Converted styles to a function that accepts colors and originalTheme
const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      backgroundColor: colors.card, // Updated
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.m,
      marginBottom: currentTheme.spacing.m,
      shadowColor: colors.black, // Updated from common.black
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    header: {
      marginBottom: currentTheme.spacing.s,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.xs,
    },
    title: {
      ...currentTheme.typography.h4,
      color: colors.text, // Added color
      flex: 1,
      marginRight: currentTheme.spacing.s,
    },
    statusBadge: {
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 2,
      borderRadius: currentTheme.radius.s,
    },
    statusText: {
      color: colors.white, // Updated from common.white
      fontSize: 10,
      fontWeight: '600',
    },
    categoryBadge: { // Data-driven colors, no change needed here for background/text
      alignSelf: 'flex-start',
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 4,
      borderRadius: currentTheme.radius.s,
      marginBottom: currentTheme.spacing.s,
    },
    categoryText: { // Data-driven color, no change needed
      ...currentTheme.typography.caption,
      fontWeight: '600',
    },
    description: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext, // Updated
      marginBottom: currentTheme.spacing.m,
    },
    detailsContainer: {
      marginBottom: currentTheme.spacing.m,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.xs,
    },
    detailText: {
      ...currentTheme.typography.caption,
      color: colors.subtext, // Updated
      marginLeft: currentTheme.spacing.xs,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    price: {
      ...currentTheme.typography.h4,
      color: colors.primary, // Updated
    },
    // Examples for other styles mentioned in prompt, if they existed:
    // tag: { backgroundColor: colors.highlight },
    // tagText: { color: colors.primary },
    // separator: { backgroundColor: colors.border },
  });

export default TaskCard;
