"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import FilterBar from '@/components/events/filter-bar';
import EventCard from '@/components/events/event-card';
import { SAMPLE_EVENTS } from '@/lib/constants';
import { Event } from '@/lib/types';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(SAMPLE_EVENTS);
  
  useEffect(() => {
    // Filter events based on URL parameters
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    const dateParam = searchParams.get('date');
    
    let results = [...SAMPLE_EVENTS];
    
    if (categoryParam) {
      results = results.filter(event => event.category === categoryParam);
    }
    
    if (locationParam) {
      results = results.filter(event => event.location === locationParam);
    }
    
    if (dateParam) {
      results = results.filter(event => event.date === dateParam);
    }
    
    setFilteredEvents(results);
  }, [searchParams]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover and secure your tickets to the hottest events
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <Filter className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Filters
            </span>
          </div>
        </div>
        
        <FilterBar />
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}