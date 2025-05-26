import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Check, ChevronLeft, CreditCard, IndianRupee, Clock, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import originalTheme from '@/constants/theme';

const BookingConfirmation = ({
  taskDetails = {
    title: 'Garden Cleanup',
    description: 'Need help removing weeds and trimming bushes in my backyard garden.',
    date: 'June 15, 2023',
    time: '10:00 AM - 2:00 PM',
    location: '123 Main St, Anytown, India',
  },
  tasker = {
    id: 't1',
    name: 'John Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    rating: 4.8,
    hourlyRate: 2000,
  },
  pricing = {
    hourlyRate: 2000,
    estimatedHours: 4,
    serviceFee: 500,
    total: 8500,
  },
  onConfirm = () => {},
}) => {
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card1');

  const paymentMethods = [
    {
      id: 'card1',
      type: 'credit',
      name: 'Visa',
      lastFour: '4242',
      icon: <CreditCard size={24} color={colors.primary} />,
    },
    {
      id: 'card2',
      type: 'credit',
      name: 'Mastercard',
      lastFour: '8888',
      icon: <CreditCard size={24} color={colors.error} />,
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI',
      icon: <IndianRupee size={24} color={colors.success} />,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{
            color: i <= rating ? colors.warning : colors.border,
            fontSize: 16,
          }}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.heading}>Booking Confirmation</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Task Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          <Text style={styles.taskTitle}>{taskDetails.title}</Text>
          <Text style={styles.subheading}>{taskDetails.description}</Text>

          <View style={styles.taskInfoRow}>
            <Calendar size={16} color={colors.subtext} />
            <Text style={styles.taskInfoText}>{taskDetails.date}</Text>
          </View>

          <View style={styles.taskInfoRow}>
            <Clock size={16} color={colors.subtext} />
            <Text style={styles.taskInfoText}>{taskDetails.time}</Text>
          </View>

          <Text style={styles.taskInfoText}>{taskDetails.location}</Text>
        </View>

        {/* Tasker Info Section */}
        <View style={[styles.section, styles.taskerContainer]}>
          <Image
            source={{ uri: tasker.avatar }}
            style={styles.image}
            contentFit="cover"
          />
          <View style={styles.taskerInfo}>
            <Text style={styles.taskerName}>{tasker.name}</Text>
            <View style={styles.taskerRatingContainer}>
              <View style={{ flexDirection: 'row' }}>{renderStars(tasker.rating)}</View>
              <Text style={styles.taskerRatingText}>{tasker.rating}</Text>
            </View>
            <Text style={styles.taskerRate}>₹{tasker.hourlyRate}/hr</Text>
          </View>
        </View>

        {/* Pricing Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Breakdown</Text>

          <View style={styles.pricingRow}>
            <Text style={styles.subheading}>
              ₹{pricing.hourlyRate} × {pricing.estimatedHours} hours
            </Text>
            <Text style={styles.pricingValue}>
              ₹{pricing.hourlyRate * pricing.estimatedHours}
            </Text>
          </View>

          <View style={styles.pricingRow}>
            <Text style={styles.subheading}>Service Fee</Text>
            <Text style={styles.pricingValue}>₹{pricing.serviceFee}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.pricingRow}>
            <Text style={styles.sectionTitle}>Total</Text>
            <Text style={styles.sectionTitle}>₹{pricing.total}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodItem,
                selectedPaymentMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodInfo}>
                <View style={styles.paymentMethodIconWrapper}>{method.icon}</View>
                <View style={styles.paymentMethodDetails}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  {method.lastFour && (
                    <Text style={styles.subheading}>•••• {method.lastFour}</Text>
                  )}
                </View>
              </View>

              {selectedPaymentMethod === method.id && (
                <View style={styles.checkContainer}>
                  <Check size={16} color={colors.card} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onConfirm}>
          <Text style={styles.primaryButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const dynamicStyles = (colors, theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: theme.spacing.s,
    backgroundColor: colors.card,
    borderRadius: theme.radius.l,
    marginRight: theme.spacing.m,
  },
  heading: {
    ...theme.typography.h2,
    color: colors.text,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: colors.text,
    marginBottom: theme.spacing.m,
  },
  taskTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  subheading: {
    ...theme.typography.body,
    color: colors.subtext,
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  taskInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  taskInfoText: {
    ...theme.typography.body,
    color: colors.subtext,
    marginLeft: theme.spacing.s,
  },
  taskerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
  },
  taskerInfo: {
    marginLeft: theme.spacing.m,
    flex: 1,
  },
  taskerName: {
    ...theme.typography.h3,
    color: colors.text,
  },
  taskerRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskerRatingText: {
    ...theme.typography.bodySmall,
    color: colors.subtext,
    marginLeft: theme.spacing.s,
  },
  taskerRate: {
    ...theme.typography.bodySmall,
    color: colors.subtext,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  pricingValue: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: theme.spacing.m,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    borderWidth: 1,
    borderRadius: theme.radius.m,
    marginBottom: theme.spacing.m,
    backgroundColor: colors.card,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIconWrapper: {
    marginRight: theme.spacing.m,
  },
  paymentMethodDetails: {
    flexDirection: 'column',
  },
  paymentMethodName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: colors.text,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.l,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...theme.typography.button,
    color: colors.card,
    fontWeight: '700',
  },
  spacer: {
    height: 80,
  },
});

export default BookingConfirmation;