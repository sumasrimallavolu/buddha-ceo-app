import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote } from 'lucide-react';

const inspirationPeople = [
  {
    name: 'Inspiring Leader One',
    role: 'Global Meditation Teacher',
    quote:
      'Meditation helped me move from constant stress to calm, clear action in every area of life.',
    image: '/images/people/inspiration-1.jpg',
  },
  {
    name: 'Inspiring Leader Two',
    role: 'Corporate Leader & Practitioner',
    quote:
      'Daily practice brings balance, creativity, and compassion into how we lead teams and organizations.',
    image: '/images/people/inspiration-2.jpg',
  },
  {
    name: 'Inspiring Leader Three',
    role: 'Mentor & Coach',
    quote:
      'The Buddha CEO teachings opened a new way of looking at success – from the inside out.',
    image: '/images/people/inspiration-3.jpg',
  },
];

export function Inspiration() {
  return (
    <section className="py-20 bg-purple-50/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1 rounded-full">
            Inspiration
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Inspired by Masters, Leaders & Real Stories
          </h2>
          <p className="text-lg text-muted-foreground">
            The meditation institute draws inspiration from Buddha CEO programs,
            teachers, and a rich library of books, blogs, magazines, and
            multimedia resources.
          </p>
        </div>

        <Card className="mb-12 bg-white border border-slate-100 shadow-sm">
          <CardContent className="pt-8 pb-8 md:px-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-purple-50 p-3">
                  <Quote className="h-7 w-7 text-purple-700" />
                </div>
                <div className="text-left">
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-900">
                    “Meditation awakens the inner CEO – the Conscious,
                    Enlightened, and Observant leader within. Our work is to
                    help every seeker discover and live from that space.”
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    – Inspired by Buddha CEO teachers and global meditation
                    leaders
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {inspirationPeople.map((person) => (
            <Card
              key={person.name}
              className="overflow-hidden border border-slate-100 bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="pt-5 pb-6">
                <h3 className="text-base font-semibold text-slate-900">
                  {person.name}
                </h3>
                <p className="text-xs text-purple-700 font-medium mb-3">
                  {person.role}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  “{person.quote}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

