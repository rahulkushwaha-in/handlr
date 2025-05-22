import React, { useState, useEffect } from 'react'; // Added useEffect for header options
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Dimensions // For screenWidth fallback
} from 'react-native';
import { router, Stack, useNavigation } from 'expo-router'; // Added useNavigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../../context/ThemeContext'; // Corrected path
import Button from '@/components/Button';
import { useAuthStore } from '@/store/authStore';

export default function EditProfileScreen() {
  const { colors } = useTheme(); 
  const styles = dynamicStyles(colors, originalTheme); 
  const navigation = useNavigation(); 

  const { user, updateUserProfile } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [address, setAddress] = useState(user?.location?.address || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically set header options based on theme
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text },
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} /> 
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Check size={24} color={colors.primary} /> 
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors, isLoading, name, email, phone, bio, address, avatar]); // Added relevant dependencies

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permission to upload your profile picture');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
      if (!user) throw new Error("User not found");
      const updatedUser = {
        ...user, name, email, phone, bio, avatar,
        location: { address, coordinates: user.location?.coordinates || { latitude: 12.9716, longitude: 77.5946 } }
      };
      updateUserProfile(updatedUser);
      Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Stack.Screen options are now set dynamically via useEffect and setOptions */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
      >
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Camera size={20} color={originalTheme.colors.common.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone.replace('+91', '')}
                    onChangeText={(text) => setPhone('+91' + text.replace(/[^0-9]/g, ''))}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    placeholderTextColor={colors.placeholder}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor={colors.placeholder}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor={colors.placeholder}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={isLoading}
                fullWidth
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, 
    },
    headerButton: { 
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarContainer: {
      alignItems: 'center',
      marginTop: currentTheme.spacing.xl,
      marginBottom: currentTheme.spacing.xl,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: (currentTheme.sizes?.screenWidth || Dimensions.get('window').width) / 2 - 60, 
      backgroundColor: colors.primary, 
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background, 
    },
    formContainer: {
      paddingHorizontal: currentTheme.spacing.l,
    },
    formGroup: {
      marginBottom: currentTheme.spacing.l,
    },
    label: {
      ...currentTheme.typography.bodySmall,
      fontWeight: '600',
      marginBottom: currentTheme.spacing.xs,
      color: colors.text, 
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border, 
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
      paddingVertical: currentTheme.spacing.m,
      ...currentTheme.typography.body,
      color: colors.text, 
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    phoneInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border, 
      borderRadius: currentTheme.radius.m,
      paddingHorizontal: currentTheme.spacing.m,
    },
    countryCode: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      marginRight: currentTheme.spacing.s,
      color: colors.text, 
    },
    phoneInput: {
      flex: 1,
      paddingVertical: currentTheme.spacing.m,
      ...currentTheme.typography.body,
      color: colors.text, 
    },
    buttonContainer: {
      padding: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.xxl, 
    },
  });
