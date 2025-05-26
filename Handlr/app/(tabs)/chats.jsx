import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import originalTheme from '@/constants/theme';
import { useTheme } from '../../context/ThemeContext';
import SearchInput from '@/components/SearchInput';
import { taskers } from '@/mocks/taskers';

const mockConversations = [
  {
    id: '1',
    taskerId: '1',
    lastMessage: {
      content: "I'll be there at 10 AM tomorrow",
      timestamp: '2023-06-10T09:30:00Z',
      read: true,
    },
  },
  {
    id: '2',
    taskerId: '2',
    lastMessage: {
      content: "Can you provide more details about the leaking tap?",
      timestamp: '2023-06-09T14:15:00Z',
      read: false,
    },
  },
  {
    id: '3',
    taskerId: '3',
    lastMessage: {
      content: "The fan installation is complete. Thank you!",
      timestamp: '2023-06-08T16:45:00Z',
      read: true,
    },
  },
];

export default function ChatsScreen() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState(mockConversations);

  const getTaskerById = (id) => taskers.find(tasker => tasker.id === id);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  const handleChatPress = (taskerId) => router.push(`/chat/${taskerId}`);

  const handleViewProfile = (taskerId) => router.push(`tasker/${taskerId}`)

  const filteredConversations = conversations.filter(convo => {
    if (!searchQuery) return true;
    const tasker = getTaskerById(convo.taskerId);
    return tasker?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Tasker Responses</Text></View>

      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search taskers..."
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
              style={styles.taskerCard}
              onPress={() => handleChatPress(item.taskerId)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: tasker.avatar }} style={styles.avatar} />
              <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                  <Text style={styles.name}>{tasker.name}</Text>
                  <TouchableOpacity style={styles.profileButton} onPress={()=>handleViewProfile(item.taskerId)}>
                    <Text style={styles.profileButtonText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.detailText}>
                  {tasker.price ? `Proposed Price: ₹${tasker.price}` : 'Chat to discuss budget'}
                </Text>
                <Text style={styles.rating}>{tasker.rating} • {tasker.taskCount} tasks</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No taskers responded yet.</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const dynamicStyles = (colors, theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: colors.text,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.l,
    marginVertical: theme.spacing.m,
  },
  taskerCard: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.m,
  },
  infoContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  profileButton: {
    backgroundColor: colors.buttonBackground || '#eee',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  profileButtonText: {
    fontSize: 12,
    color: colors.primary,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginVertical: 4,
  },
  rating: {
    fontSize: 12,
    color: colors.subtext,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: colors.subtext,
  },
});
