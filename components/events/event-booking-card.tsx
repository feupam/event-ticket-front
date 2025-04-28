"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Ticket, Share2 } from 'lucide-react';
import { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, getEventAvailabilityStatus } from '@/lib/utils';
import { NotificationToastRef } from '@/components/notifications/notification-toast';

interface EventBookingCardProps {
  event: Event;
  notificationRef: React.RefObject<NotificationToastRef>;
}

export default function EventBookingCard({ event, notificationRef }: EventBookingCardProps) {
  const router = useRouter();
  const availabilityStatus = getEventAvailabilityStatus(event);
  
  const handleAction = () => {
    if (availabilityStatus.status === 'waiting_room') {
      router.push(`/sala-de-espera?event=${event.slug}`);
    } else if (availabilityStatus.status === 'sold_out') {
      notificationRef.current?.showNotification(
        'Você foi adicionado à lista de espera. Avisaremos quando houver ingressos disponíveis.',
        'success'
      );
    } else {
      router.push(`/checkout/${event.slug}`);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        notificationRef.current?.showNotification('Link copiado para a área de transferência!', 'success');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      notificationRef.current?.showNotification('Link copiado para a área de transferência!', 'success');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-lg border border-border p-6 shadow-sm sticky top-24"
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Ingressos</h2>
        <span className="text-2xl font-bold">{formatCurrency(event.price, event.currency)}</span>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className={`font-medium ${
            availabilityStatus.status === 'available' ? 'text-green-600 dark:text-green-400' :
            availabilityStatus.status === 'limited' ? 'text-amber-600 dark:text-amber-400' :
            availabilityStatus.status === 'sold_out' ? 'text-red-600 dark:text-red-400' :
            'text-purple-600 dark:text-purple-400'
          }`}>
            {availabilityStatus.text}
          </span>
        </div>
        
        {event.isHighDemand && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Início das Vendas</span>
            <span className="font-medium">
              {event.salesStart 
                ? new Date(event.salesStart).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })
                : 'Em breve'
              }
            </span>
          </div>
        )}
        
        {availabilityStatus.status !== 'sold_out' && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Disponível</span>
            <span className="font-medium flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {event.availability > 100 
                ? '100+' 
                : event.availability}
            </span>
          </div>
        )}
      </div>
      
      <Button
        onClick={handleAction}
        className="w-full mb-4"
        size="lg"
        disabled={availabilityStatus.status === 'sold_out' && event.isHighDemand === false}
      >
        <Ticket className="mr-2 h-5 w-5" />
        {availabilityStatus.status === 'waiting_room' 
          ? 'Entrar na Sala de Espera' 
          : availabilityStatus.status === 'sold_out' 
            ? 'Entrar na Lista de Espera' 
            : 'Comprar Ingressos'}
      </Button>
      
      <Button
        variant="outline"
        onClick={handleShare}
        className="w-full"
      >
        <Share2 className="mr-2 h-5 w-5" />
        Compartilhar Evento
      </Button>
    </motion.div>
  );
}