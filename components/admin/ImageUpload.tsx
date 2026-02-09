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

const DARK_THEME = {
  cardBg: 'bg-white/5 backdrop-blur-sm border border-white/10',
  textPrimary: 'text-white',
  textSecondary: 'text-slate-400',
  textTertiary: 'text-slate-500',
  inputBg: 'bg-white/5 border-white/10 text-white placeholder:text-slate-500',
  button: 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white',
  tabsList: 'bg-white/5 border border-white/10',
  tabActive: 'data-[state=active]:bg-white/10 data-[state=active]:text-white',
  tabInactive: 'text-slate-400 hover:text-white hover:bg-white/5',
  uploadAreaDefault: 'border-white/20 bg-white/5 hover:border-white/30',
  uploadAreaActive: 'border-blue-500 bg-blue-500/10',
  previewCard: 'bg-white/5 border border-white/10',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
};

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
    className={`border-2 border-dashed p-8 text-center cursor-pointer transition-all ${DARK_THEME.cardBg} ${
      isDragActive
        ? DARK_THEME.uploadAreaActive
        : DARK_THEME.uploadAreaDefault
    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <input {...getInputProps()} />
    <div className="flex flex-col items-center gap-3">
      {uploading ? (
        <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
      ) : (
        <ImageIcon className="h-10 w-10 text-slate-500" />
      )}
      <div>
        <p className={`text-lg font-medium ${DARK_THEME.textPrimary}`}>
          {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className={`text-sm ${DARK_THEME.textSecondary} mt-1`}>
          or click to browse ({currentCount}/{maxCount} uploaded)
        </p>
      </div>
      <p className={`text-xs ${DARK_THEME.textTertiary}`}>
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
  <Card className={`${DARK_THEME.cardBg} p-4`}>
    <div className="space-y-3">
      <div>
        <Label htmlFor="image-url" className={`flex items-center gap-2 ${DARK_THEME.textPrimary}`}>
          <LinkIcon className="h-4 w-4" />
          Image URL
        </Label>
        <p className={`text-xs ${DARK_THEME.textSecondary} mt-1`}>
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
          className={DARK_THEME.inputBg}
        />
        <Button
          onClick={onAddUrl}
          disabled={validatingUrl || disabled || !urlInput.trim()}
          type="button"
          className={DARK_THEME.button}
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
        <p className="text-sm text-red-400">{urlError}</p>
      )}
      <div className={`text-xs ${DARK_THEME.textSecondary} space-y-2 p-3 bg-white/5 rounded-lg border border-white/10`}>
        <p><span className="text-base">💡</span> <strong className={DARK_THEME.textPrimary}>Tip:</strong> You can use URLs from:</p>
        <ul className="list-disc list-inside ml-2 space-y-0.5">
          <li>CDN (Cloudinary, Imgur, etc.)</li>
          <li>Direct image links</li>
          <li>Any publicly accessible image URL</li>
          <li>Google Images (both redirect & search URLs work!)</li>
        </ul>
        <div className="pt-2 border-t border-white/10 mt-2">
          <p className={`font-medium ${DARK_THEME.textPrimary} mb-1`}>📸 For Google Images:</p>
          <p className={DARK_THEME.textTertiary + ' mb-2'}>
            Paste any Google Images URL - we'll automatically extract the actual image URL!
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 p-2 rounded">
            <p className="font-medium mb-1 text-blue-300">👆 Better option:</p>
            <p className="text-xs text-blue-400">Right-click the image → "Copy image address" for the direct URL</p>
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
    <Card className={`overflow-hidden ${DARK_THEME.previewCard}`}>
      <div className="aspect-square relative bg-slate-800/50">
        <Image
          src={image.url}
          alt={`Upload ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {isExternalImage(image) && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-sm">
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
      <div className={`p-2 ${DARK_THEME.previewCard} border-t border-white/10`}>
        <p className={`text-xs ${DARK_THEME.textPrimary} truncate font-medium`}>
          {image.filename}
        </p>
        <p className={`text-xs ${DARK_THEME.textTertiary} mt-0.5`}>
          {formatFileSize(image.size)}
        </p>
      </div>
    </Card>
  </div>
));
ImagePreviewCard.displayName = 'ImagePreviewCard';

// Error Display Component
const ErrorDisplay = memo(({ error }: { error: string }) => (
  <div className={`p-3 ${DARK_THEME.error} rounded-lg`}>
    <p className={`text-sm flex items-center gap-2`}>
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
        <TabsList className={`grid w-full grid-cols-2 ${DARK_THEME.tabsList}`}>
          <TabsTrigger value="upload" className={`flex items-center gap-2 ${DARK_THEME.tabInactive} ${DARK_THEME.tabActive}`}>
            <Upload className="h-4 w-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className={`flex items-center gap-2 ${DARK_THEME.tabInactive} ${DARK_THEME.tabActive}`}>
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
            <div className="p-8 text-center border-2 border-dashed border-white/20 rounded-lg bg-white/5">
              <p className={DARK_THEME.textSecondary}>
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
            <Label className={`text-sm font-medium ${DARK_THEME.textPrimary}`}>
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
