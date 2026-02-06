'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Mail } from 'lucide-react';
import { SubscribersTab } from '@/components/admin/people/SubscribersTab';
import { VolunteersTab } from '@/components/admin/people/VolunteersTab';
import { TeachersTab } from '@/components/admin/people/TeachersTab';

type TabValue = 'subscribers' | 'volunteers' | 'teachers';

export default function PeoplePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabValue>('subscribers');
  const canEdit = session?.user?.role === 'admin';

  const tabs = [
    { value: 'subscribers' as TabValue, label: 'Subscribers', icon: Mail },
    { value: 'volunteers' as TabValue, label: 'Volunteers', icon: Users },
    { value: 'teachers' as TabValue, label: 'Teachers Applied', icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">People Management</h1>
          <p className="text-slate-400">
            Manage subscribers, volunteers, and teacher applications
            {!canEdit && ' (View Only)'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="border-b border-white/10">
          <nav className="flex gap-1 px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-all relative
                    ${isActive
                      ? 'text-blue-400 border-blue-500'
                      : 'text-slate-400 border-transparent hover:text-slate-300 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'subscribers' && <SubscribersTab canEdit={canEdit} />}
          {activeTab === 'volunteers' && <VolunteersTab canEdit={canEdit} />}
          {activeTab === 'teachers' && <TeachersTab canEdit={canEdit} />}
        </div>
      </div>
    </div>
  );
}
