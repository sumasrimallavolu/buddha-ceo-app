'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Users, Target } from 'lucide-react';

interface Achievement {
  _id: string;
  title: string;
  content: {
    description?: string;
    icon?: string;
    category?: string;
    year?: string;
    highlights?: string[];
  };
}

export default function ProjectExcellencePage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/content/achievements');
        if (!response.ok) throw new Error('Failed to fetch achievements');
        const data = await response.json();
        setAchievements(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getIconComponent = (iconName?: string) => {
    const iconMap: Record<string, any> = {
      award: Award,
      trending: TrendingUp,
      users: Users,
      target: Target,
    };
    const Icon = iconMap[iconName || 'award'] || Award;
    return <Icon className="h-8 w-8 text-purple-600" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Award className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Project Excellence
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              Celebrating our journey of achievements, milestones, and transformative impact in meditation and wellness
            </p>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {[
                { label: 'Years of Service', value: '15+', icon: Target },
                { label: 'Programs Conducted', value: '500+', icon: Award },
                { label: 'Lives Impacted', value: '50K+', icon: Users },
                { label: 'Global Centers', value: '25+', icon: TrendingUp },
              ].map((stat, idx) => (
                <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <stat.icon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Grid */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Achievements</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A testament to our commitment to spreading meditation and wellness worldwide
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600">{error}</p>
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No achievements to display yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement._id}
                    className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-purple-200"
                  >
                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6">
                      <div className="flex items-center justify-between">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                          {getIconComponent(achievement.content.icon)}
                        </div>
                        {achievement.content.year && (
                          <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                            {achievement.content.year}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-3 group-hover:text-purple-600 transition-colors">
                        {achievement.title}
                      </h3>
                      {achievement.content.category && (
                        <Badge variant="outline" className="mb-3">
                          {achievement.content.category}
                        </Badge>
                      )}
                      {achievement.content.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {achievement.content.description}
                        </p>
                      )}
                      {achievement.content.highlights && achievement.content.highlights.length > 0 && (
                        <ul className="space-y-2">
                          {achievement.content.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <div className="bg-purple-100 rounded-full p-1 mr-2 mt-0.5">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                              </div>
                              <span className="text-muted-foreground">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Be Part of Our Journey
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Join our programs and contribute to the growing legacy of meditation and wellness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Explore Programs
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
