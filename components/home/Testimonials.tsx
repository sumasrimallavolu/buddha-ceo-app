import { Card, CardContent } from '@/components/ui/card';
import { Play, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Padma Shri D. R. Kaarthikeyan',
    subtitle: 'Former Director-CBI, NHRC, CRPF',
    videoUrl: 'https://www.youtube.com/watch?v=MSUXw7Dxle8',
    thumbnail: 'https://i.ytimg.com/vi/MSUXw7Dxle8/maxresdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/MSUXw7Dxle8/default.jpg',
    quote: 'Meditation has given me the inner strength and clarity to handle even the most challenging situations in my career.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dr. S.V. Balasubramaniam',
    subtitle: 'Founder and Chairman, Bannari Amman Group',
    videoUrl: 'https://www.youtube.com/watch?v=s4vH34O7rOs',
    thumbnail: 'https://i.ytimg.com/vi/s4vH34O7rOs/hqdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/s4vH34O7rOs/default.jpg',
    quote: 'Meditation has been instrumental in my personal and professional growth, bringing balance and success.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Raji Iyengar',
    subtitle: 'Senior Leader',
    videoUrl: 'https://www.youtube.com/watch?v=_5NTRAnF-Ic',
    thumbnail: 'https://i.ytimg.com/vi/_5NTRAnF-Ic/maxresdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/_5NTRAnF-Ic/default.jpg',
    quote: 'From vertigo to victory - how meditation helped overcome severe health challenges and transformed my career.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Indrani Krishna Mohan',
    subtitle: 'Student - Achieved 10/10 in Board Exams',
    videoUrl: 'https://www.youtube.com/watch?v=9QSKyMf98uY',
    thumbnail: 'https://i.ytimg.com/vi/9QSKyMf98uY/maxresdefault.jpg',
    avatar: 'https://i.ytimg.com/vi/9QSKyMf98uY/default.jpg',
    quote: 'Achieving perfect scores through the power of meditation and focus.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-50/80 via-stone-50/70 to-amber-50/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-4 shadow-md">
            <Quote className="w-8 h-8 text-amber-700" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-stone-800">
            Transformations Through Meditation
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Hear from leaders, professionals, and students who have
            transformed their lives through meditation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="group bg-white/40 backdrop-blur-md border-amber-200/30 hover:bg-white/60 hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Video Thumbnail */}
                <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100/50 to-emerald-100/50">
                  <img
                    src={testimonial.thumbnail}
                    alt={testimonial.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-amber-700 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-stone-700 mb-6 leading-relaxed border-l-4 border-amber-300/60 pl-4 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-amber-200/50 mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-stone-800">{testimonial.name}</h4>
                    <p className="text-sm text-stone-600">{testimonial.subtitle}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mt-4 gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
