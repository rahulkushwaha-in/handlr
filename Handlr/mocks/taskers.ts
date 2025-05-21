import { Tasker } from '@/types';

export const taskers: Tasker[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+919876543210',
    email: 'rajesh@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    role: 'tasker' as const,
    bio: 'Professional cleaner with 5 years of experience. I specialize in deep cleaning and sanitization services.',
    skills: ['Deep Cleaning', 'Sanitization', 'Window Cleaning', 'Floor Polishing'],
    categories: ['1'], // Cleaning
    experience: 5,
    rating: 4.8,
    totalReviews: 124,
    verified: true,
    hourlyRate: 300, // in INR
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: {
        start: '09:00',
        end: '18:00',
      },
    },
    location: {
      address: 'Indiranagar, Bangalore',
      coordinates: {
        latitude: 12.9784,
        longitude: 77.6408,
      },
    },
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Priya Singh',
    phone: '+919876543211',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    role: 'tasker' as const,
    bio: 'Experienced plumber specializing in pipe repairs and installations. Available for emergency services.',
    skills: ['Pipe Repairs', 'Installations', 'Leak Detection', 'Bathroom Fixtures'],
    categories: ['2'], // Plumbing
    experience: 7,
    rating: 4.9,
    totalReviews: 89,
    verified: true,
    hourlyRate: 450, // in INR
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: {
        start: '08:00',
        end: '20:00',
      },
    },
    location: {
      address: 'Koramangala, Bangalore',
      coordinates: {
        latitude: 12.9352,
        longitude: 77.6245,
      },
    },
    createdAt: '2023-02-10T14:15:00Z',
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '+919876543212',
    email: 'amit@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    role: 'tasker' as const,
    bio: 'Certified electrician with expertise in home electrical systems. Safety is my top priority.',
    skills: ['Electrical Repairs', 'Wiring', 'Installation', 'Troubleshooting'],
    categories: ['3'], // Electrician
    experience: 8,
    rating: 4.7,
    totalReviews: 156,
    verified: true,
    hourlyRate: 500, // in INR
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: {
        start: '09:00',
        end: '19:00',
      },
    },
    location: {
      address: 'HSR Layout, Bangalore',
      coordinates: {
        latitude: 12.9116,
        longitude: 77.6741,
      },
    },
    createdAt: '2022-11-05T09:45:00Z',
  },
  {
    id: '4',
    name: 'Sunita Sharma',
    phone: '+919876543213',
    email: 'sunita@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    role: 'tasker' as const,
    bio: 'Professional painter with an eye for detail. I can transform your space with quality painting services.',
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Texturing', 'Color Consultation'],
    categories: ['5'], // Painting
    experience: 6,
    rating: 4.6,
    totalReviews: 78,
    verified: true,
    hourlyRate: 350, // in INR
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      hours: {
        start: '10:00',
        end: '18:00',
      },
    },
    location: {
      address: 'Whitefield, Bangalore',
      coordinates: {
        latitude: 12.9698,
        longitude: 77.7499,
      },
    },
    createdAt: '2023-03-20T11:30:00Z',
  },
  {
    id: '5',
    name: 'Vikram Reddy',
    phone: '+919876543214',
    email: 'vikram@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    role: 'tasker' as const,
    bio: 'Experienced carpenter specializing in furniture assembly and repairs. Quality craftsmanship guaranteed.',
    skills: ['Furniture Assembly', 'Repairs', 'Custom Woodwork', 'Cabinet Installation'],
    categories: ['4'], // Carpentry
    experience: 9,
    rating: 4.9,
    totalReviews: 112,
    verified: true,
    hourlyRate: 450, // in INR
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: {
        start: '09:00',
        end: '17:00',
      },
    },
    location: {
      address: 'JP Nagar, Bangalore',
      coordinates: {
        latitude: 12.9121,
        longitude: 77.5929,
      },
    },
    createdAt: '2022-12-15T13:20:00Z',
  },
];