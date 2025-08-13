'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, DollarSign, User, Briefcase, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBidDetailForBuyer } from '@/lib/apis/buyer-bids';
import { formatDateTime, getStatusBadgeStyle } from '@/lib/utils/custom-format';

export default function BuyerBidDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();

  const [isSelecting, setIsSelecting] = useState(false);

  const jobId = params.jobId as string;
  const bidId = params.bidId as string;

  // Fetch bid details
  const {
    data: bidDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['buyer-bid-detail', bidId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBidDetailForBuyer(jobId, bidId, token);
    },
    enabled: !!jobId && !!bidId && !!getToken,
    staleTime: 0,
  });

  const handleBack = () => {
    router.push(`/buyer-dashboard/jobs/${jobId}`);
  };

  const handleSelectBid = async () => {
    setIsSelecting(true);
    try {
      // TODO: Implement bid selection logic in next step
      console.log('Selecting bid:', bidId);
      // After successful selection, navigate back to job detail
      router.push(`/buyer-dashboard/jobs/${jobId}`);
    } catch (error) {
      console.error('Error selecting bid:', error);
      alert('Failed to select bid. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading bid details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !bidDetail) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Bid Not Available</h2>
          <p className='font-inter text-gray-600 mb-4'>{error instanceof Error ? error.message : 'This bid may no longer be available.'}</p>
          <Button onClick={handleBack} className='font-roboto'>
            Back to Job
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-6'>
          <Button variant='ghost' size='sm' onClick={handleBack} className='font-roboto'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Job
          </Button>
          <div className='hidden sm:block text-gray-400'>•</div>
          <h1 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900'>Bid Details</h1>
        </div>

        <div className='space-y-6'>
          {/* Job Context Card */}
          <Card className='bg-blue-50 border-blue-200'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3 mb-2'>
                <Briefcase className='h-5 w-5 text-blue-600' />
                <h3 className='font-roboto font-semibold text-blue-900'>For Job: {bidDetail.job_title}</h3>
              </div>
              <div className='text-sm text-blue-700'>
                <span>{bidDetail.job_type}</span> • <span>{bidDetail.job_city}</span> • <span>Budget: {bidDetail.job_budget}</span>
              </div>
            </CardContent>
          </Card>

          {/* Bid Overview Card */}
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <CardTitle className='font-roboto text-lg'>{bidDetail.title}</CardTitle>
                <div className='flex items-center gap-2'>
                  {bidDetail.is_selected && <CheckCircle className='h-5 w-5 text-blue-600' />}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(bidDetail.status, bidDetail.is_selected)}`}>
                    {bidDetail.is_selected ? 'Selected' : bidDetail.status.charAt(0).toUpperCase() + bidDetail.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Key Details Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='flex items-center gap-3'>
                  <DollarSign className='h-5 w-5 text-gray-500' />
                  <div>
                    <p className='font-inter text-sm text-gray-500'>Price Range</p>
                    <p className='font-inter font-semibold text-gray-900'>
                      {bidDetail.price_min} - {bidDetail.price_max}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Clock className='h-5 w-5 text-gray-500' />
                  <div>
                    <p className='font-inter text-sm text-gray-500'>Timeline</p>
                    <p className='font-inter font-semibold text-gray-900'>{bidDetail.timeline_estimate}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='h-5 w-5 text-gray-500' />
                  <div>
                    <p className='font-inter text-sm text-gray-500'>Submitted</p>
                    <p className='font-inter font-semibold text-gray-900'>{formatDateTime(bidDetail.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Work Description */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-3'>Work Description</h3>
                <p className='font-inter text-gray-700 leading-relaxed whitespace-pre-wrap'>{bidDetail.work_description}</p>
              </div>

              {/* Additional Notes */}
              {bidDetail.additional_notes && (
                <div>
                  <h3 className='font-roboto font-semibold text-gray-900 mb-3'>Additional Notes</h3>
                  <p className='font-inter text-gray-700 leading-relaxed whitespace-pre-wrap'>{bidDetail.additional_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contractor Information Card (No Contact Details) */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto text-lg flex items-center gap-2'>
                <User className='h-5 w-5' />
                Contractor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
                <p className='font-inter text-sm text-blue-800'>
                  <Briefcase className='h-4 w-4 inline mr-2' />
                  Contact details will be revealed after bid confirmation is completed.
                </p>
              </div>

              {/* TODO: Add contractor profile information in next step */}
              <div className='text-center py-8'>
                <User className='h-12 w-12 text-gray-300 mx-auto mb-4' />
                <p className='font-inter text-gray-600'>Contractor profile information will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <Button onClick={handleSelectBid} disabled={isSelecting || bidDetail.is_selected} className='flex-1 font-roboto'>
              {isSelecting ? 'Selecting...' : bidDetail.is_selected ? 'Already Selected' : 'Select This Bid'}
            </Button>

            {bidDetail.is_selected && (
              <Button
                variant='outline'
                className='flex-1 font-roboto'
                disabled={true} // TODO: Implement cancel selection in next step
              >
                Cancel Selection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
