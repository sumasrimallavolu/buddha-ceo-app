import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
  {
    name: 'Dr. Chandra Pulamarasetti',
    role: 'Founder & CEO',
    image: '/images/team/chandra.jpg',
    bio: 'Former corporate leader turned meditation master, dedicated to bringing meditation wisdom to leaders worldwide.',
  },
  {
    name: 'Padma Shri Dr. RV Ramani',
    role: 'Founder and Managing Trustee, Sankara Eye Foundation',
    image: '/images/team/ramani.jpg',
    quote: '"We are that infinite energy with unlimited capability. The entire world is one big family. Meditation helps us to realize these concepts and live them."',
  },
  {
    name: 'Dr. S.V. Balasubramaniam',
    role: 'Founder and Chairman, Bannari Amman Group',
    image: '/images/team/balasubramaniam.jpg',
    quote: '"Meditation has been transformative for both personal growth and professional excellence."',
  },
  {
    name: 'Padma Shri D. R. Kaarthikeyan',
    role: 'Former Director-CBI, NHRC, CRPF',
    image: '/images/team/kaarthikeyan.jpg',
    quote: '"Meditation brings clarity, focus, and inner strength to face life\'s challenges."',
  },
];

export function TeamMembers() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Led by experienced professionals and meditation practitioners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="hover:shadow-xl transition-shadow border border-slate-100"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border border-slate-200 bg-slate-50">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-purple-600 mb-3">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {member.bio}
                  </p>
                )}
                {member.quote && (
                  <p className="text-sm italic text-slate-600 leading-relaxed">
                    “{member.quote}”
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
