import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { CEOSection } from '@/components/about/CEOSection';
import { VisionMission } from '@/components/about/VisionMission';
import { CoreValues } from '@/components/about/CoreValues';
import { FoundersTrustees } from '@/components/about/FoundersTrustees';
import { SteeringCommittee } from '@/components/about/SteeringCommittee';
import { Mentors } from '@/components/about/Mentors';
import { Inspiration } from '@/components/about/Inspiration';
import { TeamMembers } from '@/components/about/TeamMembers';
import { Services } from '@/components/about/Services';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <CEOSection />
        <VisionMission />
        <CoreValues />
        <FoundersTrustees />
        <SteeringCommittee />
        <Mentors />
        <Inspiration />
        <TeamMembers />
        <Services />
      </main>
      <Footer />
    </div>
  );
}
