import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import theme from '@/constants/theme';
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
  Clock,
  Gift,
  Share2,
  Moon,
  Globe,
  X
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout(),
          style: "destructive"
        }
      ]
    );
  };

  const personalMenuItems = [
    {
      icon: <User size={20} color={theme.colors.light.text} />,
      title: 'Personal Information',
      onPress: () => router.push('/profile/personal-info'),
    },
    {
      icon: <CreditCard size={20} color={theme.colors.light.text} />,
      title: 'Payment Methods',
      onPress: () => router.push('/profile/payment-methods'),
    },
    {
      icon: <Heart size={20} color={theme.colors.light.text} />,
      title: 'Saved Taskers',
      onPress: () => router.push('/profile/saved-taskers'),
      badge: '3',
    },
    {
      icon: <Star size={20} color={theme.colors.light.text} />,
      title: 'Reviews & Ratings',
      onPress: () => router.push('/profile/reviews'),
    },
    {
      icon: <FileText size={20} color={theme.colors.light.text} />,
      title: 'Transaction History',
      onPress: () => router.push('/profile/transactions'),
    },
  ];

  const preferencesMenuItems = [
    {
      icon: <Bell size={20} color={theme.colors.light.text} />,
      title: 'Notifications',
      onPress: () => {},
      toggle: true,
      value: notifications,
      onToggle: () => setNotifications(!notifications),
    },
    {
      icon: <Moon size={20} color={theme.colors.light.text} />,
      title: 'Dark Mode',
      onPress: () => setShowThemeModal(true),
      toggle: true,
      value: darkMode,
      onToggle: () => setDarkMode(!darkMode),
    },
    {
      icon: <Globe size={20} color={theme.colors.light.text} />,
      title: 'Language',
      onPress: () => {},
      rightText: 'English',
    },
  ];

  const supportMenuItems = [
    {
      icon: <HelpCircle size={20} color={theme.colors.light.text} />,
      title: 'Help & Support',
      onPress: () => {},
    },
    {
      icon: <Shield size={20} color={theme.colors.light.text} />,
      title: 'Privacy & Security',
      onPress: () => {},
    },
    {
      icon: <Settings size={20} color={theme.colors.light.text} />,
      title: 'Settings',
      onPress: () => {},
    },
    {
      icon: <Share2 size={20} color={theme.colors.light.text} />,
      title: 'Invite Friends',
      onPress: () => {},
    },
  ];

  const renderMenuItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.menuItem,
        !isLast && styles.menuItemBorder,
      ]}
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
          trackColor={{ false: theme.colors.light.inactive, true: theme.colors.light.primary }}
          thumbColor={theme.colors.common.white}
        />
      ) : item.rightText ? (
        <View style={styles.menuItemRight}>
          <Text style={styles.menuItemRightText}>{item.rightText}</Text>
          <ChevronRight size={20} color={theme.colors.light.subtext} />
        </View>
      ) : (
        <ChevronRight size={20} color={theme.colors.light.subtext} />
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
            leftIcon={<LogOut size={18} color={theme.colors.light.primary} />}
          />
        </View>

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Theme Modal */}
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
                <X size={24} color={theme.colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.themeOption, !darkMode && styles.themeOptionSelected]}
              onPress={() => {
                setDarkMode(false);
                setShowThemeModal(false);
              }}
            >
              <View style={styles.themePreview}>
                <View style={styles.themePreviewLight} />
              </View>
              <Text style={styles.themeOptionText}>Light</Text>
              {!darkMode && <View style={styles.themeOptionCheck} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.themeOption, darkMode && styles.themeOptionSelected]}
              onPress={() => {
                setDarkMode(true);
                setShowThemeModal(false);
              }}
            >
              <View style={styles.themePreview}>
                <View style={styles.themePreviewDark} />
              </View>
              <Text style={styles.themeOptionText}>Dark</Text>
              {darkMode && <View style={styles.themeOptionCheck} />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.themeOption}
              onPress={() => {
                // In a real app, this would follow system settings
                setShowThemeModal(false);
              }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding to avoid tab bar overlap
  },
  header: {
    paddingHorizontal: theme.spacing.l,
    paddingTop: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: theme.colors.light.card,
    marginHorizontal: theme.spacing.l,
    borderRadius: theme.radius.l,
    marginBottom: theme.spacing.l,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  profileName: {
    ...theme.typography.h3,
    marginBottom: 4,
  },
  profilePhone: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.s,
  },
  profileStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatValue: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  profileStatLabel: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  profileStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.light.border,
    marginHorizontal: theme.spacing.m,
  },
  editButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    backgroundColor: theme.colors.light.highlight,
    borderRadius: theme.radius.m,
  },
  editButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.primary,
    fontWeight: '600',
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
  menuSection: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.l,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.l,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    ...theme.typography.body,
    marginLeft: theme.spacing.m,
  },
  menuItemBadge: {
    backgroundColor: theme.colors.light.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: theme.spacing.s,
  },
  menuItemBadgeText: {
    color: theme.colors.common.white,
    fontSize: 10,
    fontWeight: '600',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRightText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginRight: theme.spacing.s,
  },
  logoutSection: {
    marginHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.l,
  },
  versionSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  versionText: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeModal: {
    backgroundColor: theme.colors.light.background,
    borderRadius: theme.radius.l,
    width: '80%',
    padding: theme.spacing.l,
  },
  themeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  themeModalTitle: {
    ...theme.typography.h3,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.s,
  },
  themeOptionSelected: {
    backgroundColor: theme.colors.light.highlight,
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
  },
  themePreviewLight: {
    flex: 1,
    backgroundColor: theme.colors.light.background,
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
    backgroundColor: theme.colors.light.background,
  },
  themePreviewSystemDark: {
    flex: 1,
    backgroundColor: '#1A1D1F',
  },
  themeOptionText: {
    ...theme.typography.body,
    flex: 1,
  },
  themeOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});