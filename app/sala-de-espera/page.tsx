"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SAMPLE_EVENTS } from '@/lib/constants';
import { Event } from '@/lib/types';
import WaitingRoom from '@/components/waiting-room/waiting-room';

export default function WaitingRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('event');
  const [event, setEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    if (!eventSlug) {
      router.push('/eventos');
      return;
    }
    
    const foundEvent = SAMPLE_EVENTS.find(e => e.slug === eventSlug);
    
    if (!foundEvent) {
      router.push('/eventos');
      return;
    }
    
    setEvent(foundEvent);
  }, [eventSlug, router]);
  
  if (!event) {
    return null; // Loading state (will redirect if no event is found)
  }
  
  return <WaitingRoom event={event} />;
}