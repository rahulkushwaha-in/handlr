import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Tasker } from '@/types';
import theme from '@/constants/theme';
import { Star, MapPin } from 'lucide-react-native';

interface TaskerCardProps {
  tasker: Tasker;
  onPress: (tasker: Tasker) => void;
}

const TaskerCard: React.FC<TaskerCardProps> = ({ tasker, onPress }) => {
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
            <Star size={16} color={theme.colors.light.warning} fill={theme.colors.light.warning} />
            <Text style={styles.rating}>
              {tasker.rating.toFixed(1)} ({tasker.totalReviews})
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={theme.colors.light.subtext} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.common.black,
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
    marginRight: theme.spacing.m,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    ...theme.typography.h4,
    marginRight: theme.spacing.s,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.light.success,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.radius.s,
  },
  verifiedText: {
    color: theme.colors.common.white,
    fontSize: 10,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  rating: {
    ...theme.typography.bodySmall,
    marginLeft: theme.spacing.xs,
    color: theme.colors.light.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.light.border,
    marginVertical: theme.spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  experienceLabel: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginBottom: 2,
  },
  experienceValue: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  rateLabel: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginBottom: 2,
  },
  rateValue: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.light.primary,
  },
});

export default TaskerCard;