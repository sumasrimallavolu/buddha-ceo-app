import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Heart } from 'lucide-react';

const services = [
  {
    icon: BookOpen,
    title: 'Beginner Programs',
    description: 'Start your meditation journey with our carefully designed beginner-friendly programs. Learn foundational techniques in a supportive environment.',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Programs',
    description: 'Deepen your practice with advanced meditation techniques. Perfect for experienced meditators seeking transformation.',
  },
  {
    icon: Users,
    title: 'Corporate Programs',
    description: 'Customized meditation programs for organizations. Enhance productivity, well-being, and leadership skills in your team.',
  },
  {
    icon: Heart,
    title: 'Youth Programs',
    description: 'Special programs designed for students and young adults. Build confidence, clarity, and focus for academic and personal success.',
  },
];

export function Services() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Our Programs & Services
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive meditation programs for all levels and backgrounds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/10 shadow-lg bg-white/5 backdrop-blur-md">
                <CardHeader>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 mb-4 border-2 border-blue-500/30">
                    <Icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">
                    {service.description}
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
