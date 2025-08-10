import BidDetailPage from '@/components/contractor-dashboard/BidDetailPage';
import { Suspense } from 'react';

type BidDetailPageRouteProps = {
  params: Promise<{ bidId: string }>;
};

export default async function BidDetailPageRoute({ params }: BidDetailPageRouteProps) {
  const { bidId } = await params;

  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
            <p className='font-inter text-gray-600'>Loading bid details...</p>
          </div>
        </div>
      }
    >
      <BidDetailPage bidId={bidId} />
    </Suspense>
  );
}
