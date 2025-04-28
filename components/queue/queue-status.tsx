"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatWaitTime, generateMockQueueStatus } from '@/lib/utils';
import { Event, QueueStatus } from '@/lib/types';
import AnimatedBackground from '@/components/ui/animated-background';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueueStatusProps {
  event: Event;
  initialStatus?: QueueStatus;
}

export default function QueueStatusComponent({ event, initialStatus }: QueueStatusProps) {
  const router = useRouter();
  const [status, setStatus] = useState<QueueStatus | null>(initialStatus || null);
  const [isReady, setIsReady] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minute window to purchase
  
  // Simulate queue status updates
  useEffect(() => {
    if (isReady) return;
    
    // Initial status if not provided
    if (!status) {
      setStatus(generateMockQueueStatus(event.id, "user123"));
    }
    
    // Update queue position every 5-10 seconds
    const interval = setInterval(() => {
      setStatus(prevStatus => {
        if (!prevStatus) return null;
        
        // Rapidly move them forward (for demo purposes)
        const newPosition = Math.max(1, prevStatus.position - Math.floor(Math.random() * 20) - 5);
        const estimatedWaitTime = Math.max(0, Math.ceil(newPosition / 10));
        
        // When they reach position 1, they're ready to enter
        if (newPosition === 1 && prevStatus.position !== 1) {
          setIsReady(true);
          clearInterval(interval);
        }
        
        return {
          ...prevStatus,
          position: newPosition,
          estimatedWaitTime,
          totalAhead: newPosition - 1,
          updated: new Date().toISOString()
        };
      });
    }, 5000 + Math.random() * 5000);
    
    return () => clearInterval(interval);
  }, [event.id, status, isReady]);
  
  // Countdown timer once they're ready to purchase
  useEffect(() => {
    if (!isReady) return;
    
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Send back to waiting room or event page when time expires
          setTimeout(() => {
            router.push(`/eventos/${event.slug}`);
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isReady, router, event.slug]);
  
  // Format the remaining time
  const formatRemainingTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
                {isReady ? "Your Turn!" : "Queue: " + event.title}
              </h1>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {!isReady && status ? (
              <>
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center space-x-2 text-lg text-primary font-medium">
                    <Users className="h-5 w-5" />
                    <span>Position in queue: {status.position}</span>
                  </div>
                  
                  <p className="text-muted-foreground">
                    There {status.totalAhead === 1 ? 'is' : 'are'} {status.totalAhead} {status.totalAhead === 1 ? 'person' : 'people'} ahead of you
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Queue progress</span>
                    <span className="text-primary font-medium">
                      {Math.min(99, Math.max(0, 100 - (status.position / 5000 * 100))).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(99, Math.max(0, 100 - (status.position / 5000 * 100)))} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-lg font-medium">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Estimated wait time: <span className="text-primary">{formatWaitTime(status.estimatedWaitTime)}</span></span>
                </div>
                
                <div className="bg-muted/50 rounded-md p-4 space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Stay on this page</p>
                      <p className="text-muted-foreground">Leaving or refreshing this page will cause you to lose your place in line.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">You'll be notified when it's your turn</p>
                      <p className="text-muted-foreground">We'll alert you when it's your turn to purchase tickets.</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold">It's your turn!</h2>
                  <p className="text-muted-foreground">You have been moved to the front of the line.</p>
                  
                  <div className="flex flex-col items-center mt-2 space-y-2">
                    <p className="text-sm text-muted-foreground">Time remaining to complete your purchase:</p>
                    <div className="text-3xl font-bold text-primary">{formatRemainingTime()}</div>
                    <Progress 
                      value={(secondsLeft / 600) * 100} 
                      className="h-2 w-full max-w-sm mt-2" 
                    />
                  </div>
                </motion.div>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    size="lg"
                    className="w-full"
                    onClick={() => router.push(`/checkout/${event.slug}`)}
                  >
                    Continue to Checkout
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/eventos/${event.slug}`)}
                  >
                    Return to Event Details
                  </Button>
                </div>
                
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Limited time offer</p>
                      <p>Your spot is reserved for a limited time. Please complete your purchase before the timer expires.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatedBackground>
  );
}