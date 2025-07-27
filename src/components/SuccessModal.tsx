'use client';

import { CheckCircle, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type SuccessModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
};

export function SuccessModal({ isOpen, title, message, buttonText = 'Continue', onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md' onPointerDownOutside={(e) => e.preventDefault()}>
        <div className='flex flex-col items-center text-center py-6'>
          {/* Success Icon */}
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>

          {/* Title */}
          <h2 className='font-roboto text-xl font-semibold text-gray-900 mb-2'>{title}</h2>

          {/* Message */}
          <p className='font-inter text-gray-600 mb-6 leading-relaxed'>{message}</p>

          {/* Action Button */}
          <Button onClick={onClose} className='font-roboto bg-green-600 hover:bg-green-700 flex items-center gap-2 px-6'>
            {buttonText}
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
