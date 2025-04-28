import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Event, QueueStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function getTimeRemaining(targetDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = new Date(targetDate).getTime() - new Date().getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function formatWaitTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than a minute';
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

export function getEventAvailabilityStatus(event: Event): {
  status: 'available' | 'limited' | 'sold_out' | 'waiting_room';
  text: string;
} {
  const now = new Date();
  
  // Check if waiting room is open
  if (event.waitingRoomOpens && new Date(event.waitingRoomOpens) <= now && 
      event.salesStart && new Date(event.salesStart) > now) {
    return {
      status: 'waiting_room',
      text: 'Waiting Room Open'
    };
  }
  
  if (event.availability === 0) {
    return {
      status: 'sold_out',
      text: 'Sold Out'
    };
  }
  
  if (event.availability < 50) {
    return {
      status: 'limited',
      text: 'Limited Tickets'
    };
  }
  
  return {
    status: 'available',
    text: 'Available'
  };
}

// Mock function to simulate generated queue statuses
export function generateMockQueueStatus(eventId: string, userId: string): QueueStatus {
  // Simulate different positions and wait times
  const position = Math.floor(Math.random() * 5000) + 1;
  const estimatedWaitTime = Math.ceil(position / 10); // Rough estimate: 10 people per minute
  
  return {
    position,
    estimatedWaitTime,
    totalAhead: position - 1,
    eventId,
    updated: new Date().toISOString()
  };
}