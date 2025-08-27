'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventSection from './EventSection';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  startDate: string;
}

interface EventCarouselProps {
  currentDate: string;
  events: Event[];
  onEventSelect: (index: number) => void;
  selectedIndex: number;
}

export default function EventCarousel({ currentDate, events, onEventSelect, selectedIndex }: EventCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    const container = document.getElementById('event-carousel');
    if (container) {
      const newPosition = scrollPosition - 1;
      // Se chegou no início, vai para o último
      const finalPosition = newPosition < 0 ? events.length - 1 : newPosition;
      setScrollPosition(finalPosition);
      onEventSelect(finalPosition);
      
      if (newPosition < 0) {
        // Volta para o último item
        container.scrollTo({ left: container.scrollWidth - container.offsetWidth, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('event-carousel');
    if (container) {
      const newPosition = scrollPosition + 1;
      // Se chegou no final, volta para o primeiro
      const finalPosition = newPosition >= events.length ? 0 : newPosition;
      setScrollPosition(finalPosition);
      onEventSelect(finalPosition);
      
      if (newPosition >= events.length) {
        // Volta para o primeiro item
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full">
      {/* Navigation Menu */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent pt-4 pb-8 overflow-x-auto">
        <div className="flex justify-start md:justify-center gap-2 md:gap-4 px-4 md:px-0 min-w-max mx-auto">
          {events.map((event, index) => (
            <button
              key={event.id}
              onClick={() => {
                setScrollPosition(index);
                onEventSelect(index);
                const container = document.getElementById('event-carousel');
                if (container) {
                  const scrollOffset = (container.offsetWidth * 0.2) * index; // Ajusta para o layout com cards visíveis
                  container.scrollTo({
                    left: scrollOffset,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`text-xs md:text-sm whitespace-nowrap px-3 md:px-6 py-2 md:py-3 rounded-full transition-all transform hover:scale-105 ${
                selectedIndex === index
                  ? 'bg-primary text-white shadow-lg shadow-primary/50'
                  : 'bg-black/50 text-white/70 hover:bg-black/70 hover:text-white'
              }`}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full max-w-[100vw] overflow-hidden">
        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-4 rounded-full bg-black/50 hover:bg-primary/80 transition-all transform hover:scale-110 group"
          aria-label="Previous event"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-4 rounded-full bg-black/50 hover:bg-primary/80 transition-all transform hover:scale-110 group"
          aria-label="Next event"
        >
          <ChevronRight size={24} className="text-white" />
        </button>

        {/* Carousel Track */}
        <div
          id="event-carousel"
          className="flex overflow-x-hidden snap-x snap-mandatory relative w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="min-w-[80%] md:min-w-[60%] lg:min-w-[50%] flex-shrink-0 snap-center px-4 md:px-8 transform transition-transform"
              style={{
                transform: `translateX(${selectedIndex === index ? '0' : '0'}px)`,
              }}
            >
              <EventSection
                eventName={event.name}
                eventDescription={event.description}
                eventDate={event.date}
                eventLocation={event.location}
                currentDate={currentDate}
                startDate={event.startDate}
              />
            </div>
          ))}
        </div>

        {/* Gradient overlays to show adjacent slides */}
        <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-20" />

        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = document.getElementById('event-carousel');
                if (container) {
                  setScrollPosition(index);
                  onEventSelect(index);
                  container.scrollTo({
                    left: container.offsetWidth * index,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all transform ${
                selectedIndex === index 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
