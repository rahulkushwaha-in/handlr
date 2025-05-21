import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Star, MapPin, Search } from 'lucide-react-native';
import theme from '@/constants/theme';
import { taskers } from '@/mocks/taskers';
import { Tasker } from '@/types';
import SearchInput from '@/components/SearchInput';

export default function SavedTaskersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedTaskers, setSavedTaskers] = useState(taskers.slice(0, 3));

  const filteredTaskers = savedTaskers.filter(tasker => 
    tasker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tasker.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTaskerPress = (tasker: Tasker) => {
    router.push(`/tasker/${tasker.id}`);
  };

  const handleRemove = (taskerId: string) => {
    Alert.alert(
      "Remove Tasker",
      "Are you sure you want to remove this tasker from your saved list?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Remove", 
          onPress: () => {
            setSavedTaskers(current => current.filter(t => t.id !== taskerId));
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Saved Taskers',
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
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search saved taskers..."
          />
        </View>

        <FlatList
          data={filteredTaskers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskerCard}>
              <TouchableOpacity 
                style={styles.taskerContent}
                onPress={() => handleTaskerPress(item)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.taskerAvatar}
                />
                <View style={styles.taskerInfo}>
                  <View style={styles.taskerNameRow}>
                    <Text style={styles.taskerName}>{item.name}</Text>
                    {item.verified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={theme.colors.light.warning} fill={theme.colors.light.warning} />
                    <Text style={styles.rating}>
                      {item.rating.toFixed(1)} ({item.totalReviews})
                    </Text>
                  </View>
                  <View style={styles.locationContainer}>
                    <MapPin size={12} color={theme.colors.light.subtext} />
                    <Text style={styles.location} numberOfLines={1}>
                      {item.location?.address}
                    </Text>
                  </View>
                  <View style={styles.skillsContainer}>
                    {item.skills.slice(0, 2).map((skill, index) => (
                      <View key={index} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                    {item.skills.length > 2 && (
                      <Text style={styles.moreSkills}>+{item.skills.length - 2} more</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => handleRemove(item.id)}
              >
                <Heart size={20} color={theme.colors.light.error} fill={theme.colors.light.error} />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.taskersList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Heart size={60} color={theme.colors.light.subtext} />
              <Text style={styles.emptyTitle}>No Saved Taskers</Text>
              <Text style={styles.emptyText}>
                You haven't saved any taskers yet. Browse taskers and tap the heart icon to save them for later.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push('/explore')}
              >
                <Text style={styles.browseButtonText}>Browse Taskers</Text>
              </TouchableOpacity>
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
  searchContainer: {
    padding: theme.spacing.l,
  },
  taskersList: {
    padding: theme.spacing.l,
    paddingTop: 0,
    paddingBottom: theme.spacing.xxl,
  },
  taskerCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginBottom: theme.spacing.m,
    padding: theme.spacing.m,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskerContent: {
    flexDirection: 'row',
    flex: 1,
  },
  taskerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.m,
  },
  taskerInfo: {
    flex: 1,
  },
  taskerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskerName: {
    ...theme.typography.body,
    fontWeight: '600',
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
    marginBottom: 4,
  },
  rating: {
    ...theme.typography.caption,
    marginLeft: theme.spacing.xs,
    color: theme.colors.light.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  skillBadge: {
    backgroundColor: theme.colors.light.highlight,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.radius.s,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  skillText: {
    ...theme.typography.caption,
    color: theme.colors.light.primary,
  },
  moreSkills: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  removeButton: {
    padding: theme.spacing.s,
    alignSelf: 'flex-start',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginTop: theme.spacing.l,
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
    marginBottom: theme.spacing.l,
  },
  browseButton: {
    backgroundColor: theme.colors.light.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.m,
  },
  browseButtonText: {
    ...theme.typography.button,
    color: theme.colors.common.white,
  },
});