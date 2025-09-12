'use client';

import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';

type FormActionsProps = {
  isEditingDraft: boolean;
  isEditingJob: boolean;
  saveJobDraftPending: boolean;
  createJobPending: boolean;
  updateExistingJobPending: boolean;
  updateExistingDraftPending: boolean;
  createJobFromDraftPending: boolean;
  saveJobDraftHandler: () => void;
  createJobHandler: () => void;
  updateExistingJobHandler: () => void;
  updateExistingDraftHandler: () => void;
  createJobFromDraftHandler: () => void;
};

export function Actions({
  isEditingDraft,
  isEditingJob,
  saveJobDraftPending,
  createJobPending,
  updateExistingJobPending,
  updateExistingDraftPending,
  createJobFromDraftPending,
  saveJobDraftHandler,
  createJobHandler,
  updateExistingJobHandler,
  updateExistingDraftHandler,
  createJobFromDraftHandler,
}: FormActionsProps) {
  return (
    <>
      {/* no existing job / draft case */}
      {!isEditingDraft && !isEditingJob && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button type='button' variant='outline' onClick={saveJobDraftHandler} disabled={saveJobDraftPending || createJobPending} className='font-roboto flex items-center gap-2'>
            <Save className='h-4 w-4' />
            {saveJobDraftPending ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button type='button' onClick={createJobHandler} disabled={createJobPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Send className='h-4 w-4' />
            {createJobPending ? 'Posting Job...' : 'Create Job'}
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
