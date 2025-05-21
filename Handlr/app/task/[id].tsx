import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Phone,
  Shield,
  AlertTriangle,
  ChevronLeft,
  Edit
} from 'lucide-react-native';
import theme from '@/constants/theme';
import Button from '@/components/Button';
import { tasks } from '@/mocks/tasks';
import { taskers } from '@/mocks/taskers';
import { categories } from '@/mocks/categories';
import { Task, Tasker, Category } from '@/types';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const [task, setTask] = useState<Task | null>(null);
  const [tasker, setTasker] = useState<Tasker | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  
  useEffect(() => {
    // Find task by ID
    const foundTask = tasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask as Task);
      
      // Find category
      const foundCategory = categories.find(c => c.id === foundTask.category);
      if (foundCategory) {
        setCategory(foundCategory);
      }
      
      // Find tasker if assigned
      if (foundTask.taskerId) {
        const foundTasker = taskers.find(t => t.id === foundTask.taskerId);
        if (foundTasker) {
          setTasker(foundTasker as Tasker);
        }
      }
    }
  }, [id]);

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

  const handleChat = () => {
    if (tasker) {
      router.push(`/chat/${tasker.id}`);
    }
  };

  const handleCall = () => {
    Alert.alert(
      "Call Tasker",
      `Would you like to call ${tasker?.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Call", 
          onPress: () => console.log("Call pressed")
        }
      ]
    );
  };

  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "This will alert our emergency response team. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Send SOS", 
          onPress: () => console.log("SOS pressed"),
          style: "destructive"
        }
      ]
    );
  };

  const handleEdit = () => {
    // In a real app, this would navigate to edit task screen
    Alert.alert("Edit Task", "This would allow you to edit the task details.");
  };

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Task Details',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.light.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleEdit}
            >
              <Edit size={20} color={theme.colors.light.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{task.title}</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Calendar size={20} color={theme.colors.light.primary} />
              <Text style={styles.detailText}>Date: {task.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={20} color={theme.colors.light.primary} />
              <Text style={styles.detailText}>
                Time: {task.time.start}{task.time.end ? ` - ${task.time.end}` : ''}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={20} color={theme.colors.light.primary} />
              <Text style={styles.detailText}>Location: {task.location.address}</Text>
            </View>
          </View>
        </View>

        {tasker && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tasker</Text>
            <View style={styles.taskerCard}>
              <Image
                source={{ uri: tasker.avatar }}
                style={styles.taskerAvatar}
              />
              <View style={styles.taskerInfo}>
                <View style={styles.taskerNameRow}>
                  <Text style={styles.taskerName}>{tasker.name}</Text>
                  {tasker.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>
                    ★ {tasker.rating.toFixed(1)} ({tasker.totalReviews} reviews)
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewProfileButton}
                  onPress={() => router.push(`/tasker/${tasker.id}`)}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Task Price</Text>
              <Text style={styles.paymentAmount}>₹{task.price}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Fee</Text>
              <Text style={styles.paymentAmount}>₹{Math.round(task.price * 0.05)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>₹{task.price + Math.round(task.price * 0.05)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.securitySection}>
          <View style={styles.securityIcon}>
            <Shield size={24} color={theme.colors.light.primary} />
          </View>
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>TaskRiser Guarantee</Text>
            <Text style={styles.securityText}>
              Your payment is held securely until the task is completed to your satisfaction.
            </Text>
          </View>
        </View>
        
        {/* Extra padding at the bottom to avoid footer overlap */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <TouchableOpacity 
          style={styles.sosButton}
          onPress={handleSOS}
        >
          <AlertTriangle size={20} color={theme.colors.light.error} />
        </TouchableOpacity>
        
        {tasker && (
          <>
            <Button
              title="Chat"
              onPress={handleChat}
              variant="outline"
              leftIcon={<MessageSquare size={18} color={theme.colors.light.primary} />}
              style={styles.chatButton}
            />
            <Button
              title="Call"
              onPress={handleCall}
              leftIcon={<Phone size={18} color={theme.colors.common.white} />}
              style={styles.callButton}
            />
          </>
        )}
        
        {!tasker && task.status === 'pending' && (
          <Button
            title="Find Tasker"
            onPress={() => router.push('/explore')}
            style={styles.findTaskerButton}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  title: {
    ...theme.typography.h2,
    flex: 1,
    marginRight: theme.spacing.s,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.m,
  },
  statusText: {
    color: theme.colors.common.white,
    ...theme.typography.caption,
    fontWeight: '600',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.m,
  },
  categoryText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  section: {
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.m,
  },
  description: {
    ...theme.typography.body,
    lineHeight: 24,
  },
  detailsContainer: {
    gap: theme.spacing.m,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...theme.typography.body,
    marginLeft: theme.spacing.m,
  },
  taskerCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
  },
  taskerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.m,
  },
  taskerInfo: {
    flex: 1,
  },
  taskerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskerName: {
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
    marginBottom: theme.spacing.s,
  },
  ratingText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.text,
  },
  viewProfileButton: {
    alignSelf: 'flex-start',
  },
  viewProfileText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.primary,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    padding: theme.spacing.l,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  paymentLabel: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
  },
  paymentAmount: {
    ...theme.typography.body,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.light.border,
    marginVertical: theme.spacing.s,
  },
  totalLabel: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  totalAmount: {
    ...theme.typography.h3,
    color: theme.colors.light.primary,
  },
  securitySection: {
    flexDirection: 'row',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.light.highlight,
    marginHorizontal: theme.spacing.l,
    marginVertical: theme.spacing.l,
    borderRadius: theme.radius.l,
  },
  securityIcon: {
    marginRight: theme.spacing.m,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  securityText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.m : theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.border,
    backgroundColor: theme.colors.light.background,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sosButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.light.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  chatButton: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  callButton: {
    flex: 1,
  },
  findTaskerButton: {
    flex: 1,
  },
});