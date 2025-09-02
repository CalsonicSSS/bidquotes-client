'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, DollarSign, User, Briefcase, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBidDetailForSpecificJob } from '@/lib/apis/buyer-bids';
import { formatDateTime } from '@/lib/utils/custom-format';
import { getContractorProfileById } from '@/lib/apis/contractor-profile';
import ContractorProfileSection from '@/components/buyer-dashboard/job-detail/ContractorProfile';

export default function BuyerBidDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();
  // const queryClient = useQueryClient();

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
      return getBidDetailForSpecificJob(jobId, bidId, token);
    },
    enabled: !!jobId && !!bidId && !!getToken,
    staleTime: 0,
  });

  const {
    data: contractorProfile,
    isLoading: isLoadingContractorProfile,
    error: errorContractorProfile,
  } = useQuery({
    queryKey: ['bid-contractor-profile', bidDetail?.contractor_id],
    queryFn: async () => {
      return getContractorProfileById(bidDetail?.contractor_id as string);
    },
    enabled: !!bidDetail?.contractor_id,
    staleTime: 0,
  });

  const handleBack = () => {
    router.push(`/buyer-dashboard/jobs/${jobId}`);
  };

  // Bid selection mutation
  // const selectBidMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     if (!token) throw new Error('Unable to get authentication token');
  //     return selectBid(jobId, bidId, token);
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch relevant queries
  //     queryClient.invalidateQueries({ queryKey: ['buyer-bid-detail', bidId] });
  //     queryClient.invalidateQueries({ queryKey: ['job-detail', jobId] });
  //     queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });

  //     // Navigate back to job detail page to see updated status
  //     router.push(`/buyer-dashboard/jobs/${jobId}`);
  //   },
  //   onError: (error) => {
  //     console.error('Error selecting bid:', error);
  //     alert(error instanceof Error ? error.message : 'Failed to select bid. Please try again.');
  //   },
  // });

  // Cancel bid selection mutation
  // const cancelSelectionMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     if (!token) throw new Error('Unable to get authentication token');
  //     return cancelBidSelection(jobId, token);
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch relevant queries
  //     queryClient.invalidateQueries({ queryKey: ['buyer-bid-detail', bidId] });
  //     queryClient.invalidateQueries({ queryKey: ['job-detail', jobId] });
  //     queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });

  //     // Navigate back to job detail page to see updated status
  //     router.push(`/buyer-dashboard/jobs/${jobId}`);
  //   },
  //   onError: (error) => {
  //     console.error('Error cancelling bid selection:', error);
  //     alert(error instanceof Error ? error.message : 'Failed to cancel selection. Please try again.');
  //   },
  // });

  // const handleSelectBid = () => {
  //   if (window.confirm('Are you sure you want to select this bid? The contractor will be notified and you will wait for their confirmation.')) {
  //     selectBidMutation.mutate();
  //   }
  // };

  // const handleCancelSelection = () => {
  //   if (window.confirm('Are you sure you want to cancel this bid selection? The contractor will be notified and you can then select a new bid.')) {
  //     cancelSelectionMutation.mutate();
  //   }
  // };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

                {/* <div className='flex items-center gap-2'>
                  {bidDetail.is_selected && <CheckCircle className='h-5 w-5 text-blue-600' />}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeStyle(bidDetail.status, bidDetail.is_selected)}`}>
                    {bidDetail.is_selected ? 'Selected' : bidDetail.status.charAt(0).toUpperCase() + bidDetail.status.slice(1)}
                  </span>
                </div> */}
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
              {/* <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-3'>Work Description</h3>
                <p className='font-inter text-gray-700 leading-relaxed whitespace-pre-wrap'>{bidDetail.work_description}</p>
              </div> */}

              {/* Additional Notes */}
              {/* {bidDetail.additional_notes && (
                <div>
                  <h3 className='font-roboto font-semibold text-gray-900 mb-3'>Additional Notes</h3>
                  <p className='font-inter text-gray-700 leading-relaxed whitespace-pre-wrap'>{bidDetail.additional_notes}</p>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* another well design card to show fetched contractor profile */}
          {isLoadingContractorProfile ? (
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

          {/* Action Buttons */}
          {/* <div className='flex flex-col sm:flex-row gap-4'>
            {!bidDetail.is_selected && bidDetail.status === 'pending' && (
              <Button onClick={handleSelectBid} disabled={selectBidMutation.isPending} className='flex-1 font-roboto'>
                {selectBidMutation.isPending ? 'Selecting...' : 'Select This Bid'}
              </Button>
            )}

            {bidDetail.is_selected && bidDetail.status === 'selected' && (
              <Button onClick={handleCancelSelection} disabled={cancelSelectionMutation.isPending} variant='outline' className='flex-1 font-roboto bg-yellow-500'>
                {cancelSelectionMutation.isPending ? 'Cancelling...' : 'Cancel Selection'}
              </Button>
            )}

            {!(!bidDetail.is_selected && bidDetail.status === 'pending') && !(bidDetail.is_selected && bidDetail.status === 'selected') && (
              <Button disabled className='flex-1 font-roboto'>
                {bidDetail.status === 'confirmed' ? 'Bid Confirmed' : 'Cannot Select This Bid'}
              </Button>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
