'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Wallet, XCircle, ClipboardCheck, FileText, Users, Camera, Badge } from 'lucide-react';
import { getBidDetail } from '@/lib/apis/contractor-bids';
// import { declineSelectedBid } from '@/lib/apis/contractor-bids';
// import { confirmSelectedBid } from '@/lib/apis/contractor-bids';
import { Phone, Briefcase, Calendar, Hammer, MapPin } from 'lucide-react';
import { formatDateTime } from '@/lib/utils/custom-format';
import { getContractorJobDetail } from '@/lib/apis/contractor-jobs';
import { ImagesGallery } from '../ImagesGallery';
import { getBuyerContactInfoByBuyerId } from '@/lib/apis/buyer-contact-info';

type BidDetailPageProps = {
  bidId: string;
};

export default function BidDetailPage({ bidId }: BidDetailPageProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  // const queryClient = useQueryClient();

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

  // after fully fetched bid, we will use job_id from bid to the full job details
  const { data: jobDetail } = useQuery({
    queryKey: ['job-detail', bid?.job_id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getContractorJobDetail(bid?.job_id as string, token);
    },
    enabled: !!bid?.job_id && !!getToken(),
  });

  // after fully fetched job detail, we will use buyer_id to fetch buyer contact information
  const { data: buyerContactInfo } = useQuery({
    queryKey: ['buyer-contact', jobDetail?.buyer_id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerContactInfoByBuyerId(jobDetail?.buyer_id as string);
    },
    enabled: !!jobDetail?.buyer_id && !!getToken(),
  });

  // Delete bid mutation (we will now need to always keep the bid for full database track record)
  // const deleteBidMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     if (!token) throw new Error('No token available');
  //     return deleteBid(bidId, token);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });
  //     router.push('/contractor-dashboard?section=your-bids');
  //   },
  //   onError: (error) => {
  //     console.error('Error deleting bid:', error);
  //     alert(error instanceof Error ? error.message : 'Failed to delete bid');
  //   },
  // });

  // Decline bid selection mutation (No longer need decline mutation anymore)
  // const declineBidMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     if (!token) throw new Error('Unable to get authentication token');
  //     return declineSelectedBid(bidId, token);
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch relevant queries
  //     queryClient.invalidateQueries({ queryKey: ['bid-detail', bidId] });
  //     queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });

  //     // Navigate back to dashboard with success message
  //     router.push('/contractor-dashboard?section=your-bids');
  //   },
  //   onError: (error) => {
  //     console.error('Error declining bid:', error);
  //     alert(error instanceof Error ? error.message : 'Failed to decline bid. Please try again.');
  //   },
  // });

  // Confirm bid selection mutation (No longer need confirm mutation anymore)
  // const confirmBidMutation = useMutation({
  //   mutationFn: async () => {
  //     const token = await getToken();
  //     if (!token) throw new Error('Unable to get authentication token');
  //     return confirmSelectedBid(bidId, token);
  //   },
  //   onSuccess: () => {
  //     // Invalidate and refetch relevant queries to get updated bid details (with buyer contact)
  //     queryClient.invalidateQueries({ queryKey: ['bid-detail', bidId] });
  //     queryClient.invalidateQueries({ queryKey: ['contractor-bids'] });

  //     // Don't navigate away - let user see the confirmed status and buyer contact info
  //   },
  //   onError: (error) => {
  //     console.error('Error confirming bid:', error);
  //     alert(error instanceof Error ? error.message : 'Failed to confirm bid. Please try again.');
  //   },
  // });

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  //     case 'selected':
  //       return 'bg-blue-100 text-blue-700 border-blue-200';
  //     case 'confirmed':
  //       return 'bg-green-100 text-green-700 border-green-200';
  //     case 'declined':
  //       return 'bg-red-100 text-red-700 border-red-200';
  //     default:
  //       return 'bg-gray-100 text-gray-700 border-gray-200';
  //   }
  // };

  const handleEditBid = () => {
    router.push(`/contractor-dashboard/post-bid?edit=${bidId}`);
  };

  // const handleDeleteBid = () => {
  //   const confirmed = window.confirm('Are you sure you want to delete this bid? This action cannot be undone.');
  //   if (confirmed) {
  //     deleteBidMutation.mutate();
  //   }
  // };

  // const handleDeclineBid = () => {
  //   if (window.confirm('Are you sure you want to decline this bid selection? This action cannot be undone and the buyer will be notified.')) {
  //     declineBidMutation.mutate();
  //   }
  // };

  // const handleConfirmBid = () => {
  //   if (window.confirm('Are you sure you want to confirm this bid selection? This will finalize the job and reveal buyer contact information.')) {
  //     confirmBidMutation.mutate();
  //   }
  // };

  // const handleViewJob = () => {
  //   if (bid) {
  //     router.push(`/contractor-dashboard/jobs/${bid.job_id}`);
  //   }
  // };

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
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </div>
        </div>

        {/* Show when bid is selected (NO LONG NEEDED UNDER NEW WORKFLOW) */}
        {/* {bid.status === 'selected' && (
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
        )} */}

        {/* Show when bid is fully confirmed (NO LONG NEEDED UNDER NEW WORKFLOW) */}
        {/* {bid.status === 'confirmed' && (
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
        )} */}

        <div className='space-y-6'>
          {/* Bid Overview Card */}
          <Card>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <CardTitle className='font-roboto text-xl lg:text-2xl'>{bid.title}</CardTitle>
                  <p className='font-inter text-gray-600 mt-2'>Submitted on {formatDateTime(bid.created_at)}</p>
                </div>
                {/* <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bid.status)}`}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span> */}
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

              {/* Work Description (NO LONGER NEEDED UNDER NEW WORKFLOW) */}
              {/* <div>
                <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Work Description</h3>
                <p className='font-inter whitespace-pre-wrap'>{bid.work_description}</p>
              </div> */}

              {/* Additional Notes (NO LONGER NEEDED UNDER NEW WORKFLOW) */}
              {/* {bid.additional_notes && (
                <div>
                  <h3 className='font-roboto font-semibold text-gray-900 mb-2'>Additional Notes</h3>
                  <p className='font-inter whitespace-pre-wrap'>{bid.additional_notes}</p>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* full Job detail Card (NEW) */}
          {jobDetail && (
            <Card className='bg-blue-50 border-blue-200'>
              <CardHeader>
                <CardTitle className='font-roboto text-lg flex items-center gap-2'>
                  <Briefcase className='h-5 w-5' />
                  Job Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {/* Job Title */}
                  <div>
                    <div className='flex justify-between items-center mb-5'>
                      <h4 className='font-roboto font-semibold text-gray-900 text-xl'>{jobDetail.title}</h4>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          jobDetail.status === 'open' ? 'border-green-600 bg-green-400' : 'border-red-500 bg-red-400'
                        }`}
                      >
                        {jobDetail.status.charAt(0).toUpperCase() + jobDetail.status.slice(1)}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <Calendar className='h-4 w-4' />
                      <span className='font-inter'>Posted on {formatDateTime(jobDetail.created_at)}</span>
                    </div>
                  </div>

                  {/* Key Job Info Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-white/70 p-3 rounded-lg border border-blue-200'>
                      <h5 className='font-roboto font-semibold text-gray-900 mb-1 flex items-center gap-2'>
                        <Hammer className='h-4 w-4' />
                        Job Type
                      </h5>
                      <p className='font-inter text-gray-700'>{jobDetail.job_type}</p>
                    </div>

                    <div className='bg-white/70 p-3 rounded-lg border border-blue-200'>
                      <h5 className='font-roboto font-semibold text-gray-900 mb-1 flex items-center gap-2'>
                        <Wallet className='h-4 w-4' />
                        Budget
                      </h5>
                      <p className='font-inter text-gray-700'>{jobDetail.job_budget}</p>
                    </div>

                    <div className='bg-white/70 p-3 rounded-lg border border-blue-200'>
                      <h5 className='font-roboto font-semibold text-gray-900 mb-1 flex items-center gap-2'>
                        <MapPin className='h-4 w-4' />
                        Location
                      </h5>
                      <p className='font-inter text-gray-700'>{jobDetail.city}</p>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className='bg-white/70 p-4 rounded-lg border border-blue-200'>
                    <h5 className='font-roboto font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                      <ClipboardCheck className='h-4 w-4' />
                      Job Description
                    </h5>
                    <p className='font-inter text-gray-700 whitespace-pre-wrap leading-relaxed'>{jobDetail.description}</p>
                  </div>

                  {/* Additional Requirements */}
                  {jobDetail.other_requirements && (
                    <div className='bg-white/70 p-4 rounded-lg border border-blue-200'>
                      <h5 className='font-roboto font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                        <FileText className='h-4 w-4' />
                        Additional Requirements
                      </h5>
                      <p className='font-inter text-gray-700 whitespace-pre-wrap leading-relaxed'>{jobDetail.other_requirements}</p>
                    </div>
                  )}

                  {/* Job Photos */}
                  {jobDetail.images && jobDetail.images.length > 0 && (
                    <div className='bg-white/70 p-4 rounded-lg border border-blue-200'>
                      <h5 className='font-roboto font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                        <Camera className='h-4 w-4' />
                        Job Photos ({jobDetail.images.length})
                      </h5>
                      <ImagesGallery images={jobDetail.images} />
                    </div>
                  )}

                  {/* Contact Information Note */}
                  <div className='bg-amber-50 border border-amber-200 p-4 rounded-lg'>
                    <div className='flex items-start gap-3'>
                      <Phone className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
                      <div>
                        <h5 className='font-roboto font-semibold text-amber-900 mb-1'>Contact Information</h5>
                        {/* both email and phone */}
                        <p className='font-inter text-sm text-amber-800'>Email: {buyerContactInfo?.contact_email}</p>
                        <p className='font-inter text-sm text-amber-800'>Phone: {buyerContactInfo?.phone_number}</p>
                      </div>
                    </div>
                  </div>

                  {/* Full Address (if different from city) */}
                  {jobDetail.location_address && jobDetail.location_address !== jobDetail.city && (
                    <div className='bg-amber-50 border border-amber-200 p-4 rounded-lg '>
                      <h5 className='font-roboto font-semibold text-gray-900 mb-2 flex items-center gap-2'>
                        <MapPin className='h-4 w-4' />
                        Full Address
                      </h5>
                      <p className='font-inter text-gray-700'>{jobDetail.location_address}</p>
                    </div>
                  )}

                  {/* Bidding Status */}
                  <div className='bg-white/70 p-4 rounded-lg border border-blue-200'>
                    <div className='flex items-center justify-between mb-3'>
                      <h5 className='font-roboto font-semibold text-gray-900 flex items-center gap-2'>
                        <Users className='h-4 w-4' />
                        Bidding Status
                      </h5>
                      <Badge
                        className={`font-inter ${
                          jobDetail.status === 'open'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : jobDetail.status === 'full_bid'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : jobDetail.status === 'waiting_confirmation'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        {jobDetail.status === 'open'
                          ? 'Open for Bids'
                          : jobDetail.status === 'full_bid'
                          ? 'Full (5 Bids)'
                          : jobDetail.status === 'waiting_confirmation'
                          ? 'Pending Confirmation'
                          : jobDetail.status}
                      </Badge>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='font-roboto font-medium text-gray-600'>Current Bids:</span>
                        <span className='font-inter ml-2 text-gray-900'>{jobDetail.bid_count || 0}/5</span>
                      </div>
                      <div>
                        <span className='font-roboto font-medium text-gray-600'>Status:</span>
                        <span className='font-inter ml-2 text-gray-900 capitalize'>{jobDetail.status?.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* bid Progress Bar */}
                    <div className='mt-3'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='font-inter text-xs text-gray-600'>Bid Progress</span>
                        <span className='font-inter text-xs text-gray-600'>{jobDetail.bid_count || 0}/5</span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <div className='bg-blue-600 h-2 rounded-full transition-all duration-300' style={{ width: `${((jobDetail.bid_count || 0) / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons Based on Status */}
          <Card>
            <CardContent className='pt-6'>
              <div className='flex flex-col sm:flex-row gap-3'>
                {bid.status === 'pending' && (
                  <>
                    <Button onClick={handleEditBid} className='font-roboto bg-green-600 hover:bg-green-700'>
                      <Edit className='h-4 w-4 mr-1' />
                      Edit Bid
                    </Button>
                    {/* <Button onClick={handleDeleteBid} variant='destructive' disabled={deleteBidMutation.isPending} className='font-roboto'>
                      <Trash2 className='h-4 w-4 mr-2' />
                      {deleteBidMutation.isPending ? 'Deleting...' : 'Delete Bid'}
                    </Button> */}
                  </>
                )}

                {/* {bid.status === 'selected' && (
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
                )} */}

                {/* {bid.status === 'declined' && (
                  <Button onClick={handleDeleteBid} variant='destructive' disabled={deleteBidMutation.isPending} className='font-roboto'>
                    <Trash2 className='h-4 w-4 mr-2' />
                    {deleteBidMutation.isPending ? 'Deleting...' : 'Delete Bid'}
                  </Button>
                )} */}

                {/* no action needed for confirmed bid */}
                {/* {bid.status === 'confirmed' && (
                  <Button onClick={handleBackToDashboard} className='font-roboto bg-gray-600 hover:bg-gray-700'>
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back to Dashboard
                  </Button>
                )} */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
