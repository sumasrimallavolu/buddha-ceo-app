'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OpportunityForm } from '@/components/admin/volunteer-opportunities/OpportunityForm';
import { Loader2 } from 'lucide-react';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/volunteer-opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        router.push('/admin/volunteer-opportunities');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create opportunity');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Volunteer Opportunity</h1>
        <p className="text-slate-400">Add a new volunteer opportunity to the platform</p>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <OpportunityForm onSubmit={handleSubmit} submitLabel="Create Opportunity" />
        )}
      </div>
    </div>
  );
}
