import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import { ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleContinue = async () => {
    if (phoneNumber.length < 10) {
      return;
    }
    
    await login(phoneNumber);
    router.push('/(auth)/otp');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' }}
              style={styles.logo}
            />
          </View>
          
          <Text style={styles.title}>Welcome to TaskRiser</Text>
          <Text style={styles.subtitle}>
            Find verified professionals for all your home services and tasks
          </Text>
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  clearError();
                  setPhoneNumber(text.replace(/[^0-9]/g, ''));
                }}
                maxLength={10}
              />
            </View>
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Button
              title="Continue"
              onPress={handleContinue}
              loading={isLoading}
              disabled={phoneNumber.length < 10 || isLoading}
              rightIcon={<ArrowRight size={18} color={theme.colors.common.white} />}
              style={styles.button}
            />
            
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.light.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    marginTop: theme.spacing.l,
  },
  label: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.m,
    height: 56,
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  countryCode: {
    ...theme.typography.body,
    fontWeight: '600',
    marginRight: theme.spacing.s,
  },
  input: {
    flex: 1,
    height: '100%',
    ...theme.typography.body,
  },
  button: {
    marginTop: theme.spacing.m,
  },
  errorText: {
    color: theme.colors.light.error,
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.m,
  },
  termsText: {
    ...theme.typography.caption,
    textAlign: 'center',
    color: theme.colors.light.subtext,
    marginTop: theme.spacing.xl,
  },
  termsLink: {
    color: theme.colors.light.primary,
    fontWeight: '500',
  },
});