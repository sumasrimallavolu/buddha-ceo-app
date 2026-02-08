'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Star,
  MessageSquare,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import Image from 'next/image';

interface FeedbackFormProps {
  eventId: string;
  eventTitle: string;
  eventEndDate: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FeedbackType = 'rating' | 'comment' | 'photo';

export function FeedbackForm({
  eventId,
  eventTitle,
  eventEndDate,
  onSuccess,
  onCancel,
}: FeedbackFormProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<FeedbackType>('rating');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Rating state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Comment state
  const [comment, setComment] = useState('');

  // Photo state
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  const handleSubmit = async (type: FeedbackType) => {
    if (!session?.user) {
      setError('You must be signed in to submit feedback');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let body: any = { type };

      if (type === 'rating') {
        if (rating === 0) {
          setError('Please select a rating');
          setLoading(false);
          return;
        }
        body.rating = rating;
      } else if (type === 'comment') {
        if (!comment.trim()) {
          setError('Please enter a comment');
          setLoading(false);
          return;
        }
        body.comment = comment.trim();
      } else if (type === 'photo') {
        if (!photoUrl.trim()) {
          setError('Please provide a photo URL');
          setLoading(false);
          return;
        }
        body.photoUrl = photoUrl.trim();
        if (photoCaption.trim()) {
          body.photoCaption = photoCaption.trim();
        }
      }

      const response = await fetch(`/api/events/${eventId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to submit feedback');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Reset form
      setRating(0);
      setComment('');
      setPhotoUrl('');
      setPhotoCaption('');
      setPhotoPreview('');

      // Call success callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'rating' as FeedbackType, label: 'Rating', icon: Star },
    { id: 'comment' as FeedbackType, label: 'Comment', icon: MessageSquare },
    { id: 'photo' as FeedbackType, label: 'Photo', icon: ImageIcon },
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl">Leave Feedback</CardTitle>
            <p className="text-sm text-slate-400 mt-1">{eventTitle}</p>
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-500/10 border-green-500/30">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">
              Feedback submitted successfully! It will be visible after admin approval.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Rating Form */}
        {activeTab === 'rating' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                How would you rate this event?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-lg font-semibold text-white">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            <Button
              onClick={() => handleSubmit('rating')}
              disabled={loading || success || rating === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submitted!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Rating
                </>
              )}
            </Button>
          </div>
        )}

        {/* Comment Form */}
        {activeTab === 'comment' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Share your experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you liked about this event, what you learned, or any suggestions for improvement..."
                rows={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading || success}
              />
              <p className="text-xs text-slate-500 mt-2">
                {comment.length} characters
              </p>
            </div>

            <Button
              onClick={() => handleSubmit('comment')}
              disabled={loading || success || !comment.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submitted!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Comment
                </>
              )}
            </Button>
          </div>
        )}

        {/* Photo Form */}
        {activeTab === 'photo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Photo URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPhotoPreview(e.target.value);
                }}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || success}
              />
              <p className="text-xs text-slate-500 mt-2">
                Enter a publicly accessible image URL
              </p>
            </div>

            {/* Photo Preview */}
            {photoPreview && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden border border-white/10">
                <Image
                  src={photoPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setPhotoPreview('')}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Caption (optional)
              </label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="Add a description for your photo..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading || success}
              />
            </div>

            <Button
              onClick={() => handleSubmit('photo')}
              disabled={loading || success || !photoUrl.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Submitted!
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Photo
                </>
              )}
            </Button>
          </div>
        )}

        <p className="text-xs text-slate-500 mt-6 text-center">
          All feedback is reviewed by admins before being published
        </p>
      </CardContent>
    </Card>
  );
}
