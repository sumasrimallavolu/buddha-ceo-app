'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FeedbackForm } from './FeedbackForm';

interface FeedbackModalProps {
  eventId: string;
  eventTitle: string;
  eventEndDate: string;
}

export function FeedbackModal({
  eventId,
  eventTitle,
  eventEndDate,
}: FeedbackModalProps) {
  const router = useRouter();

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleSuccess = () => {
    // Close modal after successful submission
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <FeedbackForm
          eventId={eventId}
          eventTitle={eventTitle}
          eventEndDate={eventEndDate}
          onSuccess={handleSuccess}
          onCancel={handleClose}
        />
      </div>
    </div>
  );
}
