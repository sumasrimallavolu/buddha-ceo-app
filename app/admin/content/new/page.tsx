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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ArrowLeft, CheckCircle2, Plus, X, Eye } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { validateContentForm, getRequiredFieldsForContentType } from '@/lib/admin-validation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Highlight {
  text: string;
}

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface PhotoCollageImage {
  url: string;
  caption?: string;
  alt?: string;
}

export default function NewContentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [contentType, setContentType] = useState<string>('photo_collage');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [photoCollageImages, setPhotoCollageImages] = useState<PhotoCollageImage[]>([]);
  const [richTextContent, setRichTextContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'photo_collage',
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
    // New fields
    author: '',
    isbn: '',
    pages: '',
    downloadUrl: '',
    purchaseUrl: '',
    layout: 'grid',
    isFeatured: false,
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

  const handlePhotoCollageImageUpdate = (index: number, field: string, value: string) => {
    const newImages = [...photoCollageImages];
    newImages[index] = { ...newImages[index], [field]: value };
    setPhotoCollageImages(newImages);
  };

  const handleRemovePhotoCollageImage = (index: number) => {
    setPhotoCollageImages(photoCollageImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    setError('');
    setSuccess(false);

    // Validate form based on content type
    const validation = validateContentForm(contentType, formData, {
      uploadedImages,
      photoCollageImages,
      richTextContent,
    });

    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }
