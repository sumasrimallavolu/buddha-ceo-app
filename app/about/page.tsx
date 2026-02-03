import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { Achievements } from '@/components/about/Achievements';
import { CEOSection } from '@/components/about/CEOSection';
import { VisionMission } from '@/components/about/VisionMission';
import { TeamMembers } from '@/components/about/TeamMembers';
import { Services } from '@/components/about/Services';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <Achievements />
        <CEOSection />
        <VisionMission />
        <TeamMembers />
        <Services />
      </main>
      <Footer />
    </div>
  );
}
