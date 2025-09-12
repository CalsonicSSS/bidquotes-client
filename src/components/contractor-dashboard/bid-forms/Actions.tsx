'use client';

import { Button } from '@/components/ui/button';
import { Save, Send, Trash2 } from 'lucide-react';

type BidFormActionsProps = {
  isEditingDraft: boolean;
  isEditingBid: boolean;
  createBidPending: boolean;
  saveBidDraftPending: boolean;
  updateBidPending: boolean;
  updateBidDraftPending: boolean;
  createBidFromDraftPending: boolean;
  createBidHandler: () => void;
  saveBidDraftHandler: () => void;
  updateBidHandler: () => void;
  updateBidDraftHandler: () => void;
  createBidFromDraftHandler: () => void;
};

export function Actions({
  isEditingDraft,
  isEditingBid,
  createBidPending,
  saveBidDraftPending,
  updateBidPending,
  updateBidDraftPending,
  createBidFromDraftPending,
  createBidHandler,
  saveBidDraftHandler,
  updateBidHandler,
  updateBidDraftHandler,
  createBidFromDraftHandler,
}: BidFormActionsProps) {
  return (
    <>
      {/* no existing bid / draft case */}
      {!isEditingDraft && !isEditingBid && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button type='button' variant='outline' onClick={saveBidDraftHandler} disabled={saveBidDraftPending || createBidPending} className='font-roboto flex items-center gap-2'>
            <Save className='h-4 w-4' />
            {saveBidDraftPending ? 'Saving draft...' : 'Save as Draft'}
          </Button>
          <Button type='button' onClick={createBidHandler} disabled={createBidPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'>
            <Send className='h-4 w-4' />
            {createBidPending ? 'Submitting bid...' : 'Submit Bid'}
          </Button>
        </div>
      )}
      {/* editing existing draft case */}
      {isEditingDraft && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button type='button' variant='outline' onClick={updateBidDraftHandler} disabled={updateBidDraftPending} className='font-roboto flex items-center gap-2 '>
            <Save className='h-4 w-4' />
            {updateBidDraftPending ? 'Updating draft...' : 'Update Draft'}
          </Button>
          <Button
            type='button'
            onClick={createBidFromDraftHandler}
            disabled={createBidFromDraftPending}
            className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
          >
            <Send className='h-4 w-4' />
            {createBidFromDraftPending ? 'Submitting Bid...' : 'Submit Draft'}
          </Button>
        </div>
      )}
      {/* editing existing bid case */}
      {isEditingBid && (
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button type='button' onClick={updateBidHandler} disabled={updateBidPending} className='font-roboto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'>
            <Save className='h-4 w-4' />
            {updateBidPending ? 'Updating bid...' : 'Update Bid'}
          </Button>
        </div>
      )}
    </>
  );
}
