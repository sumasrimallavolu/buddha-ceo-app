import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Lightbulb, Target, Globe2 } from 'lucide-react';

const coreValues = [
  {
    icon: Heart,
    label: 'Compassion in Action',
    description:
      'We cultivate kindness, empathy, and service in every program, interaction, and initiative.',
    accent: 'from-blue-500 to-violet-500',
  },
  {
    icon: Lightbulb,
    label: 'Wisdom & Clarity',
    description:
      'We bridge ancient meditation wisdom with modern science to support clear thinking and right decisions.',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    icon: Target,
    label: 'Inner Excellence',
    description:
      'We focus on inner transformation as the foundation for sustainable outer success and leadership.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe2,
    label: 'One Global Family',
    description:
      'We honor all cultures and backgrounds, seeing the entire world as one connected family.',
    accent: 'from-blue-400 to-cyan-500',
  },
];

export function CoreValues() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge className="mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md border-0">
            Core Values
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            What Guides Our Work
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Inspired by meditation masters, transformational leaders, and
            contemporary research shared through books, blogs, and magazines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group"
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${value.accent} mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{value.label}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
