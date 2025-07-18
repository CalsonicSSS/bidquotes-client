'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface ContactInfoModalProps {
  isOpen: boolean;
  userEmail: string;
}

export function ContactInfoModal({ isOpen, userEmail }: ContactInfoModalProps) {
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // We'll implement the API call in the next step
    console.log('Submitting:', { email, phone });
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='font-roboto text-xl'>Complete Your Contact Information</DialogTitle>
          <DialogDescription className='font-inter text-gray-600'>
            You must provide your contact details before posting jobs. This information will be shared with contractors when jobs are confirmed.
          </DialogDescription>
        </DialogHeader>

        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
          <p className='font-inter text-sm text-yellow-800'>These contact details are required for contractors to reach you about confirmed jobs.</p>
        </div>

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
            <Input id='phone' type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='(123) 456-7890' className='font-inter' required />
            <p className='text-sm text-gray-500 font-inter'>For urgent contractor communications</p>
          </div>

          <Button type='submit' className='w-full font-roboto' disabled={isSubmitting || !email || !phone}>
            {isSubmitting ? 'Saving...' : 'Save Contact Information'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
