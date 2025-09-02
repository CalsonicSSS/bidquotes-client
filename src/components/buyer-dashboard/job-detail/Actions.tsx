import { Button } from '@/components/ui/button';
import { CircleX, Edit } from 'lucide-react';

type ActionsProps = {
  onEdit: () => void;
  onClose: () => void;
  isClosing: boolean;
  isMobile: boolean;
};

export function Actions({ onEdit, onClose, isClosing, isMobile }: ActionsProps) {
  return (
    <>
      {isMobile ? (
        <div className='flex gap-2'>
          <Button size='sm' onClick={onEdit} className='font-roboto bg-blue-600'>
            <Edit className='h-4 w-4 ' />
          </Button>
          <Button size='sm' variant='destructive' onClick={onClose} disabled={isClosing}>
            <CircleX className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <div className='flex gap-3'>
          <Button onClick={onEdit} variant='outline' className='font-roboto flex items-center gap-2'>
            <Edit className='h-4 w-4' />
            Edit Job
          </Button>
          <Button onClick={onClose} variant='destructive' className='font-roboto flex items-center gap-2' disabled={isClosing}>
            <CircleX className='h-4 w-4' />
            {isClosing ? 'Closing...' : 'Close Job'}
          </Button>
        </div>
      )}
    </>
  );
}

// type ActionsProps = {
//   onEdit: () => void;
//   onDelete: () => void;
//   isDeleting: boolean;
//   isMobile: boolean;
// };

// export function Actions({ onEdit, onDelete, isDeleting, isMobile }: ActionsProps) {
//   return (
//     <>
//       {isMobile ? (
//         <div className='flex gap-2'>
//           <Button size='sm' onClick={onEdit} className='font-roboto bg-blue-600'>
//             <Edit className='h-4 w-4 ' />
//           </Button>
//           <Button size='sm' variant='destructive' onClick={onDelete} disabled={isDeleting}>
//             <Trash2 className='h-4 w-4' />
//           </Button>
//         </div>
//       ) : (
//         <div className='flex gap-3'>
//           <Button onClick={onEdit} variant='outline' className='font-roboto flex items-center gap-2'>
//             <Edit className='h-4 w-4' />
//             Edit Job
//           </Button>
//           <Button onClick={onDelete} variant='destructive' className='font-roboto flex items-center gap-2' disabled={isDeleting}>
//             <Trash2 className='h-4 w-4' />
//             {isDeleting ? 'Deleting...' : 'Delete Job'}
//           </Button>
//         </div>
//       )}
//     </>
//   );
// }
