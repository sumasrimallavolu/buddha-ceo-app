'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
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
  uploadAreaDefault: 'border-white/20 hover:border-white/30 bg-white/5',
  uploadAreaActive: 'border-blue-500 bg-blue-500/10',
  successCard: 'bg-blue-500/10 border-blue-500/30',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  tipCard: 'bg-white/5 border border-white/10',
};

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

          <TabsContent value="upload">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors rounded-2xl ${
                isDragActive
                  ? DARK_THEME.uploadAreaActive
                  : DARK_THEME.uploadAreaDefault
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                {uploading ? (
                  <div className="relative">
                    <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                  </div>
                ) : (
                  <VideoIcon className="h-10 w-10 text-slate-500" />
                )}
                <div>
                  <p className={`text-lg font-medium ${DARK_THEME.textPrimary}`}>
                    {uploading ? 'Uploading...' : isDragActive ? 'Drop video here' : 'Drag & drop video here'}
                  </p>
                  <p className={`text-sm ${DARK_THEME.textSecondary} mt-1`}>
                    or click to browse
                  </p>
                </div>
                {uploading && (
                  <div className="w-full max-w-xs">
                    <div className="bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className={`text-xs ${DARK_THEME.textTertiary} mt-1`}>{uploadProgress}%</p>
                  </div>
                )}
                <p className={`text-xs ${DARK_THEME.textTertiary}`}>
                  Supports: MP4, WebM, MOV (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url">
            <div className={`p-4 rounded-2xl ${DARK_THEME.cardBg}`}>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="video-url" className={`flex items-center gap-2 ${DARK_THEME.textPrimary}`}>
                    <LinkIcon className="h-4 w-4" />
                    Video URL
                  </Label>
                  <p className={`text-xs ${DARK_THEME.textSecondary} mt-1`}>
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
                    className={DARK_THEME.inputBg}
                  />
                  <Button
                    onClick={handleAddFromUrl}
                    disabled={validatingUrl || !urlInput.trim()}
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
                <div className={`text-xs ${DARK_THEME.textSecondary} space-y-1 p-3 ${DARK_THEME.tipCard} rounded-lg`}>
                  <p>💡 <strong className={DARK_THEME.textPrimary}>Supported platforms:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-0.5">
                    <li>YouTube (youtube.com, youtu.be)</li>
                    <li>Vimeo (vimeo.com)</li>
                    <li>Direct video files (MP4, WebM, MOV)</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {error && (
        <div className={`p-3 ${DARK_THEME.error} rounded-lg`}>
          <p className={`text-sm`}>{error}</p>
        </div>
      )}

      {/* Uploaded Video Preview */}
      {video && (
        <div className={`p-4 rounded-2xl ${DARK_THEME.successCard}`}>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isExternalVideo ? (
                  <>
                    <LinkIcon className="h-5 w-5 text-blue-400" />
                    <p className={`text-sm font-medium ${DARK_THEME.textPrimary}`}>
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
                    <VideoIcon className="h-5 w-5 text-blue-400" />
                    <p className={`text-sm font-medium ${DARK_THEME.textPrimary}`}>
                      Video uploaded successfully
                    </p>
                  </>
                )}
              </div>
              <p className={`text-xs ${DARK_THEME.textSecondary} mb-1`}>
                <span className="font-medium">Filename:</span> {video.filename}
              </p>
              <p className={`text-xs ${DARK_THEME.textSecondary} mb-1`}>
                <span className="font-medium">Size:</span> {isExternalVideo ? 'External URL' : formatFileSize(video.size)}
              </p>
              <p className={`text-xs ${DARK_THEME.textTertiary} break-all flex items-center gap-1`}>
                <span className="font-medium">URL:</span>
                {video.url}
                {isExternalVideo && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </p>
              {videoMetadata?.type === 'youtube' && (
                <p className="text-xs text-red-400 mt-1">
                  ✓ YouTube video detected
                </p>
              )}
              {videoMetadata?.type === 'vimeo' && (
                <p className="text-xs text-blue-400 mt-1">
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
        </div>
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
