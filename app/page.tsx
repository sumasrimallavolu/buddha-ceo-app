import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { Testimonials } from '@/components/home/Testimonials';
import { RecentEvents } from '@/components/home/RecentEvents';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Testimonials />
        <RecentEvents />
      </main>
      <Footer />
    </div>
  );
}
