'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { OpportunityForm } from '@/components/admin/volunteer-opportunities/OpportunityForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function EditOpportunityPage() {
  const router = useRouter();
  const params = useParams();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOpportunity();
  }, [params.id]);

  const fetchOpportunity = async () => {
    try {
      const response = await fetch(`/api/admin/volunteer-opportunities/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunity(data);
      } else {
        router.push('/admin/volunteer-opportunities');
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      router.push('/admin/volunteer-opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/volunteer-opportunities/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        router.push('/admin/volunteer-opportunities');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update opportunity');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Opportunity not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/volunteer-opportunities" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Opportunities
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Volunteer Opportunity</h1>
        <p className="text-slate-400">Update volunteer opportunity details</p>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        {submitting ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <OpportunityForm
            initialData={opportunity}
            onSubmit={handleSubmit}
            submitLabel="Update Opportunity"
          />
        )}
      </div>
    </div>
  );
}
