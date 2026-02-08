'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload, RichTextEditor } from '@/components/admin';
import { Loader2, CheckCircle2, Image as ImageIcon, Users, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export default function NewContentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const [contentType, setContentType] = useState<string>('photos');
  const [teamType, setTeamType] = useState<string>('mentor'); // Sub-type for team members
  const [formData, setFormData] = useState({
    title: '',
    category: 'Community',
    imageUrl: '',
    description: '',
    videoUrl: '',
    role: '',
    bio: '',
    quote: '',
    isFeatured: false,
  });

  const categories = ['Sessions', 'Nature', 'Community', 'Practice', 'Wellness', 'Morning', 'Events', 'Retreats', 'Other'];
  const MAX_WORDS = 100;

  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  if (!canEdit) {
    router.push('/admin');
    return null;
  }

  // Word count helper
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError('');
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const contentData: Record<string, any> = {
        category: formData.category,
      };

      switch (contentType) {
        case 'photos':
          if (!formData.imageUrl && uploadedImages.length === 0) {
            setError('Please upload an image');
            setLoading(false);
            return;
          }
          contentData.imageUrl = formData.imageUrl || uploadedImages[0]?.url;

          // Validate and add description
          if (formData.description.trim()) {
            const wordCount = countWords(formData.description);
            if (wordCount > MAX_WORDS) {
              setError(`Description must be ${MAX_WORDS} words or less (currently ${wordCount} words)`);
              setLoading(false);
              return;
            }
            contentData.description = formData.description.trim();
          }
          break;

        case 'mentors':
        case 'founders':
        case 'steering_committee':
          if (!formData.role.trim()) {
            setError('Role is required');
            setLoading(false);
            return;
          }
          if (!formData.bio.trim()) {
            setError('Bio is required');
            setLoading(false);
            return;
          }
          contentData.role = formData.role;
          contentData.bio = formData.bio;
          contentData.image = formData.imageUrl || uploadedImages[0]?.url;
          contentData.quote = formData.quote;
          contentData.videoUrl = formData.videoUrl;

          // For founders, add the sub-type
          if (contentType === 'founders') {
            contentData.subType = teamType; // 'founder', 'co_founder', 'trustee'
          } else if (contentType === 'steering_committee') {
            contentData.subType = teamType; // 'chair', 'member', 'secretary'
          }
          break;
      }

      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          type: contentType,
          status: saveAsDraft ? 'draft' : 'pending_review',
          content: contentData,
          thumbnailUrl: formData.imageUrl || uploadedImages[0]?.url,
          isFeatured: formData.isFeatured,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create content');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/content');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Create New Content</h1>
          <p className="text-slate-400 text-sm">Add photos or team members to your website</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Content created successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      {/* Content Type Selector */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: 'photos', label: 'Photos', icon: ImageIcon, desc: 'Gallery images' },
          { value: 'mentors', label: 'Team Members', icon: Users, desc: 'Mentors, founders, committee' },
        ].map((type) => {
          const Icon = type.icon;
          const isSelected = contentType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setContentType(type.value)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
              <div className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {type.label}
              </div>
              <div className="text-xs text-slate-400">{type.desc}</div>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-500 text-white">Selected</Badge>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Form Card */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="pt-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white text-sm font-medium">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter a descriptive title"
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Photos Form */}
          {contentType === 'photos' && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-semibold">Photo Details</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Image <span className="text-red-400">*</span></Label>
                <ImageUpload
                  images={uploadedImages}
                  onImagesChange={(images) => {
                    setUploadedImages(images);
                    if (images.length > 0) {
                      setFormData({ ...formData, imageUrl: images[0].url });
                    }
                  }}
                  maxImages={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoDescription" className="text-slate-300 text-sm">
                  Description <span className="text-slate-500 font-normal">(max {MAX_WORDS} words)</span>
                </Label>
                <Textarea
                  id="photoDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add a description or caption for this photo..."
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {countWords(formData.description)} / {MAX_WORDS} words
                  </span>
                  {countWords(formData.description) > MAX_WORDS && (
                    <span className="text-red-400 font-medium">
                      {countWords(formData.description) - MAX_WORDS} words over limit
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoCategory" className="text-slate-300 text-sm">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="photoCategory" className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-white">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Team Members Form - Unified for Mentors, Founders, Steering Committee */}
          {(contentType === 'mentors' || contentType === 'founders' || contentType === 'steering_committee') && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-semibold">Team Member Details</h3>
              </div>

              {/* Team Type Selector */}
              <div className="space-y-2">
                <Label htmlFor="teamType" className="text-slate-300 text-sm">
                  Team Type <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={teamType}
                  onValueChange={(value) => {
                    setTeamType(value);
                    if (value === 'mentor') setContentType('mentors');
                    else if (value === 'founder') setContentType('founders');
                    else if (value === 'committee') setContentType('steering_committee');
                  }}
                >
                  <SelectTrigger id="teamType" className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select team type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    <SelectItem value="mentor" className="text-white">Mentor - Teacher/Guide</SelectItem>
                    <SelectItem value="founder" className="text-white">Founder - Founder/Trustee</SelectItem>
                    <SelectItem value="committee" className="text-white">Steering Committee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-300 text-sm">
                    Role <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Meditation Teacher, Founder, Chair"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-slate-300 text-sm">Video URL (optional)</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-300 text-sm">
                  Bio <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief biography..."
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote" className="text-slate-300 text-sm">Quote (optional)</Label>
                <Input
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Inspirational quote..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 text-sm">Photo <span className="text-red-400">*</span></Label>
                <ImageUpload
                  images={uploadedImages}
                  onImagesChange={(images) => {
                    setUploadedImages(images);
                    if (images.length > 0) {
                      setFormData({ ...formData, imageUrl: images[0].url });
                    }
                  }}
                  maxImages={1}
                />
              </div>
            </div>
          )}

          {/* Featured checkbox */}
          <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
            <Checkbox
              id="featured"
              checked={formData.isFeatured}
              onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked as boolean })}
              disabled={loading}
            />
            <Label htmlFor="featured" className="cursor-pointer text-slate-300">
              Feature on homepage
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link href="/admin/content">
          <Button variant="outline" disabled={loading} className="border-white/10 text-slate-300 hover:bg-white/5">
            Cancel
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="border-white/10 text-slate-300 hover:bg-white/5"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Draft'}
        </Button>
        <Button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Publish'}
        </Button>
      </div>
    </div>
  );
}
