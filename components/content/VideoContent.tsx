'use client';

import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface VideoContentProps {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  description?: string;
  category?: string;
  className?: string;
}

export default function VideoContent({
  title,
  videoUrl,
  thumbnail,
  description,
  category,
  className = '',
}: VideoContentProps) {
  const [embedUrl, setEmbedUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Convert YouTube URL to embed URL
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';

      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop() || '';
      } else if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
      }

      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    } else if (videoUrl.includes('vimeo.com')) {
      const videoId = videoUrl.split('/').pop() || '';
      setEmbedUrl(`https://player.vimeo.com/video/${videoId}`);
    } else {
      setEmbedUrl(videoUrl);
    }
  }, [videoUrl, thumbnail]);

  const getYoutubeThumbnail = () => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let videoId = '';
      if (videoUrl.includes('youtu.be')) {
        videoId = videoUrl.split('/').pop() || '';
      } else if (videoUrl.includes('v=')) {
        videoId = videoId.split('v=')[1]?.split('&')[0] || '';
      }
      return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return thumbnail || '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        {category && (
          <span className="text-sm bg-purple-100 px-3 py-1 rounded-full">
            {category}
          </span>
        )}
        <h3 className="text-2xl font-bold">{title}</h3>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      <div className="relative aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
        {isPlaying && embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
            {thumbnail || getYoutubeThumbnail() ? (
              <Image
                src={thumbnail || getYoutubeThumbnail()}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <p className="text-gray-400">Video thumbnail not available</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-purple-600 ml-1" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(videoUrl, '_blank')}
        >
          Open in New Tab
        </Button>
      </div>
    </div>
  );
}
