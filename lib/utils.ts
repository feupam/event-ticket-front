import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Event } from '@/types/event';
import { QueueStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency
  }).format(value);
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
  if (minutes < 1) return 'menos de 1 minuto';
  if (minutes === 1) return '1 minuto';
  if (minutes < 60) return `${minutes} minutos`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 1) {
    if (remainingMinutes === 0) return '1 hora';
    if (remainingMinutes === 1) return '1 hora e 1 minuto';
    return `1 hora e ${remainingMinutes} minutos`;
  }
  
  if (remainingMinutes === 0) return `${hours} horas`;
  if (remainingMinutes === 1) return `${hours} horas e 1 minuto`;
  return `${hours} horas e ${remainingMinutes} minutos`;
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
      text: 'Sala de espera aberta'
    };
  }
  
  if (event.availability !== undefined && event.availability === 0) {
    return {
      status: 'sold_out',
      text: 'Esgotado'
    };
  }
  
  if (event.availability !== undefined && event.availability < 50) {
    return {
      status: 'limited',
      text: 'Últimos ingressos'
    };
  }
  
  return {
    status: 'available',
    text: 'Disponível'
  };
}

// Mock function to simulate generated queue statuses
export function generateMockQueueStatus(eventUuid: string): QueueStatus {
  // Simulate different positions and wait times
  const position = Math.floor(Math.random() * 5000) + 1;
  const estimatedWaitTime = Math.ceil(position / 10); // Rough estimate: 10 people per minute
  
  return {
    position,
    estimatedWaitTime,
    totalAhead: position - 1,
    updated: new Date().toISOString()
  };
}