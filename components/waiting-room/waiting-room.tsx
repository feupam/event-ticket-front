"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getTimeRemaining } from '@/lib/utils';
import { Event } from '@/lib/types';
import AnimatedBackground from '@/components/ui/animated-background';
import { Ticket, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WaitingRoomProps {
  event: Event;
}

export default function WaitingRoom({ event }: WaitingRoomProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isPulsing, setIsPulsing] = useState(false);
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  // Simulate waiting room states
  useEffect(() => {
    if (!event.salesStart) return;
    
    const timer = setInterval(() => {
      const timeRemaining = getTimeRemaining(event.salesStart!);
      setCountdown(timeRemaining);
      
      // When time is up, redirect to queue
      if (timeRemaining.total <= 0) {
        clearInterval(timer);
        setMessage('Sales have started! Redirecting to queue...');
        
        setTimeout(() => {
          router.push(`/fila?event=${event.uuid}`);
        }, 3000);
      }
      
      // Add messaging at specific times
      if (timeRemaining.total > 0 && timeRemaining.total <= 60000) { // Last minute
        setMessage('Almost there! Sales starting in less than a minute.');
        setIsPulsing(true);
      } else if (timeRemaining.total > 0 && timeRemaining.total <= 300000) { // Last 5 minutes
        setMessage('Sales starting soon! Please stay on this page.');
        setIsPulsing(timeRemaining.seconds % 2 === 0);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [event.salesStart, router, event.uuid]);
  
  const handleSalesStart = () => {
    setIsReady(true);
    router.push(`/fila?event=${event.uuid}`);
  };
  
  return (
    <AnimatedBackground intensity="medium" speed="medium" className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
        >
          <div className="relative h-40 sm:h-60 overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-center px-4 drop-shadow-sm">
                Waiting Room: {event.title}
              </h1>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center space-x-2 text-lg text-primary font-medium">
              <Clock className="h-5 w-5" />
              <span>Sales begin in:</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 p-2">
              {[
                { label: 'Days', value: countdown.days },
                { label: 'Hours', value: countdown.hours },
                { label: 'Minutes', value: countdown.minutes },
                { label: 'Seconds', value: countdown.seconds },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="text-2xl sm:text-4xl font-bold bg-muted rounded-md w-full py-2 text-center">
                    {item.value < 10 ? `0${item.value}` : item.value}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-1">{item.label}</span>
                </div>
              ))}
            </div>
            
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-md p-4 text-center ${
                    isPulsing 
                      ? 'bg-primary/10 text-primary animate-pulse' 
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm sm:text-base font-medium">{message}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4 bg-muted/50 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Do not refresh this page</p>
                  <p className="text-muted-foreground">Refreshing will cause you to lose your place in line.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Ticket className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Prepare your information</p>
                  <p className="text-muted-foreground">Have your payment details ready to complete your purchase quickly.</p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.push(`/eventos/${event.uuid}`)}
              className="w-full"
            >
              Return to Event Details
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}