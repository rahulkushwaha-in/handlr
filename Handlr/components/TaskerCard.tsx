import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Tasker } from '@/types';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../context/ThemeContext'; // Added
import { Star, MapPin } from 'lucide-react-native'; // CheckCircle not used in original

interface TaskerCardProps {
  tasker: Tasker;
  onPress: (tasker: Tasker) => void;
}

const TaskerCard: React.FC<TaskerCardProps> = ({ tasker, onPress }) => {
  const { colors } = useTheme(); // Accessed theme colors
  const styles = dynamicStyles(colors, originalTheme); // Generate styles dynamically

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(tasker)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: tasker.avatar }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{tasker.name}</Text>
            {tasker.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.warning} fill={colors.warning} /> 
            <Text style={styles.rating}>
              {tasker.rating.toFixed(1)} ({tasker.totalReviews})
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={colors.subtext} /> 
            <Text style={styles.location} numberOfLines={1}>
              {tasker.location?.address}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.experienceLabel}>Experience</Text>
          <Text style={styles.experienceValue}>{tasker.experience} years</Text>
        </View>
        <View>
          <Text style={styles.rateLabel}>Hourly Rate</Text>
          <Text style={styles.rateValue}>₹{tasker.hourlyRate}</Text>
        </View>
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
      shadowColor: currentTheme.colors.common.black, // Changed to common.black
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: currentTheme.spacing.m,
    },
    info: {
      flex: 1,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.xs,
    },
    name: {
      ...currentTheme.typography.h4,
      color: colors.text, // Updated
      marginRight: currentTheme.spacing.s,
    },
    verifiedBadge: {
      backgroundColor: colors.success, // Updated
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 2,
      borderRadius: currentTheme.radius.s,
    },
    verifiedText: {
      color: currentTheme.colors.common.white, // Changed to common.white
      fontSize: 10,
      fontWeight: '600',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.xs,
    },
    rating: {
      ...currentTheme.typography.bodySmall,
      marginLeft: currentTheme.spacing.xs,
      color: colors.text, // Updated
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    location: {
      ...currentTheme.typography.caption,
      color: colors.subtext, // Updated
      marginLeft: currentTheme.spacing.xs,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border, // Updated
      marginVertical: currentTheme.spacing.m,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    experienceLabel: {
      ...currentTheme.typography.caption,
      color: colors.subtext, // Updated
      marginBottom: 2,
    },
    experienceValue: {
      ...currentTheme.typography.bodySmall,
      fontWeight: '600',
      color: colors.text, // Added color
    },
    rateLabel: {
      ...currentTheme.typography.caption,
      color: colors.subtext, // Updated
      marginBottom: 2,
    },
    rateValue: {
      ...currentTheme.typography.bodySmall,
      fontWeight: '600',
      color: colors.primary, // Updated
    },
    // Styles mentioned in prompt but not in original code (example):
    // categoryText: { color: colors.primary },
    // distanceText: { color: colors.subtext },
    // completedTasksText: { color: colors.subtext },
    // viewProfileButton: { backgroundColor: colors.highlight },
    // viewProfileButtonText: { color: colors.primary },
  });

export default TaskerCard;
