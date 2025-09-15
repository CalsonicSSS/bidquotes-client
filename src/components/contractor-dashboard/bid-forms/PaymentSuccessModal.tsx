'use client';

import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type PaymentSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: () => Promise<void>;
  isSubmitting?: boolean;
};

export function PaymentSuccessModal({ isOpen, onClose, onSubmitBid, isSubmitting = false }: PaymentSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
        <div className='flex flex-col items-center text-center py-6'>
          {/* Success Icon */}
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>

          {/* Title */}
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Payment Successful!</h2>

          {/* Message */}
          <p className='font-inter text-gray-600 mb-6 leading-relaxed'>
            Your payment has been processed successfully.
            <br />
            Your bid is now ready to submit!
          </p>

          {/* Action Buttons */}
          <div className='flex flex-col gap-3 w-full'>
            <Button
              onClick={async () => {
                await onSubmitBid();
                onClose();
              }}
              className='font-roboto bg-green-600 hover:bg-green-700 w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Bid...' : 'Submit My Bid Now'}
            </Button>

            <Button onClick={onClose} variant='outline' className='font-roboto w-full' disabled={isSubmitting}>
              Submit Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
