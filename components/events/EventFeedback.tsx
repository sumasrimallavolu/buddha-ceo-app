'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, MessageSquare, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface FeedbackDisplay {
  id: string;
  videoUrl?: string;
  videoCaption?: string;
  comment?: string;
  photoUrl?: string;
  photoCaption?: string;
  userName: string;
  createdAt: string;
}

interface FeedbackStats {
  totalVideos: number;
  totalComments: number;
  totalPhotos: number;
}

interface FeedbackResponse {
  success: boolean;
  feedback?: {
    videos: FeedbackDisplay[];
    comments: FeedbackDisplay[];
    photos: FeedbackDisplay[];
    stats: FeedbackStats;
  };
}

interface EventFeedbackProps {
  eventId: string;
}

export function EventFeedback({ eventId }: EventFeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [eventId]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/feedback`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!feedbacks?.success || !feedbacks.feedback) {
    return null;
  }

  const { videos, comments, photos, stats } = feedbacks.feedback;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Video className="h-5 w-5 text-blue-400" />
              <div className="text-3xl font-bold text-white">
                {stats.totalVideos}
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {stats.totalVideos === 1 ? 'video' : 'videos'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-emerald-400" />
              <div className="text-3xl font-bold text-white">
                {stats.totalComments}
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {stats.totalComments === 1 ? 'comment' : 'comments'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ImageIcon className="h-5 w-5 text-violet-400" />
              <div className="text-3xl font-bold text-white">
                {stats.totalPhotos}
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {stats.totalPhotos === 1 ? 'photo' : 'photos'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-400" />
              Event Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{video.userName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="relative rounded-lg overflow-hidden border border-white/10">
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full"
                    />
                  </div>
                  {video.videoCaption && (
                    <p className="text-slate-300 text-sm mt-2">{video.videoCaption}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      {comments.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{comment.userName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-slate-300">{comment.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos Section */}
      {photos.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-violet-400" />
              Event Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative h-48 rounded-lg overflow-hidden border border-white/10"
                >
                  <Image
                    src={photo.photoUrl || ''}
                    alt={photo.photoCaption || 'Event photo'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium">
                        {photo.userName}
                      </p>
                      {photo.photoCaption && (
                        <p className="text-slate-300 text-xs mt-1">
                          {photo.photoCaption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Feedback Message */}
      {videos.length === 0 && comments.length === 0 && photos.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Feedback Yet</h3>
            <p className="text-slate-400">
              Be the first to share your experience about this event!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
