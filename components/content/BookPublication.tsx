'use client';

import Image from 'next/image';
import { Book, Download, ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookPublicationProps {
  title: string;
  author?: string;
  coverImage?: string;
  description?: string;
  category?: string;
  isbn?: string;
  pages?: string;
  downloadUrl?: string;
  purchaseUrl?: string;
  className?: string;
}

export default function BookPublication({
  title,
  author,
  coverImage,
  description,
  category,
  isbn,
  pages,
  downloadUrl,
  purchaseUrl,
  className = '',
}: BookPublicationProps) {
  return (
    <div className={`flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Cover Image */}
      {coverImage && (
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="relative aspect-[3/4] shadow-lg rounded-lg overflow-hidden">
            <Image
              src={coverImage}
              alt={`Cover of ${title}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Book Details */}
      <div className="flex-1 space-y-4">
        <div>
          {category && (
            <span className="text-sm bg-blue-100 px-3 py-1 rounded-full inline-block mb-2">
              {category}
            </span>
          )}
          <h3 className="text-2xl font-bold">{title}</h3>
          {author && (
            <p className="text-lg text-blue-700 font-medium">By {author}</p>
          )}
        </div>

        {(isbn || pages) && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {isbn && (
              <div>
                <span className="font-medium">ISBN:</span> {isbn}
              </div>
            )}
            {pages && (
              <div>
                <span className="font-medium">Pages:</span> {pages}
              </div>
            )}
          </div>
        )}

        {description && (
          <p className="text-gray-600 leading-relaxed">{description}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {downloadUrl && (
            <Button asChild>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          )}
          {purchaseUrl && (
            <Button variant="outline" asChild>
              <a href={purchaseUrl} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase
              </a>
            </Button>
          )}
          {!downloadUrl && !purchaseUrl && (
            <Button variant="outline" disabled>
              <Book className="h-4 w-4 mr-2" />
              Not Available
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
