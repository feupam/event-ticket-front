'use client';

import React, { useEffect, useState } from 'react';
import BackgroundCarousel from '@/components/countdown/BackgroundCarousel';
import EventSection from '@/components/countdown/EventSection';
import { api } from '@/services/api';
import { useEvents } from '@/hooks/useEvents';
import YouTubeAudioPlayer from '@/components/media/YouTubeAudioPlayer';

const carouselImages = [
  '/images/carousel/bg%20(1).jpeg',
  '/images/carousel/bg%20(2).jpeg',
  '/images/carousel/bg%20(3).jpeg',
  '/images/carousel/bg%20(4).jpeg',
  '/images/carousel/bg%20(5).jpeg',
  '/images/carousel/bg%20(6).jpeg',
  '/images/carousel/bg%20(7).jpeg',
  '/images/carousel/bg%20(8).jpeg',
  '/images/carousel/bg%20(9).jpeg',
];

interface CountdownPageProps {
  params: {
    uuid: string;
  };
}

export default function CountdownStandalone({ params }: CountdownPageProps) {
  const { uuid } = params;
  const { events, loading: eventsLoading, getEventByUuid } = useEvents();
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await api.get(`/events/${uuid}/event-status`);
        setCurrentDate(response.data.currentDate);
      } catch (err) {
        setError('Não foi possível carregar os dados do evento');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [uuid]);

  // Aguarda o carregamento dos eventos
  if (eventsLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  const event = getEventByUuid(uuid);
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-500">Evento não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <YouTubeAudioPlayer videoId="PmP6LiFUmTw?si=BjteJbACehuVIvnx" autoplay />
      <BackgroundCarousel images={carouselImages} transitionTime={6000} />
      <div className="w-full max-w-2xl p-8 z-10">
        <div className="flex flex-col items-center justify-center">
          {error && (
            <p className="text-red-500">
              {error}
              <br />
              <p>Ocorreu um erro ao carregar os dados do evento. Por favor, tente novamente mais tarde.</p>
            </p>
          )}
          {event && currentDate && (
            <EventSection
              eventName={event.name}
              eventDescription={event.eventType}
              eventDate={`${new Date(event.startDate).toLocaleDateString('pt-BR')} a ${new Date(event.endDate).toLocaleDateString('pt-BR')}`}
              eventLocation={event.location}
              currentDate={currentDate}
              startDate={event.startDate}
            />
          )}
        </div>
      </div>
    </div>
  );
} 