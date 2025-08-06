import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

type JobActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

export function Actions({ onEdit, onDelete, isDeleting }: JobActionsProps) {
  return (
    <div className='flex gap-3'>
      <Button onClick={onEdit} variant='outline' className='font-roboto flex items-center gap-2'>
        <Edit className='h-4 w-4' />
        Edit Job
      </Button>
      <Button onClick={onDelete} variant='destructive' className='font-roboto flex items-center gap-2' disabled={isDeleting}>
        <Trash2 className='h-4 w-4' />
        {isDeleting ? 'Deleting...' : 'Delete Job'}
      </Button>
    </div>
  );
}
