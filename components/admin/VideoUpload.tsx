'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Video as VideoIcon, Loader2, Link as LinkIcon, Check, ExternalLink } from 'lucide-react';
import { validateMediaUrl, getVideoEmbedUrl, formatUrlForDisplay } from '@/lib/url-validation';

interface UploadedVideo {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface VideoUploadProps {
  onVideoChange: (video: UploadedVideo | null) => void;
  video?: UploadedVideo | null;
  accept?: Record<string, string[]>;
  maxSize?: number; // in bytes
  className?: string;
}

export default function VideoUpload({
  onVideoChange,
  video = null,
  accept = {
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/quicktime': ['.mov'],
  },
  maxSize = 50 * 1024 * 1024, // 50MB default
  className = '',
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [validatingUrl, setValidatingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [videoMetadata, setVideoMetadata] = useState<any>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setError('No file selected');
        return;
      }

      const file = acceptedFiles[0];

      if (file.size > maxSize) {
        setError(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`);
        return;
      }

      setError('');
      setUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', file);

        // Simulate upload progress (in a real app, you'd track actual progress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setVideoMetadata(null);
        onVideoChange({
          url: data.url,
          filename: data.filename,
          size: data.size,
          type: data.type,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload video');
        setUploadProgress(0);
      } finally {
        setUploading(false);
      }
    },
    [maxSize, onVideoChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
    disabled: uploading || !!video,
  });

  const handleAddFromUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a video URL');
      return;
    }

    setValidatingUrl(true);
    setUrlError('');
    setError('');

    try {
      const validation = await validateMediaUrl(urlInput.trim(), 'video');

      if (!validation.isValid) {
        setUrlError(validation.error || 'Invalid video URL');
        return;
      }

      // Set the video with metadata
      setVideoMetadata(validation.metadata);
      onVideoChange({
        url: validation.metadata!.url,
        filename: formatUrlForDisplay(validation.metadata!.url, 30),
        size: 0, // Unknown for external URLs
        type: 'video/external',
      });
      setUrlInput('');
    } catch (err) {
      setUrlError(err instanceof Error ? err.message : 'Failed to validate URL');
    } finally {
      setValidatingUrl(false);
    }
  };

  const handleRemove = () => {
    onVideoChange(null);
    setError('');
    setVideoMetadata(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExternalVideo = video?.type === 'video/external';

  return (
    <div className={`space-y-4 ${className}`}>
      {!video && (
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

          <TabsContent value="upload">
            <Card
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {uploading ? (
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-blue-700 dark:text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <VideoIcon className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? 'Uploading...' : isDragActive ? 'Drop video here' : 'Drag & drop video here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse
                  </p>
                </div>
                {uploading && (
                  <div className="w-full max-w-xs">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{uploadProgress}%</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports: MP4, WebM, MOV (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="url">
            <Card className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="video-url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Video URL
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Paste a YouTube, Vimeo, or direct video link
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="video-url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFromUrl()}
                    disabled={validatingUrl}
                  />
                  <Button
                    onClick={handleAddFromUrl}
                    disabled={validatingUrl || !urlInput.trim()}
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
                  <p>💡 <strong>Supported platforms:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-0.5">
                    <li>YouTube (youtube.com, youtu.be)</li>
                    <li>Vimeo (vimeo.com)</li>
                    <li>Direct video files (MP4, WebM, MOV)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Uploaded Video Preview */}
      {video && (
        <Card className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isExternalVideo ? (
                  <>
                    <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {videoMetadata?.provider || 'External Video'}
                    </p>
                    {videoMetadata?.thumbnail && (
                      <img
                        src={videoMetadata.thumbnail}
                        alt="Video thumbnail"
                        className="w-16 h-10 object-cover rounded"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <VideoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Video uploaded successfully
                    </p>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">Filename:</span> {video.filename}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span className="font-medium">Size:</span> {isExternalVideo ? 'External URL' : formatFileSize(video.size)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 break-all flex items-center gap-1">
                <span className="font-medium">URL:</span>
                {video.url}
                {isExternalVideo && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </p>
              {videoMetadata?.type === 'youtube' && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  ✓ YouTube video detected
                </p>
              )}
              {videoMetadata?.type === 'vimeo' && (
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  ✓ Vimeo video detected
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="shrink-0"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </Card>
      )}

      {/* Hidden input to store URL for form submission */}
      {video && (
        <input
          type="hidden"
          name="videoUrl"
          value={video.url}
        />
      )}
    </div>
  );
}
