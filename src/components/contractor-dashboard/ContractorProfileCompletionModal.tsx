'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { saveContractorProfile } from '@/lib/apis/contractor-profile';
import { ContractorProfileCreate } from '@/lib/apis/contractor-profile';
import { ImageUploadSection } from '@/components/ImageUploadSection';
import { formatPhoneInput } from '@/lib/utils/custom-format';

type ContractorProfileModalProps = {
  isOpen: boolean;
  userEmail: string;
};

export function ContractorProfileCompletionModal({ isOpen, userEmail }: ContractorProfileModalProps) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [formInputData, setFormInputData] = useState<ContractorProfileCreate>({
    contractor_name: '',
    main_service_areas: '',
    years_of_experience: '',
    contractor_type: 'individual',
    team_size: '',
    company_website: '',
    additional_information: '',
    email: userEmail,
    phone: '',
    images: [],
  });

  const { error, isPending, mutate } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      return saveContractorProfile(formInputData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-profile-completion'] });
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
    formInputData.contractor_name.trim() &&
    formInputData.email.trim() &&
    formInputData.phone.trim() &&
    formInputData.contractor_type.trim() &&
    formInputData.main_service_areas.trim() &&
    parseInt(formInputData.years_of_experience) > 0 &&
    parseInt(formInputData.team_size) > 0;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='font-roboto text-xl'>Complete Your Contractor Profile</DialogTitle>
        </DialogHeader>

        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
          <p className='font-inter text-sm text-yellow-800'>Please complete your profile to start bidding on jobs and showcase your services.</p>
        </div>

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
                Contractor / Company Name <span className='text-red-500'>*Required</span>
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

            {/* Years of Experience */}
            <div className='space-y-2'>
              <Label htmlFor='years_of_experience' className='font-roboto'>
                Years of Experience <span className='text-red-500'>*Required</span>
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
                className='w-full h-9 px-3 py-1 text-sm border rounded-md font-inter border-gray-300'
                required
              >
                <option value='individual'>Individual</option>
                <option value='business'>Business</option>
              </select>
            </div>

            {/* Team Size */}
            <div className='space-y-2'>
              <Label htmlFor='team_size' className='font-roboto'>
                Team Size <span className='text-red-500'>*Required</span>
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
              <p className='text-sm text-gray-500 font-inter'>How many people work on your team?</p>
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
              <ImageUploadSection images={formInputData.images} onImagesChange={handleImagesChange} maxImages={6} title='Work Sample Photos' description='Optional, max 6 images' />
            </div>
          </div>

          <Button type='submit' className='w-full font-roboto bg-green-600 hover:bg-green-700' disabled={isPending || !isFormValid}>
            {isPending ? 'Creating Profile...' : 'Complete Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
