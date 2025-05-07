"use client";

import { AlertTriangle } from 'lucide-react';
import { Event } from '@/types/event';
import { Separator } from '@/components/ui/separator';

interface EventDescriptionProps {
  event: Event;
}

export default function EventDescription({ event }: EventDescriptionProps) {
  return (
    <>
      <Separator className="my-6" />
      
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">Sobre este Evento</h2>
        <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
      </div>
      
      {event.isHighDemand && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Evento de Alta Demanda</h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                <p>
                  Este é um evento de alta demanda. A sala de espera abrirá {event.waitingRoomOpens && event.salesStart 
                    ? `${new Date(event.waitingRoomOpens).toLocaleTimeString()} em ${new Date(event.waitingRoomOpens).toLocaleDateString()}`
                    : 'antes do início das vendas'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}