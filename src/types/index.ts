export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  pricePerHour: number;
  duration?: string;
  priceFormatted?: string;
  originalPrice?: number;
  icon: string;
  emoji: string;
  category: 'social' | 'lifestyle' | 'support' | 'events';
  popular?: boolean;
  tag?: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  tenure: string;
  monthlyEarnings: string;
  quote: string;
  avatarText: string;
  verified: boolean;
  avatarColor: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PricingPlan {
  id: string;
  duration: string;
  regularPrice: number;
  discountedPrice: number;
  popular?: boolean;
  features: string[];
  discountPercentage: string;
}

export interface BookingFormData {
  serviceId: string;
  serviceTitle: string;
  fullName: string;
  phone: string;
  city: string;
  pinCode: string;
  date: string;
  hours: number;
  specialRequests?: string;
}

export interface PartnerFormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  pinCode: string;
  age: string;
  selectedServices: string[];
  availableHoursPerWeek: number;
}

export type UserRole = 'seeker' | 'companion' | null;

export interface SeekerProfile {
  id: string;
  name: string;
  phone: string;
  city: string;
  pinCode: string;
  avatarUrl: string;
  membershipPlan: string;
  subscriptionActive: boolean;
  bookingsCount: number;
}

export interface CompanionProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  pinCode: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  avatarUrl: string;
  badges: string[];
  bio: string;
  verifiedKYC: boolean;
  online: boolean;
  distanceKm: number;
  languages: string[];
  services: string[];
}

export interface BookingRequest {
  id: string;
  seekerName: string;
  seekerPhone: string;
  seekerAvatar?: string;
  serviceTitle: string;
  date: string;
  time: string;
  hours: number;
  location: string;
  pinCode: string;
  totalEarnings: number;
  netPayout: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface BookingContext {
  service?: ServiceItem | string;
  city?: string;
  pinCode?: string;
  companionName?: string;
  companionAvatar?: string;
  companionRate?: number;
}
