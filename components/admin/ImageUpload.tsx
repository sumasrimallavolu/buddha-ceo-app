'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from 'lucide-react';
import Image from 'next/image';
import { validateMediaUrl, formatUrlForDisplay } from '@/lib/url-validation';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  images?: UploadedImage[];
  maxImages?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

export default function ImageUpload({
  onImagesChange,
  images = [],
  maxImages = 10,
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'image/gif': ['.gif'],
  },
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [validatingUrl, setValidatingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setError('');
      setUploading(true);

      try {
        let uploadedImages: UploadedImage[] = [];

        // Use PUT endpoint for multiple files, POST for single file
        if (acceptedFiles.length === 1) {
          // Single file upload - use POST
          const formData = new FormData();
          formData.append('file', acceptedFiles[0]);

          const response = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
          }

          uploadedImages = [data];
        } else {
          // Multiple file upload - use PUT
          const formData = new FormData();
          acceptedFiles.forEach((file, index) => {
            formData.append(`file${index}`, file);
          });

          const response = await fetch('/api/admin/upload', {
            method: 'PUT',
            body: formData,
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
          }

          // Filter out failed uploads and extract successful ones
          uploadedImages = data.uploads
            .filter((upload: any) => upload.url)
            .map((upload: any) => ({
              url: upload.url,
              filename: upload.filename || upload.originalName,
              size: upload.size,
              type: upload.type,
            }));

          // Check if any uploads failed
          const failedUploads = data.uploads.filter((u: any) => u.error);
          if (failedUploads.length > 0) {
            setError(`${failedUploads.length} file(s) failed to upload`);
          }
        }

        onImagesChange([...images, ...uploadedImages]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image(s)');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxImages - images.length,
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const handleAddFromUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a URL');
      return;
    }

    setValidatingUrl(true);
    setUrlError('');
    setError('');

    try {
      const validation = await validateMediaUrl(urlInput.trim(), 'image');

      if (!validation.isValid) {
        setUrlError(validation.error || 'Invalid image URL');
        return;
      }

      // Add the URL as an uploaded image
      const newImage: UploadedImage = {
        url: validation.metadata!.url,
        filename: formatUrlForDisplay(validation.metadata!.url, 30),
        size: 0, // Unknown for external URLs
        type: 'image/external',
      };

      onImagesChange([...images, newImage]);
      setUrlInput('');
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : 'Failed to validate URL');
    } finally {
      setValidatingUrl(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const isExternalImage = (image: UploadedImage) => {
    return image.type === 'image/external' || image.url.startsWith('http');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            From URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {/* Upload Area */}
          {images.length < maxImages && (
            <Card
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {uploading ? (
                  <Loader2 className="h-10 w-10 text-amber-700 dark:text-amber-500 animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse ({images.length}/{maxImages} uploaded)
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports: JPEG, PNG, WebP, GIF (max 5MB each)
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="image-url" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Image URL
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Paste a direct link to an image (JPEG, PNG, WebP, GIF)
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFromUrl()}
                  disabled={validatingUrl || images.length >= maxImages}
                />
                <Button
                  onClick={handleAddFromUrl}
                  disabled={validatingUrl || images.length >= maxImages || !urlInput.trim()}
                  type="button"
                >
                  {validatingUrl ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
              {urlError && (
                <p className="text-sm text-red-500 dark:text-red-400">{urlError}</p>
              )}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>💡 <strong>Tip:</strong> You can use URLs from:</p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li>CDN (Cloudinary, Imgur, etc.)</li>
                  <li>Direct image links</li>
                  <li>Any publicly accessible image URL</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Uploaded Images ({images.length}/{maxImages})
            </Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Card className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {isExternalImage(image) && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        URL
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {image.filename}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {image.size > 0 ? `${(image.size / 1024).toFixed(1)} KB` : 'External URL'}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden input to store URLs for form submission */}
      {images.length > 0 && (
        <div className="hidden">
          {images.map((image, index) => (
            <input
              key={index}
              type="hidden"
              name={`image-${index}`}
              value={image.url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
