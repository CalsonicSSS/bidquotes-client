'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateContractorProfile } from '@/lib/apis/contractor-profile';
import { ContractorProfileResponse, ContractorProfileCreate } from '@/lib/apis/contractor-profile';
import { ImageUploadSection } from '@/components/ImageUploadSection';
import { convertImageUrlsToFiles } from '@/lib/utils/image-utils';
import { formatPhoneInput } from '@/lib/utils/custom-format';

type UpdateContractorProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ContractorProfileResponse;
};

export function UpdateContractorProfileModal({ isOpen, onClose, currentProfile }: UpdateContractorProfileModalProps) {
  const [formInputData, setFormInputData] = useState<ContractorProfileCreate>({
    contractor_name: currentProfile.contractor_name,
    main_service_areas: currentProfile.main_service_areas,
    years_of_experience: currentProfile.years_of_experience,
    contractor_type: currentProfile.contractor_type,
    team_size: currentProfile.team_size,
    email: currentProfile.email,
    phone: currentProfile.phone,
    company_website: currentProfile.company_website || '',
    additional_information: currentProfile.additional_information || '',
    images: [], // Will be populated with existing images if any
  });

  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  // Load profile data and images when modal opens or currentProfile changes
  useEffect(() => {
    const loadProfileData = async () => {
      if (isOpen && currentProfile) {
        // Reset form data first
        setFormInputData({
          contractor_name: currentProfile.contractor_name,
          main_service_areas: currentProfile.main_service_areas,
          years_of_experience: currentProfile.years_of_experience,
          contractor_type: currentProfile.contractor_type,
          team_size: currentProfile.team_size,
          email: currentProfile.email,
          phone: currentProfile.phone,
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
      }
    };

    loadProfileData();
  }, [isOpen, currentProfile]); // Dependencies: run when modal opens or profile data changes

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
    if (name === 'phone') {
      const formatted = formatPhoneInput(value);
      setFormInputData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else if (name === 'years_of_experience') {
      if (value === '') {
        setFormInputData((prev) => ({ ...prev, years_of_experience: '' }));
        return;
      }
      if (!/^\d+$/.test(value)) return;
      setFormInputData((prev) => ({ ...prev, years_of_experience: value }));
    } else if (name === 'team_size') {
      if (value === '') {
        setFormInputData((prev) => ({ ...prev, team_size: '' }));
        return;
      }
      if (!/^\d+$/.test(value)) return;
      setFormInputData((prev) => ({ ...prev, team_size: value }));
    } else {
      setFormInputData((prev) => ({ ...prev, [name]: value }));
    }
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

  const isFormValid =
    formInputData.contractor_name.trim() && formInputData.main_service_areas.trim() && parseInt(formInputData.years_of_experience) > 0 && parseInt(formInputData.team_size) > 0;

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-roboto text-xl'>Update Contractor Profile</DialogTitle>
          <DialogDescription className='font-inter text-gray-600'>
            Update your profile information below. This information will be visible to buyers when reviewing bids.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='font-inter text-sm text-red-800'>{error instanceof Error ? error.message : 'An error occurred while updating your profile'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            {/* Required Information Header */}
            <div className='border-b pb-2'>
              <h3 className='font-roboto text-base font-semibold text-gray-900'>Required Information</h3>
            </div>

            {/* Contractor Name */}
            <div className='space-y-2'>
              <Label htmlFor='contractor_name' className='font-roboto'>
                Contractor / Company Name <span className='text-red-500'>*Required</span>
              </Label>
              <Input
                id='contractor_name'
                name='contractor_name'
                value={formInputData.contractor_name}
                onChange={handleFormInputChange}
                placeholder='Enter your contractor name'
                className='font-inter'
                required
              />
            </div>

            {/* contractor contact information */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='font-roboto'>
                Main Email <span className='text-red-500'>*Required</span>
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formInputData.email}
                onChange={handleFormInputChange}
                placeholder='Your email address'
                className='font-inter'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone' className='font-roboto'>
                Primary Phone <span className='text-red-500'>*Required</span>
              </Label>
              <Input
                id='phone'
                name='phone'
                type='tel'
                value={formInputData.phone}
                onChange={handleFormInputChange}
                placeholder='Your phone number'
                className='font-inter'
                required
              />
            </div>

            {/* Main Service Areas */}
            <div className='space-y-2'>
              <Label htmlFor='main_service_areas' className='font-roboto'>
                Main Service Areas <span className='text-red-500'>*Required</span>
              </Label>
              <textarea
                id='main_service_areas'
                name='main_service_areas'
                value={formInputData.main_service_areas}
                onChange={handleFormInputChange}
                placeholder='List the main services you provide'
                className='w-full min-h-20 px-3 py-2 text-sm border rounded-md font-inter resize-y border-gray-300'
                required
              />
              <p className='font-inter text-xs text-gray-500'>List the main services you provide</p>
            </div>

            {/* Years of Experience and Team Size */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='years_of_experience' className='font-roboto'>
                  Years of Experience <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='years_of_experience'
                  name='years_of_experience'
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  value={formInputData.years_of_experience}
                  onChange={handleFormInputChange}
                  placeholder='e.g., 5'
                  className='font-inter'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='team_size' className='font-roboto'>
                  Team Size <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='team_size'
                  name='team_size'
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  value={formInputData.team_size}
                  onChange={handleFormInputChange}
                  placeholder='e.g., 3'
                  className='font-inter'
                  required
                />
              </div>
            </div>

            {/* Contractor Type */}
            <div className='space-y-2'>
              <Label htmlFor='contractor_type' className='font-roboto'>
                Contractor Type <span className='text-red-500'>*Required</span>
              </Label>
              <select
                id='contractor_type'
                name='contractor_type'
                value={formInputData.contractor_type}
                onChange={handleFormInputChange}
                className='w-full px-3 py-2 text-sm border rounded-md font-inter border-gray-300 bg-white'
                required
              >
                <option value='individual'>Individual</option>
                <option value='business'>Business</option>
              </select>
            </div>

            {/* Optional Information Header */}
            <div className='border-b pb-2 pt-4'>
              <h3 className='font-roboto text-base font-semibold text-gray-900'>Optional Information</h3>
            </div>

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
