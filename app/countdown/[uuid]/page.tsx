'use client';

import React, { useEffect, useState, useMemo } from 'react';
import BackgroundCarousel from '@/components/countdown/BackgroundCarousel';
import EventSection from '@/components/countdown/EventSection';
import EventCarousel from '@/components/countdown/EventCarousel';
import { api } from '@/services/api';
import { useEvents } from '@/hooks/useEvents';


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
  const { events, loading: eventsLoading, getEventByUuid } = useEvents();
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);

  // Mock events data - você pode substituir isso com dados reais da sua API
  const mockEvents = useMemo(() => {
    const event = getEventByUuid(uuid);
    return [
      {
        id: 1,
        name: "FederaAcamps",
        description: "O acampamento mais esperado do ano, com os convidados Andreia Vargas, Pr. Daniel Simoncelos e Miquéias Medeiros.",
        date: "18 a 22 de Junho",
        location: event?.location || "Local a definir",
        startDate: event?.startDate || "2025-06-18",
      },
      {
        id: 2,
        name: "Federa Kids",
        description: "Uma experiência exclusiva com programação especial e atividades extras.",
        date: "25 a 29 de Junho",
        location: "Campo do Sol",
        startDate: "2025-06-25",
      },
      {
        id: 3,
        name: "Federa Juniores",
        description: "Acampamento especial para crianças com muita diversão e aprendizado.",
        date: "2 a 6 de Julho",
        location: "Acampamento Feliz",
        startDate: "2025-07-02",
      },
      {
        id: 4,
        name: "Federa Lideres",
        description: "Edição especial para jovens com música, esportes e muito mais.",
        date: "9 a 13 de Julho",
        location: "Campo Alegre",
        startDate: "2025-07-09",
      },
    ];
  }, [uuid, getEventByUuid]);

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
      <BackgroundCarousel images={carouselImages} transitionTime={6000} />
      <div className="w-full max-w-5xl p-8 z-10">
        <div className="flex flex-col items-center justify-center">
          {error && (
            <p className="text-red-500">
              {error}
              <br />
              <p>Ocorreu um erro ao carregar os dados do evento. Por favor, tente novamente mais tarde.</p>
            </p>
          )}
          {currentDate && (
            <EventCarousel
              currentDate={currentDate}
              events={mockEvents}
              onEventSelect={setSelectedEventIndex}
              selectedIndex={selectedEventIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
} 