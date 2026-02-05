'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Calendar, BookOpen, MessageSquare, Mail, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  users: number;
  content: number;
  events: number;
  resources: number;
  messages: number;
  subscribers: number;
  pendingReviews: number;
  upcomingEvents: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    content: 0,
    events: 0,
    resources: 0,
    messages: 0,
    subscribers: 0,
    pendingReviews: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Content Items',
      value: stats.content,
      icon: FileText,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Events',
      value: stats.events,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Resources',
      value: stats.resources,
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Subscribers',
      value: stats.subscribers,
      icon: Mail,
      color: 'from-amber-700 to-amber-800',
      bgColor: 'bg-amber-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session?.user.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your meditation institute today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className="h-5 w-5 text-amber-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Reviews & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-amber-700" />
              Pending Content Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.pendingReviews > 0 ? (
              <>
                <div className="text-4xl font-bold text-amber-700 mb-2">
                  {stats.pendingReviews}
                </div>
                <p className="text-sm text-gray-600">
                  items waiting for review
                </p>
                <a
                  href="/admin/content?status=pending_review"
                  className="inline-block mt-4 text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  Review Now →
                </a>
              </>
            ) : (
              <p className="text-gray-600">No pending reviews</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.upcomingEvents > 0 ? (
              <>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {stats.upcomingEvents}
                </div>
                <p className="text-sm text-gray-600">
                  events scheduled
                </p>
                <a
                  href="/admin/events"
                  className="inline-block mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Manage Events →
                </a>
              </>
            ) : (
              <p className="text-gray-600">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
