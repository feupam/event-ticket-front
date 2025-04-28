"use client";

import { Calendar, Clock, MapPin } from 'lucide-react';
import { Event } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface EventInfoProps {
  event: Event;
}

export default function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      <div className="flex items-center">
        <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>{formatDate(event.date)}</span>
      </div>
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>{event.time}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
        <span>{event.venue}, {event.location}</span>
      </div>
    </div>
  );
}