import { Card, CardContent } from '@/components/ui/card';

export function CEOSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-purple-200 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="text-9xl mb-4">👨‍💼</div>
                  <p className="text-purple-900 font-semibold">Founder & CEO</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Message from Our Founder
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Welcome to Meditation Institute. Our mission is to bring the
                  transformative power of meditation to leaders, professionals,
                  and individuals worldwide.
                </p>
                <p>
                  With decades of experience in both corporate leadership and
                  meditation practice, I understand the unique challenges faced
                  by modern professionals. Our programs are designed to help
                  you find inner peace, clarity, and purpose while excelling in
                  your personal and professional life.
                </p>
                <p>
                  Through scientific meditation techniques, compassionate
                  guidance, and a supportive community, we empower you to
                  unlock your full potential and create positive change in
                  yourself and the world around you.
                </p>
                <p className="font-semibold text-foreground">
                  Join us on this transformative journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
