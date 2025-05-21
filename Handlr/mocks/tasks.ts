import { Task } from '@/types';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Deep cleaning of 2BHK apartment',
    description: 'Need thorough cleaning of my 2BHK apartment including kitchen, bathrooms, and balcony. All cleaning supplies will be provided.',
    category: '1', // Cleaning
    status: 'pending' as const,
    price: 1500,
    location: {
      address: 'Indiranagar, Bangalore',
      coordinates: {
        latitude: 12.9784,
        longitude: 77.6408,
      },
    },
    date: '2023-06-15',
    time: {
      start: '10:00',
      end: '14:00',
    },
    userId: 'user1',
    createdAt: '2023-06-10T09:30:00Z',
    updatedAt: '2023-06-10T09:30:00Z',
  },
  {
    id: '2',
    title: 'Fix leaking bathroom tap',
    description: 'The bathroom tap is leaking continuously. Need a plumber to fix it as soon as possible.',
    category: '2', // Plumbing
    status: 'accepted' as const,
    price: 500,
    location: {
      address: 'Koramangala, Bangalore',
      coordinates: {
        latitude: 12.9352,
        longitude: 77.6245,
      },
    },
    date: '2023-06-12',
    time: {
      start: '11:00',
      end: '12:00',
    },
    userId: 'user1',
    taskerId: '2', // Priya Singh
    createdAt: '2023-06-09T14:15:00Z',
    updatedAt: '2023-06-09T15:30:00Z',
  },
  {
    id: '3',
    title: 'Install new ceiling fan',
    description: 'Need to install a new ceiling fan in the living room. I have purchased the fan already.',
    category: '3', // Electrician
    status: 'completed' as const,
    price: 700,
    location: {
      address: 'HSR Layout, Bangalore',
      coordinates: {
        latitude: 12.9116,
        longitude: 77.6741,
      },
    },
    date: '2023-06-08',
    time: {
      start: '15:00',
      end: '16:30',
    },
    userId: 'user1',
    taskerId: '3', // Amit Patel
    createdAt: '2023-06-05T10:45:00Z',
    updatedAt: '2023-06-08T16:45:00Z',
  },
];