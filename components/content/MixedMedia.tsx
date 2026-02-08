'use client';

import Image from 'next/image';
import { Calendar, User } from 'lucide-react';

interface MixedMediaProps {
  title: string;
  content: string; // HTML content
  images?: string[];
  description?: string;
  category?: string;
  createdAt?: string;
  author?: string;
  className?: string;
}

export default function MixedMedia({
  title,
  content,
  images = [],
  description,
  category,
  createdAt,
  author,
  className = '',
}: MixedMediaProps) {
  return (
    <article className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="space-y-3">
        {category && (
          <span className="text-sm bg-blue-100 px-3 py-1 rounded-full">
            {category}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>

        {(createdAt || author) && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {description && (
          <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Additional Images Gallery */}
      {images && images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
