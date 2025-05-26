import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  Shield,
  MessageSquare,
  ChevronLeft,
  Share2,
  Award,
  Briefcase,
  GraduationCap,
  Languages,
  ThumbsUp,
  MessageCircle
} from 'lucide-react-native';
import theme from '@/constants/theme';
import Button from '@/components/Button';
import { taskers } from '@/mocks/taskers';
import { categories } from '@/mocks/categories';
import { Tasker } from '@/types';
import originalTheme from '@/constants/theme';
import { useTheme } from '../../context/ThemeContext';


export default function TaskerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [tasker, setTasker] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  useEffect(() => {
    // Find tasker by ID
    const foundTasker = taskers.find(t => t.id === id);
    if (foundTasker) {
      setTasker({
        ...foundTasker,
        // Adding mock data for new fields
        reviews: [
          {
            id: "1",
            userName: "Sarah M.",
            rating: 5,
            date: "2 weeks ago",
            comment: "Amazing work! Very professional and efficient.",
            userAvatar: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
          },
          {
            id: "2",
            userName: "Michael T.",
            rating: 4,
            date: "1 month ago",
            comment: "Great job on the task. Would hire again.",
            userAvatar: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
          },
          {
            id: "3",
            userName: "Jessica L.",
            rating: 5,
            date: "2 months ago",
            comment: "Excellent service and attention to detail.",
            userAvatar: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
          },
        ],
        portfolioImages: [
          {
            id: "1",
            url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&q=80",
            description: "Recent project",
          },
          {
            id: "2",
            url: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&q=80",
            description: "Installation work",
          },
          {
            id: "3",
            url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80",
            description: "Repair service",
          },
        ],
        completedJobs: 187,
        responseTime: "< 1 hour",
        memberSince: "Jan 2020",
      });
    }
  }, [id]);

  if (!tasker) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const taskerCategories = categories.filter(category =>
    tasker.categories.includes(category.id)
  );

  const handleChat = () => {
    router.push(`/chat/${tasker.id}`);
  };

  const handleHire = () => {
    router.push({
      pathname: '/task/create',
      params: { taskerId: tasker.id }
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? theme.colors.light.warning : "transparent"}
          color={i <= rating ? theme.colors.light.warning : theme.colors.light.border}
        />
      );
    }
    return stars;
  };

  const displayedReviews = showAllReviews ? tasker.reviews : tasker.reviews?.slice(0, 2);

  // Mock education data
  const education = [
    {
      degree: 'Bachelor of Engineering',
      school: 'Bangalore Institute of Technology',
      years: '2015 - 2019',
    },
    {
      degree: 'Diploma in Professional Cleaning',
      school: 'National Institute of Cleaning Science',
      years: '2020',
    }
  ];

  // Mock languages data
  const languages = ['English', 'Hindi', 'Kannada'];

  // Mock certifications data
  const certifications = [
    {
      name: 'Certified Professional Cleaner',
      issuer: 'Cleaning Association of India',
      year: '2021',
    },
    {
      name: 'Workplace Safety Certification',
      issuer: 'National Safety Council',
      year: '2022',
    }
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.common.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={24} color={theme.colors.common.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: tasker.avatar }}
            style={styles.coverImage}
          />
          <View style={styles.overlay} />
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: tasker.avatar }}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{tasker.name}</Text>
              {tasker.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.ratingContainer}>
              {renderStars(tasker.rating)}
              <Text style={styles.rating}>
                {tasker.rating.toFixed(1)} ({tasker.totalReviews} reviews)
              </Text>
            </View>

            <View style={styles.locationContainer}>
              <MapPin size={14} color={theme.colors.light.subtext} />
              <Text style={styles.location}>{tasker.location?.address}</Text>
            </View>

            <View style={styles.rateContainer}>
              <Text style={styles.rateText}>₹{tasker.hourlyRate}/hr</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{tasker.bio}</Text>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.skillsContainer}>
              {tasker.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            {/* <Text style={styles.sectionTitle}>Stats</Text> */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThumbsUp size={20} color={colors.subtext} />
                <Text style={styles.statValue}>{tasker.completedJobs}</Text>
                <Text style={styles.statLabel}>Jobs Done</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color={theme.colors.light.subtext} />
                <Text style={styles.statValue}>{tasker.responseTime}</Text>
                <Text style={styles.statLabel}>Response Time</Text>
              </View>
              <View style={styles.statItem}>
                <Calendar size={20} color={theme.colors.light.subtext} />
                <Text style={styles.statValue}>{tasker.memberSince}</Text>
                <Text style={styles.statLabel}>Member Since</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Clock size={18} color={theme.colors.light.primary} />
              <Text style={styles.sectionTitle}>Availability</Text>
            </View>
            <View style={styles.daysContainer}>
              {tasker.availability.days.map((day, index) => (
                <View key={index} style={styles.dayBadge}>
                  <Text style={styles.dayText}>{day.substring(0, 3)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Clock size={16} color={theme.colors.light.primary} />
                <Text style={styles.infoText}>
                  {tasker.availability.hours.start} - {tasker.availability.hours.end}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.portfolioContainer}
            >
              {tasker.portfolioImages?.map((image) => (
                <View key={image.id} style={styles.portfolioItem}>
                  <Image
                    source={{ uri: image.url }}
                    style={styles.portfolioImage}
                  />
                  <Text style={styles.portfolioDescription}>{image.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.reviewsContainer}>
              {displayedReviews?.map((review) => (
                <View
                  key={review.id}
                  style={styles.reviewItem}
                >
                  <View style={styles.reviewHeader}>
                    <Image
                      source={{ uri: review.userAvatar }}
                      style={styles.reviewAvatar}
                    />
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewUserName}>{review.userName}</Text>
                      <View style={styles.reviewMeta}>
                        <View style={styles.reviewStars}>
                          {renderStars(review.rating)}
                        </View>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
              {tasker.reviews && tasker.reviews.length > 2 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  onPress={() => setShowAllReviews(!showAllReviews)}
                >
                  <Text style={styles.showMoreText}>
                    {showAllReviews ? "Show less" : `Show all ${tasker.reviews.length} reviews`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Languages size={18} color={theme.colors.light.primary} />
              <Text style={styles.sectionTitle}>Languages</Text>
            </View>
            <View style={styles.languagesContainer}>
              {languages.map((language, index) => (
                <View key={index} style={styles.languageBadge}>
                  <Text style={styles.languageText}>{language}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <GraduationCap size={18} color={theme.colors.light.primary} />
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            {education.map((edu, index) => (
              <View key={index} style={[styles.educationItem, index < education.length - 1 && styles.educationItemBorder]}>
                <Text style={styles.educationDegree}>{edu.degree}</Text>
                <Text style={styles.educationSchool}>{edu.school}</Text>
                <Text style={styles.educationYear}>{edu.years}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Award size={18} color={theme.colors.light.primary} />
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            {certifications.map((cert, index) => (
              <View key={index} style={[styles.certificationItem, index < certifications.length - 1 && styles.certificationItemBorder]}>
                <Text style={styles.certificationName}>{cert.name}</Text>
                <Text style={styles.certificationIssuer}>{cert.issuer}</Text>
                <Text style={styles.certificationYear}>{cert.year}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <TouchableOpacity style={styles.chatButton}>
          <MessageCircle size={20} color={theme.colors.light.subtext} />
          <Text style={styles.chatButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.hireButton}
          disabled={true}
          onPress={handleHire}
        >
          <Text style={styles.hireButtonText}>Hire Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const dynamicStyles = (colors, theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    color: colors.text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    height: 220,
    marginTop: Platform.OS === 'ios' ? -50 : 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.s,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: theme.spacing.l,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.background,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.l,
  },
  profileHeader: {
    marginBottom: theme.spacing.l,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    ...theme.typography.h2,
    marginRight: theme.spacing.s,
    color: colors.text
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.radius.s,
  },
  verifiedText: {
    color: colors.white,
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
    color: colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  location: {
    ...theme.typography.bodySmall,
    color: colors.subtext,
    marginLeft: theme.spacing.xs,
  },
  rateContainer: {
    marginTop: theme.spacing.xs,
  },
  rateText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: theme.spacing.xl,
    color: colors.text
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h3,
    // marginLeft: theme.spacing.s,
    color: colors.text
  },
  skillsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  skillText: {
    ...theme.typography.bodySmall,
    color: colors.text
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.m,
  },
  dayBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    minWidth: 50,
    alignItems: 'center',
  },
  dayText: {
    ...theme.typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  bio: {
    ...theme.typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    ...theme.typography.body,
    marginLeft: theme.spacing.s,
    color: colors.text
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.l,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  categoryText: {
    ...theme.typography.bodySmall,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: theme.radius.m,
    padding: theme.spacing.m,
    color: colors.text
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.body,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
    color: colors.text
  },
  statLabel: {
    ...theme.typography.caption,
    color: colors.text,
  },
  portfolioContainer: {
    marginTop: theme.spacing.s,
  },
  portfolioItem: {
    marginRight: theme.spacing.m,
  },
  portfolioImage: {
    width: 128,
    height: 128,
    borderRadius: theme.radius.m,
    backgroundColor: colors.card,
  },
  portfolioDescription: {
    ...theme.typography.caption,
    color: colors.subtext,
    marginTop: theme.spacing.xs,
  },
  reviewsContainer: {
    marginTop: theme.spacing.s,
  },
  reviewItem: {
    marginBottom: theme.spacing.m,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  reviewInfo: {
    marginLeft: theme.spacing.m,
  },
  reviewUserName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.text
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewStars: {
    flexDirection: 'row',
    marginRight: theme.spacing.s,
  },
  reviewDate: {
    ...theme.typography.caption,
    color: colors.subtext,
  },
  reviewComment: {
    ...theme.typography.body,
    color: colors.text,
    marginTop: theme.spacing.s,
  },
  showMoreButton: {
    marginTop: theme.spacing.s,
  },
  showMoreText: {
    ...theme.typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  languageText: {
    ...theme.typography.bodySmall,
    color: colors.text
  },
  educationItem: {
    backgroundColor: colors.card,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  educationItemBorder: {
    marginBottom: theme.spacing.m,
  },
  educationDegree: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text
  },
  educationSchool: {
    ...theme.typography.bodySmall,
    marginBottom: 2,
    color: colors.subtext
  },
  educationYear: {
    ...theme.typography.caption,
    color: colors.subtext,
    color: colors.subtext
  },
  certificationItem: {
    backgroundColor: colors.card,
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  certificationItemBorder: {
    marginBottom: theme.spacing.m,
  },
  certificationName: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text
  },
  certificationIssuer: {
    ...theme.typography.bodySmall,
    marginBottom: 2,
    color: colors.subtext
  },
  certificationYear: {
    ...theme.typography.caption,
    color: colors.subtext,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.m : theme.spacing.l,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: theme.radius.l,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
    marginRight: theme.spacing.m,
  },
  chatButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    marginLeft: theme.spacing.s,
    color: colors.subtext,
  },
  hireButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inactive,
    borderRadius: theme.radius.l,
    paddingVertical: theme.spacing.m,
  },
  hireButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.text,
  
  },
});