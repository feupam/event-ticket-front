import { SAMPLE_EVENTS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import EventDetails from './event-details';

interface EventDetailsPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return SAMPLE_EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { slug } = params;
  const event = SAMPLE_EVENTS.find(event => event.slug === slug);
  
  if (!event) {
    notFound();
  }
  
  return <EventDetails event={event} />;
}