'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpecificJob, closeJob } from '@/lib/apis/buyer-jobs';
import { JobBidsSection } from '@/components/buyer-dashboard/job-detail/JobBidsSection';
import { CloseJobModal } from '@/components/buyer-dashboard/job-detail/CloseJobModal';
import { Actions } from '@/components/buyer-dashboard/job-detail/Actions';
import { ImagesGallery } from '@/components/ImagesGallery';
import { formatDateTime } from '@/lib/utils/custom-format';
import JobStatusBadge from '@/components/buyer-dashboard/JobStatusBadge';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const jobId = params.jobId as string;

  // Fetch specific job details
  const {
    data: jobDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getSpecificJob(jobId, token);
    },
    enabled: !!jobId && !!getToken,
    staleTime: 0,
  });

  // Delete mutation
  // const deleteMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     if (!token) throw new Error('Unable to get authentication token');
  //     return deleteJob(jobId, token);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
  //     router.push('/buyer-dashboard');
  //   },
  //   onError: (error) => {
  //     console.error('Error deleting job:', error);
  //     alert(error instanceof Error ? error.message : 'Failed to delete job. Please try again.');
  //   },
  // });

  // close job mutation
  const closeMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return closeJob(jobId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      router.push('/buyer-dashboard');
    },
    onError: (error) => {
      console.error('Error closing job:', error);
      alert(error instanceof Error ? error.message : 'Failed to close job. Please try again.');
    },
  });

  // Navigate to post job page with "edit" query parameter
  const handleEdit = () => {
    router.push(`/buyer-dashboard/post-job?edit=${jobId}`);
  };

  // const handleDelete = () => {
  //   setShowDeleteModal(true);
  // };

  // const handleConfirmDelete = () => {
  //   deleteMutation.mutate();
  //   setShowDeleteModal(false);
  // };

  const openCloseJob = () => {
    setShowCloseModal(true);
  };

  const handleConfirmClose = () => {
    closeMutation.mutate();
    setShowCloseModal(false);
  };

  const handleBackDashboard = () => {
    router.push('/buyer-dashboard');
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Show loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
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
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Job Not Found</h2>
          <p className='font-inter text-gray-600 mb-4'>The job you're looking for may not exist or having error.</p>
          <Button onClick={handleBackDashboard} className='font-roboto'>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if job can be edited/deleted
  // directly calculate based on job status upon component onMount
  const canModify = ['open'].includes(jobDetail.status);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Close Confirmation Modal component*/}
      <CloseJobModal
        isOpen={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        onConfirm={handleConfirmClose}
        isClosing={closeMutation.isPending}
        jobTitle={jobDetail.title}
      />

      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBackDashboard} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900 text-center flex-1 mx-4 truncate'>{jobDetail.title}</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:block mb-6'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center'>
              <h1 className='font-roboto text-2xl lg:text-3xl font-bold text-gray-900 mr-3'>{jobDetail.title}</h1>
              <JobStatusBadge status={jobDetail.status} />
            </div>

            {/* desktop actions */}
            <div className='flex gap-3'>
              {canModify && <Actions isMobile={false} onEdit={handleEdit} onClose={openCloseJob} isClosing={closeMutation.isPending} />}
              <Button onClick={handleBackDashboard}>Back to Dashboard</Button>
            </div>
          </div>
        </div>

        {/* {jobDetail.status === 'confirmed' && (
          <Card className='bg-purple-50 border-purple-200 mb-5'>
            <CardHeader>
              <CardTitle className='font-roboto text-lg flex items-center gap-2 text-purple-900'>
                <CheckCircle className='h-5 w-5' />
                Job Confirmed 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='font-inter text-sm text-purple-700 mb-4'>Congratulations! Your job has been successfully confirmed by the contractor.</p>
              <p className='font-inter text-sm text-purple-700 mb-4'>Contractor will soon contact you</p>
            </CardContent>
          </Card>
        )} */}

        <div className='space-y-6'>
          {/* Job Details Card */}
          <Card>
            {/* mobile card title + badge + mobile actions (all components are hidden in <lg:hidden>) */}
            <CardHeader className='sm:pb-4 lg:pb-0'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <CardTitle className='font-roboto text-lg lg:text-xl lg:hidden mr-3'>{jobDetail.title}</CardTitle>
                  <div className='lg:hidden'>
                    <JobStatusBadge status={jobDetail.status} />
                  </div>
                </div>
                {canModify && (
                  <div className='lg:hidden'>
                    <Actions isMobile={true} onEdit={handleEdit} onClose={openCloseJob} isClosing={closeMutation.isPending} />{' '}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className='space-y-6'>
              {/* post date */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Posted On</h3>
                <p className='font-inter text-gray-700'>{formatDateTime(jobDetail.created_at)}</p>
              </div>

              {/* job type */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Job Type</h3>
                <p className='font-inter text-gray-700'>{jobDetail.job_type}</p>
              </div>

              {/* Job Description */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Description</h3>
                <p className='font-inter text-gray-700 whitespace-pre-wrap leading-relaxed'>{jobDetail.description}</p>
              </div>

              {/* job budget */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Budget</h3>
                <p className='font-inter text-gray-700'>{jobDetail.job_budget}</p>
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

          {/* Bids Section */}
          <JobBidsSection jobId={jobId} bidCount={jobDetail.bid_count} bids={jobDetail.bids} />
        </div>
      </div>
    </div>
  );
}
