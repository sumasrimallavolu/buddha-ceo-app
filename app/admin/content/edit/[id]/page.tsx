'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [richTextContent, setRichTextContent] = useState('');

  const contentId = params.id as string;
  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  useEffect(() => {
    if (!canEdit && session) {
      router.push('/admin');
      return;
    }

    if (canEdit && contentId) {
      fetchContent();
    }
  }, [canEdit, contentId, session]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/admin/content/${contentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch content');
      }

      setContent(data);

      // Initialize rich text content for founders type
      if (data.type === 'founders' && data.content?.content) {
        setRichTextContent(data.content.content);
      }

      // Initialize uploaded images
      if (data.content?.imageUrl) {
        setUploadedImages([{ url: data.content.imageUrl, filename: '', size: 0, type: '' }]);
      } else if (data.content?.image) {
        setUploadedImages([{ url: data.content.image, filename: '', size: 0, type: '' }]);
      } else if (data.content?.coverImage) {
        setUploadedImages([{ url: data.content.coverImage, filename: '', size: 0, type: '' }]);
      } else if (data.content?.thumbnail) {
        setUploadedImages([{ url: data.content.thumbnail, filename: '', size: 0, type: '' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (field: string, value: string) => {
    setContent({
      ...content,
      content: {
        ...content.content,
        [field]: value,
      },
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);

    if (!content.title) {
      setError('Title is required');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: content.title,
          type: content.type,
          content: content.content,
          thumbnailUrl: uploadedImages[0]?.url || content.content?.imageUrl || content.content?.image,
          order: content.order,
          isFeatured: content.isFeatured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update content');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  const renderPhotosForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Image</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={(images) => {
            setUploadedImages(images);
            if (images.length > 0) {
              handleUpdateField('imageUrl', images[0].url);
            }
          }}
          maxImages={1}
        />
      </div>

      {content.content?.imageUrl && uploadedImages.length === 0 && (
        <div className="rounded-lg overflow-hidden border border-white/10">
          <img src={content.content.imageUrl} alt="Current" className="w-full h-48 object-cover" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={content.content?.category || 'Community'}
          onValueChange={(value) => handleUpdateField('category', value)}
        >
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['Sessions', 'Nature', 'Community', 'Practice', 'Wellness', 'Morning', 'Events', 'Retreats', 'Other'].map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          value={content.order || 0}
          onChange={(e) => setContent({ ...content, order: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  );

  const renderMentorsForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={content.content?.role || ''}
          onChange={(e) => handleUpdateField('role', e.target.value)}
          placeholder="e.g., Meditation Teacher"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={content.content?.bio || ''}
          onChange={(e) => handleUpdateField('bio', e.target.value)}
          placeholder="Brief biography..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote (Optional)</Label>
        <Input
          id="quote"
          value={content.content?.quote || ''}
          onChange={(e) => handleUpdateField('quote', e.target.value)}
          placeholder="Inspirational quote..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (Optional)</Label>
        <Input
          id="videoUrl"
          value={content.content?.videoUrl || ''}
          onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={(images) => {
            setUploadedImages(images);
            if (images.length > 0) {
              handleUpdateField('image', images[0].url);
            }
          }}
          maxImages={1}
        />
      </div>

      {content.content?.image && uploadedImages.length === 0 && (
        <div className="rounded-lg overflow-hidden border border-white/10 w-32">
          <img src={content.content.image} alt="Current" className="w-full h-32 object-cover" />
        </div>
      )}
    </div>
  );

  const renderFoundersForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={content.content?.role || ''}
          onChange={(e) => handleUpdateField('role', e.target.value)}
          placeholder="e.g., Founder, Chairman, Trustee"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={content.content?.bio || ''}
          onChange={(e) => handleUpdateField('bio', e.target.value)}
          placeholder="Brief biography..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote (Optional)</Label>
        <Input
          id="quote"
          value={content.content?.quote || ''}
          onChange={(e) => handleUpdateField('quote', e.target.value)}
          placeholder="Inspirational quote..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (Optional)</Label>
        <Input
          id="videoUrl"
          value={content.content?.videoUrl || ''}
          onChange={(e) => handleUpdateField('videoUrl', e.target.value)}
          placeholder="https://youtube.com/..."
        />
      </div>

      <div className="space-y-2">
        <Label>Photo</Label>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={(images) => {
            setUploadedImages(images);
            if (images.length > 0) {
              handleUpdateField('image', images[0].url);
            }
          }}
          maxImages={1}
        />
      </div>

      {content.content?.image && uploadedImages.length === 0 && (
        <div className="rounded-lg overflow-hidden border border-white/10 w-32">
          <img src={content.content.image} alt="Current" className="w-full h-32 object-cover" />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Edit Content</h1>
          <p className="text-slate-400">Update your content</p>
        </div>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500 bg-green-50 text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Content updated successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter title"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Content Type</Label>
              <Input
                value={
                  content.type === 'photos' ? 'Photos' :
                  content.type === 'mentors' ? 'Mentors' :
                  content.type === 'founders' ? 'Founders & Trustees' :
                  content.type === 'steering_committee' ? 'Steering Committee' :
                  content.type
                }
                disabled
              />
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-lg font-semibold mb-4 text-white">
                {content.type === 'photos' && 'Photo Details'}
                {content.type === 'mentors' && 'Mentor Details'}
                {content.type === 'founders' && 'Founder & Trustee Details'}
                {content.type === 'steering_committee' && 'Steering Committee Details'}
              </h3>

              {content.type === 'photos' && renderPhotosForm()}
              {content.type === 'mentors' && renderMentorsForm()}
              {content.type === 'founders' && renderFoundersForm()}
              {content.type === 'steering_committee' && renderFoundersForm()}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={content.isFeatured || false}
                onCheckedChange={(checked) => setContent({ ...content, isFeatured: checked })}
                disabled={saving}
              />
              <Label htmlFor="featured" className="cursor-pointer">Feature on homepage</Label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/10">
              <Link href="/admin/content">
                <Button type="button" variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
