import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BidCardInfo } from '@/lib/apis/buyer-jobs';
import { formatDateTime, getStatusBadgeStyle } from '@/lib/utils/custom-format';
import { MessageSquare, Users, Clock, CheckCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';

type JobBidsSectionProps = {
  jobId: string;
  jobStatus: string;
  bidCount: number;
  bids?: BidCardInfo[];
};

export function JobBidsSection({ jobId, jobStatus, bidCount, bids }: JobBidsSectionProps) {
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
          <div className='space-y-4'>
            {bids?.map((bid) => (
              <Link key={bid.id} href={`/buyer-dashboard/jobs/${jobId}/bids/${bid.id}`} className='block'>
                <div
                  className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                    bid.is_selected ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {/* Header with title and status */}
                  <div className='flex items-start justify-between mb-3'>
                    <h4 className='font-roboto font-semibold text-gray-900 flex-1 mr-3'>{bid.title}</h4>
                    <div className='flex items-center gap-2'>
                      {bid.is_selected && <CheckCircle className='h-4 w-4 text-blue-600' />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(bid.status, bid.is_selected)}`}>
                        {bid.is_selected ? 'Selected' : bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Bid details grid */}
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3'>
                    {/* Price Range */}
                    <div>
                      <p className='font-inter text-xs text-gray-500'>Price Range</p>
                      <p className='font-inter text-sm font-medium text-gray-900'>
                        {bid.price_min} - {bid.price_max}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-4 w-4 text-gray-500' />
                        <p className='font-inter text-xs text-gray-500'>Estimated Timeline</p>
                      </div>
                      <p className='font-inter text-sm font-medium text-gray-900'>{bid.timeline_estimate}</p>
                    </div>

                    {/* Submitted Date */}
                    <div>
                      <p className='font-inter text-xs text-gray-500'>Submitted</p>
                      <p className='font-inter text-sm font-medium text-gray-900'>{formatDateTime(bid.created_at)}</p>
                    </div>
                  </div>

                  {/* Selected bid indicator */}
                  {bid.is_selected && jobStatus === 'waiting_confirmation' && (
                    <div className='mt-3 p-3 bg-blue-100 border border-blue-200 rounded-lg'>
                      <p className='font-inter text-sm text-blue-800'>
                        <CheckCircle className='h-4 w-4 inline mr-2' />
                        This bid is selected. Waiting for contractor confirmation.
                      </p>
                    </div>
                  )}

                  {/* Click to view hint */}
                  <div className='mt-3 text-right'>
                    <span className='font-inter text-xs text-gray-500'>View details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
