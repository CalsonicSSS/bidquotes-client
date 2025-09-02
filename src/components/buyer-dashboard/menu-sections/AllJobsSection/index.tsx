'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBuyerJobCards, JobCardResponse } from '@/lib/apis/buyer-jobs';
import { Actions } from './Actions';
import { StatsCards } from './StatsCards';
import { JobsList } from './JobList';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { Briefcase } from 'lucide-react';

// type ActiveFilter = 'all' | 'draft' | 'open' | 'full_bid' | 'waiting_confirmation' | 'confirmed';

type ActiveFilter = 'all' | 'draft' | 'open' | 'closed';

type AllJobsSectionProps = {
  canPostJob: boolean;
};

export function AllJobsSection({ canPostJob }: AllJobsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const { userId, getToken } = useAuth(); // the getToken here is the function to retrieve the user's JWT from Clerk
  const { user } = useUser();

  // Query to fetch buyer's job cards
  // only filtered by buyer id, fetch all jobs existing with no ther filters
  const { data: allJobs = [], isLoading: isAllJobsLoading } = useQuery({
    queryKey: ['buyer-jobs'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerJobCards(token);
    },
    enabled: !!userId && !!getToken() && !!user,
    staleTime: 0,
  });

  // Calculate all 4 stats card values based on the fully fetch jobs data in client
  const stats = {
    activeJobs: allJobs.filter((job) => job.status === 'open').length,
    totalBids: allJobs.reduce((total, job) => total + job.bid_count, 0),
    savedDrafts: allJobs.filter((job) => job.status === 'draft').length,
    closedJobs: allJobs.filter((job) => job.status === 'closed').length,
    // confirmedJobs: allJobs.filter((job) => job.status === 'confirmed').length,
  };

  // setup Filter options and calculate counts for each of the filter in the dropdown
  const filterOptions = [
    { value: 'all', label: 'All Jobs', count: allJobs.length },
    { value: 'draft', label: 'Drafts', count: stats.savedDrafts },
    { value: 'open', label: 'Open', count: allJobs.filter((j) => j.status === 'open').length },
    { value: 'closed', label: 'Closed', count: allJobs.filter((j) => j.status === 'closed').length },
    // { value: 'full_bid', label: 'Full Bids', count: allJobs.filter((j) => j.status === 'full_bid').length },
    // { value: 'waiting_confirmation', label: 'Waiting confirmation', count: allJobs.filter((j) => j.status === 'waiting_confirmation').length },
    // { value: 'confirmed', label: 'Confirmed', count: stats.confirmedJobs },
  ];

  // Filter jobs calculated based on allJobs state and activeFilter state
  const filteredJobs = allJobs.filter((job) => {
    if (activeFilter === 'all') return true;
    return job.status === activeFilter;
  });

  // Get section title based on active filter
  const getFilteredSectionTitle = () => {
    switch (activeFilter) {
      case 'all':
        return 'All Jobs';
      case 'draft':
        return 'Saved Drafts';
      case 'closed':
        return 'Closed Jobs';
      // case 'full_bid':
      //   return 'Jobs with Full Bids';
      // case 'waiting_confirmation':
      //   return 'Jobs waiting on confirmation';
      default:
        return `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Jobs`;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Action Buttons */}
      <Actions activeFilter={activeFilter} setActiveFilter={setActiveFilter} filterOptions={filterOptions} canPostJob={canPostJob} />

      {/* Jobs List Area */}

      {isAllJobsLoading ? (
        <div className='text-center py-8'>
          <Briefcase className='h-12 w-12 text-gray-300 mx-auto mb-4' />
          <h3 className='font-roboto text-lg font-semibold text-gray-900 mb-2'>Loading jobs...</h3>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className='font-roboto'>{getFilteredSectionTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            <JobsList filteredJobs={filteredJobs} activeFilter={activeFilter} canPostJob={canPostJob} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
