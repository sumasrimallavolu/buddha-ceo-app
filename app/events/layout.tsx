import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Events & Programs - Meditation Institute',
  description: 'Discover our meditation programs designed for your transformation journey. Browse upcoming events, workshops, retreats, and training programs.',
  keywords: ['meditation programs', 'events', 'workshops', 'retreats', 'training programs', 'meditation institute'],
};

export default function EventsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
