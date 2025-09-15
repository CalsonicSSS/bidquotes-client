'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
    <Suspense fallback={<div>Loading...</div>}>
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Payment Successful!</h2>
          <p className='font-inter text-gray-600'>Redirecting you back to your bid...</p>
        </div>
      </div>
    </Suspense>
  );
}
