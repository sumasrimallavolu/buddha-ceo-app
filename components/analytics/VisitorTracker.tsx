'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    visitorSessionId?: string;
  }
}

export function VisitorTracker({ pageTitle }: { pageTitle?: string }) {
  const pathname = usePathname();
  const trackedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Generate or get session ID
    if (!window.visitorSessionId) {
      window.visitorSessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Track initial page view
    const trackPageView = async () => {
      try {
        await fetch('/api/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            pageTitle: pageTitle || document.title,
            referrer: document.referrer,
            sessionId: window.visitorSessionId,
          }),
        });
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    // Track page view on mount
    if (!trackedRef.current) {
      trackPageView();
      trackedRef.current = true;
    }

    // Track time spent on page when user leaves
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Send beacon for reliable tracking on page unload
      if (navigator.sendBeacon) {
        const data = new Blob(
          [
            JSON.stringify({
              page: pathname,
              sessionId: window.visitorSessionId,
              duration,
            }),
          ],
          { type: 'application/json' }
        );

        navigator.sendBeacon('/api/tracking', data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, pageTitle]);

  // Track page changes
  useEffect(() => {
    const trackPageChange = async () => {
      try {
        await fetch('/api/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            pageTitle: pageTitle || document.title,
            sessionId: window.visitorSessionId,
          }),
        });
        startTimeRef.current = Date.now(); // Reset start time for new page
      } catch (error) {
        console.error('Failed to track page change:', error);
      }
    };

    trackPageChange();
  }, [pathname, pageTitle]);

  return null; // This component doesn't render anything
}

// Hook to track custom events
export function useVisitorTracking() {
  const trackEvent = async (eventName: string, data?: Record<string, any>) => {
    try {
      await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.pathname,
          pageTitle: document.title,
          event: eventName,
          data,
          sessionId: window.visitorSessionId,
        }),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  return { trackEvent };
}
