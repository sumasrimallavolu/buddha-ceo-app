'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, CheckCircle2, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface Highlight {
  text: string;
}

export default function NewContentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [contentType, setContentType] = useState<string>('achievement');
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'achievement',
    description: '',
    icon: 'award',
    category: '',
    year: '',
    image: '',
    role: '',
    bio: '',
    quote: '',
    subtitle: '',
    videoUrl: '',
    linkedin: '',
  });

  // Redirect non-authorized users
  const userRole = session?.user?.role;
  const canEdit = userRole === 'admin' || userRole === 'content_manager';

  if (!canEdit) {
    router.push('/admin');
    return null;
  }

  const handleAddHighlight = () => {
    setHighlights([...highlights, { text: '' }]);
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index].text = value;
    setHighlights(newHighlights);
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError('');
    setSuccess(false);

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    // Build content object based on type
    const contentData: Record<string, any> = {};

    switch (contentType) {
      case 'achievement':
        contentData.icon = formData.icon;
        contentData.description = formData.description;
        contentData.category = formData.category;
        contentData.year = formData.year;
        contentData.highlights = highlights.filter(h => h.text.trim());
        break;

      case 'team_member':
        contentData.role = formData.role;
        contentData.bio = formData.bio;
        contentData.image = formData.image;
        contentData.quote = formData.quote;
        contentData.linkedin = formData.linkedin;
        break;

      case 'testimonial':
        contentData.subtitle = formData.subtitle;
        contentData.videoUrl = formData.videoUrl;
        contentData.image = formData.image;
        contentData.quote = formData.quote;
        break;

      case 'service':
        contentData.description = formData.description;
        break;

      case 'poster':
        contentData.image = formData.image;
        contentData.description = formData.description;
        break;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          type: contentType,
          status: saveAsDraft ? 'draft' : 'pending_review',
          content: contentData,
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

  const renderAchievementForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
            <SelectTrigger id="icon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="award">🏆 Award</SelectItem>
              <SelectItem value="trending">📈 Trending</SelectItem>
              <SelectItem value="users">👥 Users</SelectItem>
              <SelectItem value="target">🎯 Target</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2024"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Impact, Milestone, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the achievement..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Highlights</Label>
          <Button type="button" variant="outline" size="sm" onClick={handleAddHighlight}>
            <Plus className="h-4 w-4 mr-1" />
            Add Highlight
          </Button>
        </div>
        {highlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={highlight.text}
              onChange={(e) => handleHighlightChange(index, e.target.value)}
              placeholder="Highlight point..."
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveHighlight(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeamMemberForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Role/Position</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="Founder & CEO"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Short biography..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote (Optional)</Label>
        <Textarea
          id="quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          placeholder="Inspirational quote..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
        <Input
          id="linkedin"
          value={formData.linkedin}
          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
          placeholder="https://linkedin.com/in/username"
        />
      </div>
    </div>
  );

  const renderTestimonialForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle/Position</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Former Director, CBI"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quote">Quote/Testimonial</Label>
        <Textarea
          id="quote"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
          placeholder="What they said..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Thumbnail Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://i.ytimg.com/vi/.../maxresdefault.jpg"
        />
      </div>
    </div>
  );

  const renderServiceForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the service or offering..."
          rows={6}
        />
      </div>
    </div>
  );

  const renderPosterForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/poster.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Additional information..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="mt-2 text-gray-600">
            Add new content to the meditation institute website
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
          <AlertDescription>
            Content created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
          <CardDescription>
            Fill in the information for your new content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter content title"
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Content Type *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="team_member">Team Member</SelectItem>
                  <SelectItem value="testimonial">Testimonial</SelectItem>
                  <SelectItem value="service">Service (Vision/Mission)</SelectItem>
                  <SelectItem value="poster">Poster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type-specific Fields */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                {contentType === 'achievement' && 'Achievement Details'}
                {contentType === 'team_member' && 'Team Member Information'}
                {contentType === 'testimonial' && 'Testimonial Details'}
                {contentType === 'service' && 'Service Description'}
                {contentType === 'poster' && 'Poster Information'}
              </h3>

              {contentType === 'achievement' && renderAchievementForm()}
              {contentType === 'team_member' && renderTeamMemberForm()}
              {contentType === 'testimonial' && renderTestimonialForm()}
              {contentType === 'service' && renderServiceForm()}
              {contentType === 'poster' && renderPosterForm()}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <Link href="/admin/content">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save as Draft'
                )}
              </Button>
              <Button
                type="button"
                className="bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={() => handleSubmit(false)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Review'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <div className="w-3 h-3 bg-gray-600 rounded-full" />
            </div>
            <div>
              <div className="font-medium">Draft</div>
              <div className="text-sm text-muted-foreground">Content is being created/edited</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <div className="w-3 h-3 bg-yellow-600 rounded-full" />
            </div>
            <div>
              <div className="font-medium">Pending Review</div>
              <div className="text-sm text-muted-foreground">Waiting for reviewer approval</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <div className="w-3 h-3 bg-green-600 rounded-full" />
            </div>
            <div>
              <div className="font-medium">Published</div>
              <div className="text-sm text-muted-foreground">Live on the website</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
