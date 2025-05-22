import React, { useState, useEffect } from 'react'; // Added useEffect
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, // ScrollView is imported but FlatList is used for main content
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { router, Stack, useNavigation } from 'expo-router'; // Added useNavigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../../context/ThemeContext'; // Added

// Define review types (assuming these are correct)
interface ReviewGiven {
  id: string;
  taskId: string;
  taskTitle: string;
  taskerId: string;
  taskerName: string;
  taskerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  userReview: boolean;
}

interface ReviewReceived {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  userReview: boolean;
}

// Mock reviews data (data remains the same)
const mockReviews: ReviewGiven[] = [
  { id: '1', taskId: '101', taskTitle: 'Deep cleaning of 2BHK apartment', taskerId: '1', taskerName: 'Rajesh Kumar', taskerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', rating: 4.5, comment: "Rajesh did an excellent job cleaning my apartment. He was thorough and paid attention to details. Would definitely hire again!", date: '2023-06-10', userReview: true, },
  { id: '2', taskId: '102', taskTitle: 'Fix leaking bathroom tap', taskerId: '2', taskerName: 'Priya Singh', taskerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', rating: 5, comment: "Priya was prompt and fixed the leaking tap quickly. Very professional and knowledgeable.", date: '2023-06-05', userReview: true, },
  { id: '3', taskId: '103', taskTitle: 'Install new ceiling fan', taskerId: '3', taskerName: 'Amit Patel', taskerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', rating: 3.5, comment: "Amit installed the fan correctly, but was a bit late. Otherwise, the work was satisfactory.", date: '2023-05-28', userReview: true, },
];
const mockReviewsReceived: ReviewReceived[] = [
  { id: '4', taskId: '104', taskTitle: 'Garden maintenance', userId: '101', userName: 'Ananya Sharma', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', rating: 4, comment: "Good service, but could improve on timeliness.", date: '2023-06-15', userReview: false, },
  { id: '5', taskId: '105', taskTitle: 'House painting', userId: '102', userName: 'Vikram Reddy', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', rating: 5, comment: "Excellent work! Very professional and completed the job ahead of schedule.", date: '2023-06-02', userReview: false, },
];

export default function ReviewsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = dynamicStyles(colors, originalTheme);

  const [activeTab, setActiveTab] = useState('given');
  // Using mock data for now
  const currentReviews = activeTab === 'given' ? mockReviews : mockReviewsReceived;

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text },
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.headerButton} // Layout only
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.25; // Adjusted for half star visibility
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} color={colors.warning} fill={colors.warning} />);
      } else if (i === fullStars && halfStar) {
        // Using full star for half for now, can be replaced with a half-star icon if available
        stars.push(<Star key={i} size={16} color={colors.warning} fill={colors.warning} />); 
      } else {
        stars.push(<Star key={i} size={16} color={colors.inactive} />);
      }
    }
    return stars;
  };

  const calculateAverageRating = (reviewsList: ReviewGiven[] | ReviewReceived[]) => {
    if (reviewsList.length === 0) return "0.0"; // Return string for consistency
    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  };

  type ReviewItem = ReviewGiven | ReviewReceived;

  const renderReviewItem = ({ item }: { item: ReviewItem }) => {
    const isReviewGiven = 'taskerName' in item;
    
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Image
            source={{ uri: isReviewGiven ? (item as ReviewGiven).taskerAvatar : (item as ReviewReceived).userAvatar }}
            style={styles.avatar}
          />
          <View style={styles.reviewHeaderInfo}>
            <Text style={styles.reviewerName}>
              {isReviewGiven ? (item as ReviewGiven).taskerName : (item as ReviewReceived).userName}
            </Text>
            <Text style={styles.taskTitle}>{item.taskTitle}</Text>
            <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        
        <Text style={styles.reviewComment}>{item.comment}</Text>
        
        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.reviewActionButton}>
            <ThumbsUp size={16} color={colors.subtext} />
            <Text style={styles.reviewActionText}>Helpful</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewActionButton}>
            <ThumbsDown size={16} color={colors.subtext} />
            <Text style={styles.reviewActionText}>Not Helpful</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const averageRatingValue = parseFloat(calculateAverageRating(currentReviews));

  return (
    <>
      {/* Stack.Screen options are now set dynamically via useEffect */}
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{calculateAverageRating(currentReviews)}</Text>
            <View style={styles.statStars}>
              {renderStars(averageRatingValue)}
            </View>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentReviews.length}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'given' && styles.activeTabButton]}
            onPress={() => setActiveTab('given')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'given' && styles.activeTabButtonText]}>
              Reviews Given
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'received' && styles.activeTabButton]}
            onPress={() => setActiveTab('received')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'received' && styles.activeTabButtonText]}>
              Reviews Received
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={currentReviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItem}
          contentContainerStyle={styles.reviewsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Star size={60} color={colors.subtext} />
              <Text style={styles.emptyTitle}>No Reviews Yet</Text>
              <Text style={styles.emptyText}>
                {activeTab === 'given'
                  ? "You haven't reviewed any taskers yet."
                  : "You haven't received any reviews yet."
                }
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerButton: { // Layout only
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginHorizontal: currentTheme.spacing.l,
      marginTop: currentTheme.spacing.l,
      padding: currentTheme.spacing.l,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      ...currentTheme.typography.h2,
      color: colors.text, // Added
      marginBottom: currentTheme.spacing.xs,
    },
    statStars: {
      flexDirection: 'row',
      marginBottom: currentTheme.spacing.xs,
    },
    statLabel: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
    },
    statDivider: {
      width: 1,
      height: '80%',
      backgroundColor: colors.border,
      alignSelf: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      marginHorizontal: currentTheme.spacing.l,
      marginTop: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.xs,
    },
    tabButton: {
      flex: 1,
      paddingVertical: currentTheme.spacing.s,
      alignItems: 'center',
      borderRadius: currentTheme.radius.m,
    },
    activeTabButton: {
      backgroundColor: colors.primary,
    },
    tabButtonText: {
      ...currentTheme.typography.bodySmall,
      fontWeight: '600',
      color: colors.text,
    },
    activeTabButtonText: {
      color: currentTheme.colors.common.white,
    },
    reviewsList: {
      paddingHorizontal: currentTheme.spacing.l, // Changed from padding
      paddingBottom: currentTheme.spacing.xxl,
    },
    reviewCard: {
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.m,
      shadowColor: currentTheme.colors.common.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    reviewHeader: {
      flexDirection: 'row',
      marginBottom: currentTheme.spacing.m,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: currentTheme.spacing.m,
    },
    reviewHeaderInfo: {
      flex: 1,
    },
    reviewerName: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text, // Added
      marginBottom: 2,
    },
    taskTitle: {
      ...currentTheme.typography.bodySmall,
      color: colors.text, // Added
      marginBottom: 2,
    },
    reviewDate: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.m,
    },
    ratingText: {
      ...currentTheme.typography.bodySmall,
      fontWeight: '600',
      color: colors.text, // Added
      marginLeft: currentTheme.spacing.s,
    },
    reviewComment: {
      ...currentTheme.typography.body,
      lineHeight: 22,
      color: colors.text, // Added
      marginBottom: currentTheme.spacing.m,
    },
    reviewActions: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: currentTheme.spacing.m,
    },
    reviewActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: currentTheme.spacing.l,
    },
    reviewActionText: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
      marginLeft: currentTheme.spacing.xs,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
    },
    emptyTitle: {
      ...currentTheme.typography.h3,
      color: colors.text, // Added
      marginTop: currentTheme.spacing.m,
      marginBottom: currentTheme.spacing.s,
    },
    emptyText: {
      ...currentTheme.typography.body,
      color: colors.subtext,
      textAlign: 'center',
    },
  });

export default ReviewsScreen;
