import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

type CloseJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isClosing: boolean;
  jobTitle: string;
};

export function CloseJobModal({ isOpen, onClose, onConfirm, isClosing, jobTitle }: CloseJobModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
            </div>
            <div>
              <DialogTitle className='font-roboto text-lg'>Close Job</DialogTitle>
              <DialogDescription className='font-inter text-yellow-600 mt-1'>This action cannot be undone</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='font-inter text-gray-700 leading-relaxed'>
            Are you sure you want to close <span className='font-semibold'>"{jobTitle}"</span>? Once closed, you can not receive any new bids.
          </p>
        </div>

        <div className='flex gap-3 pt-4'>
          <Button variant='outline' onClick={onClose} className='flex-1 font-roboto' disabled={isClosing}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={onConfirm} className='flex-1 font-roboto' disabled={isClosing}>
            {isClosing ? 'Closing...' : 'Close Job'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// type DeleteJobModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   isDeleting: boolean;
//   jobTitle: string;
// };

// export function DeleteJobModal({ isOpen, onClose, onConfirm, isDeleting, jobTitle }: DeleteJobModalProps) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='sm:max-w-md'>
//         <DialogHeader>
//           <div className='flex items-center gap-3'>
//             <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
//               <AlertTriangle className='h-5 w-5 text-red-600' />
//             </div>
//             <div>
//               <DialogTitle className='font-roboto text-lg'>Delete Job</DialogTitle>
//               <DialogDescription className='font-inter text-gray-600 mt-1'>This action cannot be undone</DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className='py-4'>
//           <p className='font-inter text-gray-700 leading-relaxed'>
//             Are you sure you want to delete <span className='font-semibold'>"{jobTitle}"</span>? This will permanently remove the job posting and all associated bids.
//           </p>
//         </div>

//         <div className='flex gap-3 pt-4'>
//           <Button variant='outline' onClick={onClose} className='flex-1 font-roboto' disabled={isDeleting}>
//             Cancel
//           </Button>
//           <Button variant='destructive' onClick={onConfirm} className='flex-1 font-roboto' disabled={isDeleting}>
//             {isDeleting ? 'Deleting...' : 'Delete Job'}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
