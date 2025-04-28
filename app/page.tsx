"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, Search, Calendar, MapPin, Users } from 'lucide-react';
import EventCard from '@/components/events/event-card';
import { SAMPLE_EVENTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/ui/animated-background';

export default function Home() {
  // Filter to show only 3 events on the homepage
  const featuredEvents = SAMPLE_EVENTS.slice(0, 3);
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <AnimatedBackground className="relative py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
            >
              Your ticket to unforgettable experiences
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8"
            >
              Find and secure your spot at the hottest events with our seamless ticketing system featuring waiting rooms and virtual queues for high-demand shows.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search events..." 
                  className="pl-10 h-12"
                />
              </div>
              <Button className="h-12 px-8">
                Search
              </Button>
            </motion.div>
          </div>
        </div>
      </AnimatedBackground>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How EventFlow Works</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Our streamlined process ensures fair access to tickets for all events, especially for high-demand shows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Calendar className="h-10 w-10 mb-4 text-primary" />,
                title: "Find Events",
                description: "Browse and discover exciting events happening in your area or favorite venues."
              },
              {
                icon: <Users className="h-10 w-10 mb-4 text-primary" />,
                title: "Waiting Room",
                description: "For high-demand events, enter our virtual waiting room before sales begin."
              },
              {
                icon: <MapPin className="h-10 w-10 mb-4 text-primary" />,
                title: "Secure Checkout",
                description: "Complete your purchase with our secure, fast checkout process."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg border border-border text-center"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Link href="/eventos" className="text-primary flex items-center hover:underline">
              View all events <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Never Miss an Event Again</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of event-goers who secure their tickets effortlessly with EventFlow.
            </p>
            <Link href="/eventos">
              <Button size="lg" className="px-8">
                Explore All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}