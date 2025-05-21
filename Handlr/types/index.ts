export type UserRole = 'user' | 'tasker';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: string;
}

export interface Tasker extends User {
  role: 'tasker';
  bio: string;
  skills: string[];
  categories: string[];
  experience: number; // in years
  rating: number;
  totalReviews: number;
  verified: boolean;
  hourlyRate: number;
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  date: string;
  time: {
    start: string;
    end?: string;
  };
  userId: string;
  taskerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Review {
  id: string;
  taskId: string;
  userId: string;
  taskerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}