'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { VideoSection } from '@/components/home/VideoSection';
import { RecentEvents } from '@/components/home/RecentEvents';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <VideoSection />
        <RecentEvents />
      </main>
      <Footer />
    </div>
  );
}
