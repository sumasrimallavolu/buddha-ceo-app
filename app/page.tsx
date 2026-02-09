'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { PhotosGrid } from '@/components/home/PhotosGrid';
import { TransformationStories } from '@/components/home/TransformationStories';
import { Testimonials } from '@/components/home/Testimonials';
import { ProgramsServices } from '@/components/home/ProgramsServices';
import { TeacherEnrollment } from '@/components/home/TeacherEnrollment';
import { VolunteerSection } from '@/components/home/VolunteerSection';
import { ContactSection } from '@/components/home/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PhotosGrid />
        <TransformationStories />
        <Testimonials />
        <ProgramsServices />
        <TeacherEnrollment />
        <VolunteerSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
