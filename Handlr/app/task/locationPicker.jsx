// app/location-picker.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Navigation, X } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '@/context/ThemeContext';
import originalTheme from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const mockSuggestions = [
  { id: '1', name: 'Indiranagar', fullAddress: 'Indiranagar, Bangalore, Karnataka, India', coordinates: { lat: 12.9719, lng: 77.6412 } },
  { id: '2', name: 'Koramangala', fullAddress: 'Koramangala, Bangalore, Karnataka, India', coordinates: { lat: 12.9279, lng: 77.6271 } },
  { id: '3', name: 'Whitefield', fullAddress: 'Whitefield, Bangalore, Karnataka, India', coordinates: { lat: 12.9698, lng: 77.7500 } },
  { id: '4', name: 'HSR Layout', fullAddress: 'HSR Layout, Bangalore, Karnataka, India', coordinates: { lat: 12.9116, lng: 77.6370 } },
  { id: '5', name: 'Electronic City', fullAddress: 'Electronic City, Bangalore, Karnataka, India', coordinates: { lat: 12.8456, lng: 77.6593 } },
];

export default function LocationPickerScreen() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockSuggestions.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSuggestion = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location.name);
    setSuggestions([]);
    setShowMap(true);
  };

  const handleConfirmLocation = (location) => {
    router.back();
    router.setParams({ selectedLocation: JSON.stringify(location) });
  };

  const handleUseCurrentLocation = () => {
    Alert.alert(
      'Use Current Location',
      'This would use the device GPS to get current location in a real app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow',
          onPress: () => {
            const currentLocation = {
              id: 'current',
              name: 'Current Location',
              fullAddress: 'Your current location',
              coordinates: { lat: 12.9716, lng: 77.5946 },
            };
            handleSelectSuggestion(currentLocation);
          },
        },
      ]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowMap(false);
    setSelectedLocation(null);
  };

  const goBack = () => {
    if (showMap) {
      setShowMap(false);
      setSelectedLocation(null);
    } else {
      router.back();
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
      <View style={styles.suggestionIcon}>
        <MapPin size={16} color={colors.primary} />
      </View>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionAddress}>{item.fullAddress}</Text>
      </View>
    </TouchableOpacity>
  );

  if (showMap && selectedLocation) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Confirm Location',
            headerStyle: { backgroundColor: colors.background },
            headerTitleStyle: { color: colors.text },
            headerLeft: () => (
              <TouchableOpacity onPress={goBack} style={styles.headerButton}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation.coordinates.lat,
              longitude: selectedLocation.coordinates.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: selectedLocation.coordinates.lat,
              longitude: selectedLocation.coordinates.lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: selectedLocation.coordinates.lat,
                longitude: selectedLocation.coordinates.lng,
              }}
              title={selectedLocation.name}
              description={selectedLocation.fullAddress}
            />
          </MapView>
          <View style={styles.mapControls}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationInfoText}>📍 {selectedLocation.fullAddress}</Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handleConfirmLocation(selectedLocation)}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Select Location',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerLeft: () => (
            <TouchableOpacity onPress={goBack} style={styles.headerButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={colors.subtext} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for a location..."
                placeholderTextColor={colors.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <X size={18} color={colors.subtext} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
            <Navigation size={20} color={colors.primary} />
            <Text style={styles.currentLocationText}>Use current location</Text>
          </TouchableOpacity>
          {isLoading && (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
          {searchQuery.length > 0 && suggestions.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <MapPin size={48} color={colors.subtext} />
              <Text style={styles.emptyStateText}>No locations found</Text>
              <Text style={styles.emptyStateSubtext}>Try searching with a different keyword</Text>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const dynamicStyles = (colors, currentTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    headerButton: { padding: 8 },
    searchContainer: {
      padding: currentTheme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      paddingHorizontal: currentTheme.spacing.m,
      paddingVertical: currentTheme.spacing.s,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: currentTheme.spacing.s,
      ...currentTheme.typography.body,
      color: colors.text,
    },
    clearButton: { padding: currentTheme.spacing.xs },
    currentLocationButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: currentTheme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    currentLocationText: {
      ...currentTheme.typography.body,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: currentTheme.spacing.s,
    },
    loadingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: currentTheme.spacing.l,
    },
    loadingText: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      marginLeft: currentTheme.spacing.s,
    },
    suggestionsList: { flex: 1 },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: currentTheme.spacing.l,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: currentTheme.spacing.m,
    },
    suggestionContent: { flex: 1 },
    suggestionName: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    suggestionAddress: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
    },
    emptyStateText: {
      ...currentTheme.typography.h3,
      color: colors.text,
      marginTop: currentTheme.spacing.m,
      marginBottom: currentTheme.spacing.xs,
    },
    emptyStateSubtext: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      textAlign: 'center',
    },
    mapContainer: { flex: 1, backgroundColor: colors.background },
    map: { flex: 1 },
    mapControls: {
      position: 'absolute',
      top: 10,
      left: 10,
      right: 10,
      backgroundColor: colors.background + 'F2',
      padding: currentTheme.spacing.m,
      borderRadius: currentTheme.radius.m,
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    locationInfo: { marginBottom: currentTheme.spacing.s },
    locationInfoText: {
      ...currentTheme.typography.body,
      color: colors.text,
    },
    confirmButton: {
      backgroundColor: colors.primary,
      paddingVertical: currentTheme.spacing.s,
      paddingHorizontal: currentTheme.spacing.m,
      borderRadius: currentTheme.radius.s,
      alignItems: 'center',
    },
    confirmButtonText: {
      ...currentTheme.typography.body,
      color: colors.white,
      fontWeight: '600',
    },
  });