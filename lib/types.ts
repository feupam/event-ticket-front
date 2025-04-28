export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  category: string;
  image: string;
  price: number;
  currency: string;
  availability: number;
  isHighDemand: boolean;
  waitingRoomOpens?: string; // ISO date string
  salesStart?: string; // ISO date string
}

export interface EventFilters {
  date?: string;
  location?: string;
  category?: string;
}

export interface QueueStatus {
  position: number;
  estimatedWaitTime: number; // in minutes
  totalAhead: number;
  eventId: string;
  updated: string; // ISO date string
}

export interface WaitingRoomStatus {
  eventId: string;
  salesStart: string; // ISO date string
  currentTime: string; // ISO date string
  isOpen: boolean;
  message?: string;
}

export interface User {
  id: string;
  token: string;
}