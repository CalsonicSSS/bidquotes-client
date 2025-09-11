'use client';

import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';

type FormActionsProps = {
  isEditingDraft: boolean;
  isEditingJob: boolean;
  saveNewDraftPending: boolean;
  createNewJobPending: boolean;
  updateExistingJobPending: boolean;
  updateExistingDraftPending: boolean;
  createJobFromDraftPending: boolean;
  saveNewDraftHandler: () => void;
  createNewJobHandler: () => void;
  updateExistingJobHandler: () => void;
  updateExistingDraftHandler: () => void;
  createJobFromDraftHandler: () => void;
};

export function Actions({
  isEditingDraft,
  isEditingJob,
  saveNewDraftPending,
  createNewJobPending,
  updateExistingJobPending,
  updateExistingDraftPending,
  createJobFromDraftPending,
  saveNewDraftHandler,
  createNewJobHandler,
  updateExistingJobHandler,
  updateExistingDraftHandler,
  createJobFromDraftHandler,
}: FormActionsProps) {
  return (
    <>
      {/* no existing job / draft case */}
      {!isEditingDraft && !isEditingJob && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button
            type='button'
            variant='outline'
            onClick={saveNewDraftHandler}
            disabled={saveNewDraftPending || createNewJobPending}
            className='font-roboto flex items-center gap-2'
          >
            <Save className='h-4 w-4' />
            {saveNewDraftPending ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button type='button' onClick={createNewJobHandler} disabled={createNewJobPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Send className='h-4 w-4' />
            {createNewJobPending ? 'Posting Job...' : 'Create Job'}
          </Button>
        </div>
      )}
      {/* editing existing draft case */}
      {isEditingDraft && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button type='button' variant='outline' onClick={updateExistingDraftHandler} disabled={updateExistingDraftPending} className='font-roboto flex items-center gap-2 '>
            <Save className='h-4 w-4' />
            {updateExistingDraftPending ? 'Updating...' : 'Update Draft'}
          </Button>
          <Button
            type='button'
            onClick={createJobFromDraftHandler}
            disabled={createJobFromDraftPending}
            className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
          >
            <Send className='h-4 w-4' />
            {createJobFromDraftPending ? 'Posting Job...' : 'Post Draft'}
          </Button>
        </div>
      )}
      {/* editing existing job case */}
      {isEditingJob && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button
            type='button'
            onClick={updateExistingJobHandler}
            disabled={updateExistingJobPending}
            className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'
          >
            <Save className='h-4 w-4' />
            {updateExistingJobPending ? 'Updating...' : 'Update Job'}
          </Button>
        </div>
      )}
    </>
  );
}
