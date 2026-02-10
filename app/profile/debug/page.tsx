'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

export default function ProfileDebugPage() {
  const { data: session, status } = useSession();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      testAPI();
    }
  }, [status]);

  const testAPI = async () => {
    console.log('=== Testing Volunteer Profile API ===');
    console.log('Session:', session);

    try {
      const response = await fetch('/api/volunteer/my-applications');
      const data = await response.json();

      console.log('Response Status:', response.status);
      console.log('Response OK:', response.ok);
      console.log('Response Data:', data);

      setApiResponse({
        status: response.status,
        ok: response.ok,
        data: data,
        applications: data.applications,
        count: data.applications?.length || 0
      });
    } catch (error) {
      console.error('API Error:', error);
      setApiResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="p-8 text-white">Not logged in. <a href="/login">Login</a></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Volunteer Profile Debug Page</h1>

      <div className="space-y-4">
        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Session Info</h2>
          <pre className="bg-black/30 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">API Response</h2>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <pre className="bg-black/30 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Check Console</h2>
          <p className="text-slate-400">Open browser console (F12) to see detailed logs</p>
        </div>
      </div>
    </div>
  );
}
