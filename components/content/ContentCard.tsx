'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Book, Video, Images } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ContentCardProps {
  content: {
    _id: string;
    title: string;
    type: string;
    thumbnailUrl?: string;
    content: any;
    publishedAt?: string;
    createdAt?: string;
  };
  className?: string;
}

export default function ContentCard({ content, className = '' }: ContentCardProps) {
  const getTypeIcon = () => {
    switch (content.type) {
      case 'photo_collage':
        return <Images className="h-4 w-4" />;
      case 'video_content':
        return <Video className="h-4 w-4" />;
      case 'book_publication':
        return <Book className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getThumbnail = () => {
    if (content.thumbnailUrl) return content.thumbnailUrl;

    // Fallback based on content type
    if (content.type === 'photo_collage' && content.content?.images?.[0]?.url) {
      return content.content.images[0].url;
    }
    if (content.type === 'book_publication' && content.content?.coverImage) {
      return content.content.coverImage;
    }
    if (content.type === 'video_content' && content.content?.thumbnail) {
      return content.content.thumbnail;
    }

    return null;
  };

  const thumbnail = getThumbnail();

  return (
    <Link href={`/content/${content._id}`}>
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer h-full ${className}`}>
        {thumbnail && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image
              src={thumbnail}
              alt={content.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className="bg-white/90 text-black">
                {getTypeIcon()}
                <span className="ml-1 capitalize">
                  {content.type.replace('_', ' ')}
                </span>
              </Badge>
            </div>
          </div>
        )}

        <CardHeader>
          <CardTitle className="line-clamp-2">{content.title}</CardTitle>
          {content.content?.description && (
            <CardDescription className="line-clamp-2">
              {content.content.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(content.publishedAt || content.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
