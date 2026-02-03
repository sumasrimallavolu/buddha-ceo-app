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
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
            <Quote className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transformations Through Meditation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from leaders, professionals, and students who have
            transformed their lives through meditation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-2xl border-2 hover:border-purple-200"
            >
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={testimonial.thumbnail}
                  alt={testimonial.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <a
                    href={testimonial.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transform transition-transform hover:scale-110"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl transition-all">
                      <Play className="w-7 h-7 text-purple-600 ml-1" />
                    </div>
                  </a>
                </div>

                {/* Rating stars */}
                <div className="absolute top-3 right-3 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-purple-600 truncate">
                      {testimonial.subtitle}
                    </p>
                  </div>
                </div>
                {testimonial.quote && (
                  <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-3">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.youtube.com/@BuddhaCEOQuantumFoundation"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Play className="w-5 h-5" />
            Watch More on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
