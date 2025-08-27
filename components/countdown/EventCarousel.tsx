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

export default function EventCarousel({
  currentDate,
  events,
  onEventSelect,
  selectedIndex,
}: EventCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    const container = document.getElementById('event-carousel');
    if (container) {
      const newPosition = scrollPosition - 1;
      const finalPosition = newPosition < 0 ? events.length - 1 : newPosition;
      setScrollPosition(finalPosition);
      onEventSelect(finalPosition);

      if (newPosition < 0) {
        container.scrollTo({
          left: container.scrollWidth - container.offsetWidth,
          behavior: 'smooth',
        });
      } else {
        container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('event-carousel');
    if (container) {
      const newPosition = scrollPosition + 1;
      const finalPosition = newPosition >= events.length ? 0 : newPosition;
      setScrollPosition(finalPosition);
      onEventSelect(finalPosition);

      if (newPosition >= events.length) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Carousel Container */}
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden">
        {/* Navigation Arrows */}
        <button
        onClick={scrollLeft}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-4 rounded-full bg-purple-600/70 hover:bg-purple-500/90 transition-all transform hover:scale-110"
        aria-label="Previous event"
        >
        <ChevronLeft size={24} className="text-white" />
        </button>

        <button
        onClick={scrollRight}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-4 rounded-full bg-purple-600/70 hover:bg-purple-500/90 transition-all transform hover:scale-110"
        aria-label="Next event"
        >
        <ChevronRight size={24} className="text-white" />
        </button>

        {/* Carousel Track */}
        <div
          id="event-carousel"
          className="flex overflow-x-hidden snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="min-w-[80%] md:min-w-[60%] lg:min-w-[50%] flex-shrink-0 snap-center px-4 md:px-8 transform transition-transform"
              style={{ transform: `translateX(${selectedIndex === index ? '0' : '0'}px)` }}
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
                    behavior: 'smooth',
                  });
                }
              }}
              className={`w-3 h-3 rounded-full transition-all transform ${
                selectedIndex === index ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
