import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '@/types';
import theme from '@/constants/theme';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { categories } from '@/mocks/categories';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const category = categories.find(c => c.id === task.category);
  
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.light.warning;
      case 'accepted':
        return theme.colors.light.info;
      case 'in-progress':
        return theme.colors.light.primary;
      case 'completed':
        return theme.colors.light.success;
      case 'cancelled':
        return theme.colors.light.error;
      default:
        return theme.colors.light.subtext;
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
          <Calendar size={14} color={theme.colors.light.subtext} />
          <Text style={styles.detailText}>{task.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={14} color={theme.colors.light.subtext} />
          <Text style={styles.detailText}>{task.time.start}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={14} color={theme.colors.light.subtext} />
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
    marginBottom: theme.spacing.s,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h4,
    flex: 1,
    marginRight: theme.spacing.s,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.radius.s,
  },
  statusText: {
    color: theme.colors.common.white,
    fontSize: 10,
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.radius.s,
    marginBottom: theme.spacing.s,
  },
  categoryText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.m,
  },
  detailsContainer: {
    marginBottom: theme.spacing.m,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  price: {
    ...theme.typography.h4,
    color: theme.colors.light.primary,
  },
});

export default TaskCard;