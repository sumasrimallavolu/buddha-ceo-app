'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DynamicContent {
  _id: string;
  title: string;
  type: string;
  status: string;
  content: Record<string, any>;
  thumbnailUrl?: string;
  layout?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseDynamicContentOptions {
  type?: string;
  status?: string;
  isFeatured?: boolean;
  limit?: number;
  enabled?: boolean;
}

export function useDynamicContent(options: UseDynamicContentOptions = {}) {
  const {
    type,
    status = 'published',
    isFeatured,
    limit,
    enabled = true,
  } = options;

  const [data, setData] = useState<DynamicContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (type && type !== 'all') params.append('type', type);
      if (limit) params.append('limit', limit.toString());
      if (isFeatured) params.append('featured', 'true');

      const response = await fetch(`/api/content/public?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const result = await response.json();

      // The API returns { content, pagination } structure
      const contentData = result.content || result;

      setData(Array.isArray(contentData) ? contentData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [enabled, status, type, isFeatured, limit]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { data, loading, error, refetch: fetchContent };
}

export function useContentType(contentType: string, options: Omit<UseDynamicContentOptions, 'type'> = {}) {
  return useDynamicContent({ ...options, type: contentType });
}

export function useFeaturedContent(contentType?: string) {
  return useDynamicContent({ type: contentType, isFeatured: true, status: 'published' });
}
