'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Eye,
  BarChart3,
  Activity,
  Image,
  Users,
} from 'lucide-react';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';

interface DashboardStats {
  content: number;
  events: number;
  resources: number;
  photos: number;
  pendingReviews: number;
  upcomingEvents: number;
  analytics?: {
    totalVisits: number;
    uniqueVisitors: number;
    todayVisits: number;
    todayUniqueVisitors: number;
    pageStats: Array<{ _id: string; count: number }>;
    recentVisits: any[];
    dailyStats: Array<{ date: string; visits: number; uniqueVisitors: number }>;
  } | null;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    content: 0,
    events: 0,
    resources: 0,
    photos: 0,
    pendingReviews: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect content_reviewers to content page
    if (session?.user?.role === 'content_reviewer') {
      router.replace('/admin/content');
      return;
    }
    fetchStats();
  }, [session, router]);

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
      title: 'Content Items',
      value: stats.content,
      icon: FileText,
      gradient: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      href: '/admin/content',
    },
    {
      title: 'Events',
      value: stats.events,
      icon: Calendar,
      gradient: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
      href: '/admin/events',
    },
    {
      title: 'Resources',
      value: stats.resources,
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-500',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      href: '/admin/resources',
    },
    {
      title: 'Photos',
      value: stats.photos,
      icon: Image,
      gradient: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400',
      href: '/admin/content?type=photos',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {session?.user.name}!
          </h1>
          <p className="text-slate-400">
            Here's what's happening with your meditation institute today.
          </p>
        </div>
      </div>

      {/* Visitor Analytics - Admin Only - Prominent Position */}
      {session?.user?.role === 'admin' && stats.analytics && (
        <div className="space-y-6">
          {/* Analytics Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Visitor Analytics</h2>
              <p className="text-sm text-slate-400">Track your website performance</p>
            </div>
          </div>

          {/* Main Analytics Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Visits */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Visits</h3>
                  <p className="text-sm text-slate-400">Last 30 days</p>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stats.analytics.totalVisits.toLocaleString()}
                </div>
                <div className="text-slate-400 mb-2">page views</div>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-violet-500/20">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Unique Visitors</h3>
                  <p className="text-sm text-slate-400">Last 30 days</p>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-5xl font-bold bg-gradient-to-br from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {stats.analytics.uniqueVisitors.toLocaleString()}
                </div>
                <div className="text-slate-400 mb-2">visitors</div>
              </div>
            </div>

            {/* Today's Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <Activity className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Today</h3>
                  <p className="text-sm text-slate-400">Page views / Visitors</p>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  {stats.analytics.todayVisits}
                </div>
                <div className="text-slate-400 mb-2">/ {stats.analytics.todayUniqueVisitors}</div>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <AnalyticsCharts
            dailyStats={stats.analytics.dailyStats || []}
            pageStats={stats.analytics.pageStats || []}
          />

          {/* Top Pages & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            {stats.analytics.pageStats && stats.analytics.pageStats.length > 0 && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Top Pages</h3>
                    <p className="text-sm text-slate-400">Most visited pages</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.analytics.pageStats.slice(0, 5).map((pageStat, index) => (
                    <div
                      key={pageStat._id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-blue-500/20 text-blue-400' :
                          index === 1 ? 'bg-slate-400/20 text-slate-400' :
                          index === 2 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-white/5 text-slate-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="text-sm text-white truncate max-w-[200px]">
                          {pageStat._id === '/' ? 'Home' :
                           pageStat._id.startsWith('/admin') ? 'Admin' :
                           pageStat._id === '/about' ? 'About' :
                           pageStat._id === '/events' ? 'Events' :
                           pageStat._id === '/resources' ? 'Resources' :
                           pageStat._id === '/contact' ? 'Contact' :
                           pageStat._id}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-white">{pageStat.count}</div>
                        <Eye className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.analytics.recentVisits && stats.analytics.recentVisits.length > 0 && (
              <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-pink-500/10">
                    <Clock className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    <p className="text-sm text-slate-400">Latest page visits</p>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {stats.analytics.recentVisits.slice(0, 10).map((visit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {visit.page === '/' ? 'Home' :
                           visit.page.startsWith('/admin') ? 'Admin' :
                           visit.page === '/about' ? 'About' :
                           visit.page === '/events' ? 'Events' :
                           visit.page === '/resources' ? 'Resources' :
                           visit.page === '/contact' ? 'Contact' :
                           visit.page}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(visit.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analytics Summary Card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 backdrop-blur-sm border border-blue-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Analytics Overview</h3>
                  <p className="text-sm text-slate-400">
                    Tracking page visits and user behavior
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Total Tracked Pages</div>
                <div className="text-2xl font-bold text-white">
                  {stats.analytics.pageStats?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Management Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <FileText className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Content Overview</h2>
            <p className="text-sm text-slate-400">Manage your website content</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.title}
                href={stat.href}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}`} />
                </div>

                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className={`h-5 w-5 text-slate-600 group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0`} />
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Actions & Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/20">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Actions & Notifications</h2>
            <p className="text-sm text-slate-400">Review pending items and upcoming events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Reviews */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pending Reviews</h3>
              <p className="text-sm text-slate-400">Content awaiting approval</p>
            </div>
          </div>

          <div className="space-y-4">
            {stats.pendingReviews > 0 ? (
              <>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-blue-400 bg-clip-text text-transparent">
                    {stats.pendingReviews}
                  </div>
                  <div className="text-slate-400 mb-2">items</div>
                </div>
                <Link
                  href="/admin/content?status=pending_review"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group"
                >
                  Review now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 py-4">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-white font-medium">All caught up!</p>
                  <p className="text-sm text-slate-400">No pending reviews</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Calendar className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Upcoming Events</h3>
              <p className="text-sm text-slate-400">Events scheduled soon</p>
            </div>
          </div>

          <div className="space-y-4">
            {stats.upcomingEvents > 0 ? (
              <>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-bold bg-gradient-to-br from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    {stats.upcomingEvents}
                  </div>
                  <div className="text-slate-400 mb-2">events</div>
                </div>
                <Link
                  href="/admin/events"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors group"
                >
                  Manage events
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 py-4">
                <AlertCircle className="h-8 w-8 text-slate-500" />
                <div>
                  <p className="text-white font-medium">No upcoming events</p>
                  <p className="text-sm text-slate-400">Schedule a new event</p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
