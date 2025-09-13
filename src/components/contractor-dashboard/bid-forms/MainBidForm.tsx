'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBid, saveBidDraft, getBidDetail, updateBid, deleteBid, type BidCreate } from '@/lib/apis/contractor-bids';
import { getPreBidJobDetail } from '@/lib/apis/contractor-jobs';
import { SuccessModal } from '@/components/SuccessModal';
import { BidInfoSection } from './BidInfoSection';
import { Actions } from './Actions';
import { DeleteBidDraftModal } from './DeleteBidDraftModal';

export default function MainBidForm() {
  const [errors, setErrors] = useState<Partial<Record<keyof BidCreate, string>>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteBidDraftModal, setShowDeleteBidDraftModal] = useState(false);
  const [successType, setSuccessType] = useState<'bid' | 'draft'>('bid');

  const hasPushed = useRef(false);
  const blockPop = useRef(true);

  const queryClient = useQueryClient();
  const { userId, getToken } = useAuth();
  const { user } = useUser();

  const [formData, setFormData] = useState<BidCreate>({
    job_id: '',
    title: '',
    price_min: '',
    price_max: '',
    timeline_estimate: '',
  });

  // Identify the mode and IDs
  // there 3 ways to navigate to this post bid form page:
  // 1. From the job detail page (new bid posting) -> comes with "job Id" (only through this way) in query params
  // 2. From the bids list page (draft) -> comes with "draft id" in query params
  // 3. From the bid detail page (edit) -> comes with "bid id" in query params
  const jobId = searchParams.get('jobId');
  const bidId = searchParams.get('draft') || searchParams.get('edit');
  const isEditingDraft = !!searchParams.get('draft');
  const isEditingBid = !!searchParams.get('edit');

  // Fetch pre-bid job details based on job id (to display some basic top level job information)
  const { data: preBidJobDetail } = useQuery({
    queryKey: ['contractor-job-detail', jobId],
    queryFn: async () => {
      const token = await getToken();
      if (!token || !jobId) throw new Error('No token or job ID available');
      return getPreBidJobDetail(jobId, token);
    },
    enabled: !!jobId && !!getToken,
    staleTime: 0,
  });

  // Fetch existing bid data if its either editing or drafting
  // this will fetch if bidId is available
  const { data: existingBidData, isLoading: isBidLoading } = useQuery({
    queryKey: ['bid-detail', bidId],
    queryFn: async () => {
      const token = await getToken();
      if (!token || !bidId) throw new Error('No token or bid ID available');
      return getBidDetail(bidId, token);
    },
    enabled: !!bidId && !!getToken,
    staleTime: 0,
  });

  // Pre-populate form data
  useEffect(() => {
    if (jobId && !bidId) {
      // New bid for specific job
      setFormData((prev) => ({ ...prev, job_id: jobId }));
    } else if (existingBidData) {
      // Only do this if there is existing bid or draft, then do the pre-populate form fields
      setFormData({
        job_id: existingBidData.job_id,
        title: existingBidData.title || '',
        price_min: existingBidData.price_min || '',
        price_max: existingBidData.price_max || '',
        timeline_estimate: existingBidData.timeline_estimate || '',
      });
    }
  }, [jobId, bidId, existingBidData]);

  // Browser navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (!hasPushed.current) {
      window.history.pushState(null, '', window.location.href);
      hasPushed.current = true;
    }

    const handlePopState = (event: PopStateEvent) => {
      if (blockPop.current && hasUnsavedChanges) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmed) {
          window.history.pushState(null, '', window.location.href);
          return;
        }
      }
      blockPop.current = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  // Form change handler
  const handleFormInputChange = (field: keyof BidCreate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation
  const validateRequiredFields = () => {
    const newErrors: Partial<Record<keyof BidCreate, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Bid title is required';
    if (!formData.price_min.trim()) newErrors.price_min = 'Minimum price is required';
    if (!formData.price_max.trim()) newErrors.price_max = 'Maximum price is required';
    if (!formData.timeline_estimate.trim()) newErrors.timeline_estimate = 'Timeline estimate is required';

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      alert('Please fill in all required fields before submitting.');
    }

    return isValid;
  };

  // ----------------------------------------------------------------------------------------------------------------------------------------------------
  // Mutations

  const createBidMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return createBid(formData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-available-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      setHasUnsavedChanges(false);
      setSuccessType('bid');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error submitting bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit bid. Please try again.');
    },
  });

  const updateExistingBidMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingBid && bidId) {
        return updateBid(bidId, formData, token, false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-available-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      queryClient.invalidateQueries({ queryKey: ['bid-detail', bidId] });
      setHasUnsavedChanges(false);
      setSuccessType('bid');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error updating bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to update bid. Please try again.');
    },
  });

  const saveBidDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return saveBidDraft(formData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      setHasUnsavedChanges(false);
      setSuccessType('draft');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to save draft. Please try again.');
    },
  });

  const updateExistingBidDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingDraft && bidId) {
        return updateBid(bidId, formData, token, false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      queryClient.invalidateQueries({ queryKey: ['bid-detail', bidId] });
      setHasUnsavedChanges(false);
      setSuccessType('draft');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error updating draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to update draft. Please try again.');
    },
  });

  const createBidFromDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      if (isEditingDraft && bidId) {
        return updateBid(bidId, formData, token, true);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-available-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      setHasUnsavedChanges(false);
      setSuccessType('bid');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error submitting bid from draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit bid. Please try again.');
    },
  });

  const deleteBidDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (userId && user) {
        if (!token || !bidId) throw new Error('Unable to get authentication token or bid ID');
        return deleteBid(bidId, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-available-jobs'] });
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      console.error('Error deleting bid draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete bid draft. Please try again.');
    },
  });

  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  // Action handlers
  const createBidHandler = async () => {
    if (!validateRequiredFields()) return;
    createBidMutation.mutate();
  };

  const updateExistingBidHandler = async () => {
    if (!validateRequiredFields()) return;
    updateExistingBidMutation.mutate();
  };

  const saveBidDraftHandler = async () => {
    saveBidDraftMutation.mutate();
  };

  const updateExistingBidDraftHandler = async () => {
    updateExistingBidDraftMutation.mutate();
  };

  const createBidFromDraftHandler = async () => {
    if (!validateRequiredFields()) return;
    createBidFromDraftMutation.mutate();
  };

  const deleteDraftHandler = async () => {
    try {
      await deleteBidDraftMutation.mutateAsync();
      setShowDeleteBidDraftModal(false); // only runs after mutation succeeds
      router.push('/contractor-dashboard?section=your-bids');
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------------------------------------------------------------------------------------------------------------------------------------------
  // other handlers

  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    if (jobId) {
      router.push(`/contractor-dashboard/jobs/${jobId}`);
    } else {
      router.push('/contractor-dashboard?section=your-bids');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (successType === 'bid') {
      if (createBidMutation.data?.id) {
        router.push(`/contractor-dashboard/bids/${createBidMutation.data.id}`);
      }
      if (createBidFromDraftMutation.data?.id) {
        router.push(`/contractor-dashboard/bids/${createBidFromDraftMutation.data.id}`);
      }
      if (updateExistingBidMutation.data?.id) {
        router.push(`/contractor-dashboard/bids/${updateExistingBidMutation.data.id}`);
      }
    } else {
      router.push('/contractor-dashboard?section=your-bids');
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Show loading while fetching bid data
  if ((isEditingDraft || isEditingBid) && isBidLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading bid data...</p>
        </div>
      </div>
    );
  }

  const contextJob = preBidJobDetail || existingBidData;

  return (
    <div className='min-h-screen bg-gray-50'>
      <SuccessModal
        isOpen={showSuccessModal}
        title={successType === 'bid' ? 'Bid Submitted Successfully!' : 'Draft Saved Successfully!'}
        message={
          successType === 'bid'
            ? 'Your bid has been submitted to this job. View bid detail to see all revealed information of this job!'
            : 'Your bid draft has been saved. You can continue editing it anytime from your dashboard.'
        }
        buttonText={`${successType === 'bid' ? 'View Bid Detail' : 'Back to Dashboard'}`}
        onClose={handleSuccessModalClose}
      />

      {/* Delete Draft Confirmation Modal */}
      <DeleteBidDraftModal
        isOpen={showDeleteBidDraftModal}
        onClose={() => setShowDeleteBidDraftModal(false)}
        onConfirm={deleteDraftHandler}
        isDeleting={deleteBidDraftMutation.isPending}
        draftTitle={formData.title}
      />

      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBackNavigation} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900'>{isEditingDraft ? 'Edit Draft' : isEditingBid ? 'Edit Bid' : 'Submit Bid'}</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:block mb-8'>
          <div className='flex justify-between items-center'>
            <h1 className='font-roboto text-3xl font-bold text-gray-900'>{isEditingDraft ? 'Edit Bid Draft' : isEditingBid ? 'Edit Your Bid' : 'Submit Your Bid'}</h1>
            <div className='flex gap-3'>
              {/* Delete Draft button - only show when editing a draft */}
              {isEditingDraft && (
                <Button
                  onClick={() => {
                    setShowDeleteBidDraftModal(true);
                  }}
                  variant='destructive'
                  className='font-roboto flex items-center gap-2'
                  disabled={deleteBidDraftMutation.isPending}
                >
                  <Trash2 className='h-4 w-4' />
                  {deleteBidDraftMutation.isPending ? 'Deleting...' : 'Delete Draft'}
                </Button>
              )}
              <Button onClick={handleBackNavigation}>{jobId ? 'Back to Job' : 'Back to Dashboard'}</Button>
            </div>
          </div>
          <p className='font-inter text-gray-600 mt-4'>
            {isEditingDraft
              ? 'Continue editing your bid draft below.'
              : isEditingBid
              ? 'Update your bid details below.'
              : 'Fill out the details below to submit your competitive bid.'}
          </p>
        </div>

        <div className='space-y-6'>
          {/* Job Context Card */}
          {contextJob && (
            <Card className='bg-blue-50 border-blue-200'>
              <CardHeader>
                <CardTitle className='font-roboto text-lg'>Job Title: {preBidJobDetail?.title || existingBidData?.job_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                  <div>
                    <span className='font-roboto font-semibold'>Type:</span>
                    <span className='font-inter ml-2'>{preBidJobDetail?.job_type || existingBidData?.job_type}</span>
                  </div>
                  <div>
                    <span className='font-roboto font-semibold'>Budget:</span>
                    <span className='font-inter ml-2'>{preBidJobDetail?.job_budget || existingBidData?.job_budget}</span>
                  </div>
                  <div>
                    <span className='font-roboto font-semibold'>Location:</span>
                    <span className='font-inter ml-2'>{preBidJobDetail?.city || existingBidData?.job_city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bid Form */}
          <BidInfoSection formData={formData} onFormInputChange={handleFormInputChange} errors={errors} />

          {/* Form Actions */}
          <Actions
            isEditingDraft={isEditingDraft}
            isEditingBid={isEditingBid}
            createBidPending={createBidMutation.isPending}
            saveBidDraftPending={saveBidDraftMutation.isPending}
            updateBidPending={updateExistingBidMutation.isPending}
            updateBidDraftPending={updateExistingBidDraftMutation.isPending}
            createBidFromDraftPending={createBidFromDraftMutation.isPending}
            createBidHandler={createBidHandler}
            saveBidDraftHandler={saveBidDraftHandler}
            updateBidHandler={updateExistingBidHandler}
            updateBidDraftHandler={updateExistingBidDraftHandler}
            createBidFromDraftHandler={createBidFromDraftHandler}
          />

          {/* Mobile Delete Draft Button - only show when editing a draft */}
          {isEditingDraft && (
            <div className='lg:hidden'>
              <Button
                type='button'
                variant='destructive'
                onClick={() => setShowDeleteBidDraftModal(true)}
                disabled={deleteBidDraftMutation.isPending}
                className='font-roboto flex items-center w-full mt-5'
              >
                <Trash2 className='h-4 w-4' />
                {deleteBidDraftMutation.isPending ? 'Deleting...' : 'Delete Draft'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
