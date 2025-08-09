'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageSquare, MapPin, Send, Hammer, ClipboardCheck, Wallet, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContractorJobDetail } from '@/lib/apis/contractor-jobs';
import { ImagesGallery } from '@/components/ImagesGallery';

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
      return getContractorJobDetail(jobId, token);
    },
    enabled: !!jobId && !!getToken,
    staleTime: 0,
  });

  const handleBack = () => {
    router.push('/contractor-dashboard');
  };

  const handleSubmitBid = () => {
    // TODO: Navigate to bid posting page
    router.push(`/contractor-dashboard/bid-posting?jobId=${jobId}`);
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
        <div className='hidden lg:block mb-6'>
          <Button onClick={handleBack} variant='ghost' className='font-roboto mb-4 -ml-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to All Jobs
          </Button>
        </div>

        <div className='space-y-6'>
          {/* Job Details Card */}
          <Card>
            <CardHeader className='pb-4 mb-5'>
              <div className='flex justify-between items-start'>
                <CardTitle className='font-roboto text-lg lg:text-xl'>{jobDetail.title}</CardTitle>
                <span className='text-sm font-inter'>Posted on {new Date(jobDetail.created_at).toLocaleDateString()}</span>
              </div>
            </CardHeader>

            <CardContent className='space-y-6'>
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

              {/* Job Description */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <ClipboardCheck className='h-4 w-4' />
                  Description
                </h3>
                <p className='font-inter text-gray-700 whitespace-pre-wrap leading-relaxed'>{jobDetail.description}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <MapPin className='h-4 w-4' />
                  Location
                </h3>
                <p className='font-inter text-gray-700'>{jobDetail.location_address}</p>
                <p className='font-inter text-sm text-gray-500 mt-1'>{jobDetail.city}</p>
              </div>

              {/* contact */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                  <Phone className='h-4 w-4' />
                  Contact Information
                </h3>
                {/* will be shared with selected contractor only */}
                <p className='font-inter text-xs text-blue-600 mt-2'>* Buyer contact information will be shared with selected contractor only</p>
              </div>

              {/* Other Requirements */}
              {jobDetail.other_requirements && (
                <div>
                  <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Additional Requirements</h3>
                  <p className='font-inter text-gray-700 whitespace-pre-wrap leading-relaxed'>{jobDetail.other_requirements}</p>
                </div>
              )}

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
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='font-roboto font-semibold text-green-800 mb-1'>{jobDetail.bid_count} of 5 bids submitted</h4>
                  </div>
                  {jobDetail.bid_count < 5 && (
                    <Button onClick={handleSubmitBid} className='font-roboto bg-green-600 hover:bg-green-700'>
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
                  <li>If selected, you'll be notified and you can confirm the job</li>
                  <li>Full buyer contact details will be shared after confirmation</li>
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
