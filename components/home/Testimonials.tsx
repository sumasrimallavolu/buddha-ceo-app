'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Star, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Testimonial {
  _id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl?: string;
  quote: string;
  order: number;
}

interface TestimonialsResponse {
  success: boolean;
  resources?: {
    testimonials?: Testimonial[];
  };
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('/api/resources/public?type=testimonial');
        const data: TestimonialsResponse = await response.json();

        if (data.success && data.resources?.testimonials) {
          setTestimonials(data.resources.testimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Extract YouTube video ID from URL to generate thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://i.ytimg.com/vi/${match[1]}/maxresdefault.jpg` : null;
  };

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" id="testimonials">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <Skeleton className="w-full aspect-video rounded-xl mb-6" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="flex items-center">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 mb-4 shadow-lg">
            <Quote className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Transformations Through Meditation
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Hear from leaders, professionals, and students who have
            transformed their lives through meditation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => {
            const youtubeId = getYouTubeId(testimonial.videoUrl);
            const thumbnail = testimonial.thumbnailUrl || getYouTubeThumbnail(testimonial.videoUrl);
            const avatar = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/default.jpg` : thumbnail;

            return (
              <Card
                key={testimonial._id}
                className="group bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <CardContent className="p-6">
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600/10 to-violet-600/10">
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={testimonial.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    )}
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-blue-700 ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  {testimonial.quote && (
                    <p className="text-slate-300 mb-6 leading-relaxed border-l-4 border-blue-500/30 pl-4 italic">
                      "{testimonial.quote}"
                    </p>
                  )}

                  {/* Author */}
                  <div className="flex items-center">
                    {avatar && (
                      <img
                        src={avatar}
                        alt={testimonial.title}
                        className="w-12 h-12 rounded-full border-2 border-blue-500/30 mr-4"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.title}</h4>
                      <p className="text-sm text-slate-400">{testimonial.subtitle}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-4 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
