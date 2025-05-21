import React, { useState } from 'react';
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
import { router, Stack } from 'expo-router';
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
import theme from '@/constants/theme';
import Button from '@/components/Button';

// Mock payment methods
const mockPaymentMethods = [
  {
    id: '1',
    type: 'card',
    name: 'HDFC Credit Card',
    number: '•••• •••• •••• 4242',
    expiry: '12/25',
    isDefault: true,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
  },
  {
    id: '2',
    type: 'upi',
    name: 'Google Pay',
    number: 'user@okicici',
    isDefault: false,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png',
  },
  {
    id: '3',
    type: 'wallet',
    name: 'Paytm Wallet',
    number: '+91 98765 43210',
    isDefault: false,
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/200px-Paytm_Logo_%28standalone%29.svg.png',
  },
];

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleAddPaymentMethod = () => {
    // In a real app, this would navigate to a screen to add a new payment method
    Alert.alert(
      "Add Payment Method",
      "This would open a screen to add a new payment method in a real app."
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDeleteConfirm = () => {
    if (selectedMethod) {
      // Check if trying to delete default method
      const isDefault = paymentMethods.find(m => m.id === selectedMethod)?.isDefault;
      
      if (isDefault) {
        Alert.alert(
          "Cannot Delete Default",
          "Please set another payment method as default before deleting this one."
        );
        setShowDeleteModal(false);
        setSelectedMethod(null);
        return;
      }
      
      setPaymentMethods(methods => 
        methods.filter(method => method.id !== selectedMethod)
      );
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
      <Stack.Screen 
        options={{
          title: 'Payment Methods',
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.addButtonContainer}>
            <Button
              title="Add Payment Method"
              onPress={handleAddPaymentMethod}
              leftIcon={<Plus size={18} color={theme.colors.common.white} />}
            />
          </View>

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
                        <CheckCircle size={14} color={theme.colors.light.success} />
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
                      <Trash2 size={18} color={theme.colors.light.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <CreditCard size={60} color={theme.colors.light.subtext} />
              <Text style={styles.emptyTitle}>No Payment Methods</Text>
              <Text style={styles.emptyText}>
                Add a payment method to easily pay for tasks
              </Text>
            </View>
          )}

          <View style={styles.securityNote}>
            <View style={styles.securityIcon}>
              <AlertCircle size={20} color={theme.colors.light.primary} />
            </View>
            <Text style={styles.securityText}>
              Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your data.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Delete Confirmation Modal */}
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
                <X size={24} color={theme.colors.light.text} />
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
                variant="primary"
                style={[styles.modalButton, styles.deleteModalButton]}
                textStyle={{ color: theme.colors.common.white }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  addButtonContainer: {
    padding: theme.spacing.l,
  },
  sectionTitle: {
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  sectionTitleText: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  paymentMethodsContainer: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.l,
    overflow: 'hidden',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  paymentMethodItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.light.border,
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
    marginRight: theme.spacing.m,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  paymentMethodNumber: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginBottom: 2,
  },
  paymentMethodExpiry: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light.success + '20',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.radius.s,
    marginRight: theme.spacing.s,
  },
  defaultText: {
    ...theme.typography.caption,
    color: theme.colors.light.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  setDefaultButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    marginRight: theme.spacing.s,
  },
  setDefaultText: {
    ...theme.typography.caption,
    color: theme.colors.light.primary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.l,
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
  },
  securityNote: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.highlight,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.xxl,
  },
  securityIcon: {
    marginRight: theme.spacing.m,
  },
  securityText: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    flex: 1,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.colors.light.background,
    borderRadius: theme.radius.l,
    width: '80%',
    padding: theme.spacing.l,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  modalTitle: {
    ...theme.typography.h3,
  },
  modalText: {
    ...theme.typography.body,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.l,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  deleteModalButton: {
    backgroundColor: theme.colors.light.error,
  },
});