import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/Button';
import theme from '@/constants/theme';
import { ArrowLeft } from 'lucide-react-native';

export default function OtpScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
  const [timer, setTimer] = useState(30);
  
  const { verifyOtp, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    clearError();
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) return;
    
    await verifyOtp(otpString);
  };

  const handleResend = () => {
    setTimer(30);
    // In a real app, this would call the API to resend OTP
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.light.text} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            We have sent a verification code to your phone number
          </Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <Button
            title="Verify"
            onPress={handleVerify}
            loading={isLoading}
            disabled={otp.join('').length !== 4 || isLoading}
            style={styles.button}
          />
          
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
            </Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendButton}>Resend</Text>
              </TouchableOpacity>
            )}
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
  backButton: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.xl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xl,
  },
  otpInput: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: theme.colors.light.border,
    borderRadius: theme.radius.m,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
  },
  button: {
    marginTop: theme.spacing.l,
  },
  errorText: {
    color: theme.colors.light.error,
    ...theme.typography.bodySmall,
    marginBottom: theme.spacing.m,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  resendText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
  },
  timerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
  },
  resendButton: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.primary,
    fontWeight: '600',
  },
});