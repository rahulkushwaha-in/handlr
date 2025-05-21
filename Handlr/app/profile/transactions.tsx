import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Image
} from 'react-native';
import { router, Stack } from 'expo-router';
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
import theme from '@/constants/theme';

// Mock transactions data
const mockTransactions = [
  {
    id: '1',
    type: 'payment',
    amount: 1500,
    taskId: '101',
    taskTitle: 'Deep cleaning of 2BHK apartment',
    taskerId: '1',
    taskerName: 'Rajesh Kumar',
    taskerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    date: '2023-06-10',
    status: 'completed',
    paymentMethod: 'HDFC Credit Card',
  },
  {
    id: '2',
    type: 'payment',
    amount: 500,
    taskId: '102',
    taskTitle: 'Fix leaking bathroom tap',
    taskerId: '2',
    taskerName: 'Priya Singh',
    taskerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    date: '2023-06-05',
    status: 'completed',
    paymentMethod: 'Google Pay',
  },
  {
    id: '3',
    type: 'payment',
    amount: 700,
    taskId: '103',
    taskTitle: 'Install new ceiling fan',
    taskerId: '3',
    taskerName: 'Amit Patel',
    taskerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    date: '2023-05-28',
    status: 'completed',
    paymentMethod: 'Paytm Wallet',
  },
  {
    id: '4',
    type: 'refund',
    amount: 300,
    taskId: '104',
    taskTitle: 'Garden maintenance',
    taskerId: '1',
    taskerName: 'Rajesh Kumar',
    taskerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    date: '2023-05-20',
    status: 'completed',
    paymentMethod: 'HDFC Credit Card',
  },
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filterActive, setFilterActive] = useState(false);

  const totalSpent = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalRefunded = transactions
    .filter(t => t.type === 'refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('Credit') || method.includes('Debit')) {
      return <CreditCard size={16} color={theme.colors.light.subtext} />;
    } else {
      return <Wallet size={16} color={theme.colors.light.subtext} />;
    }
  };

  const renderTransactionItem = ({ item }: { item: typeof mockTransactions[0] }) => (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => router.push(`/task/${item.taskId}`)}
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
            <Text style={styles.transactionDate}>{item.date}</Text>
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
            ? <ArrowDown size={12} color={theme.colors.light.success} /> 
            : <ArrowUp size={12} color={theme.colors.light.primary} />
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
      <Stack.Screen 
        options={{
          title: 'Transaction History',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={theme.colors.light.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => {}}
              >
                <Calendar size={20} color={theme.colors.light.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.headerButton,
                  filterActive && styles.headerButtonActive
                ]}
                onPress={() => setFilterActive(!filterActive)}
              >
                <Filter size={20} color={filterActive ? theme.colors.light.primary : theme.colors.light.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => {}}
              >
                <Download size={20} color={theme.colors.light.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
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
              <CreditCard size={60} color={theme.colors.light.subtext} />
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
    marginHorizontal: 4,
  },
  headerButtonActive: {
    backgroundColor: theme.colors.light.highlight,
  },
  headerActions: {
    flexDirection: 'row',
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginHorizontal: theme.spacing.l,
    marginTop: theme.spacing.l,
    padding: theme.spacing.l,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.light.subtext,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    ...theme.typography.h3,
    color: theme.colors.light.primary,
  },
  refundValue: {
    color: theme.colors.light.success,
  },
  summaryDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.light.border,
    alignSelf: 'center',
  },
  transactionsList: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.xxl,
  },
  transactionCard: {
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    shadowColor: theme.colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  transactionLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  taskerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.m,
  },
  transactionInfo: {
    flex: 1,
  },
  taskTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  taskerName: {
    ...theme.typography.bodySmall,
    marginBottom: 2,
  },
  transactionDate: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentAmount: {
    color: theme.colors.light.primary,
  },
  refundAmount: {
    color: theme.colors.light.success,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.radius.s,
  },
  completedBadge: {
    backgroundColor: theme.colors.light.success + '20',
  },
  pendingBadge: {
    backgroundColor: theme.colors.light.warning + '20',
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.light.text,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.light.border,
    paddingTop: theme.spacing.m,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    ...theme.typography.caption,
    color: theme.colors.light.subtext,
    marginLeft: theme.spacing.xs,
  },
  transactionTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.radius.s,
  },
  paymentBadge: {
    backgroundColor: theme.colors.light.primary + '20',
  },
  refundBadge: {
    backgroundColor: theme.colors.light.success + '20',
  },
  transactionTypeText: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginLeft: 4,
  },
  paymentText: {
    color: theme.colors.light.primary,
  },
  refundText: {
    color: theme.colors.light.success,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.light.card,
    borderRadius: theme.radius.l,
    marginTop: theme.spacing.l,
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
});