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
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="flex-1">
          <div className="container mx-auto px-4 py-16 space-y-24">
            <Skeleton className="h-32 w-96 mx-auto" />
            <div className="space-y-6">
              <Skeleton className="h-24 w-full max-w-4xl mx-auto" />
              <Skeleton className="h-24 w-full max-w-4xl mx-auto" />
              <Skeleton className="h-24 w-full max-w-4xl mx-auto" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-16 w-64 mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                ))}
              </div>
            </div>
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
