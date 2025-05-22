import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../context/ThemeContext'; // Added
import SearchInput from '@/components/SearchInput';
import { taskers } from '@/mocks/taskers';

// Mock conversations
const mockConversations = [
  {
    id: '1',
    taskerId: '1', // Rajesh Kumar
    lastMessage: {
      content: "I'll be there at 10 AM tomorrow",
      timestamp: '2023-06-10T09:30:00Z',
      read: true,
    },
  },
  {
    id: '2',
    taskerId: '2', // Priya Singh
    lastMessage: {
      content: "Can you provide more details about the leaking tap?",
      timestamp: '2023-06-09T14:15:00Z',
      read: false,
    },
  },
  {
    id: '3',
    taskerId: '3', // Amit Patel
    lastMessage: {
      content: "The fan installation is complete. Thank you!",
      timestamp: '2023-06-08T16:45:00Z',
      read: true,
    },
  },
];

export default function ChatsScreen() {
  const { colors } = useTheme(); // Accessed theme colors
  const styles = dynamicStyles(colors, originalTheme); // Generate styles dynamically

  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const getTaskerById = (id: string) => {
    return taskers.find(tasker => tasker.id === id);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  const handleChatPress = (conversationId: string, taskerId: string) => {
    router.push(`/chat/${taskerId}`);
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const tasker = getTaskerById(conversation.taskerId);
    if (!tasker) return false;
    
    return tasker.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations..."
        />
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const tasker = getTaskerById(item.taskerId);
          if (!tasker) return null;
          
          return (
            <TouchableOpacity
              style={styles.conversationItem}
              onPress={() => handleChatPress(item.id, item.taskerId)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: tasker.avatar }}
                style={styles.avatar}
              />
              {!item.lastMessage.read && <View style={styles.unreadBadge} />} 
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.name}>{tasker.name}</Text>
                  <Text style={styles.time}>{formatTime(item.lastMessage.timestamp)}</Text>
                </View>
                <Text
                  style={[
                    styles.message,
                    !item.lastMessage.read && styles.unreadMessage,
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage.content}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Start chatting with taskers to discuss your tasks
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Updated
    },
    header: {
      paddingHorizontal: currentTheme.spacing.l,
      paddingTop: currentTheme.spacing.l,
      paddingBottom: currentTheme.spacing.m,
    },
    title: {
      ...currentTheme.typography.h2,
      color: colors.text, // Added color
    },
    searchContainer: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
    },
    conversationItem: {
      flexDirection: 'row',
      padding: currentTheme.spacing.m,
      borderBottomWidth: 1,
      borderBottomColor: colors.border, // Updated
      position: 'relative', 
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: currentTheme.spacing.m,
    },
    unreadBadge: {
      position: 'absolute',
      top: 20, // Reverted to original fixed value
      left: 45, // Reverted to original fixed value
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary, // Updated
      borderWidth: 2,
      borderColor: colors.background, // Updated (to match overall screen background)
    },
    conversationContent: {
      flex: 1,
    },
    conversationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    name: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text, // Added color
    },
    time: {
      ...currentTheme.typography.caption,
      color: colors.subtext, // Updated
    },
    message: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext, // Updated
    },
    unreadMessage: {
      color: colors.text, // Updated
      fontWeight: '500',
    },
    emptyContainer: {
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
      marginTop: currentTheme.spacing.xl,
    },
    emptyTitle: {
      ...currentTheme.typography.h3,
      color: colors.text, // Added color
      marginBottom: currentTheme.spacing.s,
    },
    emptyText: {
      ...currentTheme.typography.body,
      color: colors.subtext, // Updated
      textAlign: 'center',
    },
  });

export default ChatsScreen;
