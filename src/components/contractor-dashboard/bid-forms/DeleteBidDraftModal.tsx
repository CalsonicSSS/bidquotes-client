import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type DeleteBidDraftModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  draftTitle: string;
};

export function DeleteBidDraftModal({ isOpen, onClose, onConfirm, isDeleting, draftTitle }: DeleteBidDraftModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            <div>
              <DialogTitle className='font-roboto text-lg flex justify-start'>Delete Bid Draft</DialogTitle>
              <DialogDescription className='font-inter text-yellow-600 mt-1'>This action cannot be undone</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='font-inter text-gray-700 leading-relaxed'>
            Are you sure you want to delete the bid draft <span className='font-semibold'>"{draftTitle || 'Untitled Draft'}"</span>? This will permanently remove your saved
            progress.
          </p>
        </div>

        <div className='flex gap-3 pt-4'>
          <Button variant='outline' onClick={onClose} className='flex-1 font-roboto' disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm} className='flex-1 font-roboto' disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Draft'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
