'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the draft bid ID from URL params
    const draftId = searchParams.get('draft');

    if (draftId) {
      // Redirect to the draft bid page with payment success indicator
      router.replace(`/contractor-dashboard/post-bid?draft=${draftId}&payment=success`);
    } else {
      // Fallback to dashboard if no draft ID
      router.replace('/contractor-dashboard?section=your-bids');
    }
  }, [router, searchParams]);

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
        <p className='font-inter text-gray-600'>Payment success!</p>
      </div>
    </div>
  );
}
