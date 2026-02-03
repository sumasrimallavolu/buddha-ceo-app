import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye } from 'lucide-react';

export function VisionMission() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <div className="flex items-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mr-4">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To create a world where every individual experiences inner peace
                and radiant health through the practice of meditation, leading
                to a compassionate and harmonious global community.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow">
            <CardContent className="pt-8">
              <div className="flex items-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mr-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Empower leaders, professionals, and individuals with
                transformative meditation wisdom and techniques, fostering
                personal growth, organizational excellence, and social
                responsibility.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
