'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { saveBuyerContactInfo } from '@/lib/apis/buyer-contact-info';
import { formatPhoneInput, getCleanPhoneNumber } from '@/lib/utils/custom-format';
import { BuyerContactInfoData } from '@/lib/apis/buyer-contact-info';

type BuyerContactInfoModalProps = {
  isOpen: boolean;
  homeOwnerEmail: string;
};

export function BuyerContactInfoModal({ isOpen, homeOwnerEmail }: BuyerContactInfoModalProps) {
  const [formInputData, setFormInputData] = useState<BuyerContactInfoData>({
    contact_email: homeOwnerEmail,
    phone_number: '',
  });

  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const { error, isPending, mutate } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      return saveBuyerContactInfo(formInputData, token);
    },
    onSuccess: () => {
      // invalidate here means: after successfully saving the contact info, refetch the "buyer-contact-info" query to get the latest data from server
      // this will automatically update any component that uses the 'buyer-contact-info' query key
      queryClient.invalidateQueries({ queryKey: ['buyer-contact-info'] });
    },
  });

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Format phone input if it's a phone number field
    if (name === 'phone_number') {
      const formattedPhone = formatPhoneInput(value);
      setFormInputData((prev) => ({
        ...prev,
        [name]: formattedPhone,
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='font-roboto text-xl'>Complete Your Contact Information</DialogTitle>
        </DialogHeader>

        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
          <p className='font-inter text-sm text-yellow-800'>These contact details are required for contractors to reach you about confirmed jobs.</p>
        </div>

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

          <Button
            type='submit'
            className='w-full font-roboto'
            disabled={isPending || !formInputData.contact_email || !formInputData.phone_number || getCleanPhoneNumber(formInputData.phone_number).length !== 10}
          >
            {isPending ? 'Saving...' : 'Save Contact Information'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
