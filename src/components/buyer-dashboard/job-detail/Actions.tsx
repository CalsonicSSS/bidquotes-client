import { Button } from '@/components/ui/button';
import { CircleX, Edit } from 'lucide-react';

type ActionsProps = {
  navToJobEdit: () => void;
  openJobCloseModal: () => void;
  isClosing: boolean;
  isMobile: boolean;
};

export function Actions({ navToJobEdit, openJobCloseModal, isClosing, isMobile }: ActionsProps) {
  return (
    <>
      {isMobile ? (
        <div className='flex flex-col gap-3'>
          <Button onClick={navToJobEdit} variant='outline' className='font-roboto flex items-center gap-2 bg-blue-500 text-white'>
            <Edit className='h-4 w-4' />
            Edit Job
          </Button>
          <Button onClick={openJobCloseModal} variant='destructive' className='font-roboto flex items-center gap-2' disabled={isClosing}>
            <CircleX className='h-4 w-4' />
            {isClosing ? 'Closing...' : 'Close Job'}
          </Button>
        </div>
      ) : (
        <div className='flex gap-3'>
          <Button onClick={navToJobEdit} variant='outline' className='font-roboto flex items-center gap-2 bg-blue-500 text-white'>
            <Edit className='h-4 w-4' />
            Edit Job
          </Button>
          <Button onClick={openJobCloseModal} variant='destructive' className='font-roboto flex items-center gap-2' disabled={isClosing}>
            <CircleX className='h-4 w-4' />
            {isClosing ? 'Closing...' : 'Close Job'}
          </Button>
        </div>
      )}
    </>
  );
}
