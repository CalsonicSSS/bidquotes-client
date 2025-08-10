'use client';

import { Button } from '@/components/ui/button';
import { Save, Send, Trash2 } from 'lucide-react';

type BidFormActionsProps = {
  isEditingDraft: boolean;
  isEditingBid: boolean;
  onSaveDraft: () => void;
  onBidSubmit: () => void;
  saveDraftPending: boolean;
  createOrUpdateBidPending: boolean;
  deleteBidPending: boolean;
  onDeleteDraft?: () => void;
};

export function Actions({
  isEditingDraft,
  isEditingBid,
  onSaveDraft,
  onBidSubmit,
  saveDraftPending,
  createOrUpdateBidPending,
  deleteBidPending,
  onDeleteDraft,
}: BidFormActionsProps) {
  const isAnyActionPending = saveDraftPending || createOrUpdateBidPending || deleteBidPending;

  return (
    <div className='space-y-4'>
      {/* Mobile Delete Draft Button - only show when editing a draft */}
      {isEditingDraft && onDeleteDraft && (
        <div className='lg:hidden'>
          <Button type='button' variant='destructive' onClick={onDeleteDraft} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2 w-full'>
            <Trash2 className='h-4 w-4' />
            {deleteBidPending ? 'Deleting...' : 'Delete Draft'}
          </Button>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className='flex flex-col sm:flex-row gap-3 pt-2'>
        {/* Save Draft Button - only show if not editing existing bid */}
        {!isEditingBid && (
          <Button type='button' variant='outline' onClick={onSaveDraft} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2'>
            <Save className='h-4 w-4' />
            {saveDraftPending ? 'Saving...' : isEditingDraft ? 'Update Draft' : 'Save as Draft'}
          </Button>
        )}

        {/* Submit/Update Bid Button */}
        <Button type='button' onClick={onBidSubmit} disabled={isAnyActionPending} className='font-roboto flex items-center gap-2 bg-green-600 hover:bg-green-700'>
          <Send className='h-4 w-4' />
          {createOrUpdateBidPending ? 'Submitting...' : isEditingBid ? 'Update Bid' : 'Submit Bid'}
        </Button>
      </div>
    </div>
  );
}
