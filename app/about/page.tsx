'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/about/AboutHero';
import { VisionMission } from '@/components/about/VisionMission';
import { Inspiration } from '@/components/about/Inspiration';
import { Founders } from '@/components/about/Founders';
import { Mentors } from '@/components/about/Mentors';
import { SteeringCommittee } from '@/components/about/SteeringCommittee';
import { Services } from '@/components/about/Services';
import { Partners } from '@/components/about/Partners';
import { Loader2 } from 'lucide-react';

interface AboutData {
  whoWeAre: any;
  visionMission: any;
  inspiration: any;
  teamMembers: any[];
  services: any;
  partners: any;
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Fetch all sections in parallel
        const [
          whoWeAreRes,
          visionMissionRes,
          inspirationRes,
          teamMembersRes,
          servicesRes,
          partnersRes
        ] = await Promise.all([
          fetch('/api/about?section=whoWeAre'),
          fetch('/api/about?section=visionMission'),
          fetch('/api/about?section=inspiration'),
          fetch('/api/about?section=teamMembers'),
          fetch('/api/about?section=services'),
          fetch('/api/about?section=partners')
        ]);

        const [
          whoWeAreData,
          visionMissionData,
          inspirationData,
          teamMembersData,
          servicesData,
          partnersData
        ] = await Promise.all([
          whoWeAreRes.json(),
          visionMissionRes.json(),
          inspirationRes.json(),
          teamMembersRes.json(),
          servicesRes.json(),
          partnersRes.json()
        ]);

        setData({
          whoWeAre: whoWeAreData.success ? whoWeAreData.data : null,
          visionMission: visionMissionData.success ? visionMissionData.data : null,
          inspiration: inspirationData.success ? inspirationData.data : null,
          teamMembers: teamMembersData.success ? teamMembersData.data : [],
          services: servicesData.success ? servicesData.data : null,
          partners: partnersData.success ? partnersData.data : null
        });
      } catch (err) {
        console.error('Error fetching about page data:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {data ? (
          <>
            <AboutHero data={data.whoWeAre} />
            <VisionMission data={data.visionMission} />
            <Inspiration data={data.inspiration} />
            <Founders data={data.teamMembers} />
            <Mentors data={data.teamMembers} />
            <SteeringCommittee data={data.teamMembers} />
            <Services data={data.services} />
            <Partners data={data.partners} />
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-lg">No data available</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
