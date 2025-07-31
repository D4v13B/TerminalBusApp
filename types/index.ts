export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cedula?: string;
  avatar?: string;
  isVerified: boolean;
  image?: string
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'yappy' | 'nequi' | 'ach';
  lastFour: string;
  brand?: string;
  isDefault: boolean;
}

export interface FrequentPassenger {
  id: string;
  name: string;
  cedula: string;
  relationship: string;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  duration: string;
  distance: string;
  price: number;
  company: string;
}

export interface Schedule {
  id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  busType: 'economico' | 'expres' | 'premium';
  amenities: string[];
}

export interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  type: 'window' | 'aisle' | 'middle';
  price: number;
}

export interface Ticket {
  id: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  seatNumber: string;
  passengerName: string;
  passengerCedula: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  price: number;
  status: 'active' | 'used' | 'cancelled';
  qrCode: string;
  purchaseDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  isRead: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}