import { SAMPLE_EVENTS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import CheckoutClient from '@/components/checkout/checkout-client';

interface CheckoutPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return SAMPLE_EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const event = SAMPLE_EVENTS.find(e => e.slug === params.slug);
  
  if (!event) {
    notFound();
  }
  
  return <CheckoutClient event={event} />;
} 