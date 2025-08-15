'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createBid, saveBidDraft, getBidDetail, updateBid, deleteBid, type BidFormData } from '@/lib/apis/contractor-bids';
import { getContractorJobDetail } from '@/lib/apis/contractor-jobs';
import { SuccessModal } from '@/components/SuccessModal';
import { BidInfoSection } from './BidInfoSection';
import { Actions } from './Actions';
import { DeleteBidDraftModal } from './DeleteBidDraftModal';
import { getContractorProfileName } from '@/lib/apis/contractor-profile';

export default function MainBidForm() {
  const [errors, setErrors] = useState<Partial<Record<keyof BidFormData, string>>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);
  const [successType, setSuccessType] = useState<'bid' | 'draft'>('bid');

  const hasPushed = useRef(false);
  const blockPop = useRef(true);

  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<BidFormData>({
    job_id: '',
    title: '',
    price_min: '',
    price_max: '',
    timeline_estimate: '',
    work_description: 'hidden placeholder',
    additional_notes: 'hidden placeholder',
  });

  // Identify the mode and IDs
  const jobId = searchParams.get('jobId'); // jobID will be getting for new bid posting on this job (nav from the job detail page)
  const bidId = searchParams.get('draft') || searchParams.get('edit'); // this is nav from the bids list page or bid detail page
  const isEditingDraft = !!searchParams.get('draft');
  const isEditingBid = !!searchParams.get('edit');

  // Fetch contractor name based on user token, the name will be used as value for bid title
  const { data: contractorName } = useQuery({
    queryKey: ['contractor-name'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getContractorProfileName(token);
    },
    enabled: !!getToken,
  });

  // Fetch job details based on job id (when creating new bid)
  const { data: jobDetail } = useQuery({
    queryKey: ['contractor-job-detail', jobId],
    queryFn: async () => {
      const token = await getToken();
      if (!token || !jobId) throw new Error('No token or job ID available');
      return getContractorJobDetail(jobId, token);
    },
    enabled: !!jobId && !!getToken,
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
    staleTime: 0,
    enabled: !!bidId && !!getToken,
  });

  // Pre-populate contractor name
  useEffect(() => {
    if (contractorName) {
      setFormData((prev) => ({ ...prev, title: contractorName || '' }));
    }
  }, [contractorName]);

  // Pre-populate form data
  useEffect(() => {
    if (jobId && !bidId) {
      // New bid for specific job
      setFormData((prev) => ({ ...prev, job_id: jobId }));
    } else if (existingBidData) {
      // Editing existing bid/draft by pre-populating form fields
      setFormData({
        job_id: existingBidData.job_id,
        title: existingBidData.title || '',
        price_min: existingBidData.price_min || '',
        price_max: existingBidData.price_max || '',
        timeline_estimate: existingBidData.timeline_estimate || '',
        work_description: existingBidData.work_description || '',
        additional_notes: existingBidData.additional_notes || '',
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
  const handleFormInputChange = (field: keyof BidFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation
  const validateRequiredFields = () => {
    const newErrors: Partial<Record<keyof BidFormData, string>> = {};

    // if (!formData.title.trim()) newErrors.title = 'Bid title is required';
    if (!formData.price_min.trim()) newErrors.price_min = 'Minimum price is required';
    if (!formData.price_max.trim()) newErrors.price_max = 'Maximum price is required';
    if (!formData.timeline_estimate.trim()) newErrors.timeline_estimate = 'Timeline estimate is required';
    // if (!formData.work_description.trim()) newErrors.work_description = 'Work description is required';

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      alert('Please fill in all required fields before submitting.');
    }

    return isValid;
  };

  // Mutations
  const createOrUpdateBidMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingDraft && bidId) {
        return updateBid(bidId, formData, token, true);
      } else if (isEditingBid && bidId) {
        return updateBid(bidId, formData, token, false);
      } else {
        return createBid(formData, token);
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
      console.error('Error submitting bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit bid. Please try again.');
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingDraft && bidId) {
        return updateBid(bidId, formData, token, false);
      } else {
        return saveBidDraft(formData, token);
      }
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

  const deleteBidDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token || !bidId) throw new Error('Unable to get authentication token or bid ID');
      return deleteBid(bidId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      queryClient.invalidateQueries({ queryKey: ['contractor-available-jobs'] });
      setHasUnsavedChanges(false);
      router.push('/contractor-dashboard?section=your-bids');
    },
    onError: (error) => {
      console.error('Error deleting bid draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete bid draft. Please try again.');
    },
  });

  // Action handlers
  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };

  const handleBidSubmit = () => {
    if (!validateRequiredFields()) return;
    createOrUpdateBidMutation.mutate();
  };

  const handleDeleteDraft = () => {
    setShowDeleteDraftModal(true);
  };

  const handleConfirmDeleteDraft = () => {
    deleteBidDraftMutation.mutate();
    setShowDeleteDraftModal(false);
  };

  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    router.push('/contractor-dashboard?section=your-bids');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/contractor-dashboard?section=your-bids');
  };

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

  const contextJob = jobDetail || existingBidData;

  return (
    <div className='min-h-screen bg-gray-50'>
      <SuccessModal
        isOpen={showSuccessModal}
        title={successType === 'bid' ? 'Bid Submitted Successfully!' : 'Draft Saved Successfully!'}
        message={
          successType === 'bid'
            ? 'Your bid has been submitted to the buyer. You will be notified if your bid is selected.'
            : 'Your bid draft has been saved. You can continue editing it anytime from your dashboard.'
        }
        buttonText={successType === 'bid' ? 'View Dashboard' : 'Back to Dashboard'}
        onClose={handleSuccessModalClose}
      />

      {/* Delete Draft Confirmation Modal */}
      <DeleteBidDraftModal
        isOpen={showDeleteDraftModal}
        onClose={() => setShowDeleteDraftModal(false)}
        onConfirm={handleConfirmDeleteDraft}
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
                <Button onClick={handleDeleteDraft} variant='destructive' className='font-roboto flex items-center gap-2' disabled={deleteBidDraftMutation.isPending}>
                  <Trash2 className='h-4 w-4' />
                  {deleteBidDraftMutation.isPending ? 'Deleting...' : 'Delete Draft'}
                </Button>
              )}
              <Button onClick={handleBackNavigation}>Back to Dashboard</Button>
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
                <CardTitle className='font-roboto text-lg'>Job: {jobDetail?.title || existingBidData?.job_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                  <div>
                    <span className='font-roboto font-semibold'>Type:</span>
                    <span className='font-inter ml-2'>{jobDetail?.job_type || existingBidData?.job_type}</span>
                  </div>
                  <div>
                    <span className='font-roboto font-semibold'>Budget:</span>
                    <span className='font-inter ml-2'>{jobDetail?.job_budget || existingBidData?.job_budget}</span>
                  </div>
                  <div>
                    <span className='font-roboto font-semibold'>Location:</span>
                    <span className='font-inter ml-2'>{jobDetail?.city || existingBidData?.job_city}</span>
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
            onSaveDraft={handleSaveDraft}
            onBidSubmit={handleBidSubmit}
            saveDraftPending={saveDraftMutation.isPending}
            createOrUpdateBidPending={createOrUpdateBidMutation.isPending}
            deleteBidPending={deleteBidDraftMutation.isPending}
            onDeleteDraft={isEditingDraft ? handleDeleteDraft : undefined}
          />
        </div>
      </div>
    </div>
  );
}
