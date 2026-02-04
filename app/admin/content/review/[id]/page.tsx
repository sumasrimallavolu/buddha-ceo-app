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
            <h3 className="text-2xl font-bold">{content.title}</h3>
            {content.content?.description && (
              <p className="text-gray-600">{content.content.description}</p>
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
                    <p className="text-sm mt-2 text-gray-600">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'video_content':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{content.title}</h3>
            {content.content?.category && (
              <span className="text-sm bg-purple-100 px-3 py-1 rounded-full">
                {content.content.category}
              </span>
            )}
            {content.content?.description && (
              <p className="text-gray-600 mt-4">{content.content.description}</p>
            )}
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
              {content.content?.videoUrl ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Video Preview</p>
                  <a
                    href={content.content.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    {content.content.videoUrl}
                  </a>
                </div>
              ) : (
                <p className="text-gray-400">No video URL provided</p>
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
              <h3 className="text-2xl font-bold">{content.title}</h3>
              {content.content?.author && (
                <p className="text-lg text-gray-600 mt-2">By {content.content.author}</p>
              )}
              {content.content?.category && (
                <span className="text-sm bg-purple-100 px-3 py-1 rounded-full inline-block mt-2">
                  {content.content.category}
                </span>
              )}
              {content.content?.description && (
                <p className="text-gray-600 mt-4">{content.content.description}</p>
              )}
              <div className="flex gap-4 mt-6">
                {content.content?.downloadUrl && (
                  <Button>Download</Button>
                )}
                {content.content?.purchaseUrl && (
                  <Button variant="outline">Purchase</Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'mixed_media':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{content.title}</h3>
            {content.content?.category && (
              <span className="text-sm bg-purple-100 px-3 py-1 rounded-full">
                {content.content.category}
              </span>
            )}
            <div className="prose max-w-none">
              {content.content?.content ? (
                <div dangerouslySetInnerHTML={{ __html: content.content.content }} />
              ) : (
                <p className="text-gray-400">No content added yet</p>
              )}
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{content.title}</h3>
            {content.content?.subtitle && (
              <p className="text-purple-600 font-medium">{content.content.subtitle}</p>
            )}
            {content.content?.quote && (
              <blockquote className="text-lg italic text-gray-700 border-l-4 border-purple-600 pl-4">
                "{content.content.quote}"
              </blockquote>
            )}
            {content.content?.videoUrl && (
              <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                <a
                  href={content.content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline"
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
              <h3 className="text-2xl font-bold">{content.title}</h3>
              {content.content?.role && (
                <p className="text-purple-600 font-medium">{content.content.role}</p>
              )}
              {content.content?.bio && (
                <p className="text-gray-600 mt-4">{content.content.bio}</p>
              )}
              {content.content?.quote && (
                <blockquote className="text-sm italic text-gray-600 mt-4 border-l-2 border-gray-300 pl-3">
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
                <h3 className="text-2xl font-bold">{content.title}</h3>
                {content.content?.year && (
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    {content.content.year}
                  </span>
                )}
                {content.content?.category && (
                  <span className="text-sm bg-purple-100 px-3 py-1 rounded-full ml-2">
                    {content.content.category}
                  </span>
                )}
              </div>
            </div>
            {content.content?.description && (
              <p className="text-gray-600">{content.content.description}</p>
            )}
            {content.content?.highlights?.length > 0 && (
              <ul className="list-disc list-inside space-y-2">
                {content.content.highlights.map((highlight: string, i: number) => (
                  <li key={i} className="text-gray-700">{highlight}</li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{content.title}</h3>
            <p className="text-gray-600">
              {content.content?.description || 'No description provided'}
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Content not found</p>
        <Link href="/admin/content">
          <Button className="mt-4">Back to Content</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content?status=pending_review">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Review Content</h1>
          <p className="mt-2 text-gray-600">
            Review and approve or reject this content
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="preview" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="details" className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="review" className="flex-1">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {renderContentPreview()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Metadata</CardTitle>
              <CardDescription>View all details about this content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Title</Label>
                  <p className="font-medium">{content.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{content.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    content.status === 'published' ? 'bg-green-100 text-green-700' :
                    content.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {content.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <Label className="text-muted-foreground">Layout</Label>
                  <p className="font-medium capitalize">{content.layout || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Created By
                  </Label>
                  <p className="font-medium">{content.createdBy?.name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{content.createdBy?.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created Date
                  </Label>
                  <p className="font-medium">
                    {new Date(content.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {content.isFeatured && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-700">
                    ⭐ This content is marked as featured and will appear on the homepage
                  </p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <Label className="text-muted-foreground">Raw Content Data</Label>
                <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(content.content, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Decision</CardTitle>
              <CardDescription>
                Approve to publish on the website, or reject with feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none text-sm text-gray-600">
                <p>
                  Review the content carefully before making a decision. Once approved,
                  this content will be immediately visible on the public website.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">✓ Approve</h4>
                  <p className="text-sm text-green-700">
                    Content will be published immediately and visible to all visitors
                  </p>
                  <Button
                    onClick={handleApprove}
                    disabled={submitting}
                    className="mt-3 bg-green-600 hover:bg-green-700"
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

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">✗ Reject</h4>
                  <p className="text-sm text-red-700">
                    Content will be returned to the content manager with feedback
                  </p>
                  <div className="mt-3 space-y-2">
                    <Label htmlFor="rejectionReason">Reason for rejection (required)</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain what needs to be improved..."
                      rows={4}
                      className="bg-white"
                    />
                    <Button
                      onClick={handleReject}
                      disabled={submitting || !rejectionReason.trim()}
                      variant="destructive"
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
