import { Card, CardContent } from '@/components/ui/card';
import { type ContractorBidCardResponse } from '@/lib/apis/contractor-bids';
import { Calendar } from 'lucide-react';

export function BidCard({ bid, onClick }: { bid: ContractorBidCardResponse; onClick: () => void }) {
  return (
    <Card className='border border-gray-200 hover:shadow-md transition-shadow cursor-pointer' onClick={onClick}>
      <CardContent className='p-4 lg:p-6'>
        <div className='space-y-3'>
          {/* Bid Title & Status */}
          <div className='flex items-start justify-between'>
            <h3 className='font-roboto text-base lg:text-lg font-bold text-gray-900 flex-1 pr-2'>{bid.title || 'Untitled Bid'}</h3>
            {bid.status === 'draft' && <span className='text-xs font-bold bg-gray-200 text-gray-700 font-roboto rounded-full px-3 py-2'>Draft</span>}
            {bid.status === 'submitted' && <span className='text-xs font-bold bg-green-200 text-green-800 font-roboto rounded-full px-3 py-2'>Submitted</span>}
          </div>

          {/* Job Info */}
          <div className='space-y-1'>
            <p className='font-inter text-sm text-gray-600 font-semibold'>For Job: {bid.job_title}</p>
            <div className='flex flex-col  gap-2 text-xs text-gray-500'>
              <span className='font-medium'>Job type: {bid.job_type}</span>
              <span className='font-medium'>Job City: {bid.job_city}</span>
            </div>
          </div>

          {/* Date */}
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <Calendar className='h-3 w-3' />
            <span>Submitted at {new Date(bid.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
