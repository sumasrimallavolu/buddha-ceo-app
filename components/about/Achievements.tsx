import { Card, CardContent } from '@/components/ui/card';
import { Award, Users, Globe, BookOpen, TrendingUp, Heart } from 'lucide-react';

const achievements = [
  {
    icon: TrendingUp,
    number: '50,000+',
    label: 'Lives Transformed',
    description: 'Through our meditation programs worldwide, bringing positive change to individuals and communities',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    icon: Users,
    number: '100+',
    label: 'Corporate Programs',
    description: 'Delivered to leading organizations globally, enhancing workplace wellness and leadership',
    gradient: 'from-blue-600 to-cyan-600',
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
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    icon: Award,
    number: '25+',
    label: 'Years of Service',
    description: 'Dedicated to bringing meditation wisdom to leaders, professionals, and seekers globally',
    gradient: 'from-indigo-600 to-purple-600',
  },
];

export function Achievements() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Our Impact & Achievements
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Making a difference through meditation and mindfulness across the globe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-200 group"
              >
                <CardContent className="pt-8 pb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`text-5xl font-bold bg-gradient-to-r ${achievement.gradient} bg-clip-text text-transparent mb-3`}>
                    {achievement.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {achievement.label}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
