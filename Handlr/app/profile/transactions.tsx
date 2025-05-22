import React, { useState, useEffect } from 'react'; // Added useEffect
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import { router, Stack, useNavigation } from 'expo-router'; // Added useNavigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  Filter,
  Download,
  CreditCard,
  Wallet
} from 'lucide-react-native';
import originalTheme from '@/constants/theme'; // Renamed
import { useTheme } from '../../../context/ThemeContext'; // Added

// Mock transactions data (data remains the same)
const mockTransactions = [
  { id: '1', type: 'payment', amount: 1500, taskId: '101', taskTitle: 'Deep cleaning of 2BHK apartment', taskerId: '1', taskerName: 'Rajesh Kumar', taskerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', date: '2023-06-10', status: 'completed', paymentMethod: 'HDFC Credit Card', },
  { id: '2', type: 'payment', amount: 500, taskId: '102', taskTitle: 'Fix leaking bathroom tap', taskerId: '2', taskerName: 'Priya Singh', taskerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', date: '2023-06-05', status: 'completed', paymentMethod: 'Google Pay', },
  { id: '3', type: 'payment', amount: 700, taskId: '103', taskTitle: 'Install new ceiling fan', taskerId: '3', taskerName: 'Amit Patel', taskerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', date: '2023-05-28', status: 'completed', paymentMethod: 'Paytm Wallet', },
  { id: '4', type: 'refund', amount: 300, taskId: '104', taskTitle: 'Garden maintenance', taskerId: '1', taskerName: 'Rajesh Kumar', taskerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80', date: '2023-05-20', status: 'completed', paymentMethod: 'HDFC Credit Card', },
];

type Transaction = typeof mockTransactions[0];

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = dynamicStyles(colors, originalTheme);

  const [transactions, setTransactions] = useState(mockTransactions);
  const [filterActive, setFilterActive] = useState(false);

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
      headerRight: () => (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => { /* Date picker logic */ }}>
            <Calendar size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, filterActive && styles.headerButtonActive]}
            onPress={() => setFilterActive(!filterActive)}
          >
            <Filter size={20} color={filterActive ? colors.primary : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => { /* Download logic */ }}>
            <Download size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, colors, filterActive, styles.headerButton, styles.headerButtonActive, styles.headerActions]); // Added dependencies

  const totalSpent = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRefunded = transactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('Credit') || method.includes('Debit')) {
      return <CreditCard size={16} color={colors.subtext} />;
    } else {
      return <Wallet size={16} color={colors.subtext} />;
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => router.push(`/task/${item.taskId}`)} // Assuming task details page exists
      activeOpacity={0.7}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <Image
            source={{ uri: item.taskerAvatar }}
            style={styles.taskerAvatar}
          />
          <View style={styles.transactionInfo}>
            <Text style={styles.taskTitle} numberOfLines={1}>{item.taskTitle}</Text>
            <Text style={styles.taskerName}>{item.taskerName}</Text>
            <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text 
            style={[
              styles.transactionAmount,
              item.type === 'refund' ? styles.refundAmount : styles.paymentAmount
            ]}
          >
            {item.type === 'refund' ? '+' : '-'}₹{item.amount}
          </Text>
          <View 
            style={[
              styles.statusBadge,
              item.status === 'completed' ? styles.completedBadge : styles.pendingBadge
            ]}
          >
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.transactionFooter}>
        <View style={styles.paymentMethodContainer}>
          {getPaymentMethodIcon(item.paymentMethod)}
          <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
        </View>
        <View 
          style={[
            styles.transactionTypeBadge,
            item.type === 'refund' ? styles.refundBadge : styles.paymentBadge
          ]}
        >
          {item.type === 'refund' 
            ? <ArrowDown size={12} color={colors.success} /> 
            : <ArrowUp size={12} color={colors.primary} />
          }
          <Text 
            style={[
              styles.transactionTypeText,
              item.type === 'refund' ? styles.refundText : styles.paymentText
            ]}
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Stack.Screen options are now set dynamically via useEffect */}
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={styles.summaryValue}>₹{totalSpent}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Refunded</Text>
            <Text style={[styles.summaryValue, styles.refundValue]}>₹{totalRefunded}</Text>
          </View>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransactionItem}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CreditCard size={60} color={colors.subtext} />
              <Text style={styles.emptyTitle}>No Transactions</Text>
              <Text style={styles.emptyText}>
                You haven't made any transactions yet.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const dynamicStyles = (colors: ReturnType<typeof useTheme>['colors'], currentTheme: typeof originalTheme) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerButton: { // Layout only
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    headerButtonActive: {
      backgroundColor: colors.highlight,
    },
    headerActions: {
      flexDirection: 'row',
    },
    summaryContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginHorizontal: currentTheme.spacing.l,
      marginTop: currentTheme.spacing.l,
      padding: currentTheme.spacing.l,
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryLabel: {
      ...currentTheme.typography.bodySmall,
      color: colors.subtext,
      marginBottom: currentTheme.spacing.xs,
    },
    summaryValue: {
      ...currentTheme.typography.h3,
      color: colors.primary,
    },
    refundValue: {
      color: colors.success,
    },
    summaryDivider: {
      width: 1,
      height: '80%',
      backgroundColor: colors.border,
      alignSelf: 'center',
    },
    transactionsList: {
      padding: currentTheme.spacing.l,
      paddingBottom: currentTheme.spacing.xxl,
    },
    transactionCard: {
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.m,
      marginBottom: currentTheme.spacing.m,
      shadowColor: currentTheme.colors.common.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    transactionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: currentTheme.spacing.m,
    },
    transactionLeft: {
      flexDirection: 'row',
      flex: 1, // Allow this to take space
      marginRight: currentTheme.spacing.s, // Add some space before amount
    },
    taskerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: currentTheme.spacing.m,
    },
    transactionInfo: {
      flex: 1, // Allow text to shrink if needed
    },
    taskTitle: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text, // Added
      marginBottom: 2,
    },
    taskerName: {
      ...currentTheme.typography.bodySmall,
      color: colors.text, // Added
      marginBottom: 2,
    },
    transactionDate: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
    },
    transactionRight: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      marginBottom: 4,
    },
    paymentAmount: {
      color: colors.primary,
    },
    refundAmount: {
      color: colors.success,
    },
    statusBadge: {
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 2,
      borderRadius: currentTheme.radius.s,
    },
    completedBadge: {
      backgroundColor: colors.success + '20',
    },
    pendingBadge: { // Example if you have pending status
      backgroundColor: colors.warning + '20',
    },
    statusText: {
      ...currentTheme.typography.caption,
      fontWeight: '600',
      color: colors.text, // Updated (text on badge should be themed)
    },
    transactionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: currentTheme.spacing.m,
    },
    paymentMethodContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    paymentMethodText: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
      marginLeft: currentTheme.spacing.xs,
    },
    transactionTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: currentTheme.spacing.s,
      paddingVertical: 4,
      borderRadius: currentTheme.radius.s,
    },
    paymentBadge: {
      backgroundColor: colors.primary + '20',
    },
    refundBadge: {
      backgroundColor: colors.success + '20',
    },
    transactionTypeText: {
      ...currentTheme.typography.caption,
      fontWeight: '600',
      marginLeft: 4,
    },
    paymentText: {
      color: colors.primary,
    },
    refundText: {
      color: colors.success,
    },
    emptyContainer: {
      alignItems: 'center',
      padding: currentTheme.spacing.xl,
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      marginTop: currentTheme.spacing.l, // Added to separate from summary
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
  });

export default TransactionsScreen;
