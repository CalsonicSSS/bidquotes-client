'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createJob, saveJobDraft, getJobDetail, updateJob, deleteJob, type JobFormData } from '@/lib/apis/jobs';
import { SuccessModal } from '@/components/SuccessModal';
import { LocationSection } from '@/components/buyer-dashboard/forms/LocationSection';
import { JobBasicInfoSection } from '@/components/buyer-dashboard/forms/JobBasicInfoSection';
import { FormActions } from '@/components/buyer-dashboard/forms/FormActions';
import { ImageUploadSection } from '@/components/ImageUploadSection';
import { convertImageUrlsToFiles } from '@/lib/utils/image-utils';
import { DeleteDraftModal } from '../DeleteDraftModal';

export default function MainJobForm() {
  // keyof creates a "union literal type" of the keys of the JobFormData type.
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteDraftModal, setShowDeleteDraftModal] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [successType, setSuccessType] = useState<'job' | 'draft'>('job');

  const hasPushed = useRef(false);
  const blockPop = useRef(true);

  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    job_type: '',
    job_budget: '',
    description: '',
    location_address: '',
    city: '',
    other_requirements: '',
    images: [],
  });

  // identify if this is draft or new post creation
  const jobId = searchParams.get('draft') || searchParams.get('edit');
  const isEditingDraft = !!searchParams.get('draft');
  const isEditingJob = !!searchParams.get('edit');

  // ----------------------------------------------------------------------------------------------------------

  // Fetch existing job data if this is either draft or edit case
  const { data: existingJobData, isLoading: isJobLoading } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      const token = await getToken();
      if (!token || !jobId) throw new Error('No token or job ID available');
      return getJobDetail(jobId, token);
    },
    staleTime: 0,
    enabled: !!jobId && !!getToken, // if jobId is falsy, the query will not run
  });

  // Pre-populate form field data if existing job data is available from either draft or edit case
  useEffect(() => {
    const loadJobData = async () => {
      if (existingJobData) {
        // Pre-populate fields
        setFormData({
          title: existingJobData.title || '',
          job_type: existingJobData.job_type || '',
          job_budget: existingJobData.job_budget || '',
          description: existingJobData.description || '',
          location_address: existingJobData.location_address || '',
          city: existingJobData.city || '',
          other_requirements: existingJobData.other_requirements || '',
          images: [],
        });

        // Load existing images if any
        if (existingJobData.images && existingJobData.images.length > 0) {
          setIsLoadingImages(true);
          try {
            const existingImageFiles = await convertImageUrlsToFiles(existingJobData.images);
            setFormData((prev) => ({
              ...prev,
              images: existingImageFiles,
            }));
          } catch (error) {
            console.error('Error loading existing images:', error);
          } finally {
            setIsLoadingImages(false);
          }
        }
      }
    };

    loadJobData();
  }, [existingJobData]);

  // Browser navigation protection when there are unsaved changes
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
        if (confirmed) {
          blockPop.current = false;
          router.back();
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      } else {
        router.back();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, router]);

  // ------------------------------------------------------------------------------------------------------------------
  // form input update logic and error handling

  const handleFormInputChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);

    // Clear corresponding field errors upon value change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLocationChange = (locationData: Partial<{ location_address: string; city: string }>) => {
    setFormData((prev) => ({ ...prev, ...locationData }));
    setHasUnsavedChanges(true);

    // Clear location-related errors field upon value change
    if (locationData.location_address && errors.location_address) {
      setErrors((prev) => ({ ...prev, location_address: undefined }));
    }
    if (locationData.city && errors.city) {
      setErrors((prev) => ({ ...prev, city: undefined }));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
    setHasUnsavedChanges(true);
  };

  const validateRequiredFields = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.job_type) newErrors.job_type = 'Please select a job type';
    if (!formData.job_budget.trim()) newErrors.job_budget = 'Job budget is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location_address.trim()) newErrors.location_address = 'Job address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      alert('Please fill in all required fields before submitting.');
    }

    return isValid;
  };

  // ----------------------------------------------------------------------------------------------------------------------
  // Mutations for creating/updating job, saving draft, and deleting draft

  const createOrUpdateJobMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      if (isEditingDraft && jobId) {
        // If editing a draft, update it with isDraftPost set to true for posting
        return updateJob(jobId, formData, token, true);
      } else if (isEditingJob && jobId) {
        // If its editing an existing job, update it
        return updateJob(jobId, formData, token, false);
      } else {
        // Only create new job if not editing anything
        return createJob(formData, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      setSuccessType('job');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error posting job:', error);
      alert(error instanceof Error ? error.message : 'Failed to post job. Please try again.');
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');

      // very important: distinguish if this is the first time draft save or its the continuous updates for the existing draft
      // thats why we have this isDraftPost
      if (isEditingDraft && jobId) {
        return updateJob(jobId, formData, token, false);
      } else {
        return saveJobDraft(formData, token);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      setSuccessType('draft');
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to save draft. Please try again.');
    },
  });

  // Delete draft mutation
  const deleteDraftMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token || !jobId) throw new Error('Unable to get authentication token or job ID');
      return deleteJob(jobId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      router.push('/buyer-dashboard');
    },
    onError: (error) => {
      console.error('Error deleting draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete draft. Please try again.');
    },
  });

  // ------------------------------------------------------------------------------------------------------------------------
  // Handlers for form actions

  const handleSaveDraft = async () => {
    saveDraftMutation.mutate();
  };

  const handleJobSubmit = async () => {
    if (!validateRequiredFields()) return;
    createOrUpdateJobMutation.mutate();
  };

  const handleDeleteDraft = () => {
    setShowDeleteDraftModal(true);
  };

  const handleConfirmDeleteDraft = () => {
    deleteDraftMutation.mutate();
    setShowDeleteDraftModal(false);
  };

  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    router.push('/buyer-dashboard');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/buyer-dashboard');
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Show loading while fetching draft

  if ((isEditingDraft || isEditingJob) && (isJobLoading || isLoadingImages)) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>{isJobLoading ? 'Loading job data...' : 'Loading images...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <SuccessModal
        isOpen={showSuccessModal}
        title={successType === 'job' ? 'Job Posted Successfully!' : 'Draft Saved Successfully!'}
        message={
          successType === 'job'
            ? 'Your job posting is now live and contractors can start submitting bids.'
            : 'Your job draft has been saved. You can continue editing it anytime from your dashboard.'
        }
        buttonText={successType === 'job' ? 'View Dashboard' : 'Back to Dashboard'}
        onClose={handleSuccessModalClose}
      />

      {/* Delete Draft Confirmation Modal */}
      <DeleteDraftModal
        isOpen={showDeleteDraftModal}
        onClose={() => setShowDeleteDraftModal(false)}
        onConfirm={handleConfirmDeleteDraft}
        isDeleting={deleteDraftMutation.isPending}
        draftTitle={formData.title}
      />

      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBackNavigation} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900'>{isEditingDraft ? 'Edit Draft' : isEditingJob ? 'Edit Job' : 'Post New Job'}</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:block mb-8'>
          <div className='flex justify-between items-center'>
            <h1 className='font-roboto text-3xl font-bold text-gray-900'>{isEditingDraft ? 'Edit Draft' : isEditingJob ? 'Edit Job' : 'Post New Job'}</h1>
            <div className='flex gap-3'>
              {/* Delete Draft button - only show when editing a draft */}
              {isEditingDraft && (
                <Button onClick={handleDeleteDraft} variant='destructive' className='font-roboto flex items-center gap-2' disabled={deleteDraftMutation.isPending}>
                  <Trash2 className='h-4 w-4' />
                  {deleteDraftMutation.isPending ? 'Deleting...' : 'Delete Draft'}
                </Button>
              )}
              <Button onClick={handleBackNavigation}>Back to Dashboard</Button>
            </div>
          </div>
          <p className='font-inter text-gray-600 mt-4'>
            {isEditingDraft ? 'Continue editing your job draft below.' : isEditingJob ? 'Edit your job details below.' : 'Fill out the details below to get competitive bids.'}
          </p>
        </div>

        <div className='space-y-6'>
          {/* Job Basic Info Section */}
          <JobBasicInfoSection
            formData={{
              title: formData.title,
              job_type: formData.job_type,
              job_budget: formData.job_budget,
              description: formData.description,
              other_requirements: formData.other_requirements,
            }}
            onFormInputChange={handleFormInputChange}
            errors={errors}
          />

          {/* Location Section */}
          <LocationSection
            locationData={{
              location_address: formData.location_address,
              city: formData.city,
            }}
            onLocationChange={handleLocationChange}
            errors={{
              location_address: errors.location_address,
              city: errors.city,
            }}
          />

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto'>Photos Upload</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <ImageUploadSection
                images={formData.images}
                onImagesChange={handleImagesChange}
                isLoading={isLoadingImages}
                maxImages={6}
                title='Job Photos'
                description='Optional, max 6 images'
              />
            </CardContent>
          </Card>

          {/* Mobile Delete Draft Button - only show when editing a draft */}
          {isEditingDraft && (
            <div className='lg:hidden'>
              <Button
                type='button'
                variant='destructive'
                onClick={handleDeleteDraft}
                disabled={deleteDraftMutation.isPending}
                className='font-roboto flex items-center gap-2 w-full'
              >
                <Trash2 className='h-4 w-4' />
                {deleteDraftMutation.isPending ? 'Deleting...' : 'Delete Draft'}
              </Button>
            </div>
          )}

          {/* Form Actions */}
          <FormActions
            isEditingDraft={isEditingDraft}
            isEditingJob={isEditingJob}
            onSaveDraft={handleSaveDraft}
            onJobSubmit={handleJobSubmit}
            saveDraftPending={saveDraftMutation.isPending}
            createOrUpdateJobPending={createOrUpdateJobMutation.isPending}
            deleteDraftPending={deleteDraftMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
