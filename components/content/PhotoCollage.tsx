'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface Photo {
  url: string;
  alt?: string;
  caption?: string;
}

interface PhotoCollageProps {
  title: string;
  photos: Photo[];
  layout?: 'grid' | 'masonry' | 'slider';
  description?: string;
  className?: string;
}

export default function PhotoCollage({
  title,
  photos,
  layout = 'grid',
  description,
  className = '',
}: PhotoCollageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (layout === 'slider') {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && <h3 className="text-2xl font-bold text-center">{title}</h3>}
        {description && <p className="text-gray-600 text-center">{description}</p>}

        <div className="relative aspect-video max-w-4xl mx-auto">
          {photos.length > 0 && (
            <div className="relative w-full h-full">
              <Image
                src={photos[currentIndex].url}
                alt={photos[currentIndex].alt || title}
                fill
                className="object-cover rounded-lg cursor-pointer"
                onClick={() => {
                  setLightboxIndex(currentIndex);
                  setLightboxOpen(true);
                }}
              />
              {photos[currentIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm">{photos[currentIndex].caption}</p>
                </div>
              )}
            </div>
          )}

          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={() => setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'masonry') {
    return (
      <div className={`space-y-4 ${className}`}>
        {title && <h3 className="text-2xl font-bold">{title}</h3>}
        {description && <p className="text-gray-600">{description}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`relative ${
                index % 3 === 0 ? 'md:row-span-2' : ''
              } group cursor-pointer`}
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <div className={`${index % 3 === 0 ? 'md:h-[400px]' : 'md:h-[190px]'} h-[250px]`}>
                <Image
                  src={photo.url}
                  alt={photo.alt || `${title} ${index + 1}`}
                  fill
                  className="object-cover rounded-lg transition-transform group-hover:scale-105"
                />
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-5xl">
            <div className="relative aspect-video">
              <Image
                src={photos[lightboxIndex]?.url}
                alt={photos[lightboxIndex]?.alt || title}
                fill
                className="object-contain"
              />
              {photos[lightboxIndex]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white">{photos[lightboxIndex].caption}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h3 className="text-2xl font-bold">{title}</h3>}
      {description && <p className="text-gray-600">{description}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative aspect-square group cursor-pointer"
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={photo.url}
              alt={photo.alt || `${title} ${index + 1}`}
              fill
              className="object-cover rounded-lg transition-transform group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl">
          <div className="relative aspect-video">
            <Image
              src={photos[lightboxIndex]?.url}
              alt={photos[lightboxIndex]?.alt || title}
              fill
              className="object-contain"
            />
            {photos[lightboxIndex]?.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white">{photos[lightboxIndex].caption}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
