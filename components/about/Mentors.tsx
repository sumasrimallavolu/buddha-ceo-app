import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mentors = [
  {
    name: 'Senior Mentor One',
    title: 'Meditation Teacher & Mentor',
    quote:
      'True leadership begins with inner silence. When the mind is still, the right decisions arise naturally.',
    image: '/images/people/mentor-1.jpg',
  },
  {
    name: 'Senior Mentor Two',
    title: 'Corporate Leader & Meditation Guide',
    quote:
      'Meditation brings clarity and courage to lead teams with compassion, purpose, and long-term vision.',
    image: '/images/people/mentor-2.jpg',
  },
  {
    name: 'Senior Mentor Three',
    title: 'Global Facilitator & Coach',
    quote:
      'From retreats to online programs, we have seen thousands rediscover joy, health, and focus through daily practice.',
    image: '/images/people/mentor-3.jpg',
  },
];

export function Mentors() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Badge variant="secondary" className="mb-4 px-4 py-1 rounded-full">
            Mentors
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Guided by Experienced Mentors
          </h2>
          <p className="text-lg text-muted-foreground">
            A global network of meditation mentors, coaches, and facilitators who
            support seekers at every stage of their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border border-slate-100 bg-white hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="pt-6 pb-7 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border border-slate-200 bg-slate-50">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-semibold mb-1">{mentor.name}</h3>
                <p className="text-xs text-purple-700 font-medium mb-3">
                  {mentor.title}
                </p>
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  “{mentor.quote}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

