import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { router } from 'expo-router';
import React from 'react';
import originalTheme from '@/constants/theme';


export default function TaskConfirmedScreen() {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={{uri:"https://img.freepik.com/free-vector/3d-cartoon-style-checklist-with-green-checkmark-icon-list-with-completed-tasks-white-background-flat-vector-illustration-success-productivity-management-achievement-concept_778687-983.jpg?semt=ais_hybrid&w=740"}} // replace with your actual image path
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.heading}>Your task is confirmed!</Text>
      <Text style={styles.subheading}>
        Your task has been successfully confirmed. You can now view the task details or continue browsing.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('task/findingTasker')}>
        <Text style={styles.primaryButtonText}>Find Tasker</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('task/bookingConfirm')}>
        <Text style={styles.secondaryButtonText}>Continue Browsing</Text>
      </TouchableOpacity>
    </View>
  );
}

const dynamicStyles = (colors, theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: theme.spacing.l,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  image: {
    width: 100,
    height:100,
  },
  heading: {
    ...theme.typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.s,
  },
  subheading: {
    ...theme.typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.l,
    marginBottom: theme.spacing.s,
  },
  primaryButtonText: {
    color: colors.card,
    ...theme.typography.button,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    ...theme.typography.button,
  },
});
