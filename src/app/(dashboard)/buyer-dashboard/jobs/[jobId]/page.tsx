'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJobDetail, deleteJob } from '@/lib/apis/jobs';
import { JobImagesGallery } from '@/components/buyer-dashboard/job-detail/JobImagesGallery';
import { JobBidsSection } from '@/components/buyer-dashboard/job-detail/JobBidsSection';
import { DeleteJobModal } from '@/components/buyer-dashboard/job-detail/DeleteJobModal';
import { JobActions } from '@/components/buyer-dashboard/job-detail/JobAction';

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const jobId = params.jobId as string;

  // Fetch job details
  const {
    data: jobDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getJobDetail(jobId, token);
    },
    enabled: !!jobId && !!getToken,
    staleTime: 0,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return deleteJob(jobId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      router.push('/buyer-dashboard');
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete job. Please try again.');
    },
  });

  // Navigate to edit job page with "edit" query parameter
  const handleEdit = () => {
    router.push(`/buyer-dashboard/post-job?edit=${jobId}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    router.push('/buyer-dashboard');
  };

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
          <Button onClick={handleBack} className='font-roboto'>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if job can be edited/deleted
  const canModify = ['draft', 'open', 'full_bid'].includes(jobDetail.status);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Delete Confirmation Modal */}
      <DeleteJobModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        jobTitle={jobDetail.title}
      />

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
            Back to Dashboard
          </Button>
          <div className='flex justify-between items-start'>
            <div>
              <h1 className='font-roboto text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>{jobDetail.title}</h1>
            </div>

            {canModify && <JobActions onEdit={handleEdit} onDelete={handleDelete} isDeleting={deleteMutation.isPending} />}
          </div>
        </div>

        <div className='space-y-6'>
          {/* Job Details Card */}
          <Card>
            <CardHeader className='pb-4'>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <CardTitle className='font-roboto text-lg lg:text-xl lg:hidden'>{jobDetail.title}</CardTitle>
                  <div className='flex flex-wrap items-center gap-2 lg:gap-4 text-sm text-gray-600 font-inter mt-2 lg:mt-0'>
                    <span className='capitalize'>{jobDetail.job_type}</span>
                    <span className='hidden lg:inline'>•</span>
                    <span className='lg:hidden'>Posted</span>
                    <span>{new Date(jobDetail.created_at).toLocaleDateString()}</span>
                    <div className='w-full lg:w-auto lg:inline'>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          jobDetail.status === 'open'
                            ? 'bg-green-100 text-green-800'
                            : jobDetail.status === 'draft'
                            ? 'bg-gray-100 text-gray-800'
                            : jobDetail.status === 'full_bid'
                            ? 'bg-blue-100 text-blue-800'
                            : jobDetail.status === 'confirmed'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {jobDetail.status === 'full_bid' ? 'Full Bids' : jobDetail.status.charAt(0).toUpperCase() + jobDetail.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {canModify && (
                  <div className='lg:hidden flex gap-2 ml-4'>
                    <Button size='sm' onClick={handleEdit} className='font-roboto'>
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='destructive' onClick={handleDelete} disabled={deleteMutation.isPending}>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className='space-y-6'>
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
                  <JobImagesGallery images={jobDetail.images} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bids Section */}
          <JobBidsSection jobId={jobId} jobStatus={jobDetail.status} bidCount={jobDetail.bid_count} />
        </div>
      </div>
    </div>
  );
}
