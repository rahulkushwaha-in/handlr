import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useTheme } from '@/context/ThemeContext';
import originalTheme from '@/constants/theme';
import { Star } from 'lucide-react-native';

const TaskerMap = ({ taskers, onSelectTasker }) => {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  // Default coordinates if no taskers are provided
  const initialRegion = {
    latitude: taskers[0]?.coordinates.latitude || 37.78825,
    longitude: taskers[0]?.coordinates.longitude || -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {taskers.map((tasker) => (
          <Marker
            key={tasker.id}
            coordinate={tasker.coordinates}
            title={tasker.name}
            description={`$${tasker.hourlyRate}/hr`}
          >
            <Callout onPress={() => onSelectTasker(tasker)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{tasker.name}</Text>
                <View style={styles.calloutRating}>
                  <View style={{ flexDirection: 'row' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.round(tasker.rating) ? colors.warning : 'transparent'}
                        color={i < Math.round(tasker.rating) ? colors.warning : colors.border}
                      />
                    ))}
                  </View>
                  <Text style={styles.calloutRatingText}>{tasker.rating} ({tasker.reviews} reviews)</Text>
                </View>
                <Text style={styles.calloutRate}>${tasker.hourlyRate}/hr</Text>
                <Text style={styles.calloutDistance}>{tasker.distance} miles away</Text>
                <TouchableOpacity style={styles.calloutButton}>
                  <Text style={styles.calloutButtonText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const dynamicStyles = (colors, theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
    // borderRadius: theme.radius.m,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    width: 200,
    padding: theme.spacing.s,
    backgroundColor: colors.card,
    borderRadius: theme.radius.m,
  },
  calloutTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: theme.spacing.s,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  calloutRatingText: {
    ...theme.typography.bodySmall,
    color: colors.subtext,
    marginLeft: theme.spacing.s,
  },
  calloutRate: {
    ...theme.typography.bodySmall,
    color: colors.subtext,
    marginBottom: theme.spacing.s,
  },
  calloutDistance: {
    ...theme.typography.bodySmall,
    color: colors.subtext,
    marginBottom: theme.spacing.s,
  },
  calloutButton: {
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.radius.l,
    alignItems: 'center',
  },
  calloutButtonText: {
    ...theme.typography.bodySmall,
    color: colors.card,
    fontWeight: '600',
  },
});

export default TaskerMap;