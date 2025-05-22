import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import originalTheme from '@/constants/theme'; // Renamed to avoid conflict with theme from useTheme
import Button from '@/components/Button';
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Heart,
  Star,
  FileText,
  Moon,
  Globe,
  X
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

type AppColorsType = ReturnType<typeof useTheme>['colors'];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { colors, isDark, setThemePreference, theme: currentActiveTheme } = useTheme(); 
  
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout(), style: "destructive" }
      ]
    );
  };

  const styles = dynamicStyles(colors, originalTheme);

  const personalMenuItems = [
    { icon: <User size={20} color={colors.text} />, title: 'Personal Information', onPress: () => router.push('/profile/personal-info') },
    { icon: <CreditCard size={20} color={colors.text} />, title: 'Payment Methods', onPress: () => router.push('/profile/payment-methods') },
    { icon: <Heart size={20} color={colors.text} />, title: 'Saved Taskers', onPress: () => router.push('/profile/saved-taskers'), badge: '3' },
    { icon: <Star size={20} color={colors.text} />, title: 'Reviews & Ratings', onPress: () => router.push('/profile/reviews') },
    { icon: <FileText size={20} color={colors.text} />, title: 'Transaction History', onPress: () => router.push('/profile/transactions') },
  ];

  const preferencesMenuItems = [
    { icon: <Bell size={20} color={colors.text} />, title: 'Notifications', onPress: () => {}, toggle: true, value: notifications, onToggle: () => setNotifications(!notifications) },
    { icon: <Moon size={20} color={colors.text} />, title: 'Dark Mode', onPress: () => setShowThemeModal(true), toggle: true, value: isDark, onToggle: () => setThemePreference(isDark ? 'light' : 'dark') },
    { icon: <Globe size={20} color={colors.text} />, title: 'Language', onPress: () => {}, rightText: 'English' },
  ];

  const supportMenuItems = [
    { icon: <HelpCircle size={20} color={colors.text} />, title: 'Help & Support', onPress: () => {} },
    { icon: <Shield size={20} color={colors.text} />, title: 'Privacy & Security', onPress: () => {} },
    { icon: <Settings size={20} color={colors.text} />, title: 'Settings', onPress: () => {} },
    { icon: <Share2 size={20} color={colors.text} />, title: 'Invite Friends', onPress: () => {} },
  ];

  const renderMenuItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[ styles.menuItem, !isLast && styles.menuItemBorder ]} // Corrected !isLask to !isLast
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        {item.icon}
        <Text style={styles.menuItemTitle}>{item.title}</Text>
        {item.badge && (
          <View style={styles.menuItemBadge}>
            <Text style={styles.menuItemBadgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      
      {item.toggle ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: colors.inactive, true: colors.primary }}
          thumbColor={originalTheme.colors.common.white} 
        />
      ) : item.rightText ? (
        <View style={styles.menuItemRight}>
          <Text style={styles.menuItemRightText}>{item.rightText}</Text>
          <ChevronRight size={20} color={colors.subtext} />
        </View>
      ) : (
        <ChevronRight size={20} color={colors.subtext} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Demo User'}</Text>
            <Text style={styles.profilePhone}>{user?.phone || '+919876543200'}</Text>
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>12</Text>
                <Text style={styles.profileStatLabel}>Tasks</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>4.8</Text>
                <Text style={styles.profileStatLabel}>Rating</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStat}>
                <Text style={styles.profileStatValue}>3</Text>
                <Text style={styles.profileStatLabel}>Saved</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Personal</Text>
        </View>
        <View style={styles.menuSection}>
          {personalMenuItems.map((item, index) => 
            renderMenuItem(item, index, index === personalMenuItems.length - 1)
          )}
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Preferences</Text>
        </View>
        <View style={styles.menuSection}>
          {preferencesMenuItems.map((item, index) => 
            renderMenuItem(item, index, index === preferencesMenuItems.length - 1)
          )}
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Support</Text>
        </View>
        <View style={styles.menuSection}>
          {supportMenuItems.map((item, index) => 
            renderMenuItem(item, index, index === supportMenuItems.length - 1)
          )}
        </View>

        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            leftIcon={<LogOut size={18} color={colors.primary} />}
          />
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showThemeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.themeModal}>
            <View style={styles.themeModalHeader}>
              <Text style={styles.themeModalTitle}>Choose Theme</Text>
              <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.themeOption, currentActiveTheme === 'light' && styles.themeOptionSelected]}
              onPress={() => { setThemePreference('light'); setShowThemeModal(false); }}
            >
              <View style={styles.themePreview}>
                <View style={styles.themePreviewLight} />
              </View>
              <Text style={styles.themeOptionText}>Light</Text>
              {currentActiveTheme === 'light' && <View style={styles.themeOptionCheck} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.themeOption, currentActiveTheme === 'dark' && styles.themeOptionSelected]}
              onPress={() => { setThemePreference('dark'); setShowThemeModal(false); }}
            >
              <View style={styles.themePreview}>
                <View style={styles.themePreviewDark} />
              </View>
              <Text style={styles.themeOptionText}>Dark</Text>
              {currentActiveTheme === 'dark' && <View style={styles.themeOptionCheck} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.themeOption}
              onPress={() => { setThemePreference('system'); setShowThemeModal(false); }}
            >
              <View style={styles.themePreview}>
                <View style={styles.themePreviewSystem}>
                  <View style={styles.themePreviewSystemLight} />
                  <View style={styles.themePreviewSystemDark} />
                </View>
              </View>
              <Text style={styles.themeOptionText}>System</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const dynamicStyles = (colors: AppColorsType, currentTheme: typeof originalTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: currentTheme.spacing.l,
    paddingTop: currentTheme.spacing.l,
    paddingBottom: currentTheme.spacing.m,
  },
  title: {
    ...currentTheme.typography.h2,
    color: colors.text,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: currentTheme.spacing.l,
    backgroundColor: colors.card,
    marginHorizontal: currentTheme.spacing.l,
    borderRadius: currentTheme.radius.l,
    marginBottom: currentTheme.spacing.l,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: currentTheme.spacing.m,
  },
  profileName: {
    ...currentTheme.typography.h3,
    color: colors.text,
    marginBottom: 4,
  },
  profilePhone: {
    ...currentTheme.typography.bodySmall,
    color: colors.subtext,
    marginBottom: currentTheme.spacing.s,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    ...currentTheme.typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  profileStatLabel: {
    ...currentTheme.typography.caption,
    color: colors.subtext,
  },
  profileStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
    marginHorizontal: currentTheme.spacing.m,
  },
  editButton: {
    paddingHorizontal: currentTheme.spacing.m,
    paddingVertical: currentTheme.spacing.s,
    backgroundColor: colors.highlight,
    borderRadius: currentTheme.radius.m,
  },
  editButtonText: {
    ...currentTheme.typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
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
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: currentTheme.radius.l,
    marginHorizontal: currentTheme.spacing.l,
    marginBottom: currentTheme.spacing.l,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: currentTheme.spacing.l,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    ...currentTheme.typography.body,
    color: colors.text,
    marginLeft: currentTheme.spacing.m,
  },
  menuItemBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: currentTheme.spacing.s,
  },
  menuItemBadgeText: {
    color: originalTheme.colors.common.white,
    fontSize: 10,
    fontWeight: '600',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRightText: {
    ...currentTheme.typography.bodySmall,
    color: colors.subtext,
    marginRight: currentTheme.spacing.s,
  },
  logoutSection: {
    marginHorizontal: currentTheme.spacing.l,
    marginBottom: currentTheme.spacing.l,
  },
  versionSection: {
    alignItems: 'center',
    marginBottom: currentTheme.spacing.xl,
    paddingBottom: currentTheme.spacing.xl,
  },
  versionText: {
    ...currentTheme.typography.caption,
    color: colors.subtext,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeModal: {
    backgroundColor: colors.background,
    borderRadius: currentTheme.radius.l,
    width: '80%',
    padding: currentTheme.spacing.l,
  },
  themeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: currentTheme.spacing.l,
  },
  themeModalTitle: {
    ...currentTheme.typography.h3,
    color: colors.text,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: currentTheme.spacing.m,
    borderRadius: currentTheme.radius.m,
    marginBottom: currentTheme.spacing.s,
  },
  themeOptionSelected: {
    backgroundColor: colors.highlight,
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: currentTheme.spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  themePreviewLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  themePreviewDark: {
    flex: 1,
    backgroundColor: '#1A1D1F',
  },
  themePreviewSystem: {
    flex: 1,
    flexDirection: 'row',
  },
  themePreviewSystemLight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  themePreviewSystemDark: {
    flex: 1,
    backgroundColor: '#1A1D1F',
  },
  themeOptionText: {
    ...currentTheme.typography.body,
    color: colors.text,
    flex: 1,
  },
  themeOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
});
