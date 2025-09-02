'use client';

import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';

type FormActionsProps = {
  isEditingDraft: boolean;
  isEditingJob: boolean;
  onSaveDraft: () => void;
  onJobSubmit: () => void;
  saveDraftPending: boolean;
  createOrUpdateJobPending: boolean;
  deleteDraftPending: boolean;
};

// rewrite this actions here by clearly separate the case of no edit / draft, draft only, is editing only cases

export function Actions({ isEditingDraft, isEditingJob, onSaveDraft, onJobSubmit, saveDraftPending, createOrUpdateJobPending, deleteDraftPending }: FormActionsProps) {
  const isAnyActionPending = saveDraftPending || createOrUpdateJobPending || deleteDraftPending;

  return (
    <>
      {!isEditingDraft && !isEditingJob && (
        <div className='flex flex-col sm:flex-row gap-3 pt-6'>
          <Button type='button' variant='outline' onClick={onSaveDraft} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2'>
            <Save className='h-4 w-4' />
            {saveDraftPending ? 'Saving...' : isEditingDraft ? 'Update Draft' : 'Save as Draft'}
          </Button>
          <Button type='button' onClick={onJobSubmit} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Send className='h-4 w-4' />
            {createOrUpdateJobPending ? 'Posting Job...' : 'Create Job'}
          </Button>
        </div>
      )}

      {isEditingDraft && (
        <div className='flex flex-col sm:flex-row gap-3 pt-6'>
          <Button type='button' variant='outline' onClick={onSaveDraft} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2'>
            <Save className='h-4 w-4' />
            {saveDraftPending ? 'Saving...' : 'Update Draft'}
          </Button>
          <Button type='button' onClick={onJobSubmit} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Send className='h-4 w-4' />
            {createOrUpdateJobPending ? 'Posting Job...' : 'Post Draft'}
          </Button>
        </div>
      )}

      {isEditingJob && (
        <div className='flex flex-col sm:flex-row gap-3 pt-6'>
          <Button type='button' onClick={onJobSubmit} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Send className='h-4 w-4' />
            {createOrUpdateJobPending ? 'Posting Job...' : 'Update Job'}
          </Button>
        </div>
      )}
    </>
  );
}
