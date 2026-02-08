'use client';

import { useState, useCallback, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Check } from 'lucide-react';
import Image from 'next/image';
import { validateMediaUrl, formatUrlForDisplay } from '@/lib/url-validation';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

export interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void;
  images?: UploadedImage[];
  maxImages?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_MAX_IMAGES = 10;
const DEFAULT_ACCEPT_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: 5,
  SUPPORTED_FORMATS: 'JPEG, PNG, WebP, GIF',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const isExternalImage = (image: UploadedImage): boolean => {
  return image.type === 'image/external' || image.url.startsWith('http');
};

const formatFileSize = (bytes: number): string => {
  return bytes > 0 ? `${(bytes / 1024).toFixed(1)} KB` : 'External URL';
};

const validateFileCount = (currentCount: number, newFiles: number, maxAllowed: number): string | null => {
  if (currentCount + newFiles > maxAllowed) {
    return `Maximum ${maxAllowed} images allowed`;
  }
  return null;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

// Upload Area Component
const UploadArea = memo(({
  getRootProps,
  getInputProps,
  isDragActive,
  uploading,
  currentCount,
  maxCount,
}: {
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  uploading: boolean;
  currentCount: number;
  maxCount: number;
}) => (
  <Card
    {...getRootProps()}
    className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
      isDragActive
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 hover:border-gray-400 dark:hover:border-gray-600'
    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <input {...getInputProps()} />
    <div className="flex flex-col items-center gap-3">
      {uploading ? (
        <Loader2 className="h-10 w-10 text-blue-700 dark:text-blue-400 animate-spin" />
      ) : (
        <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
      )}
      <div>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          or click to browse ({currentCount}/{maxCount} uploaded)
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Supports: {UPLOAD_CONFIG.SUPPORTED_FORMATS} (max {UPLOAD_CONFIG.MAX_FILE_SIZE_MB}MB each)
      </p>
    </div>
  </Card>
));
UploadArea.displayName = 'UploadArea';

// URL Input Component
const UrlInputArea = memo(({
  urlInput,
  setUrlInput,
  validatingUrl,
  urlError,
  onAddUrl,
  disabled,
}: {
  urlInput: string;
  setUrlInput: (value: string) => void;
  validatingUrl: boolean;
  urlError: string;
  onAddUrl: () => void;
  disabled: boolean;
}) => (
  <Card className="p-4 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
    <div className="space-y-3">
      <div>
        <Label htmlFor="image-url" className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <LinkIcon className="h-4 w-4" />
          Image URL
        </Label>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Paste a direct link to an image ({UPLOAD_CONFIG.SUPPORTED_FORMATS})
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          id="image-url"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddUrl()}
          disabled={validatingUrl || disabled}
          className="bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <Button
          onClick={onAddUrl}
          disabled={validatingUrl || disabled || !urlInput.trim()}
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
        <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>
      )}
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p><span className="text-base">💡</span> <strong className="text-gray-900 dark:text-gray-100">Tip:</strong> You can use URLs from:</p>
        <ul className="list-disc list-inside ml-2 space-y-0.5">
          <li>CDN (Cloudinary, Imgur, etc.)</li>
          <li>Direct image links</li>
          <li>Any publicly accessible image URL</li>
          <li>Google Images (both redirect & search URLs work!)</li>
        </ul>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">📸 For Google Images:</p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Paste any Google Images URL - we'll automatically extract the actual image URL!
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded text-gray-700 dark:text-gray-300">
            <p className="font-medium mb-1">👆 Better option:</p>
            <p className="text-xs">Right-click the image → "Copy image address" for the direct URL</p>
          </div>
        </div>
      </div>
    </div>
  </Card>
));
UrlInputArea.displayName = 'UrlInputArea';

