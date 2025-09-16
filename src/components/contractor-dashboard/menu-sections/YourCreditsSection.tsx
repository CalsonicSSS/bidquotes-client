'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CreditCard, History, Package, Loader2, ExternalLink } from 'lucide-react';
import { getContractorCredits } from '@/lib/apis/payments-credits';

export function YourCreditsSection() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current credit balance
  const { data: creditBalance = 0, isLoading: creditsLoading } = useQuery({
    queryKey: ['contractor-credits'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No authentication token');
      return getContractorCredits(token);
    },
  });

  // Credit purchase mutation - we'll implement the API call next
  const purchaseCreditsMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No authentication token');

      // TODO: Implement createCreditPurchaseSession API call
      // For now, just simulate the flow
      throw new Error('Credit purchase API not implemented yet');
    },
    onSuccess: (data: any) => {
      // Redirect to Stripe checkout
      if (data.session_url) {
        window.location.href = data.session_url;
      }
    },
    onError: (error: Error) => {
      console.error('Error purchasing credits:', error);
      alert('Failed to initiate credit purchase. Please try again later.');
      setIsLoading(false);
    },
  });

  const handlePurchaseCredits = () => {
    setIsLoading(true);
    purchaseCreditsMutation.mutate();
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Your Credits</h2>
        <Badge variant='outline' className='w-fit'>
          💳 Sandbox Mode
        </Badge>
      </div>

      {/* Credits Balance Card */}
      <Card className='bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'>
        <CardHeader className='pb-3'>
          <CardTitle className='font-roboto text-lg flex items-center gap-2'>
            <Coins className='h-5 w-5 text-green-600' />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              {creditsLoading ? (
                <div className='flex items-center gap-2'>
                  <Loader2 className='h-6 w-6 animate-spin text-green-600' />
                  <span className='font-inter text-gray-600'>Loading...</span>
                </div>
              ) : (
                <div className='space-y-1'>
                  <div className='text-3xl lg:text-4xl font-bold text-green-700'>{creditBalance}</div>
                  <p className='font-inter text-sm text-green-600'>{creditBalance === 1 ? 'Credit available' : 'Credits available'}</p>
                </div>
              )}
            </div>

            <div className='text-right'>
              <p className='font-inter text-sm text-gray-600 mb-2'>Each credit = 1 free bid</p>
              <Badge variant='secondary' className='bg-green-100 text-green-800'>
                Save $70 per bid
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Credits Card */}
      <Card className='border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-100'>
        <CardHeader>
          <CardTitle className='font-roboto text-lg flex items-center gap-2'>
            <Package className='h-5 w-5 text-orange-600' />
            Purchase More Credits
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Credit Package Info */}
          <div className='bg-white/70 p-4 rounded-lg border border-orange-200'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='font-roboto font-semibold text-lg text-gray-900'>Credits Package</h3>
              <Badge className='bg-orange-500 text-white'>Best Value</Badge>
            </div>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='font-inter text-gray-600'>Credits:</span>
                <div className='font-bold text-2xl text-orange-700'>20</div>
              </div>
              <div>
                <span className='font-inter text-gray-600'>Price:</span>
                <div className='font-bold text-2xl text-orange-700'>$700</div>
              </div>
              <div className='col-span-2'>
                <span className='font-inter text-gray-600'>Cost per bid:</span>
                <div className='font-semibold text-green-700'>$35 CAD</div>
                <div className='text-xs text-gray-500'>vs $70 CAD per individual bid</div>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <Button
            onClick={handlePurchaseCredits}
            disabled={isLoading || purchaseCreditsMutation.isPending}
            className='w-full bg-orange-600 hover:bg-orange-700 font-roboto font-semibold'
            size='lg'
          >
            {isLoading || purchaseCreditsMutation.isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin mr-2' />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className='h-4 w-4 mr-2' />
                Purchase 20 Credits - $700 CAD
                <ExternalLink className='h-4 w-4 ml-2' />
              </>
            )}
          </Button>

          <p className='font-inter text-xs text-gray-600 text-center'>Secure payment powered by Stripe. You'll be redirected to complete your purchase.</p>
        </CardContent>
      </Card>

      {/* Credit History Card */}
      <Card>
        <CardHeader>
          <CardTitle className='font-roboto text-lg flex items-center gap-2'>
            <History className='h-5 w-5 text-gray-600' />
            Credit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for now - we'll implement history fetching next */}
          <div className='text-center py-8'>
            <History className='h-12 w-12 text-gray-300 mx-auto mb-4' />
            <p className='font-inter text-gray-500 mb-2'>No credit history yet</p>
            <p className='font-inter text-sm text-gray-400'>Your credit purchases and usage will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* How Credits Work Info */}
      <Card className='bg-blue-50 border-blue-200'>
        <CardHeader>
          <CardTitle className='font-roboto text-lg text-blue-900'>How Credits Work</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-start gap-3'>
            <div className='w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5'>1</div>
            <div>
              <h4 className='font-roboto font-semibold text-blue-900'>Purchase Credits</h4>
              <p className='font-inter text-sm text-blue-700'>Buy credits in bulk to save money on bid submissions</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5'>2</div>
            <div>
              <h4 className='font-roboto font-semibold text-blue-900'>Submit Bids</h4>
              <p className='font-inter text-sm text-blue-700'>Credits are automatically used when you submit bids (no payment required)</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <div className='w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold mt-0.5'>3</div>
            <div>
              <h4 className='font-roboto font-semibold text-blue-900'>Get Job Details</h4>
              <p className='font-inter text-sm text-blue-700'>Access full job information and homeowner contact details instantly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
