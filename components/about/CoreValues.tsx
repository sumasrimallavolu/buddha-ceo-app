import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Lightbulb, Target, Globe2 } from 'lucide-react';

const coreValues = [
  {
    icon: Heart,
    label: 'Compassion in Action',
    description:
      'We cultivate kindness, empathy, and service in every program, interaction, and initiative.',
    accent: 'from-pink-500 to-rose-500',
  },
  {
    icon: Lightbulb,
    label: 'Wisdom & Clarity',
    description:
      'We bridge ancient meditation wisdom with modern science to support clear thinking and right decisions.',
    accent: 'from-amber-500 to-yellow-500',
  },
  {
    icon: Target,
    label: 'Inner Excellence',
    description:
      'We focus on inner transformation as the foundation for sustainable outer success and leadership.',
    accent: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Globe2,
    label: 'One Global Family',
    description:
      'We honor all cultures and backgrounds, seeing the entire world as one connected family.',
    accent: 'from-sky-500 to-cyan-500',
  },
];

export function CoreValues() {
  return (
    <section className="py-20 bg-purple-50/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-4 py-1 rounded-full">
            Core Values
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-purple-700">
            What Guides Our Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                className="relative overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-purple-600"
                />
                <CardContent className="pt-8 pb-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 mb-4 shadow-sm">
                    <Icon className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
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

