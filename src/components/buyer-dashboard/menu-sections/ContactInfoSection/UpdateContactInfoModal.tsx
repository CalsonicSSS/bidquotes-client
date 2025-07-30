'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveBuyerContactInfo } from '@/lib/apis/buyer-contact-info';
import { formatPhoneInput, getCleanPhoneNumber, formatPhoneDisplay } from '@/lib/utils/custom-format';

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
  onUpdated: () => void;
};

export function UpdateContactInfoModal({ isOpen, onClose, currentContactInfo, onUpdated }: UpdateContactInfoModalProps) {
  const [email, setEmail] = useState(currentContactInfo.contact_email);
  const [phone, setPhone] = useState(formatPhoneDisplay(currentContactInfo.phone_number));
  const { getToken } = useAuth();

  // Reset form when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEmail(currentContactInfo.contact_email);
      setPhone(formatPhoneDisplay(currentContactInfo.phone_number));
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

      return saveBuyerContactInfo(
        {
          contact_email: email,
          phone_number: getCleanPhoneNumber(phone), // Store clean digits only
        },
        token
      );
    },
    onSuccess: () => {
      onUpdated();
      onClose();
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  // Check if there are any changes
  const hasChanges = email !== currentContactInfo.contact_email || getCleanPhoneNumber(phone) !== currentContactInfo.phone_number;

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
            <Input id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='your@email.com' className='font-inter' required />
            <p className='text-sm text-gray-500 font-inter'>This email will receive job notifications</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone' className='font-roboto'>
              Phone Number <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='phone'
              type='tel'
              value={phone}
              onChange={handlePhoneChange}
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
            <Button type='submit' className='flex-1 font-roboto' disabled={isPending || !email || !phone || getCleanPhoneNumber(phone).length !== 10 || !hasChanges}>
              {isPending ? 'Updating...' : 'Update Contact Info'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
