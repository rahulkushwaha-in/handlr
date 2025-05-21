
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, MapPin, X } from 'lucide-react-native';
import theme from '@/constants/theme';
import { categories } from '@/mocks/categories';
import { taskers } from '@/mocks/taskers';
import { tasks } from '@/mocks/tasks';
import { Category, Tasker, Task } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import TaskerCard from '@/components/TaskerCard';
import TaskCard from '@/components/TaskCard';
import SearchInput from '@/components/SearchInput';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const user = useAuthStore(state => state.user);
  
  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/explore',
      params: { category: category.id }
    });
  };

  const handleTaskerPress = (tasker: Tasker) => {
    router.push(`/tasker/${tasker.id}`);
  };

  const handleTaskPress = (task: Task) => {
    router.push(`/task/${task.id}`);
  };

  // Mock notifications
  const notifications = [
    {
      id: '1',
      title: 'New message',
      message: 'Rajesh Kumar sent you a message',
      time: '10 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Task update',
      message: 'Your cleaning task has been accepted',
      time: '1 hour ago',
      read: true,
    },
    {
      id: '3',
      title: 'Payment successful',
      message: 'Payment for plumbing task was successful',
      time: '2 days ago',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={theme.colors.light.subtext} />
              <Text style={styles.location}>Bangalore, India</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Bell size={24} color={theme.colors.light.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for services..."
          />
        </View>

        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Taskers</Text>
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={taskers.slice(0, 3)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskerCardContainer}>
                <TaskerCard tasker={item as Tasker} onPress={handleTaskerPress} />
              </View>
            )}
            contentContainerStyle={styles.taskersList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/task/create')}>
              <Text style={styles.seeAllText}>Create New</Text>
            </TouchableOpacity>
          </View>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task as Task} onPress={handleTaskPress} />
            ))
          ) : (
            <View style={styles.emptyTasksContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }}
                style={styles.emptyTasksImage}
              />
              <Text style={styles.emptyTasksTitle}>No tasks yet</Text>
              <Text style={styles.emptyTasksText}>
                Create your first task and find the perfect tasker for your needs
              </Text>
              <TouchableOpacity
                style={styles.createTaskButton}
                onPress={() => router.push('/task/create')}
              >
                <Text style={styles.createTaskButtonText}>Create a Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.notificationsContainer}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <X size={24} color={theme.colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={notifications}
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
  greeting: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.light.card,
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
    backgroundColor: theme.colors.light.error,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  categoriesSection: {
    marginBottom: theme.spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h3,
  },
  seeAllText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  taskersList: {
    paddingHorizontal: theme.spacing.l,
  },
  taskerCardContainer: {
    width: 280,
    marginRight: theme.spacing.m,
  },
  emptyTasksContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
  },
  emptyTasksImage: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.l,
  },
  emptyTasksTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.s,
  },
  emptyTasksText: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  createTaskButton: {
    backgroundColor: theme.colors.light.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.m,
  },
  createTaskButtonText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  notificationsContainer: {
    backgroundColor: theme.colors.light.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    height: '70%',
    paddingBottom: 20,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
  },
  notificationsTitle: {
    ...theme.typography.h3,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
  },
  unreadNotification: {
    backgroundColor: theme.colors.light.highlight,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginBottom: 4,
  },
  notificationTime: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.light.primary,
    alignSelf: 'center',
    marginLeft: theme.spacing.s,
  },
  emptyNotifications: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyNotificationsText: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
  },
});