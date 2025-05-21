import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, ThumbsUp, ThumbsDown } from 'lucide-react-native';
import theme from '@/constants/theme';

// Define review types
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

// Mock reviews data
const mockReviews: ReviewGiven[] = [
  {
    id: '1',
    taskId: '101',
    taskTitle: 'Deep cleaning of 2BHK apartment',
    taskerId: '1',
    taskerName: 'Rajesh Kumar',
    taskerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4.5,
    comment: "Rajesh did an excellent job cleaning my apartment. He was thorough and paid attention to details. Would definitely hire again!",
    date: '2023-06-10',
    userReview: true,
  },
  {
    id: '2',
    taskId: '102',
    taskTitle: 'Fix leaking bathroom tap',
    taskerId: '2',
    taskerName: 'Priya Singh',
    taskerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: "Priya was prompt and fixed the leaking tap quickly. Very professional and knowledgeable.",
    date: '2023-06-05',
    userReview: true,
  },
  {
    id: '3',
    taskId: '103',
    taskTitle: 'Install new ceiling fan',
    taskerId: '3',
    taskerName: 'Amit Patel',
    taskerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 3.5,
    comment: "Amit installed the fan correctly, but was a bit late. Otherwise, the work was satisfactory.",
    date: '2023-05-28',
    userReview: true,
  },
];

// Mock reviews received (if user is also a tasker)
const mockReviewsReceived: ReviewReceived[] = [
  {
    id: '4',
    taskId: '104',
    taskTitle: 'Garden maintenance',
    userId: '101',
    userName: 'Ananya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 4,
    comment: "Good service, but could improve on timeliness.",
    date: '2023-06-15',
    userReview: false,
  },
  {
    id: '5',
    taskId: '105',
    taskTitle: 'House painting',
    userId: '102',
    userName: 'Vikram Reddy',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: "Excellent work! Very professional and completed the job ahead of schedule.",
    date: '2023-06-02',
    userReview: false,
  },
];

export default function ReviewsScreen() {
  const [activeTab, setActiveTab] = useState('given');
  const [reviews, setReviews] = useState<ReviewGiven[]>(mockReviews);
  const [reviewsReceived, setReviewsReceived] = useState<ReviewReceived[]>(mockReviewsReceived);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} color={theme.colors.light.warning} fill={theme.colors.light.warning} />
        );
      } else if (i === fullStars && halfStar) {
        stars.push(
          <Star key={i} size={16} color={theme.colors.light.warning} fill={theme.colors.light.warning} />
        );
      } else {
        stars.push(
          <Star key={i} size={16} color={theme.colors.light.inactive} />
        );
      }
    }
    
    return stars;
  };

  const calculateAverageRating = (reviewsList: ReviewGiven[] | ReviewReceived[]) => {
    if (reviewsList.length === 0) return 0;
    
    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  };

  type ReviewItem = ReviewGiven | ReviewReceived;

  const renderReviewItem = ({ item }: { item: ReviewItem }) => {
    // Determine if this is a review given or received
    const isReviewGiven = 'taskerName' in item;
    
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Image
            source={{ uri: isReviewGiven ? item.taskerAvatar : item.userAvatar }}
            style={styles.avatar}
          />
          <View style={styles.reviewHeaderInfo}>
            <Text style={styles.reviewerName}>
              {isReviewGiven ? item.taskerName : item.userName}
            </Text>
            <Text style={styles.taskTitle}>{item.taskTitle}</Text>
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        
        <Text style={styles.reviewComment}>{item.comment}</Text>
        
        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.reviewActionButton}>
            <ThumbsUp size={16} color={theme.colors.light.subtext} />
            <Text style={styles.reviewActionText}>Helpful</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reviewActionButton}>
            <ThumbsDown size={16} color={theme.colors.light.subtext} />
            <Text style={styles.reviewActionText}>Not Helpful</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Reviews & Ratings',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.light.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {activeTab === 'given' 
                ? calculateAverageRating(reviews) 
                : calculateAverageRating(reviewsReceived)}
            </Text>
            <View style={styles.statStars}>
              {renderStars(parseFloat(
                activeTab === 'given' 
                  ? calculateAverageRating(reviews) 
                  : calculateAverageRating(reviewsReceived)
              ))}
            </View>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {activeTab === 'given' ? reviews.length : reviewsReceived.length}
            </Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'given' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('given')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                activeTab === 'given' && styles.activeTabButtonText
              ]}
            >
              Reviews Given
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tabButton,
              activeTab === 'received' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('received')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                activeTab === 'received' && styles.activeTabButtonText
              ]}
            >
              Reviews Received
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTab === 'given' ? reviews : reviewsReceived}
          keyExtractor={(item) => item.id}
          renderItem={renderReviewItem}
          contentContainerStyle={styles.reviewsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Star size={60} color={theme.colors.light.subtext} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
    marginTop: theme.spacing.l,
    padding: theme.spacing.l,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.xs,
  },
  statStars: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.light.border,
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.l,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    padding: theme.spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
    borderRadius: theme.radius.m,
  },
  activeTabButton: {
    backgroundColor: theme.colors.light.primary,
  },
  tabButtonText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.light.text,
  },
  activeTabButtonText: {
    color: theme.colors.common.white,
  },
  reviewsList: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.xxl,
  },
  reviewCard: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    padding: theme.spacing.l,
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.m,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewerName: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskTitle: {
    ...theme.typography.bodySmall,
    marginBottom: 2,
  },
  reviewDate: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  ratingText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginLeft: theme.spacing.s,
  },
  reviewComment: {
    ...theme.typography.body,
    lineHeight: 22,
    marginBottom: theme.spacing.m,
  },
  reviewActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.border,
    paddingTop: theme.spacing.m,
  },
  reviewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.l,
  },
  reviewActionText: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
  },
  emptyTitle: {
    ...theme.typography.h3,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
    textAlign: 'center',
  },
});