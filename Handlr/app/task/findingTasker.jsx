import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  FlatList,
  Image,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter, router } from 'expo-router';
import { ChevronLeft, Filter, MapPin, Star, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import originalTheme from '@/constants/theme';
import TaskerMap from '@/components/TaskerMap';
import BookingConfirmation from './bookingConfirm';

const { width: screenWidth } = Dimensions.get('window');

const mockTaskers = [
  {
    id: '1',
    name: 'John Smith',
    rating: 4.8,
    reviews: 124,
    hourlyRate: 2000,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    bio: 'Professional gardener with 5+ years of experience',
    specialties: ['Lawn Care', 'Garden Maintenance', 'Planting'],
    coordinates: { latitude: 37.78825, longitude: -122.4324 },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviews: 89,
    hourlyRate: 2500,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    bio: 'Experienced landscaper specializing in garden design',
    specialties: ['Landscaping', 'Garden Design', 'Pruning'],
    coordinates: { latitude: 37.78925, longitude: -122.4344 },
  },
  {
    id: '3',
    name: 'Mike Wilson',
    rating: 4.7,
    reviews: 56,
    hourlyRate: 1800,
    distance: 3.1,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    bio: 'Reliable and efficient garden maintenance specialist',
    specialties: ['Lawn Mowing', 'Hedge Trimming', 'Weeding'],
    coordinates: { latitude: 37.78725, longitude: -122.4314 },
  },

];

const cancellationReasons = [
  { id: '1', reason: 'Changed my mind' },
  { id: '2', reason: 'Found another tasker' },
  { id: '3', reason: 'Task no longer needed' },
  { id: '4', reason: 'Other' },
];

const TaskerProfile = React.memo(({ taskerId, onHire, onBack }) => {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);
  const tasker = mockTaskers.find((t) => t.id === taskerId);

  if (!tasker) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.subheading}>Tasker not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tasker.name}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: originalTheme.spacing.m }}>
          <Image
            source={{ uri: tasker.image }}
            style={styles.taskerAvatar}
            resizeMode="cover"
          />
          <Text style={styles.taskerBio}>{tasker.bio}</Text>
          <View style={styles.taskerRatingContainer}>
            <View style={{ flexDirection: 'row' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(tasker.rating) ? colors.warning : 'transparent'}
                  color={i < Math.floor(tasker.rating) ? colors.warning : colors.border}
                />
              ))}
            </View>
            <Text style={styles.taskerRatingText}>
              {tasker.rating} ({tasker.reviews} reviews)
            </Text>
          </View>
          <Text style={styles.taskerRate}>₹{tasker.hourlyRate}/hr</Text>
          <View style={styles.taskerSpecialties}>
            {tasker.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={onHire}>
            <Text style={styles.primaryButtonText}>Hire Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const TaskerCard = React.memo(({ tasker, onAccept, onDecline, slideAnim, index }) => {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  const handleSwipe = useCallback(({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { translationX } = nativeEvent;
      if (Math.abs(translationX) > 50) {
        onDecline(tasker.id);
      }
    }
  }, [tasker.id, onDecline]);

  const handleAcceptPress = useCallback(() => {
    onAccept(tasker);
  }, [tasker, onAccept]);

  const handleDeclinePress = useCallback(() => {
    onDecline(tasker.id);
  }, [tasker.id, onDecline]);

  return (
    <PanGestureHandler
      onHandlerStateChange={handleSwipe}
      activeOffsetX={[-10, 10]}
    >
      <Animated.View
        style={[
          styles.taskerCard,
          {
            transform: [{ translateX: slideAnim }],
            zIndex: 1000 - index,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleDeclinePress}
        >
          <X size={16} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.cardHeader}>
          <Image
            source={{ uri: tasker.image }}
            style={styles.compactAvatar}
            resizeMode="cover"
          />
          <View style={styles.cardHeaderInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.compactName}>{tasker.name}</Text>
              <TouchableOpacity
                onPress={() => router.push(`tasker/${tasker.id}`)}
                style={styles.viewProfileButton}
              >
                <Text style={styles.viewProfileText}>
                  View Profile
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.compactRatingContainer}>
              <View style={styles.starsContainer}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(tasker.rating) ? colors.warning : 'transparent'}
                    color={i < Math.floor(tasker.rating) ? colors.warning : colors.border}
                  />
                ))}
              </View>
              <Text style={styles.compactRatingText}>
                {tasker.rating} ({tasker.reviews})
              </Text>
            </View>
            <Text style={styles.compactRate}>
              ₹{tasker.hourlyRate}/hr • {tasker.distance}km
            </Text>
          </View>
        </View>

        <View style={styles.compactSpecialties}>
          {tasker.specialties.slice(0, 3).map((specialty, specIndex) => (
            <View key={specIndex} style={styles.compactSpecialtyBadge}>
              <Text style={styles.compactSpecialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={handleAcceptPress}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={handleDeclinePress}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
});

export default function FindingTasker() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);
  const router = useRouter();
  const [currentView, setCurrentView] = useState('list');
  const [selectedTaskerId, setSelectedTaskerId] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [incomingTaskers, setIncomingTaskers] = useState([]);
  const taskerQueueRef = useRef([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnims = useRef({}).current;
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const taskDetails = {
    title: 'Lawn Mowing and Garden Cleanup',
    description: 'Need help with mowing the lawn and cleaning up garden debris',
    date: 'Oct 15, 2023',
    time: '10:00 AM - 12:00 PM',
    location: '123 Main St, Anytown, India',
    budget: '₹4000-₹8000',
  };

  // Initialize tasker queue
  useEffect(() => {
    taskerQueueRef.current = [...mockTaskers];
    console.log('Initialized tasker queue:', taskerQueueRef.current.length, 'taskers');
    
    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: incomingTaskers.length > 0 ? 0.8 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [incomingTaskers.length, fadeAnim]);

  // Simulate incoming tasker requests
  useEffect(() => {
    if (currentView !== 'list') {
      // Clear intervals when not in list view
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const showNextTasker = () => {
      if (taskerQueueRef.current.length > 0) {
        const nextTasker = taskerQueueRef.current.shift(); // Remove from front
        
        // Check for duplicates
        if (!incomingTaskers.some((t) => t.id === nextTasker.id)) {
          // Initialize slide animation
          slideAnims[nextTasker.id] = new Animated.Value(100);
          
          setIncomingTaskers((prev) => {
            const newTaskers = [nextTasker, ...prev];
            console.log('Added tasker:', nextTasker.name, '- Total visible:', newTaskers.length);
            return newTaskers;
          });
          
          // Animate slide-in
          Animated.timing(slideAnims[nextTasker.id], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Set new timers
    timeoutRef.current = setTimeout(showNextTasker, 1000);
    intervalRef.current = setInterval(showNextTasker, 6000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentView, incomingTaskers]);

  const handleSelectTasker = useCallback((tasker) => {
    console.log('Selecting tasker:', tasker.name);
    setSelectedTaskerId(tasker.id);
    setCurrentView('profile');
    setIncomingTaskers([]);
    
    // Clear animations
    Object.keys(slideAnims).forEach(key => {
      delete slideAnims[key];
    });
    // router.push(`tasker/${tasker.id}`)
  }, [slideAnims]);

  const handleHireTasker = useCallback(() => {
    console.log('Hiring tasker:', selectedTaskerId);
    setCurrentView('confirmation');
  }, [selectedTaskerId]);

  const handleConfirmBooking = useCallback(() => {
    console.log('Confirming booking for tasker:', selectedTaskerId);
    router.push('/taskConfirmed');
    setCurrentView('list');
    setSelectedTaskerId(null);
    setIncomingTaskers([]);
  }, [selectedTaskerId, router]);

  const handleBackToList = useCallback(() => {
    console.log('Back to list');
    setCurrentView('list');
    setSelectedTaskerId(null);
    // Reset the queue
    taskerQueueRef.current = [...mockTaskers];
  }, []);

  const handleBackToProfile = useCallback(() => {
    setCurrentView('profile');
  }, []);

  const handleCancelRequest = useCallback(() => {
    setCancelModalVisible(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    if (selectedReason) {
      console.log('Cancelling request for reason:', selectedReason);
      setCancelModalVisible(false);
      setSelectedReason(null);
      router.back();
    }
  }, [selectedReason, router]);

  const handleAcceptTasker = useCallback((tasker) => {
    if (slideAnims[tasker.id]) {
      Animated.timing(slideAnims[tasker.id], {
        toValue: -500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIncomingTaskers(prev => prev.filter(t => t.id !== tasker.id));
        delete slideAnims[tasker.id];
        handleSelectTasker(tasker);
      });
    } else {
      handleSelectTasker(tasker);
    }
  }, [slideAnims, handleSelectTasker]);

  const handleDeclineTasker = useCallback((taskerId) => {
    if (slideAnims[taskerId]) {
      Animated.timing(slideAnims[taskerId], {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIncomingTaskers(prev => prev.filter(tasker => tasker.id !== taskerId));
        delete slideAnims[taskerId];
      });
    } else {
      setIncomingTaskers(prev => prev.filter(tasker => tasker.id !== taskerId));
    }
  }, [slideAnims]);

  const renderCancellationReason = useCallback(({ item }) => (
    <TouchableOpacity
      style={[
        styles.reasonItem,
        selectedReason === item.id && { backgroundColor: colors.primary + '20' },
      ]}
      onPress={() => setSelectedReason(item.id)}
    >
      <Text style={styles.reasonText}>{item.reason}</Text>
    </TouchableOpacity>
  ), [selectedReason, colors.primary, styles]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {currentView === 'list' && (
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Available Taskers</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
              <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
                {/* Task Info */}
                <View style={styles.taskInfoContainer}>
                  <Text style={styles.taskTitle}>{taskDetails.title}</Text>
                  <View style={styles.taskDetailRow}>
                    <MapPin size={14} color={colors.subtext} />
                    <Text style={styles.taskDetailText}>{taskDetails.location}</Text>
                  </View>
                  <View style={styles.taskDetailRow}>
                    <Text style={styles.taskDetailText}>
                      {taskDetails.date} • {taskDetails.time}
                    </Text>
                  </View>
                  <Text style={styles.taskDetailText}>Budget: {taskDetails.budget}</Text>
                </View>

                {/* Map */}
                <View style={styles.mapContainer}>
                  <TaskerMap taskers={mockTaskers} onSelectTasker={handleSelectTasker} />
                </View>

                {/* Cancel Button */}
                <View style={styles.cancelButtonContainer}>
                  <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.error }]}
                    onPress={handleCancelRequest}
                  >
                    <Text style={styles.primaryButtonText}>Cancel Request</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* Incoming Tasker Cards Overlay */}
              {incomingTaskers.length > 0 && (
                <View style={styles.taskerOverlay}>
                  <ScrollView
                    style={styles.taskerScrollView}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                  >
                    {incomingTaskers.map((tasker, index) => (
                      <TaskerCard
                        key={tasker.id}
                        tasker={tasker}
                        onAccept={handleAcceptTasker}
                        onDecline={handleDeclineTasker}
                        slideAnim={slideAnims[tasker.id] || new Animated.Value(0)}
                        index={index}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Cancel Modal */}
            <Modal visible={cancelModalVisible} transparent={true} animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Why are you cancelling?</Text>
                  <FlatList
                    data={cancellationReasons}
                    keyExtractor={(item) => item.id}
                    renderItem={renderCancellationReason}
                  />
                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.border }]}
                      onPress={() => setCancelModalVisible(false)}
                    >
                      <Text style={styles.modalButtonText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        { backgroundColor: selectedReason ? colors.success : colors.error },
                      ]}
                      onPress={handleConfirmCancel}
                      disabled={!selectedReason}
                    >
                      <Text style={styles.modalButtonText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {currentView === 'profile' && selectedTaskerId && (
          <TaskerProfile
            taskerId={selectedTaskerId}
            onHire={handleHireTasker}
            onBack={handleBackToList}
          />
        )}

        {currentView === 'confirmation' && selectedTaskerId && (
          <BookingConfirmation
            tasker={mockTaskers.find((t) => t.id === selectedTaskerId)}
            taskDetails={taskDetails}
            onConfirm={handleConfirmBooking}
            onBack={handleBackToProfile}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const dynamicStyles = (colors, theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.s,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    backgroundColor: colors.border,
    borderRadius: theme.radius.l,
    marginRight: theme.spacing.m,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  filterButton: {
    padding: 8,
    backgroundColor: colors.border,
    borderRadius: theme.radius.l,
  },
  contentContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  taskInfoContainer: {
    padding: theme.spacing.m,
    backgroundColor: colors.card,
    marginHorizontal: theme.spacing.m,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderRadius: theme.radius.m,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.m,
  },
  taskDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  taskDetailText: {
    fontSize: 13,
    color: colors.subtext,
    marginLeft: theme.spacing.xs,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    borderRadius: theme.radius.m,
    overflow: 'hidden',
    minHeight: 200,
  },
  cancelButtonContainer: {
    padding: theme.spacing.s,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  taskerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  taskerScrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.s,
  },
  taskerCard: {
    backgroundColor: colors.card,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border + '30',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.s,
    top: theme.spacing.s,
    padding: 4,
    backgroundColor: colors.background + '90',
    borderRadius: 12,
    zIndex: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.s,
  },
  compactAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: theme.spacing.s,
    borderWidth: 2,
    borderColor: colors.primary + '30',
  },
  cardHeaderInfo: {
    flex: 1,
    paddingRight: theme.spacing.m,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically centers items
    flexWrap: 'wrap', // Allows wrapping if space is too small
  },
  compactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
    marginRight: 8,
  },
  viewProfileButton: {
    backgroundColor: colors.primary + '20', // Adds 20% opacity (hex '33')
    borderRadius: 12, // Adjust for desired roundness
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  viewProfileText: {
    color: colors.primary,
    fontSize: 12,
    // textDecorationLine: 'underline',
  },
  compactRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:2,
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
  },
  compactRatingText: {
    fontSize: 11,
    color: colors.subtext,
  },
  compactRate: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '500',
  },
  compactSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.s,
  },
  compactSpecialtyBadge: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.xs,
    marginRight: theme.spacing.xs,
    marginBottom: 2,
  },
  compactSpecialtyText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.s,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.s,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  declineButton: {
    backgroundColor: colors.error,
  },
  acceptButtonText: {
    fontSize: 13,
    color: colors.card,
    fontWeight: '600',
  },
  declineButtonText: {
    fontSize: 13,
    color: colors.card,
    fontWeight: '600',
  },
  // Profile styles
  taskerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.primary + '40',
  },
  taskerBio: {
    fontSize: 14,
    color: colors.text,
    marginVertical: theme.spacing.s,
    textAlign: 'center',
    lineHeight: 20,
  },
  taskerRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.s,
  },
  taskerRatingText: {
    fontSize: 12,
    color: colors.subtext,
    marginLeft: theme.spacing.xs,
  },
  taskerRate: {
    fontSize: 16,
    color: colors.text,
    marginVertical: theme.spacing.s,
    textAlign: 'center',
    fontWeight: '600',
  },
  taskerSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.m,
  },
  specialtyBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.radius.s,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  specialtyText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.s,
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  primaryButtonText: {
    fontSize: 16,
    color: colors.card,
    fontWeight: '700',
  },
  subheading: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginVertical: theme.spacing.m,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.card,
    marginHorizontal: theme.spacing.m,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  reasonItem: {
    padding: theme.spacing.m,
    borderRadius: theme.radius.s,
    marginBottom: theme.spacing.s,
  },
  reasonText: {
    fontSize: 14,
    color: colors.text,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.m,
    gap: theme.spacing.m,
    // backgroundColor:"red"
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.radius.s,
    alignItems: 'center',

  },
  modalButtonText: {
    fontSize: 16,
    color: colors.card,
    fontWeight: '600',
  },
});