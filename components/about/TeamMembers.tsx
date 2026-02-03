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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Our Team
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Led by experienced professionals and meditation practitioners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="aspect-square rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4 overflow-hidden">
                  <div className="text-center">
                    <div className="text-6xl">👤</div>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-purple-600 mb-4">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}
                {member.quote && (
                  <p className="text-sm italic text-gray-600">
                    &ldquo;{member.quote}&rdquo;
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
