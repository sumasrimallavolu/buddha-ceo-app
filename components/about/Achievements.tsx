import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Globe, BookOpen, TrendingUp, Heart } from 'lucide-react';

const achievements = [
  {
    icon: TrendingUp,
    number: '50,000+',
    label: 'Lives Transformed',
    description: 'Through our meditation programs worldwide, bringing positive change to individuals and communities',
    gradient: 'from-amber-600 to-emerald-600',
  },
  {
    icon: Users,
    number: '100+',
    label: 'Corporate Programs',
    description: 'Delivered to leading organizations globally, enhancing workplace wellness and leadership',
    gradient: 'from-emerald-600 to-cyan-600',
  },
  {
    icon: Globe,
    number: '2',
    label: 'Global Conferences',
    description: 'Successfully organized Global Conference of Meditation Leaders, uniting teachers worldwide',
    gradient: 'from-green-600 to-teal-600',
  },
  {
    icon: BookOpen,
    number: '500+',
    label: 'Free Resources',
    description: 'Books, videos, guided meditations, and articles freely available to all seekers',
    gradient: 'from-orange-600 to-red-600',
  },
  {
    icon: Heart,
    number: '40-Day',
    label: 'Transformation Programs',
    description: 'Scientifically designed meditation programs proven to create lasting positive change',
    gradient: 'from-orange-600 to-orange-700',
  },
  {
    icon: Award,
    number: '25+',
    label: 'Years of Service',
    description: 'Dedicated to bringing meditation wisdom to leaders, professionals, and seekers globally',
    gradient: 'from-amber-700 to-amber-800',
  },
];

export function Achievements() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Our Impact & Achievements
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Making a difference through meditation and mindfulness across the globe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/10 shadow-lg bg-white/5 backdrop-blur-md"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold text-white mb-3">
                    {achievement.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {achievement.label}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
