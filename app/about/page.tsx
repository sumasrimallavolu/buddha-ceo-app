import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { VisionMission } from '@/components/about/VisionMission';
import { Inspiration } from '@/components/about/Inspiration';
import { Founders } from '@/components/about/Founders';
import { Mentors } from '@/components/about/Mentors';
import { Services } from '@/components/about/Services';
import { Partners } from '@/components/about/Partners';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <VisionMission />
        <Inspiration />
        <Founders />
        <Mentors />
        <Services />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}
