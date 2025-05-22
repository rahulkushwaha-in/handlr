import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, MapPin, X } from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../context/ThemeContext'; // Added
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
  const { colors } = useTheme(); 
  const styles = dynamicStyles(colors, originalTheme); 

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

  const currentNotificationsData = [ // Renamed mock data
    { id: '1', title: 'New message', message: 'Rajesh Kumar sent you a message', time: '10 min ago', read: false, },
    { id: '2', title: 'Task update', message: 'Your cleaning task has been accepted', time: '1 hour ago', read: true, },
    { id: '3', title: 'Payment successful', message: 'Payment for plumbing task was successful', time: '2 days ago', read: true, },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
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

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
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
      width: 8, // Original size
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.error, 
    },
    searchContainer: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
    },
    categoriesSection: {
      marginBottom: currentTheme.spacing.l,
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
    section: {
      marginBottom: currentTheme.spacing.xl,
    },
    taskersList: {
      paddingHorizontal: currentTheme.spacing.l,
    },
    taskerCardContainer: {
      width: 280,
      marginRight: currentTheme.spacing.m,
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
    createTaskButton: {
      backgroundColor: colors.primary, 
      paddingVertical: currentTheme.spacing.m,
      paddingHorizontal: currentTheme.spacing.xl,
      borderRadius: currentTheme.radius.m,
    },
    createTaskButtonText: {
      ...currentTheme.typography.button,
      color: currentTheme.colors.common.white, 
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
    notificationsTitle: { // Title for the modal "Notifications"
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
    notificationTitle: { // Title for individual notification item
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

export default HomeScreen;
