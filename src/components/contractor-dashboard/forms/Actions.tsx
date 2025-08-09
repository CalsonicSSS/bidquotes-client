'use client';

import { Button } from '@/components/ui/button';
import { Save, Send } from 'lucide-react';

type BidFormActionsProps = {
  isEditingDraft: boolean;
  isEditingBid: boolean;
  onSaveDraft: () => void;
  onBidSubmit: () => void;
  saveDraftPending: boolean;
  createOrUpdateBidPending: boolean;
  deleteBidPending: boolean;
};

export function Actions({ isEditingDraft, isEditingBid, onSaveDraft, onBidSubmit, saveDraftPending, createOrUpdateBidPending, deleteBidPending }: BidFormActionsProps) {
  const isAnyActionPending = saveDraftPending || createOrUpdateBidPending || deleteBidPending;

  return (
    <div className='flex flex-col sm:flex-row gap-3 pt-6'>
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
  );
}