// Image Preview Card Component
const ImagePreviewCard = memo(({
  image,
  index,
  onRemove,
}: {
  image: UploadedImage;
  index: number;
  onRemove: (index: number) => void;
}) => (
  <div className="relative group">
    <Card className="overflow-hidden bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
      <div className="aspect-square relative bg-gray-100 dark:bg-gray-800">
        <Image
          src={image.url}
          alt={`Upload ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {isExternalImage(image) && (
          <div className="absolute top-2 left-2 bg-blue-600 dark:bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-sm">
            <LinkIcon className="h-3 w-3" />
            URL
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="p-2 bg-white dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-900 dark:text-gray-100 truncate font-medium">
          {image.filename}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatFileSize(image.size)}
        </p>
      </div>
    </Card>
  </div>
));
ImagePreviewCard.displayName = 'ImagePreviewCard';

// Error Display Component
const ErrorDisplay = memo(({ error }: { error: string }) => (
  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg">
    <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
      <span className="text-base">⚠️</span>
      {error}
    </p>
  </div>
));
ErrorDisplay.displayName = 'ErrorDisplay';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ImageUpload({
  onImagesChange,
  images = [],
  maxImages = DEFAULT_MAX_IMAGES,
  accept = DEFAULT_ACCEPT_TYPES,
  className = '',
}: ImageUploadProps) {
  // State
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [validatingUrl, setValidatingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  // ============================================================================
  // UPLOAD HANDLERS
  // ============================================================================

  const uploadSingleFile = async (file: File): Promise<UploadedImage[]> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    return [data];
  };

  const uploadMultipleFiles = async (files: File[]): Promise<UploadedImage[]> => {
    const formData = new FormData();
    files.forEach((file, index) => {
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

    // Process successful uploads
    const uploadedImages = data.uploads
      .filter((upload: any) => upload.url)
      .map((upload: any) => ({
        url: upload.url,
        filename: upload.filename || upload.originalName,
        size: upload.size,
        type: upload.type,
      }));

    // Check for failed uploads
    const failedUploads = data.uploads.filter((u: any) => u.error);
    if (failedUploads.length > 0) {
      setError(`${failedUploads.length} file(s) failed to upload`);
    }

    return uploadedImages;
  };

  const handleFileDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Validate file count
      const countError = validateFileCount(images.length, acceptedFiles.length, maxImages);
      if (countError) {
        setError(countError);
        return;
      }

      setError('');
      setUploading(true);

      try {
        const uploadedImages =
          acceptedFiles.length === 1
            ? await uploadSingleFile(acceptedFiles[0])
            : await uploadMultipleFiles(acceptedFiles);

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
    onDrop: handleFileDrop,
    accept,
    maxFiles: maxImages - images.length,
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  // ============================================================================
  // URL INPUT HANDLERS
  // ============================================================================

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

      const newImage: UploadedImage = {
        url: validation.metadata!.url,
        filename: formatUrlForDisplay(validation.metadata!.url, 30),
        size: 0,
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

  // ============================================================================
  // REMOVE HANDLER
  // ============================================================================

  const handleRemove = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const isMaxReached = images.length >= maxImages;

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
          <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950">
            <LinkIcon className="h-4 w-4" />
            From URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 mt-4">
          {!isMaxReached && (
            <UploadArea
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              uploading={uploading}
              currentCount={images.length}
              maxCount={maxImages}
            />
          )}
          {isMaxReached && (
            <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                Maximum number of images ({maxImages}) reached. Remove some images to upload more.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4 mt-4">
          <UrlInputArea
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            validatingUrl={validatingUrl}
            urlError={urlError}
            onAddUrl={handleAddFromUrl}
            disabled={isMaxReached}
          />
        </TabsContent>
      </Tabs>

      {error && <ErrorDisplay error={error} />}

      {/* Uploaded Images Preview */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Uploaded Images ({images.length}/{maxImages})
            </Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <ImagePreviewCard
                key={`${image.url}-${index}`}
                image={image}
                index={index}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hidden inputs for form submission */}
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
