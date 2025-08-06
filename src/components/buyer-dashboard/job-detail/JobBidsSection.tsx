import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';

type JobBidsSectionProps = {
  jobId: string;
  jobStatus: string;
  bidCount: number;
};

export function JobBidsSection({ jobId, jobStatus, bidCount }: JobBidsSectionProps) {
  // TODO: Implement bid fetching and display logic
  // For now, show a placeholder

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-roboto flex items-center gap-2'>
          <MessageSquare className='h-5 w-5' />
          Bids ({bidCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bidCount === 0 ? (
          <div className='text-center py-8'>
            <Users className='h-12 w-12 text-gray-300 mx-auto mb-4' />
            <h3 className='font-roboto text-lg font-semibold text-gray-900 mb-2'>No bids yet</h3>
            <p className='font-inter text-gray-600'>Contractors will start submitting bids soon. Check back later!</p>
          </div>
        ) : (
          <div className='text-center py-8'>
            <Users className='h-12 w-12 text-blue-300 mx-auto mb-4' />
            <h3 className='font-roboto text-lg font-semibold text-gray-900 mb-2'>{bidCount} bids received</h3>
            <p className='font-inter text-gray-600'>Bid management will be available soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
