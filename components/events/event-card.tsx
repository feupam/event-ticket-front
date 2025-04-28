"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { formatCurrency, formatDate, getEventAvailabilityStatus } from '@/lib/utils';
import { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const availabilityStatus = getEventAvailabilityStatus(event);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200"
    >
      <Link href={`/eventos/${event.slug}`} className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
          availabilityStatus.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
          availabilityStatus.status === 'limited' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
          availabilityStatus.status === 'sold_out' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
          'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        }`}>
          {availabilityStatus.text}
        </div>
      </Link>
      
      <div className="flex flex-col p-4 space-y-2 flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary/90">{event.category}</p>
            <h3 className="text-lg font-semibold line-clamp-2 mt-1">{event.title}</h3>
          </div>
          <p className="text-base font-bold">{formatCurrency(event.price, event.currency)}</p>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-grow">{event.shortDescription}</p>
        
        <div className="flex flex-col space-y-2 mt-2 text-sm text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.venue}, {event.location}</span>
          </div>
        </div>
      </div>
      
      <Link
        href={`/eventos/${event.slug}`}
        className="mt-2 flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-center transition-colors bg-secondary hover:bg-secondary/80 border-t border-border"
      >
        {availabilityStatus.status === 'waiting_room' 
          ? 'Enter Waiting Room' 
          : availabilityStatus.status === 'sold_out' 
            ? 'Join Waitlist' 
            : 'View Details'}
      </Link>
    </motion.div>
  );
}