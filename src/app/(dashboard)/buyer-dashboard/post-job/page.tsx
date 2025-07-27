'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Send, Plus, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJob, saveJobDraft, type JobFormData } from '@/lib/apis/jobs';

const JOB_TYPES = ['Plumbing', 'Painting', 'Landscaping', 'Roofing', 'Indoor', 'Backyard', 'Fencing & Decking', 'Design'] as const;

export default function PostJobPage() {
  //  Form errors
  //  keyof is ts specific syntax, as "type operator" used to get the union of the keys of a object type.
  //  such as: type User = { name: string; age: number; };
  //  "keyof User" will be "name" | "age"

  //  Partial<Type>: makes all properties in Type optional
  //  such as: type User = { name: string; age: number; };
  //  Partial<User> will be { name?: string; age?: number; }
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    job_type: '',
    description: '',
    location_address: '',
    city: '',
    other_requirements: '',
    images: [],
  });

  const handleFormInputChange = (field: keyof JobFormData, value: string) => {
    // update form data on any specific field with value change
    setFormData((prev) => ({ ...prev, [field]: value }));

    // set "hasUnsavedChanges" to true
    setHasUnsavedChanges(true);

    // Clear error when user starts typing / valule change on any specific field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Auto-populate city when address changes (simplified for now)
    if (field === 'location_address' && value) {
      // This would normally integrate with Google Places API
      // For now, just extract potential city from address
      const addressParts = value.split(',');
      if (addressParts.length > 1) {
        const potentialCity = addressParts[addressParts.length - 2]?.trim();
        if (potentialCity) {
          setFormData((prev) => ({ ...prev, city: potentialCity }));
        }
      }
    }
  };

  // ------------------------------------------------------------------------------------------------------------

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length > 6) {
      alert('Maximum 6 images allowed per job');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    setHasUnsavedChanges(true);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setHasUnsavedChanges(true);
  };

  // ------------------------------------------------------------------------------------------------------------

  const validateRequiredFields = (): boolean => {
    const newErrors: Partial<Record<keyof JobFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    if (!formData.job_type) {
      newErrors.job_type = 'Please select a job type';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }

    if (!formData.location_address.trim()) {
      newErrors.location_address = 'Job address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------------------------------------------------------------------------------------
  // TypeScript lets you use typeof to refer to the type of a value or variable
  // The operator here does not output a string; it produces a type shape matching the value

  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobFormData) => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return createJob(jobData, token);
    },
    onSuccess: () => {
      // Invalidate and refetch buyer jobs data
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      alert('Job posted successfully!');
      router.push('/buyer-dashboard');
    },
    onError: (error) => {
      console.error('Error posting job:', error);
      alert(error instanceof Error ? error.message : 'Failed to post job. Please try again.');
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (draftData: JobFormData) => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return saveJobDraft(draftData, token);
    },
    onSuccess: () => {
      // Invalidate and refetch buyer jobs data
      queryClient.invalidateQueries({ queryKey: ['buyer-jobs'] });
      setHasUnsavedChanges(false);
      alert('Draft saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      alert(error instanceof Error ? error.message : 'Failed to save draft. Please try again.');
    },
  });

  // ------------------------------------------------------------------------------------------------------------

  const handleSaveDraft = async () => {
    saveDraftMutation.mutate(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateRequiredFields()) {
      return;
    }

    createJobMutation.mutate(formData);
  };

  // ------------------------------------------------------------------------------------------------------------

  // Warn about unsaved changes when navigating away
  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    router.back();
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBackNavigation} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900'>Post New Job</h1>
        <div className='w-9' /> {/* Spacer for centering */}
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}

        <div className='hidden lg:block mb-8'>
          <div className='flex justify-between items-center'>
            <h1 className='font-roboto text-3xl font-bold text-gray-900 '>Post New Job</h1>
            <Button onClick={handleBackNavigation}>Back to Dashboard</Button>
          </div>
          <p className='font-inter text-gray-600 mt-4'>Fill out the details below to get competitive bids from qualified contractors.</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto'>Job Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Job Title */}
              <div className='space-y-2'>
                <Label htmlFor='title' className='font-roboto'>
                  Job Title <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => handleFormInputChange('title', e.target.value)}
                  placeholder='e.g., Kitchen Plumbing Repair Needed'
                  className={`font-inter ${errors.title ? 'border-red-500' : ''}`}
                />
                {errors.title && <p className='font-inter text-sm text-red-600'>{errors.title}</p>}
              </div>

              {/* Job Type */}
              <div className='space-y-2'>
                <Label htmlFor='job_type' className='font-roboto'>
                  Job Type <span className='text-red-500'>*</span>
                </Label>
                <select
                  id='job_type'
                  value={formData.job_type}
                  onChange={(e) => handleFormInputChange('job_type', e.target.value)}
                  className={`w-full h-9 px-3 py-1 text-sm border rounded-md font-inter ${errors.job_type ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value=''>Select a job type...</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.job_type && <p className='font-inter text-sm text-red-600'>{errors.job_type}</p>}
              </div>

              {/* Job Description */}
              <div className='space-y-2'>
                <Label htmlFor='description' className='font-roboto'>
                  Job Description <span className='text-red-500'>*</span>
                </Label>
                <textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => handleFormInputChange('description', e.target.value)}
                  placeholder='Describe your project in detail. Include what needs to be done, current issues, timeline preferences, and any specific requirements...'
                  className={`w-full min-h-32 px-3 py-2 text-sm border rounded-md font-inter resize-y ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                <div className='flex justify-between items-center'>{errors.description && <p className='font-inter text-sm text-red-600'>{errors.description}</p>}</div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto'>Location</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Address */}
              <div className='space-y-2'>
                <Label htmlFor='location_address' className='font-roboto'>
                  Job Address <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='location_address'
                  value={formData.location_address}
                  onChange={(e) => handleFormInputChange('location_address', e.target.value)}
                  placeholder='Enter the full address where work will be done'
                  className={`font-inter ${errors.location_address ? 'border-red-500' : ''}`}
                />
                {errors.location_address && <p className='font-inter text-sm text-red-600'>{errors.location_address}</p>}
                <p className='font-inter text-xs text-gray-500'>This address will be shared with selected contractors only</p>
              </div>

              {/* City */}
              <div className='space-y-2'>
                <Label htmlFor='city' className='font-roboto'>
                  City <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='city'
                  value={formData.city}
                  onChange={(e) => handleFormInputChange('city', e.target.value)}
                  placeholder='City name'
                  className={`font-inter ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className='font-inter text-sm text-red-600'>{errors.city}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className='font-roboto'>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Other Requirements */}
              <div className='space-y-2'>
                <Label htmlFor='other_requirements' className='font-roboto'>
                  Other Requirements
                  <span className='font-inter text-sm text-gray-500 ml-2'>(Optional)</span>
                </Label>
                <textarea
                  id='other_requirements'
                  value={formData.other_requirements}
                  onChange={(e) => handleFormInputChange('other_requirements', e.target.value)}
                  placeholder='Any special requirements, preferred timing, budget considerations, or other important details...'
                  className='w-full min-h-24 px-3 py-2 text-sm border border-gray-300 rounded-md font-inter resize-y'
                />
              </div>

              {/* Image Upload */}
              <div className='space-y-3'>
                <Label className='font-roboto'>
                  Job Photos
                  <span className='font-inter text-sm text-gray-500 ml-2'>(Optional, max 6 images)</span>
                </Label>

                {/* Upload Button */}
                <div className='flex items-center gap-4'>
                  <input type='file' accept='image/*' multiple onChange={handleImageUpload} className='hidden' id='image-upload' disabled={formData.images.length >= 6} />
                  <label
                    htmlFor='image-upload'
                    className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-inter cursor-pointer hover:bg-gray-50 ${
                      formData.images.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus className='h-4 w-4' />
                    Add Photos
                  </label>
                  <p className='font-inter text-xs text-gray-500'>{formData.images.length}/6 images</p>
                </div>

                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {formData.images.map((file, index) => (
                      <div key={index} className='relative group'>
                        <img src={URL.createObjectURL(file)} alt={`Upload ${index + 1}`} className='w-full h-24 object-cover rounded-lg border' />
                        <button
                          type='button'
                          onClick={() => removeImage(index)}
                          className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-6'>
            <Button
              type='button'
              variant='outline'
              onClick={handleSaveDraft}
              disabled={saveDraftMutation.isPending || createJobMutation.isPending}
              className='font-roboto flex items-center gap-2'
            >
              <Save className='h-4 w-4' />
              {saveDraftMutation.isPending ? 'Saving...' : 'Save as Draft'}
            </Button>

            <Button
              type='submit'
              disabled={createJobMutation.isPending || saveDraftMutation.isPending}
              className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
            >
              <Send className='h-4 w-4' />
              {createJobMutation.isPending ? 'Posting Job...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
