"use client";

import { useRouter } from 'next/navigation';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';
import { Ticket, MapPin, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AnimatedBackground from '@/components/ui/animated-background';
import PaymentForm from '@/components/checkout/payment-form';
import { NotificationToast, NotificationToastRef } from '@/components/notifications/notification-toast';
import { useRef } from 'react';

interface CheckoutClientProps {
  event: Event;
}

export default function CheckoutClient({ event }: CheckoutClientProps) {
  const router = useRouter();
  const notificationRef = useRef<NotificationToastRef>(null);

  const handlePaymentSubmit = async (data: any) => {
    try {
      // Aqui você implementaria a lógica de pagamento
      // Por enquanto, apenas simulamos um sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notificationRef.current?.showNotification(
        'Pagamento realizado com sucesso! Seu ingresso foi enviado para seu e-mail.',
        'success'
      );
      
      router.push('/conta/ingressos');
    } catch (error) {
      notificationRef.current?.showNotification(
        'Erro ao processar pagamento. Por favor, tente novamente.',
        'error'
      );
    }
  };

  return (
    <AnimatedBackground className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informações do Evento */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{event.title}</h2>
                    <p className="text-sm text-muted-foreground">{event.shortDescription}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Valor do Ingresso</span>
                    <span className="font-semibold">{formatCurrency(event.price, event.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Formulário de Pagamento */}
              <PaymentForm event={event} onSubmit={handlePaymentSubmit} />
            </div>
          </div>
        </motion.div>
      </div>
      <NotificationToast ref={notificationRef} />
    </AnimatedBackground>
  );
} 