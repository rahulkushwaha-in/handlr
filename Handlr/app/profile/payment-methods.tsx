import React, { useState, useEffect } from 'react'; // Added useEffect
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Modal
} from 'react-native';
import { router, Stack, useNavigation } from 'expo-router'; // Added useNavigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Plus, 
  CreditCard, 
  Trash2, 
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '@/context/ThemeContext'; // Added
import Button from '@/components/Button';

// Mock payment methods (data remains the same)
const mockPaymentMethods = [
  { id: '1', type: 'card', name: 'HDFC Credit Card', number: '•••• •••• •••• 4242', expiry: '12/25', isDefault: true, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png', },
  { id: '2', type: 'upi', name: 'Google Pay', number: 'user@okicici', isDefault: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png', },
  { id: '3', type: 'wallet', name: 'Paytm Wallet', number: '+91 98765 43210', isDefault: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/200px-Paytm_Logo_%28standalone%29.svg.png', },
];

export default function PaymentMethodsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = dynamicStyles(colors, originalTheme);

  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTitleStyle: { color: colors.text },
      headerLeft: () => (
        <TouchableOpacity 
          style={styles.headerButton} // Layout only
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, colors]);

  const handleAddPaymentMethod = () => {
    Alert.alert("Add Payment Method", "This would open a screen to add a new payment method.");
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({ ...method, isDefault: method.id === id }))
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedMethod) {
      const isDefault = paymentMethods.find(m => m.id === selectedMethod)?.isDefault;
      if (isDefault) {
        Alert.alert("Cannot Delete Default", "Please set another payment method as default first.");
        setShowDeleteModal(false);
        setSelectedMethod(null);
        return;
      }
      setPaymentMethods(methods => methods.filter(method => method.id !== selectedMethod));
      setShowDeleteModal(false);
      setSelectedMethod(null);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedMethod(id);
    setShowDeleteModal(true);
  };

  return (
    <>
      {/* Stack.Screen options are now set dynamically via useEffect */}
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Your Payment Methods</Text>
          </View>

          {paymentMethods.length > 0 ? (
            <View style={styles.paymentMethodsContainer}>
              {paymentMethods.map((method, index) => (
                <View 
                  key={method.id} 
                  style={[
                    styles.paymentMethodItem,
                    index !== paymentMethods.length - 1 && styles.paymentMethodItemBorder
                  ]}
                >
                  <View style={styles.paymentMethodLeft}>
                    <Image 
                      source={{ uri: method.icon }} 
                      style={styles.paymentMethodIcon} 
                    />
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      <Text style={styles.paymentMethodNumber}>{method.number}</Text>
                      {method.expiry && (
                        <Text style={styles.paymentMethodExpiry}>Expires: {method.expiry}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.paymentMethodActions}>
                    {method.isDefault ? (
                      <View style={styles.defaultBadge}>
                        <CheckCircle size={14} color={colors.success} />
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Text style={styles.setDefaultText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDelete(method.id)}
                    >
                      <Trash2 size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <CreditCard size={60} color={colors.subtext} />
              <Text style={styles.emptyTitle}>No Payment Methods</Text>
              <Text style={styles.emptyText}>
                Add a payment method to easily pay for tasks
              </Text>
            </View>
          )}

          <View style={styles.addButtonContainer}>
            <Button
              title="Add Payment Method"
              onPress={handleAddPaymentMethod}
              leftIcon={<Plus size={18} color={originalTheme.colors.common.white} />} // Explicitly white icon
            />
          </View>

          <View style={styles.securityNoteContainer}>
            <View style={styles.securityIcon}>
              <AlertCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.securityText}>
              Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your data.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delete Payment Method</Text>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowDeleteModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Delete"
                onPress={handleDeleteConfirm}
                variant="primary" // This will use primary bg, text should be white
                style={[styles.modalButton, styles.deleteModalButton]}
                textStyle={{ color: originalTheme.colors.common.white }} // Explicitly white text
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      paddingTop:35,
      flex: 1,
      backgroundColor: colors.background,
    },
    headerButton: { // Layout only
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonContainer: {
      padding: currentTheme.spacing.l,
    },
    sectionTitle: {
      paddingHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.s,
    },
    sectionTitleText: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    paymentMethodsContainer: {
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
      overflow: 'hidden',
    },
    paymentMethodItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: currentTheme.spacing.l,
    },
    paymentMethodItemBorder: { // Applied to paymentMethodItem
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    paymentMethodLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    paymentMethodIcon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      marginRight: currentTheme.spacing.m,
    },
    paymentMethodInfo: {
      flex: 1,
    },
    paymentMethodName: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text, // Added
      marginBottom: 2,
    },
    paymentMethodNumber: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      marginBottom: 2,
    },
    paymentMethodExpiry: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
    },
    paymentMethodActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    defaultBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success + '20', // Updated
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 4,
      borderRadius: currentTheme.radius.s,
      marginRight: currentTheme.spacing.s,
    },
    defaultText: {
      ...currentTheme.typography.caption,
      color: colors.success,
      fontWeight: '600',
      marginLeft: 4,
    },
    setDefaultButton: {
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 4,
      marginRight: currentTheme.spacing.s,
    },
    setDefaultText: {
      ...currentTheme.typography.caption,
      color: colors.primary,
      fontWeight: '600',
    },
    deleteButton: { // Layout for TouchableOpacity containing Trash2 icon
      padding: currentTheme.spacing.xs,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.l,
    },
    emptyTitle: {
      ...currentTheme.typography.h3,
      color: colors.text, // Added
      marginTop: currentTheme.spacing.m,
      marginBottom: currentTheme.spacing.s,
    },
    emptyText: {
      ...currentTheme.typography.body,
      color: colors.subtext,
      textAlign: 'center',
    },
    securityNoteContainer: { // Renamed from securityNote for clarity
      flexDirection: 'row',
      backgroundColor: colors.highlight,
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.m,
      marginHorizontal: currentTheme.spacing.l,
      marginBottom: currentTheme.spacing.xxl,
    },
    securityIcon: { // Layout for AlertCircle icon
      marginRight: currentTheme.spacing.m,
    },
    securityText: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
      flex: 1,
      lineHeight: 18,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)', // Standard overlay
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderRadius: currentTheme.radius.l,
      width: '80%',
      padding: currentTheme.spacing.l,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: currentTheme.spacing.m,
    },
    modalTitle: {
      ...currentTheme.typography.h3,
      color: colors.text, // Added
    },
    modalText: {
      ...currentTheme.typography.body,
      color: colors.subtext,
      marginBottom: currentTheme.spacing.l,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: { // For layout of individual button in modal
      flex: 1,
      marginHorizontal: currentTheme.spacing.xs,
    },
    deleteModalButton: { // Specific style for delete button background
      backgroundColor: colors.error, 
    },
  });

export default PaymentMethodsScreen;
