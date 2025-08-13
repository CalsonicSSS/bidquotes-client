'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { getBidDetail, deleteBid } from '@/lib/apis/contractor-bids';
import { declineSelectedBid } from '@/lib/apis/contractor-bids';
import { confirmSelectedBid } from '@/lib/apis/contractor-bids';
import { Phone, Mail } from 'lucide-react';

type BidDetailPageProps = {
  bidId: string;
};

export default function BidDetailPage({ bidId }: BidDetailPageProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch bid details
  const {
    data: bid,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bid-detail', bidId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBidDetail(bidId, token);
    },
    enabled: !!bidId && !!getToken(),
    staleTime: 0,
  });

  // Delete bid mutation
  const deleteBidMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return deleteBid(bidId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
      router.push('/contractor-dashboard?section=your-bids');
    },
    onError: (error) => {
      console.error('Error deleting bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete bid');
    },
  });

  // Decline bid selection mutation
  const declineBidMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return declineSelectedBid(bidId, token);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['bid-detail', bidId] });
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });

      // Navigate back to dashboard with success message
      router.push('/contractor-dashboard?section=your-bids');
    },
    onError: (error) => {
      console.error('Error declining bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to decline bid. Please try again.');
    },
  });

  // Confirm bid selection mutation
  const confirmBidMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Unable to get authentication token');
      return confirmSelectedBid(bidId, token);
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries to get updated bid details (with buyer contact)
      queryClient.invalidateQueries({ queryKey: ['bid-detail', bidId] });
      queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });

      // Don't navigate away - let user see the confirmed status and buyer contact info
    },
    onError: (error) => {
      console.error('Error confirming bid:', error);
      alert(error instanceof Error ? error.message : 'Failed to confirm bid. Please try again.');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'selected':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleEditBid = () => {
    router.push(`/contractor-dashboard/post-bid?edit=${bidId}`);
  };

  const handleDeleteBid = () => {
    const confirmed = window.confirm('Are you sure you want to delete this bid? This action cannot be undone.');
    if (confirmed) {
      deleteBidMutation.mutate();
    }
  };

  const handleDeclineBid = () => {
    if (window.confirm('Are you sure you want to decline this bid selection? This action cannot be undone and the buyer will be notified.')) {
      declineBidMutation.mutate();
    }
  };

  const handleConfirmBid = () => {
    if (window.confirm('Are you sure you want to confirm this bid selection? This will finalize the job and reveal buyer contact information.')) {
      confirmBidMutation.mutate();
    }
  };

  const handleViewJob = () => {
    if (bid) {
      router.push(`/contractor-dashboard/jobs/${bid.job_id}`);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/contractor-dashboard?section=your-bids');
  };

  // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading bid details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !bid) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <XCircle className='h-12 w-12 text-red-400 mx-auto mb-4' />
          <h3 className='font-roboto font-semibold text-lg mb-2'>Bid Not Found</h3>
          <p className='font-inter text-gray-600 mb-4'>The bid you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={handleBackToDashboard} className='font-roboto bg-green-600 hover:bg-green-700'>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile Header */}
      <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10'>
        <button onClick={handleBackToDashboard} className='p-2 rounded-md hover:bg-gray-100'>
          <ArrowLeft className='h-5 w-5' />
        </button>
        <h1 className='font-roboto font-semibold text-gray-900'>Bid Details</h1>
        <div className='w-9' />
      </div>

      <div className='container mx-auto px-4 py-6 max-w-4xl'>
        {/* Desktop Header */}
        <div className='hidden lg:block mb-8'>
          <div className='flex justify-between items-center'>
            <h1 className='font-roboto text-3xl font-bold text-gray-900'>Bid Details</h1>
            <Button onClick={handleBackToDashboard} variant='outline'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Show when bid is selected */}
        {bid.status === 'selected' && (
          <Card className='bg-green-50 border-green-200 mb-5'>
            <CardContent className='pt-6'>
              <div className='flex items-center gap-3 mb-4'>
                <CheckCircle className='h-6 w-6 text-green-600' />
                <div>
                  <h3 className='font-roboto font-semibold text-green-900'>🎉 Your Bid Has Been Selected!</h3>
                  <p className='font-inter text-sm text-green-700'>The buyer has chosen your bid for this job.</p>
                </div>
              </div>

              <div className='bg-green-100 border border-green-200 rounded-lg p-4'>
                <h4 className='font-roboto font-semibold text-green-900 mb-2'>Next Steps:</h4>
                <ul className='font-inter text-sm text-green-800 space-y-1'>
                  <li>
                    • <strong>Confirm:</strong> Pay the confirmation fee to secure this job and get buyer contact details
                  </li>
                  <li>
                    • <strong>Decline:</strong> If you're no longer available, decline so the buyer can select another contractor
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show when bid is fully confirmed */}
        {bid.status === 'confirmed' && (
          <Card className='bg-purple-50 border-purple-200 mb-5'>
            <CardHeader>
              <CardTitle className='font-roboto text-lg flex items-center gap-2 text-purple-900'>
                <CheckCircle className='h-5 w-5' />
                Job Confirmed 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='font-inter text-sm text-purple-700 mb-4'>Congratulations! You have successfully confirmed this job. The buyer contact information is now available.</p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200'>
                  <Mail className='h-5 w-5 text-purple-600' />
                  <div>
                    <p className='font-roboto font-semibold text-gray-900'>Email</p>
                    <p className='font-inter text-sm text-gray-700'>{bid.buyer_contact_email}</p>
                  </div>
                </div>

                {bid.buyer_contact_phone && (
                  <div className='flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200'>
                    <Phone className='h-5 w-5 text-purple-600' />
                    <div>
                      <p className='font-roboto font-semibold text-gray-900'>Phone</p>
                      <p className='font-inter text-sm text-gray-700'>{bid.buyer_contact_phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className='bg-purple-100 border border-purple-200 rounded-lg p-4'>
                <p className='font-inter text-sm text-purple-800'>
                  <strong>Next Steps:</strong> Reach out to the buyer to discuss project details, timeline, and coordinate the work.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className='space-y-6'>
          {/* Bid Overview Card */}
          <Card>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <CardTitle className='font-roboto text-xl lg:text-2xl'>{bid.title}</CardTitle>
                  <p className='font-inter text-gray-600 mt-2'>
                    Submitted on{' '}
                    {new Date(bid.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bid.status)}`}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Pricing */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Pricing</h3>
                <p className='font-inter text-lg'>
                  {bid.price_min} - {bid.price_max}
                </p>
              </div>

              {/* Timeline */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Timeline Estimate</h3>
                <p className='font-inter'>{bid.timeline_estimate}</p>
              </div>

              {/* Work Description */}
              <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Work Description</h3>
                <p className='font-inter whitespace-pre-wrap'>{bid.work_description}</p>
              </div>

              {/* Additional Notes */}
              {bid.additional_notes && (
                <div>
                  <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Additional Notes</h3>
                  <p className='font-inter whitespace-pre-wrap'>{bid.additional_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Context Card */}
          <Card className='bg-blue-50 border-blue-200'>
            <CardHeader>
              <CardTitle className='font-roboto text-lg'>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-roboto font-semibold text-gray-900'>{bid.job_title}</h4>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm'>
                    <div>
                      <span className='font-roboto font-medium'>Type:</span>
                      <span className='font-inter ml-2'>{bid.job_type}</span>
                    </div>
                    <div>
                      <span className='font-roboto font-medium'>Budget:</span>
                      <span className='font-inter ml-2'>{bid.job_budget}</span>
                    </div>
                    <div>
                      <span className='font-roboto font-medium'>Location:</span>
                      <span className='font-inter ml-2'>{bid.job_city}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={handleViewJob} variant='outline' size='sm' className='font-roboto'>
                  <ExternalLink className='h-4 w-4 mr-2' />
                  View Full Job Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons Based on Status */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col sm:flex-row gap-3'>
                {bid.status === 'pending' && (
                  <>
                    <Button onClick={handleEditBid} className='font-roboto bg-green-600 hover:bg-green-700'>
                      <Edit className='h-4 w-4 mr-2' />
                      Edit Bid
                    </Button>
                    <Button onClick={handleDeleteBid} variant='destructive' disabled={deleteBidMutation.isPending} className='font-roboto'>
                      <Trash2 className='h-4 w-4 mr-2' />
                      {deleteBidMutation.isPending ? 'Deleting...' : 'Delete Bid'}
                    </Button>
                  </>
                )}

                {bid.status === 'selected' && (
                  <>
                    <Button onClick={handleConfirmBid} disabled={confirmBidMutation.isPending} className='font-roboto bg-blue-600 hover:bg-blue-700'>
                      <CheckCircle className='h-4 w-4 mr-2' />
                      {confirmBidMutation.isPending ? 'Confirming...' : 'Confirm Selection'}
                    </Button>
                    <Button onClick={handleDeclineBid} disabled={declineBidMutation.isPending || confirmBidMutation.isPending} variant='outline' className='font-roboto'>
                      <XCircle className='h-4 w-4 mr-2' />
                      {declineBidMutation.isPending ? 'Declining...' : 'Decline Selection'}
                    </Button>
                  </>
                )}

                {bid.status === 'declined' && (
                  <Button onClick={handleDeleteBid} variant='destructive' disabled={deleteBidMutation.isPending} className='font-roboto'>
                    <Trash2 className='h-4 w-4 mr-2' />
                    {deleteBidMutation.isPending ? 'Deleting...' : 'Delete Bid'}
                  </Button>
                )}

                {/* no action needed for confirmed bid */}
                {bid.status === 'confirmed' && (
                  <Button onClick={handleBackToDashboard} className='font-roboto bg-gray-600 hover:bg-gray-700'>
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back to Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
