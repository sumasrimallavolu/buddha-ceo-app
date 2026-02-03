import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const steeringMembers = [
  {
    name: 'Committee Member One',
    role: 'Chair – Steering Committee',
    focus: 'Provides overall strategic guidance for meditation programs, retreats, and global outreach.',
    image: '/images/people/steering-1.jpg',
  },
  {
    name: 'Committee Member Two',
    role: 'Programs & Content',
    focus: 'Oversees design of courses, online programs, and curated content inspired by Buddha CEO resources.',
    image: '/images/people/steering-2.jpg',
  },
  {
    name: 'Committee Member Three',
    role: 'Partnerships & Outreach',
    focus: 'Builds collaborations with corporates, institutions, and meditation communities worldwide.',
    image: '/images/people/steering-3.jpg',
  },
  {
    name: 'Committee Member Four',
    role: 'Research & Impact',
    focus: 'Tracks outcomes, feedback, and impact metrics from participants and organizations.',
    image: '/images/people/steering-4.jpg',
  },
];

export function SteeringCommittee() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-4 py-1 rounded-full">
            Steering Committee
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Guiding the Vision & Execution
          </h2>
          <p className="text-lg text-muted-foreground">
            A group of senior meditators, professionals, and leaders who
            translate the Buddha CEO vision into clear projects, priorities, and
            action plans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steeringMembers.map((member, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-shadow border border-slate-100 bg-white"
            >
              <CardContent className="pt-6 pb-7 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border border-slate-200 bg-slate-50">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wide text-purple-700 bg-purple-50 px-2 py-1 rounded-full mb-2">
                  Core Team
                </span>
                <h3 className="text-base font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-purple-700 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.focus}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

