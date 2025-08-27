'use client';

import React, { useEffect, useState } from 'react';
import BackgroundCarousel from '@/components/countdown/BackgroundCarousel';
import EventCarousel from '@/components/countdown/EventCarousel';
import { eventService, EventData } from '@/services/eventService';

const carouselImages = [
  'https://federa-acamps.pages.dev/images/carousel/bg%20(1).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(2).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(3).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(4).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(5).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(6).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(7).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(8).jpeg',
  'https://federa-acamps.pages.dev/images/carousel/bg%20(9).jpeg',
];

interface CountdownPageProps {
  params: {
    uuid: string;
  };
}

export default function CountdownStandalone({ params }: CountdownPageProps) {
  const { uuid } = params;
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await eventService.getEventStatus(uuid);
        console.log("API response:", response);

        setCurrentDate(response.currentDate || null);
        setEvents(response.events ?? []);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os dados do evento');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [uuid]);

  // loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  // erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // caso não tenha eventos
  if (events.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-yellow-500">Nenhum evento disponível</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <BackgroundCarousel images={carouselImages} transitionTime={6000} overlayOpacity="bg-black/30" />
      <div className="w-full max-w-5xl p-8 z-10">
        <div className="flex flex-col items-center justify-center">
          {currentDate && (
            <EventCarousel
              currentDate={currentDate}
              events={events.map(event => ({
                ...event,
                description: event.description ?? "",
              }))}
              onEventSelect={setSelectedEventIndex}
              selectedIndex={selectedEventIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
}
