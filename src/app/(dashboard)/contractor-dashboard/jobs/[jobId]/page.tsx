'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageSquare, MapPin, Send, Hammer, Info, Wallet, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPreBidJobDetail } from '@/lib/apis/contractor-jobs';
import { ImagesGallery } from '@/components/ImagesGallery';
import { formatDateTime } from '@/lib/utils/custom-format';

export default function ContractorJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();

  const jobId = params.jobId as string;

  // Fetch job details from contractor perspective
  const {
    data: jobDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contractor-job-detail', jobId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getPreBidJobDetail(jobId, token);
    },
    enabled: !!jobId && !!getToken,
    staleTime: 0,
  });

  const handleBack = () => {
    router.push('/contractor-dashboard');
  };

  const handleSubmitBid = () => {
    router.push(`/contractor-dashboard/post-bid?jobId=${jobId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading job details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !jobDetail) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Job Not Available</h2>
          <p className='font-inter text-gray-600 mb-4'>{error instanceof Error ? error.message : 'This job may no longer be available for bidding.'}</p>
          <Button onClick={handleBack} className='font-roboto'>
            Back to All Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBack} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900 text-center flex-1 mx-4 truncate'>{jobDetail.title}</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:flex justify-between items-center mb-6'>
          <h1 className='font-semibold text-xl font-roboto'>{jobDetail.title}</h1>

          <Button onClick={handleBack} className='font-roboto mb-4 -ml-4'>
            Back to All Jobs
          </Button>
        </div>

        <div className='space-y-6'>
          {/* Job Details Card */}
          <Card>
            <CardHeader className='pb-0' />

            <CardContent className='space-y-6'>
              {/* Posted on */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  Posted On
                </h3>
                <span className='text-sm font-inter'>Posted {formatDateTime(jobDetail.created_at)}</span>
              </div>

              {/* job type */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Hammer className='h-4 w-4' />
                  Job Type
                </h3>
                <p className='font-inter text-gray-700'>{jobDetail.job_type}</p>
              </div>

              {/* Job Budget */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Wallet className='h-4 w-4' />
                  Budget
                </h3>
                <p className='font-inter text-gray-700'>{jobDetail.job_budget}</p>
              </div>

              {/* Location (showing only general city) */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <MapPin className='h-4 w-4' />
                  Location (City / Area)
                </h3>
                {/* <p className='font-inter text-gray-700'>{jobDetail.location_address}</p> */}
                <p className='font-inter text-gray-700'>{jobDetail.city}</p>
              </div>

              {/* Owner contact information, job description, and other information (not to reveal ON THIS TIME YET)
              only show after contractor full paid and submit the bid) */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Info className='h-4 w-4' />
                  Job Contact & Detail Information
                </h3>
                {/* will be shared with selected contractor only */}
                <p className='font-inter text-sm text-blue-600 mt-2'>* All detail information will be revealed once bid & payment are completed for this job</p>
              </div>

              {/* Images */}
              {jobDetail.images && jobDetail.images.length > 0 && (
                <div>
                  <h3 className='font-roboto font-semibold text-gray-900 mb-3'>Job Photos</h3>
                  <ImagesGallery images={jobDetail.images} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bidding Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto flex items-center gap-2'>
                <MessageSquare className='h-5 w-5' />
                Bidding Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='bg-green-100 border border-green-200 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-roboto font-semibold text-green-800 mb-1'>{jobDetail.bid_count} of 5 bids submitted</h4>
                  </div>
                  {jobDetail.bid_count < 5 && (
                    <Button onClick={handleSubmitBid} className='font-roboto bg-green-600 hover:bg-green-700 hidden lg:inline-flex'>
                      Submit Your Bid
                    </Button>
                  )}
                </div>
              </div>

              <div className='mt-4 text-sm text-gray-600 font-inter'>
                <p className='mb-2'>
                  <strong>How it works:</strong>
                </p>
                <ul className='space-y-1 list-disc list-inside'>
                  <li>Submit your competitive bid for this job</li>
                  <li>Full job detail will be revealed once bid payment is completed</li>
                  <li>Contact job owner!</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Submit Bid Button */}
          <div className='lg:hidden'>
            <Button onClick={handleSubmitBid} className='w-full font-roboto bg-green-600 hover:bg-green-700 py-3 text-lg'>
              <Send className='h-5 w-5 mr-2' />
              Submit Your Bid
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
