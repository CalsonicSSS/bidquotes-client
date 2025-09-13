'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getContractorBidCards, type ContractorBidCardResponse } from '@/lib/apis/contractor-bids';
import { Clock, FileText, XCircle } from 'lucide-react';
import { StatusCard } from './StatusCards';
import { BidCard } from './BidCard';
import { Actions } from './Actions';
import { ActiveSection } from '@/app/(dashboard)/contractor-dashboard/page';

export type ActiveFilter = 'all' | 'draft' | 'submitted';

export function YourBidsSection({ setActiveSection }: { setActiveSection: Dispatch<SetStateAction<ActiveSection>> }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');

  // Handle Browse Jobs button click
  const handleBrowseJobs = () => {
    setActiveSection('all-jobs');
  };

  // Fetch contractor bids (always fetch all, filter on client side like buyer)
  const {
    data: allContractorBids = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contractor-bids'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      // Always fetch all bids, filter on client side
      return getContractorBidCards(token);
    },
    enabled: !!getToken(),
  });

  // Calculate status counts
  const statusCounts = {
    total: allContractorBids.length,
    draft: allContractorBids.filter((bid) => bid.status === 'draft').length,
  };

  // Filter bids options with counts (like buyer side) based on status
  // we hardcode them here
  const filterOptions = [
    { value: 'all', label: 'All Bids', count: allContractorBids.length },
    { value: 'draft', label: 'Drafts', count: allContractorBids.filter((b) => b.status === 'draft').length },
    { value: 'submitted', label: 'Submitted', count: allContractorBids.filter((b) => b.status === 'submitted').length },
  ];

  // Filter bids based on active filter (client-side filtering like buyer side)
  const filteredBids = allContractorBids.filter((bid) => {
    if (activeFilter === 'all') return true;
    return bid.status === activeFilter;
  });

  // Get section title based on active filter
  const getFilteredSectionTitle = () => {
    switch (activeFilter) {
      case 'all':
        return 'All Bids';
      case 'draft':
        return 'Draft Bids';
      case 'submitted':
        return 'Submitted Bids';
      default:
        return `${(activeFilter as string).charAt(0).toUpperCase() + (activeFilter as string).slice(1)} Bids`;
    }
  };

  // Handle bid card click
  const handleBidClick = (bid: ContractorBidCardResponse) => {
    if (bid.status === 'draft') {
      // Draft bids go to post-bid page for editing with draft param
      router.push(`/contractor-dashboard/post-bid?draft=${bid.id}`);
    } else {
      // Other bids go to bid detail page
      router.push(`/contractor-dashboard/bids/${bid.id}`);
    }
  };

  // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className='space-y-6'>
      <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Your Bids</h2>

      {/* Status Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatusCard title='Total Bids' count={statusCounts.total} icon={<FileText className='h-6 w-6 text-blue-600' />} bgColor='bg-blue-100' />
        <StatusCard title='Drafts' count={statusCounts.draft} icon={<Clock className='h-6 w-6 text-gray-600' />} bgColor='bg-gray-100' />
      </div>

      {/* Actions (Filter + Browse Jobs button) */}
      <Actions activeFilter={activeFilter} setActiveFilter={setActiveFilter} filterOptions={filterOptions} onBrowseJobs={handleBrowseJobs} />

      {/* Bids List */}
      <Card className='border border-gray-200'>
        <CardHeader>
          <CardTitle className='font-roboto'>{getFilteredSectionTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600' />
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <XCircle className='h-12 w-12 text-red-400 mx-auto mb-4' />
              <h3 className='font-roboto font-semibold text-lg mb-2'>Error Loading Bids</h3>
              <p className='font-inter text-gray-600'>Please try refreshing the page.</p>
            </div>
          ) : filteredBids.length === 0 ? (
            <div className='text-center py-12'>
              <FileText className='h-12 w-12 text-gray-300 mx-auto mb-4' />
              <h3 className='font-roboto font-semibold text-lg mb-2'>
                {activeFilter === 'all' ? 'No Bids Yet' : `No ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bids`}
              </h3>
              <p className='font-inter text-gray-600 mb-4'>
                {activeFilter === 'all' ? 'Start browsing jobs and submit your first bid!' : 'Try adjusting your filter or browse available jobs.'}
              </p>
              {activeFilter === 'all' && (
                <Button onClick={handleBrowseJobs} className='font-roboto bg-green-600 hover:bg-green-700'>
                  Browse Jobs
                </Button>
              )}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredBids.map((bid) => (
                <BidCard key={bid.id} bid={bid} onClick={() => handleBidClick(bid)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
