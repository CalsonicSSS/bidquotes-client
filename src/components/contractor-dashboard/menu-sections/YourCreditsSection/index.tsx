'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreditCard, Zap, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getContractorCredits, createCreditPurchase } from '@/lib/apis/payments-credits';
import { useState, useEffect, Suspense } from 'react';
import { CreditPurchaseModals } from './CreditPurchaseModal';

function YourCreditsSectionHandler() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Check for payment result in URL parameters
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      setShowSuccessModal(true);
      // Refresh credits after successful payment
      queryClient.invalidateQueries({ queryKey: ['contractor-credits'] });
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    } else if (paymentStatus === 'cancelled') {
      setShowCancelModal(true);
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, queryClient]);

  // Fetch current credit balance
  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useQuery({
    queryKey: ['contractor-credits'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getContractorCredits(token);
    },
    enabled: !!user && !!getToken(),
    staleTime: 0,
  });

  // Handle credit purchase with proper mutation
  const purchaseCreditsMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return createCreditPurchase(token);
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.session_url;
    },
    onError: (error) => {
      console.error('Credit purchase error:', error);
      // Handle error - maybe show a toast notification
    },
  });

  if (creditsLoading) {
    return (
      <div className='space-y-6'>
        <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Your Credits</h2>
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-green-600' />
        </div>
      </div>
    );
  }

  if (creditsError) {
    return (
      <div className='space-y-6'>
        <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Your Credits</h2>
        <div className='text-center py-12'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='font-roboto font-semibold text-lg mb-2'>Error Loading Credits</h3>
          <p className='font-inter text-gray-600 mb-4'>Unable to fetch your credit balance</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['contractor-credits'] })} variant='outline'>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Your Credits</h2>

      {/* Credit Balance Card */}
      <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg'>
        <div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 mb-2'>
              <Zap className='h-5 w-5' />
              <span className='font-roboto font-medium'>Available Credits</span>
            </div>
            <p className='text-3xl pb-6'>💳</p>
          </div>

          <div className='text-3xl font-bold font-roboto'>{credits || 0}</div>
          <p className='font-inter text-green-100 text-sm mt-3 font-semibold'>
            {credits === 0 ? 'Purchase credits to submit bids for free' : `Submit ${credits} more ${credits === 1 ? 'bid' : 'bids'} for free`}
          </p>
        </div>
      </div>

      {/* How Credits Work */}
      <div className='bg-white rounded-xl p-6 shadow-sm border'>
        <h3 className='font-roboto font-semibold text-lg mb-4 flex items-center gap-2'>
          <CheckCircle className='h-5 w-5 text-green-600' />
          How Credits Work
        </h3>
        <div className='space-y-3 font-inter text-gray-600'>
          <div className='flex items-start gap-3'>
            <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <span className='text-xs font-bold text-green-600'>1</span>
            </div>
            <p>
              <strong className='text-gray-900'>Purchase credits</strong>
            </p>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <span className='text-xs font-bold text-green-600'>2</span>
            </div>
            <p>
              <strong className='text-gray-900'>Submit bids for free</strong>
            </p>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
              <span className='text-xs font-bold text-green-600'>3</span>
            </div>
            <p>
              <strong className='text-gray-900'>Save money</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Credits Card */}
      <div className='bg-white rounded-xl p-6 shadow-sm border'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <h3 className='font-roboto font-semibold text-lg mb-2 flex items-center gap-2'>
              <CreditCard className='h-5 w-5 text-green-600' />
              Purchase Credits
            </h3>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='font-roboto text-2xl font-bold text-gray-900'>20 Credits</span>
                <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'>Best Value</span>
              </div>
              <div className='font-inter text-gray-600'>
                <span className='text-lg font-semibold text-gray-900'>$550 CAD</span>
                <span className='ml-2 text-sm line-through text-gray-400'>$900</span>
                <span className='ml-2 text-sm text-green-600 font-medium'>Save nearly 40%</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => purchaseCreditsMutation.mutate()}
            disabled={purchaseCreditsMutation.isPending}
            className='font-roboto bg-green-600 hover:bg-green-700 px-8 py-3 text-lg font-semibold min-w-[160px]'
          >
            {purchaseCreditsMutation.isPending ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Processing...
              </div>
            ) : (
              'Purchase Credits'
            )}
          </Button>
        </div>
      </div>

      {/* Emergency Note */}
      <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
        <div className='flex items-start gap-3'>
          <div className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5'>💡</div>
          <div className='font-inter text-sm text-blue-800'>
            <p className='font-medium mb-1'>Need help?</p>
            <p>If you experience any issues with getting work after making payments, Contact us at: info@bidquotecanada.com</p>
          </div>
        </div>
      </div>

      {/* Credit Purchase Modals */}
      <CreditPurchaseModals
        showSuccessModal={showSuccessModal}
        showCancelModal={showCancelModal}
        onCloseSuccessModal={() => setShowSuccessModal(false)}
        onCloseCancelModal={() => setShowCancelModal(false)}
      />
    </div>
  );
}

// ------------------------------------------------------------------------------

export function YourCreditsSection() {
  return (
    <Suspense fallback={<div>Loading credits...</div>}>
      <YourCreditsSectionHandler />
    </Suspense>
  );
}
