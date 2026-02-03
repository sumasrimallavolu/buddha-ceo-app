'use client';

import { useState } from 'react';
import { Play, Youtube, Heart, Eye } from 'lucide-react';

export function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 'MSUXw7Dxle8',
      title: 'Guided Morning Meditation',
      description: 'Start your day with peace and clarity',
      thumbnail: 'https://i.ytimg.com/vi/MSUXw7Dxle8/hqdefault.jpg',
      duration: '15:30',
      views: '125K',
      category: 'Morning Practice'
    },
    {
      id: 's4vH34O7rOs',
      title: 'Stress Relief Meditation',
      description: 'Release anxiety and find inner calm',
      thumbnail: 'https://i.ytimg.com/vi/s4vH34O7rOs/hqdefault.jpg',
      duration: '20:15',
      views: '89K',
      category: 'Stress Relief'
    },
    {
      id: '9QSKyMf98uY',
      title: 'Deep Sleep Meditation',
      description: 'Drift into peaceful, restful sleep',
      thumbnail: 'https://i.ytimg.com/vi/9QSKyMf98uY/hqdefault.jpg',
      duration: '30:00',
      views: '234K',
      category: 'Sleep'
    },
    {
      id: '_5NTRAnF-Ic',
      title: 'Mindfulness for Beginners',
      description: 'Learn the basics of mindfulness',
      thumbnail: 'https://i.ytimg.com/vi/_5NTRAnF-Ic/hqdefault.jpg',
      duration: '18:45',
      views: '156K',
      category: 'Beginners'
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm text-purple-700 text-sm font-medium border border-purple-200/50 mb-6 shadow-sm">
            <Youtube className="w-4 h-4 text-red-500" />
            <span>Video Library</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Guided Meditations & Resources
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Explore our collection of free guided meditations, talks, and practices to support your journey
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.slice(1).map((video) => (
            <div
              key={video.id}
              className="group bg-white/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/60 hover:scale-105"
            >
              <div className="relative aspect-video overflow-hidden">
                {activeVideo === video.id ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white font-medium">
                      {video.duration}
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {video.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="w-3 h-3" />
                    {video.views}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{video.description}</p>

                <button
                  onClick={() => activeVideo === video.id ? setActiveVideo(null) : setActiveVideo(video.id)}
                  className="w-full mt-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Youtube className="w-4 h-4" />
                  {activeVideo === video.id ? 'Close' : 'Watch Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/60 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Subscribe to Our Channel
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Get weekly guided meditations, talks, and inspiration delivered to you
            </p>
            <a
              href="https://youtube.com/@BuddhaCEO"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              <Youtube className="w-5 h-5" />
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
