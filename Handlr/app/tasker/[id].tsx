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
  Languages
} from 'lucide-react-native';
import theme from '@/constants/theme';
import Button from '@/components/Button';
import { taskers } from '@/mocks/taskers';
import { categories } from '@/mocks/categories';
import { Tasker } from '@/types';

export default function TaskerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [tasker, setTasker] = useState<Tasker | null>(null);
  
  useEffect(() => {
    // Find tasker by ID
    const foundTasker = taskers.find(t => t.id === id);
    if (foundTasker) {
      setTasker(foundTasker as Tasker);
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
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
              <Star size={16} color={theme.colors.light.warning} fill={theme.colors.light.warning} />
              <Text style={styles.rating}>
                {tasker.rating.toFixed(1)} ({tasker.totalReviews} reviews)
              </Text>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={14} color={theme.colors.light.subtext} />
              <Text style={styles.location}>{tasker.location?.address}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{tasker.bio}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesContainer}>
              {taskerCategories.map(category => (
                <View 
                  key={category.id} 
                  style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}
                >
                  <Text style={[styles.categoryText, { color: category.color }]}>
                    {category.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {tasker.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Briefcase size={18} color={theme.colors.light.primary} />
              <Text style={styles.sectionTitle}>Experience & Rate</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Shield size={16} color={theme.colors.light.primary} />
                <Text style={styles.infoText}>{tasker.experience} years experience</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.rateText}>₹{tasker.hourlyRate}/hr</Text>
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
          
          {/* Extra space to avoid footer overlap */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Button
          title="Chat"
          onPress={handleChat}
          variant="outline"
          leftIcon={<MessageSquare size={18} color={theme.colors.light.primary} />}
          style={styles.chatButton}
        />
        <Button
          title="Hire Now"
          onPress={handleHire}
          style={styles.hireButton}
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
    borderColor: theme.colors.light.background,
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
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h3,
    marginLeft: theme.spacing.xs,
  },
  bio: {
    ...theme.typography.body,
    color: theme.colors.light.text,
    lineHeight: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  categoryText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: theme.colors.light.card,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  skillText: {
    ...theme.typography.bodySmall,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.m,
  },
  dayBadge: {
    backgroundColor: theme.colors.light.primary + '20',
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
    color: theme.colors.light.primary,
    fontWeight: '600',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageBadge: {
    backgroundColor: theme.colors.light.card,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  languageText: {
    ...theme.typography.bodySmall,
  },
  educationItem: {
    backgroundColor: theme.colors.light.card,
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
  },
  educationSchool: {
    ...theme.typography.bodySmall,
    marginBottom: 2,
  },
  educationYear: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  certificationItem: {
    backgroundColor: theme.colors.light.card,
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
  },
  certificationIssuer: {
    ...theme.typography.bodySmall,
    marginBottom: 2,
  },
  certificationYear: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
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
  },
  rateText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.light.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.light.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.border,
    flexDirection: 'row',
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.m : theme.spacing.l,
  },
  chatButton: {
    flex: 1,
    marginRight: theme.spacing.m,
  },
  hireButton: {
    flex: 2,
  },
});