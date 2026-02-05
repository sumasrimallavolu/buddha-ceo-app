import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye } from 'lucide-react';

export function VisionMission() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="pt-8">
              <div className="flex items-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 mr-4 shadow-md">
                  <Eye className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                To create a world where every individual experiences inner peace
                and radiant health through the practice of meditation, leading
                to a compassionate and harmonious global community.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/10 bg-white/5 backdrop-blur-md">
            <CardContent className="pt-8">
              <div className="flex items-center mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 mr-4 shadow-md">
                  <Target className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
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
