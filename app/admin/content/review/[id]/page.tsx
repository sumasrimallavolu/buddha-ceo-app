'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Clock,
  User,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReviewContentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [content, setContent] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const contentId = params.id as string;

  // Redirect non-authorized users
  const userRole = session?.user?.role;
  const canReview = userRole === 'admin' || userRole === 'content_reviewer';

  useEffect(() => {
    if (!canReview && session) {
      router.push('/admin');
      return;
    }

    if (canReview && contentId) {
      fetchContent();
    }
  }, [canReview, contentId, session]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve content');
      }

      setSuccess('Content approved successfully!');
      setTimeout(() => {
        router.push('/admin/content?status=pending_review');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject content');
      }

      setSuccess('Content rejected successfully!');
      setTimeout(() => {
        router.push('/admin/content?status=pending_review');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject content');
    } finally {
      setSubmitting(false);
    }
  };

  const renderContentPreview = () => {
    if (!content) return null;

    switch (content.type) {
      case 'photo_collage':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            {content.content?.description && (
              <p className="text-slate-300">{content.content.description}</p>
            )}
            <div className={`grid gap-4 ${
              content.layout === 'masonry' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'
            }`}>
              {content.content?.images?.map((img: any, i: number) => (
                <div key={i} className="relative aspect-square">
                  <Image
                    src={img.url}
                    alt={img.alt || `Photo ${i + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                  {img.caption && (
                    <p className="text-sm mt-2 text-slate-400">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'video_content':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            {content.content?.category && (
              <span className="text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                {content.content.category}
              </span>
            )}
            {content.content?.description && (
              <p className="text-slate-300 mt-4">{content.content.description}</p>
            )}
            <div className="aspect-video bg-white/5 rounded flex items-center justify-center border border-white/10">
              {content.content?.videoUrl ? (
                <div className="text-center">
                  <p className="text-slate-400 mb-2">Video Preview</p>
                  <a
                    href={content.content.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {content.content.videoUrl}
                  </a>
                </div>
              ) : (
                <p className="text-slate-500">No video URL provided</p>
              )}
            </div>
          </div>
        );

      case 'book_publication':
        return (
          <div className="flex gap-6 flex-col md:flex-row">
            {content.content?.coverImage && (
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={content.content.coverImage}
                    alt="Book cover"
                    fill
                    className="object-cover rounded shadow-lg"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{content.title}</h3>
              {content.content?.author && (
                <p className="text-lg text-slate-300 mt-2">By {content.content.author}</p>
              )}
              {content.content?.category && (
                <span className="text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full inline-block mt-2">
                  {content.content.category}
                </span>
              )}
              {content.content?.description && (
                <p className="text-slate-300 mt-4">{content.content.description}</p>
              )}
              <div className="flex gap-4 mt-6">
                {content.content?.downloadUrl && (
                  <Button className="bg-white/5 hover:bg-white/10 border border-white/20 text-white">Download</Button>
                )}
                {content.content?.purchaseUrl && (
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Purchase</Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'mixed_media':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            {content.content?.category && (
              <span className="text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
                {content.content.category}
              </span>
            )}
            <div className="prose prose-invert max-w-none">
              {content.content?.content ? (
                <div dangerouslySetInnerHTML={{ __html: content.content.content }} />
              ) : (
                <p className="text-slate-500">No content added yet</p>
              )}
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            {content.content?.subtitle && (
              <p className="text-blue-400 font-medium">{content.content.subtitle}</p>
            )}
            {content.content?.quote && (
              <blockquote className="text-lg italic text-slate-300 border-l-4 border-amber-500 pl-4">
                "{content.content.quote}"
              </blockquote>
            )}
            {content.content?.videoUrl && (
              <div className="aspect-video bg-white/5 rounded flex items-center justify-center border border-white/10">
                <a
                  href={content.content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  Watch Video
                </a>
              </div>
            )}
          </div>
        );

      case 'team_member':
        return (
          <div className="flex gap-6">
            {content.content?.image && (
              <div className="w-48 flex-shrink-0">
                <div className="relative aspect-square">
                  <Image
                    src={content.content.image}
                    alt={content.title}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">{content.title}</h3>
              {content.content?.role && (
                <p className="text-blue-400 font-medium">{content.content.role}</p>
              )}
              {content.content?.bio && (
                <p className="text-slate-300 mt-4">{content.content.bio}</p>
              )}
              {content.content?.quote && (
                <blockquote className="text-sm italic text-slate-400 mt-4 border-l-2 border-white/20 pl-3">
                  "{content.content.quote}"
                </blockquote>
              )}
            </div>
          </div>
        );

      case 'achievement':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-4xl">
                {content.content?.icon === 'award' && '🏆'}
                {content.content?.icon === 'trending' && '📈'}
                {content.content?.icon === 'users' && '👥'}
                {content.content?.icon === 'target' && '🎯'}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{content.title}</h3>
                {content.content?.year && (
                  <span className="text-sm bg-white/10 text-slate-300 border border-white/20 px-3 py-1 rounded-full">
                    {content.content.year}
                  </span>
                )}
                {content.content?.category && (
                  <span className="text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full ml-2">
                    {content.content.category}
                  </span>
                )}
              </div>
            </div>
            {content.content?.description && (
              <p className="text-slate-300">{content.content.description}</p>
            )}
            {content.content?.highlights?.length > 0 && (
              <ul className="list-disc list-inside space-y-2">
                {content.content.highlights.map((highlight: string, i: number) => (
                  <li key={i} className="text-slate-300">{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            <p className="text-slate-300">
              {content.content?.description || 'No description provided'}
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Content not found</p>
        <Link href="/admin/content">
          <Button className="mt-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white">Back to Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl px-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content?status=pending_review">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">Review Content</h1>
          <p className="mt-2 text-slate-400">
            Review and approve or reject this content
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full bg-slate-900/50 border border-white/10 p-1">
          <TabsTrigger value="preview" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-blue-500/30 text-slate-400 hover:text-slate-300 transition-all">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-blue-500/30 text-slate-400 hover:text-slate-300 transition-all">
            <FileText className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          {userRole === 'content_reviewer' && (
            <TabsTrigger value="review" className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-blue-500/30 text-slate-400 hover:text-slate-300 transition-all">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Review
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              {renderContentPreview()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Content Metadata</CardTitle>
              <CardDescription className="text-slate-400">View all details about this content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-400">Title</Label>
                  <p className="font-medium text-white">{content.title}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Type</Label>
                  <p className="font-medium capitalize text-slate-300">{content.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-slate-400">Status</Label>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    content.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    content.status === 'pending_review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    {content.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <Label className="text-slate-400">Layout</Label>
                  <p className="font-medium capitalize text-slate-300">{content.layout || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-slate-400 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created By
                  </Label>
                  <p className="font-medium text-white">{content.createdBy?.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-500">{content.createdBy?.email}</p>
                </div>
                <div>
                  <Label className="text-slate-400 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created Date
                  </Label>
                  <p className="font-medium text-slate-300">
                    {new Date(content.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {content.isFeatured && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm font-medium text-amber-400">
                    ⭐ This content is marked as featured and will appear on the homepage
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10">
                <Label className="text-slate-400">Raw Content Data</Label>
                <pre className="mt-2 p-4 bg-white/5 border border-white/10 rounded-lg text-xs overflow-x-auto text-slate-300">
                  {JSON.stringify(content.content, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Review Decision</CardTitle>
              <CardDescription className="text-slate-400">
                Approve to publish on the website, or reject with feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-invert max-w-none text-sm text-slate-400">
                <p>
                  Review the content carefully before making a decision. Once approved,
                  this content will be immediately visible on the public website.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <h4 className="font-medium text-emerald-400 mb-2">✓ Approve</h4>
                  <p className="text-sm text-emerald-300">
                    Content will be published immediately and visible to all visitors
                  </p>
                  <Button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve & Publish
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-medium text-red-400 mb-2">✗ Reject</h4>
                  <p className="text-sm text-red-300">
                    Content will be returned to the content manager with feedback
                  </p>
                  <div className="mt-3 space-y-2">
                    <Label htmlFor="rejectionReason" className="text-slate-300">Reason for rejection (required)</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain what needs to be improved..."
                      rows={4}
                    />
                    <Button
                      onClick={handleReject}
                      disabled={submitting || !rejectionReason.trim()}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject with Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
