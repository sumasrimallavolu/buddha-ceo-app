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
        <Card className="p-4 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {document.filename}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(document.size)}
                </p>
                {isExternalDocument && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
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
                  className="h-8"
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
                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {!document && (
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
                  <FileText className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? 'Uploading...' : isDragActive ? 'Drop document here' : 'Drag & drop document here'}
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
                  Supports: PDF files (max {(maxSize / (1024 * 1024)).toFixed(0)}MB)
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="url">
            <Card className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="document-url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Document URL
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                  />
                  <Button
                    onClick={handleAddFromUrl}
                    disabled={uploading || !urlInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                  >
                    Add
                  </Button>
                </div>
                {urlError && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
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
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <X className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
