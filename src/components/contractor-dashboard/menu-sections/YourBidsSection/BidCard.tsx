import { Card, CardContent } from '@/components/ui/card';
import { type ContractorBidCardResponse } from '@/lib/apis/contractor-bids';
import { Calendar, Clock, FileText, CheckCircle, XCircle, Star } from 'lucide-react';

export function BidCard({ bid, onClick }: { bid: ContractorBidCardResponse; onClick: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'selected':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className='h-4 w-4' />;
      case 'pending':
        return <Clock className='h-4 w-4' />;
      case 'selected':
        return <Star className='h-4 w-4' />;
      case 'confirmed':
        return <CheckCircle className='h-4 w-4' />;
      case 'declined':
        return <XCircle className='h-4 w-4' />;
      default:
        return <FileText className='h-4 w-4' />;
    }
  };

  return (
    <Card className='border border-gray-200 hover:shadow-md transition-shadow cursor-pointer' onClick={onClick}>
      <CardContent className='p-4 lg:p-6'>
        <div className='space-y-3'>
          {/* Bid Title & Status */}
          <div className='flex items-start justify-between'>
            <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 flex-1 pr-2'>{bid.title || 'Untitled Bid'}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
              {getStatusIcon(bid.status)}
              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
            </span>
          </div>

          {/* Job Info */}
          <div className='space-y-1'>
            <p className='font-inter text-sm text-gray-600'>For Job: {bid.job_title}</p>
            <div className='flex items-center gap-4 text-xs text-gray-500'>
              <span>{bid.job_type}</span>
              <span>•</span>
              <span>{bid.job_city}</span>
            </div>
          </div>

          {/* Date */}
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <Calendar className='h-3 w-3' />
            <span>Created {new Date(bid.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
