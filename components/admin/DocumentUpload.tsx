'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, FileText, Loader2, Link as LinkIcon, ExternalLink, Check } from 'lucide-react';

interface UploadedDocument {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface DocumentUploadProps {
  onDocumentChange: (document: UploadedDocument | null) => void;
  document?: UploadedDocument | null;
  accept?: string; // e.g., '.pdf'
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
};

export default function DocumentUpload({
  onDocumentChange,
  document = null,
  accept = '.pdf',
  maxSize = 25 * 1024 * 1024, // 25MB default
  className = '',
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');

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

        // Simulate upload progress
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

        onDocumentChange({
          url: data.url,
          filename: data.filename,
          size: data.size,
          type: data.type,
        });
        setUrlInput('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload document');
        setUploadProgress(0);
      } finally {
        setUploading(false);
      }
    },
    [maxSize, onDocumentChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [accept] },
    maxFiles: 1,
    multiple: false,
    disabled: uploading || !!document,
  });

  const handleAddFromUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a document URL');
      return;
    }

    try {
      // Basic URL validation
      const urlObj = new URL(urlInput.trim());
      if (!urlObj.protocol.startsWith('http')) {
        setUrlError('URL must start with http:// or https://');
        return;
      }

      onDocumentChange({
        url: urlInput.trim(),
        filename: urlObj.pathname.split('/').pop() || 'document',
        size: 0,
        type: 'application/pdf',
      });
      setUrlInput('');
      setUrlError('');
    } catch (err) {
      setUrlError('Please enter a valid URL');
    }
  };

  const handleRemove = () => {
    onDocumentChange(null);
    setError('');
    setUrlInput('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExternalDocument = document?.type === 'application/pdf' && document?.size === 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {document && (
        <Card className={`p-4 ${DARK_THEME.successCard}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${DARK_THEME.textPrimary} truncate`}>
                  {document.filename}
                </p>
                <p className={`text-xs ${DARK_THEME.textTertiary} mt-1`}>
                  {formatFileSize(document.size)}
                </p>
                {isExternalDocument && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-500/20 text-violet-400">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      External URL
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {document.url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.url, '_blank')}
                  className="h-8 bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
                className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!document && (
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
            <Card
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
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
                  <FileText className="h-10 w-10 text-slate-500" />
                )}
                <div>
                  <p className={`text-lg font-medium ${DARK_THEME.textPrimary}`}>
                    {uploading ? 'Uploading...' : isDragActive ? 'Drop document here' : 'Drag & drop document here'}
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
                  Supports: PDF files (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="url">
            <Card className={`p-4 ${DARK_THEME.cardBg}`}>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="document-url" className={`flex items-center gap-2 ${DARK_THEME.textPrimary}`}>
                    <LinkIcon className="h-4 w-4" />
                    Document URL
                  </Label>
                  <p className={`text-xs ${DARK_THEME.textSecondary} mt-1`}>
                    Paste a direct link to a PDF document
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="document-url"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFromUrl()}
                    disabled={uploading}
                    className={DARK_THEME.inputBg}
                  />
                  <Button
                    onClick={handleAddFromUrl}
                    disabled={uploading || !urlInput.trim()}
                    className={DARK_THEME.button}
                  >
                    Add
                  </Button>
                </div>
                {urlError && (
                  <p className={`text-sm ${DARK_THEME.error.replace('text-', '')} flex items-center gap-1`}>
                    <X className="h-4 w-4" />
                    {urlError}
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {error && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${DARK_THEME.error}`}>
          <X className="h-4 w-4 flex-shrink-0" />
          <p className={`text-sm`}>{error}</p>
        </div>
      )}
    </div>
  );
}
