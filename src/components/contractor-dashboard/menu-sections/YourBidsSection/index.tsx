'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getContractorBidCards, type ContractorBidCardResponse } from '@/lib/apis/contractor-bids';
import { Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { StatusCard } from './StatusCards';
import { BidCard } from './BidCard';

export function YourBidsSection() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch contractor bids
  const {
    data: bids = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contractor-bids', statusFilter],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      const filterValue = statusFilter === 'all' ? undefined : statusFilter;
      return getContractorBidCards(token, filterValue);
    },
    enabled: !!getToken(),
  });

  // Calculate status counts
  const statusCounts = {
    total: bids.length,
    draft: bids.filter((bid) => bid.status === 'draft').length,
    pending: bids.filter((bid) => bid.status === 'pending').length,
    confirmed: bids.filter((bid) => bid.status === 'confirmed').length,
  };

  // Handle bid card click
  const handleBidClick = (bid: ContractorBidCardResponse) => {
    if (bid.status === 'draft') {
      // Draft bids go to bid posting page for editing
      router.push(`/contractor-dashboard/bid-posting?job_id=${bid.job_id}&bid_id=${bid.id}`);
    } else {
      // Other bids go to bid detail page
      router.push(`/contractor-dashboard/bid-detail/${bid.id}`);
    }
  };

  const filterButtons = [
    { value: 'all', label: 'All Bids' },
    { value: 'draft', label: 'Drafts' },
    { value: 'pending', label: 'Pending' },
    { value: 'selected', label: 'Selected' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'declined', label: 'Declined' },
  ];

  return (
    <div className='space-y-6'>
      <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Your Bids</h2>

      {/* Status Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatusCard title='Total Bids' count={statusCounts.total} icon={<FileText className='h-6 w-6 text-blue-600' />} bgColor='bg-blue-100' />
        <StatusCard title='Drafts' count={statusCounts.draft} icon={<Clock className='h-6 w-6 text-gray-600' />} bgColor='bg-gray-100' />
        <StatusCard title='Pending' count={statusCounts.pending} icon={<Clock className='h-6 w-6 text-yellow-600' />} bgColor='bg-yellow-100' />
        <StatusCard title='Confirmed' count={statusCounts.confirmed} icon={<CheckCircle className='h-6 w-6 text-green-600' />} bgColor='bg-green-100' />
      </div>

      {/* Filter Buttons */}
      <div className='flex flex-wrap gap-2'>
        {filterButtons.map((button) => (
          <Button
            key={button.value}
            variant={statusFilter === button.value ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatusFilter(button.value)}
            className={statusFilter === button.value ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-gray-50'}
          >
            {button.label}
          </Button>
        ))}
      </div>

      {/* Bids List */}
      <Card className='border border-gray-200'>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <XCircle className='h-12 w-12 text-red-400 mx-auto mb-4' />
              <h3 className='font-roboto font-semibold text-lg mb-2'>Error Loading Bids</h3>
              <p className='font-inter text-gray-600'>Please try refreshing the page.</p>
            </div>
          ) : bids.length === 0 ? (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <h3 className='font-roboto font-semibold text-lg mb-2'>
                {statusFilter === 'all' ? 'No Bids Yet' : `No ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Bids`}
              </h3>
              <p className='font-inter text-gray-600 mb-4'>
                {statusFilter === 'all' ? 'Start browsing jobs and submit your first bid!' : 'Try adjusting your filter or browse available jobs.'}
              </p>
              {statusFilter === 'all' && (
                <Button onClick={() => router.push('/contractor-dashboard')} className='font-roboto bg-green-600 hover:bg-green-700'>
                  Browse Jobs
                </Button>
              )}
            </div>
          ) : (
            <div className='divide-y divide-gray-200'>
              {bids.map((bid) => (
                <div key={bid.id} className='p-4 lg:p-6'>
                  <BidCard bid={bid} onClick={() => handleBidClick(bid)} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
