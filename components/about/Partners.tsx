'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Building2 } from 'lucide-react';

interface Partner {
  _id?: string;
  name: string;
  logoUrl: string;
  website?: string;
  order: number;
}

export function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about?section=partners');
        const result = await response.json();

        if (result.success && result.data) {
          const partnersData = result.data.sort(
            (a: Partner, b: Partner) => a.order - b.order
          );
          setPartners(partnersData);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Partner Organizations
            </h2>
          </div>
          <p className="text-slate-400">
            Collaborating to spread meditation and mindfulness worldwide
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <div
              key={partner._id || partner.order}
              className="group bg-white/5 bg-white rounded-xl p-6 border border-white/10 hover:border-blue-600/50 hover:bg-slate-800/10 transition-all duration-300 flex items-center justify-center"
            >
              <div className="relative w-full h-16">
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  fill
                  className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
