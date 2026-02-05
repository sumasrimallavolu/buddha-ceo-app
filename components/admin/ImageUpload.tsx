'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setError('');
      setUploading(true);

      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append('file', file);
        });

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        onImagesChange([...images, data]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image');
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

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="h-10 w-10 text-amber-700 animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-medium text-gray-700">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse ({images.length}/{maxImages} uploaded)
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supports: JPEG, PNG, WebP, GIF (max 5MB each)
            </p>
          </div>
        </Card>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
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
                  <p className="text-xs text-gray-600 truncate">
                    {image.filename}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </Card>
            </div>
          ))}
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
