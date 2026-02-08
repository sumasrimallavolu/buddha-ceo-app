'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, CheckCircle2, X, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReviewContentPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState<any>(null);

  const contentId = params.id as string;

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'admin' && session.user.role !== 'content_manager') {
      router.push('/admin');
      return;
    }

    if (contentId) {
      fetchContent();
    }
  }, [session, contentId, router]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve content');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve content');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject content');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject content');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPreview = () => {
    if (!content) return null;

    switch (content.type) {
      case 'photos':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            {content.content?.category && (
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {content.content.category}
              </Badge>
            )}
            {content.content?.description && (
              <p className="text-slate-300 mt-2">{content.content.description}</p>
            )}
            {content.content?.imageUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                <img
                  src={content.content.imageUrl}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        );

      case 'mentors':
      case 'founders':
      case 'steering_committee':
        return (
          <div className="flex gap-6">
            {content.content?.image && (
              <div className="w-48 flex-shrink-0">
                <div className="relative aspect-square rounded-full overflow-hidden border border-white/10">
                  <Image
                    src={content.content.image}
                    alt={content.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{content.title}</h3>
                {content.content?.role && (
                  <p className="text-blue-400 font-medium">{content.content.role}</p>
                )}
              </div>
              {content.content?.bio && (
                <p className="text-slate-300">{content.content.bio}</p>
              )}
              {content.content?.quote && (
                <blockquote className="text-lg italic text-slate-300 border-l-4 border-blue-500 pl-4">
                  "{content.content.quote}"
                </blockquote>
              )}
            </div>
          </div>
        );
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">{content.title}</h3>
            {content.content?.category && (
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {content.content.category}
              </Badge>
            )}
            {content.content?.description && (
              <p className="text-slate-300 mt-2">{content.content.description}</p>
            )}

            {/* Book preview */}
            {content.content?.author && (
              <div className="flex gap-6 mt-4 border-t border-white/10 pt-4">
                {content.content?.coverImage && (
                  <div className="w-48 flex-shrink-0">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={content.content.coverImage}
                        alt="Cover"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-slate-300">By {content.content.author}</p>
                  {content.content?.isbn && <p className="text-slate-400 text-sm">ISBN: {content.content.isbn}</p>}
                  {content.content?.pages && <p className="text-slate-400 text-sm">{content.content.pages} pages</p>}
                  <div className="flex gap-2 mt-4">
                    {content.content?.downloadUrl && <Button size="sm">Download</Button>}
                    {content.content?.purchaseUrl && <Button size="sm" variant="outline">Purchase</Button>}
                  </div>
                </div>
              </div>
            )}

            {/* Video preview */}
            {content.content?.videoUrl && (
              <div className="aspect-video bg-white/5 rounded flex items-center justify-center border border-white/10">
                <Eye className="w-8 h-8 text-slate-400 mr-2" />
                <span className="text-slate-400">Video content</span>
              </div>
            )}

            {/* Article preview */}
            {content.content?.content && (
              <div className="prose prose-invert max-w-none mt-4 bg-white/5 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: content.content.content }} />
              </div>
            )}

            {/* Link preview */}
            {content.content?.linkUrl && (
              <div className="mt-4">
                <a
                  href={content.content.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {content.content.linkUrl}
                </a>
              </div>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Review Content</h1>
            <p className="text-slate-400">Review and approve or reject this content</p>
          </div>
        </div>
        <Badge className="capitalize bg-blue-500/20 text-blue-400 border border-blue-500/30">
          {content?.type}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Card */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
                <X className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 mb-6">
                <CheckCircle2 className="h-5 w-5" />
                <p>Content updated successfully!</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Title</h3>
                <p className="text-xl font-semibold text-white">{content?.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Status</h3>
                  <Badge className={
                    content?.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    content?.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                    content?.status === 'published' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {content?.status === 'pending_review' ? 'Pending Review' :
                     content?.status === 'draft' ? 'Draft' :
                     content?.status === 'published' ? 'Published' : 'Archived'}
                  </Badge>
                </div>

                {content?.isFeatured && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Featured</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      Featured on homepage
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Content Preview</h3>
                {content && renderPreview()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Review Actions</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Approve</h4>
                <p className="text-sm text-slate-500 mb-4">
                  This content will be published to the website immediately.
                </p>
                <Button
                  onClick={handleApprove}
                  disabled={submitting || content?.status === 'published'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve Content
                    </>
                  )}
                </Button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-2">Reject</h4>
                <p className="text-sm text-slate-500 mb-4">
                  Return to draft status and request changes. You'll need to provide a reason.
                </p>
                <Button
                  onClick={handleReject}
                  disabled={submitting}
                  variant="destructive"
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Reject Content
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link href={`/admin/content/edit/${contentId}`}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                    Edit Content Instead
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
