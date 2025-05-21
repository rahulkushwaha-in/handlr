import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Edit2 } from 'lucide-react-native';
import theme from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function PersonalInfoScreen() {
  const { user } = useAuthStore();

  const personalInfo = [
    {
      title: 'Full Name',
      value: user?.name || 'Not provided',
    },
    {
      title: 'Phone Number',
      value: user?.phone || 'Not provided',
    },
    {
      title: 'Email',
      value: user?.email || 'Not provided',
    },
    {
      title: 'Address',
      value: user?.location?.address || 'Not provided',
    },
    {
      title: 'Date of Birth',
      value: 'Not provided',
    },
    {
      title: 'Gender',
      value: 'Not provided',
    },
    {
      title: 'Emergency Contact',
      value: 'Not provided',
    },
    {
      title: 'Language',
      value: 'English',
    },
  ];

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Personal Information',
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
              <Edit2 size={20} color={theme.colors.light.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoContainer}>
            {personalInfo.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.infoItem,
                  index !== personalInfo.length - 1 && styles.infoItemBorder
                ]}
              >
                <Text style={styles.infoTitle}>{item.title}</Text>
                <Text 
                  style={[
                    styles.infoValue,
                    item.value === 'Not provided' && styles.infoValueEmpty
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Account Information</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Account Type</Text>
              <Text style={styles.infoValue}>
                {user?.role === 'tasker' ? 'Tasker' : 'User'}
              </Text>
            </View>
            <View style={[styles.infoItem, styles.infoItemBorder]}>
              <Text style={styles.infoTitle}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Not available'
                }
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoTitle}>Account Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>

          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              Your personal information is secure and will only be used to improve your experience with TaskRiser. 
              We do not share your information with third parties without your consent.
            </Text>
          </View>
        </ScrollView>
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
  infoContainer: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.l,
    overflow: 'hidden',
  },
  infoItem: {
    padding: theme.spacing.l,
  },
  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
  },
  infoTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  infoValueEmpty: {
    color: theme.colors.light.subtext,
    fontStyle: 'italic',
  },
  sectionTitle: {
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.s,
    marginTop: theme.spacing.l,
  },
  sectionTitleText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.light.success,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.m,
    marginTop: theme.spacing.xs,
  },
  statusText: {
    color: theme.colors.common.white,
    ...theme.typography.caption,
    fontWeight: '600',
  },
  noteContainer: {
    padding: theme.spacing.l,
    marginBottom: theme.spacing.xxl,
  },
  noteText: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    lineHeight: 18,
  },
});