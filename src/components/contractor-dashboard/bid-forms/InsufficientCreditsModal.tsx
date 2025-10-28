'use client';

import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type InsufficientCreditsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBuySingleBid: () => void;
  onGoToCredits: () => void;
  isProcessingPayment?: boolean;
};

export function InsufficientCreditsModal({ isOpen, onClose, onBuySingleBid, onGoToCredits, isProcessingPayment }: InsufficientCreditsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
        <div className='flex flex-col items-center text-center py-6'>
          {/* Warning Icon */}
          <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4'>
            <AlertTriangle className='h-8 w-8 text-yellow-600' />
          </div>

          {/* Title */}
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>Insufficient Credits</h2>

          {/* Message */}
          <p className='font-inter text-gray-600 mb-6 leading-relaxed'>
            You have no credits left to submit this bid.
            <br />
            {/* You can either pay <strong>$70</strong> for this bid, or purchase a credit package (<strong>$700</strong> for 20 credits). */}
          </p>

          {/* Action Buttons */}
          <div className='flex flex-col gap-3 w-full'>
            <Button
              onClick={() => {
                onBuySingleBid();
                // Don't close modal immediately - let payment mutation handle it
              }}
              className='font-roboto bg-green-600 hover:bg-green-700 w-full'
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? 'Creating Payment...' : 'Pay This Bid ($45 CAD)'}
            </Button>

            <Button
              onClick={() => {
                onGoToCredits();
                onClose();
              }}
              variant='outline'
              className='font-roboto w-full'
            >
              Buy More Credits
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
