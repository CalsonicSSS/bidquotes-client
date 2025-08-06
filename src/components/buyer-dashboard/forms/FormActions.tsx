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

export function FormActions({ isEditingDraft, isEditingJob, onSaveDraft, onJobSubmit, saveDraftPending, createOrUpdateJobPending, deleteDraftPending }: FormActionsProps) {
  const isAnyActionPending = saveDraftPending || createOrUpdateJobPending || deleteDraftPending;

  return (
    <div className='flex flex-col sm:flex-row gap-3 pt-6'>
      {/* Save Draft Button - only show if not editing a job */}
      {!isEditingJob && (
        <Button type='button' variant='outline' onClick={onSaveDraft} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2'>
          <Save className='h-4 w-4' />
          {saveDraftPending ? 'Saving...' : isEditingDraft ? 'Update Draft' : 'Save as Draft'}
        </Button>
      )}

      {/* Post/Update Job Button */}
      <Button type='button' onClick={onJobSubmit} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
        <Send className='h-4 w-4' />
        {createOrUpdateJobPending ? 'Posting Job...' : isEditingJob ? 'Update Job' : 'Post Job'}
      </Button>
    </div>
  );
}
