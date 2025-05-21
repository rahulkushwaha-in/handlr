import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Mock login function (would connect to backend in real app)
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  updateUserProfile: (updatedUser: User) => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phoneNumber: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would call an API to send OTP
          // For demo, we'll just simulate a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Success - in real app, we'd wait for OTP verification
          set({ isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to send OTP" 
          });
        }
      },

      verifyOtp: async (otp: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would verify the OTP with the backend
          // For demo, we'll just simulate a delay and accept any 4-digit OTP
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (otp.length !== 4) {
            throw new Error("Invalid OTP");
          }
          
          // Mock user data
          const mockUser: User = {
            id: 'user1',
            name: 'Demo User',
            phone: '+919876543200',
            email: 'demo@example.com',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
            role: 'user',
            bio: 'Regular user of TaskRiser looking for quality services.',
            location: {
              address: 'Indiranagar, Bangalore',
              coordinates: {
                latitude: 12.9784,
                longitude: 77.6408,
              }
            },
            createdAt: new Date().toISOString(),
          };
          
          set({ 
            user: mockUser,
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to verify OTP" 
          });
        }
      },

      updateUserProfile: (updatedUser: User) => {
        set({ user: updatedUser });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);