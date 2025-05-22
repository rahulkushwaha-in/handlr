import React, { useEffect } from 'react'; // Added useEffect
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { router, Stack, useNavigation } from 'expo-router'; // Added useNavigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Edit2 } from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../../context/ThemeContext'; // Added
import { useAuthStore } from '@/store/authStore';

export default function PersonalInfoScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = dynamicStyles(colors, originalTheme);

  const { user } = useAuthStore();

  const personalInfo = [
    { title: 'Full Name', value: user?.name || 'Not provided', },
    { title: 'Phone Number', value: user?.phone || 'Not provided', },
    { title: 'Email', value: user?.email || 'Not provided', },
    { title: 'Address', value: user?.location?.address || 'Not provided', },
    { title: 'Date of Birth', value: 'Not provided', },
    { title: 'Gender', value: 'Not provided', },
    { title: 'Emergency Contact', value: 'Not provided', },
    { title: 'Language', value: 'English', },
  ];

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
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton} // Layout only
          onPress={handleEdit}
        >
          <Edit2 size={20} color={colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  return (
    <>
      {/* Stack.Screen options are now set dynamically via useEffect */}
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoContainer}>
            {personalInfo.map((item, index) => (
              <View 
                key={index} 
                style={[
                  styles.infoItem,
                  // Apply borderBottom only if not the last item
                  index !== personalInfo.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }
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
            <View style={[styles.infoItem, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <Text style={styles.infoTitle}>Account Type</Text>
              <Text style={styles.infoValue}>
                {user?.role === 'tasker' ? 'Tasker' : 'User'}
              </Text>
            </View>
            <View style={[styles.infoItem, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
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
    infoContainer: {
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginHorizontal: currentTheme.spacing.l,
      marginTop: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
      overflow: 'hidden', // To respect borderRadius with borders
    },
    infoItem: {
      padding: currentTheme.spacing.l,
      // borderBottomColor and borderBottomWidth are applied conditionally
    },
    // infoItemBorder style is removed, merged into infoItem conditionally
    infoTitle: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      marginBottom: currentTheme.spacing.xs,
    },
    infoValue: {
      ...currentTheme.typography.body,
      fontWeight: '500',
      color: colors.text, // Added
    },
    infoValueEmpty: {
      color: colors.subtext,
      fontStyle: 'italic',
    },
    sectionTitle: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.s,
      marginTop: currentTheme.spacing.l,
    },
    sectionTitleText: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    statusBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.success,
      paddingHorizontal: currentTheme.spacing.m,
      paddingVertical: currentTheme.spacing.xs,
      borderRadius: currentTheme.radius.m,
      marginTop: currentTheme.spacing.xs,
    },
    statusText: {
      color: currentTheme.colors.common.white, // Updated to common.white
      ...currentTheme.typography.caption,
      fontWeight: '600',
    },
    noteContainer: {
      padding: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.xxl,
    },
    noteText: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
      lineHeight: 18,
    },
  });

export default PersonalInfoScreen;
