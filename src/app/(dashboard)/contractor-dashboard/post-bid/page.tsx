import MainBidForm from '@/components/contractor-dashboard/bid-forms/MainBidForm';
import { Suspense } from 'react';

export default function BidPostingPage() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center text-gray-600'>Loading bid form...</div>}>
      <MainBidForm />
    </Suspense>
  );
}
