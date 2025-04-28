"use client";

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Event } from '@/lib/types';
import { NotificationToast, NotificationToastRef } from '@/components/notifications/notification-toast';
import EventHeader from '@/components/events/event-header';
import EventInfo from '@/components/events/event-info';
import EventDescription from '@/components/events/event-description';
import EventBookingCard from '@/components/events/event-booking-card';

interface EventDetailsProps {
  event: Event;
}

export default function EventDetails({ event }: EventDetailsProps) {
  const notificationRef = useRef<NotificationToastRef>(null);
  
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EventHeader event={event} />
              <EventInfo event={event} />
              <EventDescription event={event} />
            </motion.div>
          </div>
          
          <div>
            <EventBookingCard event={event} notificationRef={notificationRef} />
          </div>
        </div>
      </div>
      
      <NotificationToast ref={notificationRef} />
    </>
  );
}