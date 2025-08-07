'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateContractorProfile } from '@/lib/apis/contractor-profile';
import { ContractorProfileResponse, ContractorProfileData } from '@/lib/apis/contractor-profile';
import { ImageUploadSection } from '@/components/ImageUploadSection';
import { convertImageUrlsToFiles } from '@/lib/utils/image-utils';

type UpdateContractorProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ContractorProfileResponse;
};

export function UpdateContractorProfileModal({ isOpen, onClose, currentProfile }: UpdateContractorProfileModalProps) {
  const [formInputData, setFormInputData] = useState<ContractorProfileData>({
    contractor_name: currentProfile.contractor_name,
    main_service_areas: currentProfile.main_service_areas,
    years_of_experience: currentProfile.years_of_experience,
    contractor_type: currentProfile.contractor_type,
    team_size: currentProfile.team_size,
    company_website: currentProfile.company_website || '',
    additional_information: currentProfile.additional_information || '',
    images: [], // Will be populated with existing images if any
  });

  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  // Reset form when modal opens and load existing images
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      setFormInputData({
        contractor_name: currentProfile.contractor_name,
        main_service_areas: currentProfile.main_service_areas,
        years_of_experience: currentProfile.years_of_experience,
        contractor_type: currentProfile.contractor_type,
        team_size: currentProfile.team_size,
        company_website: currentProfile.company_website || '',
        additional_information: currentProfile.additional_information || '',
        images: [],
      });

      // Load existing images if any
      if (currentProfile.images && currentProfile.images.length > 0) {
        setIsLoadingImages(true);
        try {
          const existingImageFiles = await convertImageUrlsToFiles(currentProfile.images);
          setFormInputData((prev) => ({
            ...prev,
            images: existingImageFiles,
          }));
        } catch (error) {
          console.error('Error loading existing images:', error);
        } finally {
          setIsLoadingImages(false);
        }
      }
    } else {
      onClose();
    }
  };

  const { error, isPending, mutate } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      return updateContractorProfile(formInputData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-profile'] });
      onClose();
    },
  });

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputData((prev) => ({
      ...prev,
      [name]: name === 'years_of_experience' || name === 'team_size' ? parseInt(value) || 1 : value,
    }));
  };

  const handleImagesChange = (images: File[]) => {
    setFormInputData((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  const isFormValid = formInputData.contractor_name.trim() && formInputData.main_service_areas.trim() && formInputData.years_of_experience > 0 && formInputData.team_size > 0;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-roboto text-xl'>Update Contractor Profile</DialogTitle>
          <DialogDescription className='font-inter text-gray-600'>
            Update your profile information below. This information will be visible to buyers when reviewing bids.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='font-inter text-sm text-red-800'>{error instanceof Error ? error.message : 'An error occurred'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6 mt-4'>
          {/* Required Fields */}
          <div className='space-y-4'>
            <h3 className='font-roboto font-semibold text-gray-900'>Required Information</h3>

            {/* Contractor Name */}
            <div className='space-y-2'>
              <Label htmlFor='contractor_name' className='font-roboto'>
                Contractor Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='contractor_name'
                name='contractor_name'
                value={formInputData.contractor_name}
                onChange={handleFormInputChange}
                placeholder='Your name or business name'
                className='font-inter'
                required
              />
            </div>

            {/* Main Service Areas */}
            <div className='space-y-2'>
              <Label htmlFor='main_service_areas' className='font-roboto'>
                Main Service Areas <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='main_service_areas'
                name='main_service_areas'
                value={formInputData.main_service_areas}
                onChange={handleFormInputChange}
                placeholder='e.g., Plumbing, Electrical, HVAC'
                className='font-inter'
                required
              />
              <p className='text-sm text-gray-500 font-inter'>List the main services you provide</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Years of Experience */}
              <div className='space-y-2'>
                <Label htmlFor='years_of_experience' className='font-roboto'>
                  Years of Experience <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='years_of_experience'
                  name='years_of_experience'
                  type='number'
                  min='1'
                  value={formInputData.years_of_experience}
                  onChange={handleFormInputChange}
                  className='font-inter'
                  required
                />
              </div>

              {/* Team Size */}
              <div className='space-y-2'>
                <Label htmlFor='team_size' className='font-roboto'>
                  Team Size <span className='text-red-500'>*</span>
                </Label>
                <Input id='team_size' name='team_size' type='number' min='1' value={formInputData.team_size} onChange={handleFormInputChange} className='font-inter' required />
              </div>
            </div>

            {/* Contractor Type */}
            <div className='space-y-2'>
              <Label htmlFor='contractor_type' className='font-roboto'>
                Contractor Type <span className='text-red-500'>*</span>
              </Label>
              <select
                id='contractor_type'
                name='contractor_type'
                value={formInputData.contractor_type}
                onChange={handleFormInputChange}
                className='w-full h-9 px-3 py-1 text-sm border rounded-md font-inter border-gray-300'
                required
              >
                <option value='individual'>Individual</option>
                <option value='business'>Business</option>
              </select>
            </div>
          </div>

          {/* Optional Fields */}
          <div className='space-y-4'>
            <h3 className='font-roboto font-semibold text-gray-900'>Optional Information</h3>

            {/* Company Website */}
            <div className='space-y-2'>
              <Label htmlFor='company_website' className='font-roboto'>
                Company Website
              </Label>
              <Input
                id='company_website'
                name='company_website'
                type='url'
                value={formInputData.company_website}
                onChange={handleFormInputChange}
                placeholder='https://yourwebsite.com'
                className='font-inter'
              />
            </div>

            {/* Additional Information */}
            <div className='space-y-2'>
              <Label htmlFor='additional_information' className='font-roboto'>
                Additional Information
              </Label>
              <textarea
                id='additional_information'
                name='additional_information'
                value={formInputData.additional_information}
                onChange={handleFormInputChange}
                placeholder='Tell buyers about your experience, specializations, certifications, or anything else that makes you stand out...'
                className='w-full min-h-24 px-3 py-2 text-sm border rounded-md font-inter resize-y border-gray-300'
              />
            </div>

            {/* Work Sample Images */}
            <div className='space-y-2'>
              <ImageUploadSection
                images={formInputData.images}
                onImagesChange={handleImagesChange}
                maxImages={6}
                title='Work Sample Photos'
                description='Optional, max 6 images'
                isLoading={isLoadingImages}
              />
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={onClose} className='flex-1 font-roboto' disabled={isPending}>
              Cancel
            </Button>
            <Button type='submit' className='flex-1 font-roboto bg-green-600 hover:bg-green-700' disabled={isPending || !isFormValid}>
              {isPending ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
