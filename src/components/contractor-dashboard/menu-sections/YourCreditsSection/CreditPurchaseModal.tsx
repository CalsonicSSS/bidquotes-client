'use client';

import { CheckCircle, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type CreditPurchaseModalsProps = {
  showSuccessModal: boolean;
  showCancelModal: boolean;
  onCloseSuccessModal: () => void;
  onCloseCancelModal: () => void;
};

export function CreditPurchaseModals({ showSuccessModal, showCancelModal, onCloseSuccessModal, onCloseCancelModal }: CreditPurchaseModalsProps) {
  return (
    <>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={onCloseSuccessModal}>
        <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
          <div className='flex flex-col items-center text-center py-6'>
            {/* Success Icon */}
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <CheckCircle className='h-8 w-8 text-green-600' />
            </div>

            {/* Title */}
            <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Credits Purchased Successfully! 🎉</h2>

            {/* Message */}
            <p className='font-inter text-gray-600 mb-6 leading-relaxed'>
              20 credits have been added to your account.
              <br />
              You can now submit bids for free!
            </p>

            {/* Action Button */}
            <Button onClick={onCloseSuccessModal} className='font-roboto bg-green-600 hover:bg-green-700 w-full'>
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Modal */}
      <Dialog open={showCancelModal} onOpenChange={onCloseCancelModal}>
        <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
          <div className='flex flex-col items-center text-center py-6'>
            {/* Cancel Icon */}
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <X className='h-8 w-8 text-gray-600' />
            </div>

            {/* Title */}
            <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Payment Cancelled</h2>

            {/* Message */}
            <p className='font-inter text-gray-600 mb-6 leading-relaxed'>
              No charges were made.
              <br />
              You can try purchasing credits again anytime.
            </p>

            {/* Action Button */}
            <Button onClick={onCloseCancelModal} variant='outline' className='font-roboto w-full'>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
