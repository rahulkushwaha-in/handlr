import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Keyboard
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Phone, Video, ChevronLeft } from 'lucide-react-native';
import originalTheme from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { taskers } from '@/mocks/taskers';
import { useAuthStore } from '@/store/authStore';

// Define message type
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    receiverId: '1',
    content: "Hi, I'm interested in your cleaning services. Are you available this weekend?",
    timestamp: '2023-06-10T09:00:00Z',
  },
  {
    id: '2',
    senderId: '1',
    receiverId: 'user1',
    content: "Hello! Yes, I'm available on Saturday from 10 AM to 5 PM. What kind of cleaning service do you need?",
    timestamp: '2023-06-10T09:05:00Z',
  },
  {
    id: '3',
    senderId: 'user1',
    receiverId: '1',
    content: "I need a deep cleaning for my 2BHK apartment. How much would you charge?",
    timestamp: '2023-06-10T09:10:00Z',
  },
  {
    id: '4',
    senderId: '1',
    receiverId: 'user1',
    content: "For a 2BHK deep cleaning, it would cost around ₹1500. This includes kitchen, bathrooms, and all rooms. Would you like to book for this Saturday?",
    timestamp: '2023-06-10T09:15:00Z',
  },
  {
    id: '5',
    senderId: 'user1',
    receiverId: '1',
    content: "That sounds good. Yes, I'd like to book for Saturday at 10 AM.",
    timestamp: '2023-06-10T09:20:00Z',
  },
  {
    id: '6',
    senderId: '1',
    receiverId: 'user1',
    content: "Great! I'll be there at 10 AM on Saturday. Please make sure someone is available to let me in. Do you have any specific cleaning products you prefer?",
    timestamp: '2023-06-10T09:25:00Z',
  },
  {
    id: '7',
    senderId: 'user1',
    receiverId: '1',
    content: "No specific preferences. I'll make sure to be home when you arrive.",
    timestamp: '2023-06-10T09:30:00Z',
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const styles = dynamicStyles(colors, originalTheme);
  const [tasker, setTasker] = useState<Tasker | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);
  const user = useAuthStore(state => state.user);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  useEffect(() => {
    // Find tasker by ID
    const foundTasker = taskers.find(t => t.id === id);
    if (foundTasker) {
      setTasker(foundTasker as Tasker);
    }
    
    // Filter messages for this conversation
    const filteredMessages = mockMessages.filter(
      msg => 
        (msg.senderId === 'user1' && msg.receiverId === id) || 
        (msg.senderId === id && msg.receiverId === 'user1')
    );
    
    setMessages(filteredMessages);

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [id]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user1',
      receiverId: typeof id === 'string' ? id : id[0],
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!tasker) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Image source={{ uri: tasker.avatar }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>{tasker.name}</Text>
                <Text style={styles.headerStatus}>Online</Text>
              </View>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={20} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Video size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
          },
        }} 
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.messagesList,
            keyboardVisible && Platform.OS === 'android' && { paddingBottom: keyboardHeight }
          ]}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isUser = item.senderId === 'user1';
            
            return (
              <View style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.otherMessageContainer
              ]}>
                <View style={[
                  styles.messageBubble,
                  isUser ? styles.userMessageBubble : styles.otherMessageBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    isUser ? styles.userMessageText : styles.otherMessageText
                  ]}>
                    {item.content}
                  </Text>
                </View>
                <Text style={styles.messageTime}>
                  {formatTime(item.timestamp)}
                </Text>
              </View>
            );
          }}
        />
        
        <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.subtext}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !newMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={20} color={originalTheme.colors.common.white} />
          </TouchableOpacity>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      color: colors.text,
      ...currentTheme.typography.body,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: currentTheme.spacing.s,
    },
    headerName: {
      ...currentTheme.typography.body,
      fontWeight: '600',
      color: colors.text,
    },
    headerStatus: {
      ...currentTheme.typography.caption,
      color: colors.success,
    },
    headerButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 4,
    },
    headerActions: {
      flexDirection: 'row',
    },
    messagesList: {
      padding: currentTheme.spacing.m,
      paddingBottom: currentTheme.spacing.xl,
    },
    messageContainer: {
      marginBottom: currentTheme.spacing.m,
      maxWidth: '80%',
    },
    userMessageContainer: {
      alignSelf: 'flex-end',
    },
    otherMessageContainer: {
      alignSelf: 'flex-start',
    },
    messageBubble: {
      borderRadius: currentTheme.radius.l,
      padding: currentTheme.spacing.m,
    },
    userMessageBubble: {
      backgroundColor: colors.primary,
    },
    otherMessageBubble: {
      backgroundColor: colors.card,
    },
    messageText: {
      ...currentTheme.typography.body,
    },
    userMessageText: {
      color: currentTheme.colors.common.white,
    },
    otherMessageText: {
      color: colors.text,
    },
    messageTime: {
      ...currentTheme.typography.caption,
      color: colors.subtext,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    inputContainer: {
      flexDirection: 'row',
      padding: currentTheme.spacing.m,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    input: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: currentTheme.radius.l,
      paddingHorizontal: currentTheme.spacing.m,
      paddingVertical: currentTheme.spacing.s,
      maxHeight: 100,
      ...currentTheme.typography.body,
      color: colors.text,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: currentTheme.spacing.m,
    },
    sendButtonDisabled: {
      backgroundColor: colors.inactive,
    },
  });