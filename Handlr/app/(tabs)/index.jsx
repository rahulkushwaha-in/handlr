import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal,
  Animated,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, MapPin, X, Search, ArrowRight, Star, Calendar, Clock } from 'lucide-react-native';
import originalTheme from '@/constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { categories } from '@/mocks/categories';
import { taskers } from '@/mocks/taskers';
import { tasks } from '@/mocks/tasks'; 
import { Category, Tasker, Task } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import TaskerCard from '@/components/TaskerCard';
import TaskCard from '@/components/TaskCard';
import SearchInput from '@/components/SearchInput';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const user = useAuthStore(state => state.user);

  const handleSearchFocus = () => {
   
    router.push({ pathname: '/categories', params: { autoFocus: '1' } });


  };

  const handleCategoryPress = (category) => {
    router.push({
      pathname: '/explore',
      params: { category: category.id }
    });
  };

  const handleTaskerPress = (tasker) => {
    router.push(`/tasker/${tasker.id}`);
  };

  const handleTaskPress = (task) => {
    router.push(`/task/${task.id}`);
  };

  const currentNotificationsData = [
    { id: '1', title: 'New message', message: 'Rajesh Kumar sent you a message', time: '10 min ago', read: false, },
    { id: '2', title: 'Task update', message: 'Your cleaning task has been accepted', time: '1 hour ago', read: true, },
    { id: '3', title: 'Payment successful', message: 'Payment for plumbing task was successful', time: '2 days ago', read: true, },
  ];

  // Featured sections data
  const featuredTaskers = taskers.filter(t => t.rating >= 4.8).slice(0, 3);
  const ongoingTasks = tasks.filter(t => t.status === 'in-progress');
  const upcomingTasks = tasks.filter(t => t.status === 'accepted');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={colors.subtext} />
              <Text style={styles.locationText}>Bangalore, India</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Bell size={24} color={colors.text} />
            {currentNotificationsData.some(n => !n.read) && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>

        {/* Search Bar with Animation */}
        <Animated.View 
          style={[
            styles.searchContainer,
            { transform: [{ scale: searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }) }] }
          ]}
        >
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchFocus}
            activeOpacity={0.7}
          >
            <Search size={20} color={colors.subtext} />
            <Text style={styles.searchPlaceholder}>Search for services...</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        {/* <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.createTaskButton}
            onPress={() => router.push('/task/create')}
          >
            <View style={styles.createTaskContent}>
              <Text style={styles.createTaskTitle}>Create New Task</Text>
              <Text style={styles.createTaskSubtitle}>Find the perfect tasker</Text>
            </View>
            <ArrowRight size={24} color={colors.primary} />
          </TouchableOpacity>
        </View> */}

        {/* Ongoing Tasks Section */}
        {ongoingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ongoing Tasks</Text>
            </View>
            {ongoingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onPress={handleTaskPress} />
            ))}
          </View>
        )}

        {/* Popular Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                onPress={handleCategoryPress}
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Taskers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Taskers</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredTaskers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskerCardContainer}>
                <TaskerCard tasker={item} onPress={handleTaskerPress} />
              </View>
            )}
            contentContainerStyle={styles.taskersList}
          />
        </View>

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            </View>
            {upcomingTasks.map((task) => (
              <View key={task.id} style={styles.upcomingTaskCard}>
                <View style={styles.upcomingTaskHeader}>
                  <Text style={styles.upcomingTaskTitle}>{task.title}</Text>
                  <Star size={16} color={colors.warning} fill={colors.warning} />
                </View>
                <View style={styles.upcomingTaskDetails}>
                  <View style={styles.upcomingTaskDetail}>
                    <Calendar size={14} color={colors.subtext} />
                    <Text style={styles.upcomingTaskDetailText}>{task.date}</Text>
                  </View>
                  <View style={styles.upcomingTaskDetail}>
                    <Clock size={14} color={colors.subtext} />
                    <Text style={styles.upcomingTaskDetailText}>{task.time.start}</Text>
                  </View>
                </View>
                <Button
                  title="View Details"
                  onPress={() => handleTaskPress(task)}
                  size="small"
                  variant="outline"
                />
              </View>
            ))}
          </View>
        )}

        {/* Empty State for Tasks */}
        {!ongoingTasks.length && !upcomingTasks.length && (
          <View style={styles.emptyTasksContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }}
              style={styles.emptyTasksImage}
            />
            <Text style={styles.emptyTasksTitle}>No tasks yet</Text>
            <Text style={styles.emptyTasksText}>
              Create your first task and find the perfect tasker for your needs
            </Text>
            <Button
              title="Create a Task"
              onPress={() => router.push('/task/create')}
              style={styles.createTaskButton}
            />
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationsModalContainer}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={currentNotificationsData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.notificationItem,
                    !item.read && styles.unreadNotification
                  ]}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationMessage}>{item.message}</Text>
                    <Text style={styles.notificationTime}>{item.time}</Text>
                  </View>
                  {!item.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyNotifications}>
                  <Text style={styles.emptyNotificationsText}>No notifications yet</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const dynamicStyles = (colors, currentTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    welcomeSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: currentTheme.spacing.l,
      paddingTop: currentTheme.spacing.l,
      paddingBottom: currentTheme.spacing.m,
    },
    greeting: {
      ...currentTheme.typography.h2,
      color: colors.text,
      marginBottom: currentTheme.spacing.xs,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      marginLeft: currentTheme.spacing.xs,
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.error,
    },
    searchContainer: {
      padding: currentTheme.spacing.l,
    },
    searchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
      height: 48,
    },
    searchPlaceholder: {
      ...currentTheme.typography.body,
      color: colors.subtext,
      marginLeft: currentTheme.spacing.m,
    },
    quickActions: {
      padding: currentTheme.spacing.l,
      paddingTop: 0,
    },
    createTaskButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.l,
      borderWidth: 1,
      borderColor: colors.border,
    },
    createTaskContent: {
      flex: 1,
    },
    createTaskTitle: {
      ...currentTheme.typography.h3,
      color: colors.text,
      marginBottom: 4,
    },
    createTaskSubtitle: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
    },
    section: {
      marginBottom: currentTheme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
    },
    sectionTitle: {
      ...currentTheme.typography.h3,
      color: colors.text,
    },
    seeAllText: {
      ...currentTheme.typography.bodySmall,
      color: colors.primary,
      fontWeight: '600',
    },
    categoriesList: {
      paddingHorizontal: currentTheme.spacing.l,
    },
    taskersList: {
      paddingHorizontal: currentTheme.spacing.l,
    },
    taskerCardContainer: {
      width: 280,
      marginRight: currentTheme.spacing.m,
    },
    upcomingTaskCard: {
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.m,
      marginHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
    },
    upcomingTaskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.s,
    },
    upcomingTaskTitle: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text,
    },
    upcomingTaskDetails: {
      marginBottom: currentTheme.spacing.m,
    },
    upcomingTaskDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    upcomingTaskDetailText: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
      marginLeft: currentTheme.spacing.xs,
    },
    emptyTasksContainer: {
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginHorizontal: currentTheme.spacing.l,
    },
    emptyTasksImage: {
      width: 120,
      height: 120,
      marginBottom: currentTheme.spacing.l,
    },
    emptyTasksTitle: {
      ...currentTheme.typography.h3,
      color: colors.text,
      marginBottom: currentTheme.spacing.s,
    },
    emptyTasksText: {
      ...currentTheme.typography.body,
      color: colors.subtext,
      textAlign: 'center',
      marginBottom: currentTheme.spacing.l,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    notificationsModalContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: currentTheme.radius.xl,
      borderTopRightRadius: currentTheme.radius.xl,
      height: '70%',
      paddingBottom: currentTheme.spacing.m,
    },
    notificationsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: currentTheme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    notificationsTitle: {
      ...currentTheme.typography.h3,
      color: colors.text,
    },
    notificationItem: {
      flexDirection: 'row',
      padding: currentTheme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    unreadNotification: {
      backgroundColor: colors.highlight,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      marginBottom: 4,
    },
    notificationTime: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
    },
    unreadDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      alignSelf: 'center',
      marginLeft: currentTheme.spacing.s,
    },
    emptyNotifications: {
      padding: currentTheme.spacing.xl,
      alignItems: 'center',
    },
    emptyNotificationsText: {
      ...currentTheme.typography.body,
      color: colors.subtext,
    },
  });