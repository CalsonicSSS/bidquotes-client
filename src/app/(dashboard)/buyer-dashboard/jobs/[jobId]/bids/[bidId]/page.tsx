'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, DollarSign, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpecificBidDetailForSpecificJob } from '@/lib/apis/buyer-bids';
import { formatDateTime } from '@/lib/utils/custom-format';
import { getContractorProfileByContractorId } from '@/lib/apis/contractor-profile';
import ContractorProfileSection from '@/components/buyer-dashboard/job-detail/ContractorProfile';

export default function BuyerBidDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();

  const jobId = params.jobId as string;
  const bidId = params.bidId as string;

  // Fetch bid details
  const {
    data: bidDetail,
    isLoading: isBidLoading,
    error,
  } = useQuery({
    queryKey: ['buyer-bid-detail', bidId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getSpecificBidDetailForSpecificJob(jobId, bidId, token);
    },
    enabled: !!jobId && !!bidId && !!getToken,
  });

  // fetch contractor profile based on bidDetail?.contractor_id
  // this query depends on the bidDetail being available first
  const {
    data: contractorProfile,
    isLoading: isContractorProfileLoading,
    error: errorContractorProfile,
  } = useQuery({
    queryKey: ['bid-contractor-profile', bidDetail?.contractor_id],
    queryFn: async () => {
      return getContractorProfileByContractorId(bidDetail?.contractor_id as string);
    },
    enabled: !!bidDetail?.contractor_id,
  });

  const handleBack = () => {
    router.push(`/buyer-dashboard/jobs/${jobId}`);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Show loading state
  if (isBidLoading) {
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
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBack} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900 text-center flex-1 mx-4 truncate'>Bid Details</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:block'>
          <div className='flex items-center justify-between gap-4 mb-4'>
            <h1 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900'>Bid Details</h1>
            <Button onClick={handleBack} className='font-roboto -ml-4'>
              Back to Job Detail
            </Button>
          </div>
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
                {/* animated glowing indicator on the text saying contractor will contact you soon!*/}
                <div className='flex items-center gap-2 animate-bounce'>
                  <span className='relative flex h-3 w-3 '>
                    <span className='absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping'></span>
                    <span className='relative inline-flex rounded-full h-3 w-3 bg-blue-500'></span>
                  </span>
                  <p className='font-inter text-sm text-gray-600 '>This contractor will contact you soon!</p>{' '}
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
            </CardContent>
          </Card>

          {/* another well design card to show fetched contractor profile */}
          {isContractorProfileLoading ? (
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
              <p className='font-inter text-gray-600'>Loading bid details...</p>
            </div>
          ) : errorContractorProfile ? (
            <div className='text-center'>
              <p className='font-inter text-red-600'>Error loading contractor profile</p>
            </div>
          ) : (
            contractorProfile && <ContractorProfileSection contractorProfile={contractorProfile} />
          )}
        </div>
      </div>
    </div>
  );
}
