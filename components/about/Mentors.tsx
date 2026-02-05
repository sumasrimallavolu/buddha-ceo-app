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
    <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Badge className="mb-4 px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Mentors
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Guided by Experienced Mentors
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A global network of meditation mentors, coaches, and facilitators who
            support seekers at every stage of their journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mentors.map((mentor, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white/5 backdrop-blur-md"
            >
              <CardContent className="pt-6 pb-7 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-blue-500/30 bg-blue-500/10">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-base font-semibold mb-1 text-white">{mentor.name}</h3>
                <p className="text-xs text-emerald-400 font-medium mb-3 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">
                  {mentor.title}
                </p>
                <p className="text-sm italic text-slate-400 leading-relaxed">
                  "{mentor.quote}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

