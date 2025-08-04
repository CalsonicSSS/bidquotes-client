'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveBuyerContactInfo } from '@/lib/apis/buyer-contact-info';
import { formatPhoneInput, getCleanPhoneNumber } from '@/lib/utils/custom-format';

type ContactInfo = {
  id: string;
  user_id: string;
  contact_email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
};

type UpdateContactInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentContactInfo: ContactInfo;
};

export function UpdateContactInfoModal({ isOpen, onClose, currentContactInfo }: UpdateContactInfoModalProps) {
  const [formInputData, setFormInputData] = useState({
    contact_email: currentContactInfo.contact_email,
    phone_number: currentContactInfo.phone_number,
  });
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  // Reset form when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFormInputData({
        contact_email: currentContactInfo.contact_email,
        phone_number: currentContactInfo.phone_number,
      });
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

      return saveBuyerContactInfo(formInputData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buyer-contact-info'] });
      onClose();
    },
  });

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone_number') {
      const formatted = formatPhoneInput(value);
      setFormInputData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-roboto text-xl'>Update Contact Information</DialogTitle>
          <DialogDescription className='font-inter text-gray-600'>Update your contact details below. These will be shared with contractors for confirmed jobs.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='font-inter text-sm text-red-800'>{error instanceof Error ? error.message : 'An error occurred'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4 mt-4'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='font-roboto'>
              Contact Email <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='email'
              type='email'
              name='contact_email'
              value={formInputData.contact_email}
              onChange={handleFormInputChange}
              placeholder='your@email.com'
              className='font-inter'
              required
            />
            <p className='text-sm text-gray-500 font-inter'>This email will receive job notifications</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone' className='font-roboto'>
              Phone Number <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='phone'
              type='tel'
              name='phone_number'
              value={formInputData.phone_number}
              onChange={handleFormInputChange}
              placeholder='(123) 456-7890'
              className='font-inter'
              maxLength={14} // Max length for formatted phone
              required
            />
            <p className='text-sm text-gray-500 font-inter'>For urgent contractor communications</p>
          </div>

          <div className='flex gap-3 pt-4'>
            <Button type='button' variant='outline' onClick={onClose} className='flex-1 font-roboto' disabled={isPending}>
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1 font-roboto'
              disabled={isPending || !formInputData.contact_email || !formInputData.phone_number || getCleanPhoneNumber(formInputData.phone_number).length !== 10}
            >
              {isPending ? 'Updating...' : 'Update Contact Info'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
