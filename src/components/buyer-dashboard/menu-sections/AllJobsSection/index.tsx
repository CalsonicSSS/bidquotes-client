'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobCardResponse } from '@/lib/apis/buyer-jobs';
import { Actions } from './Actions';
import { StatsCards } from './StatsCards';
import { JobsList } from './JobList';

type ActiveFilter = 'all' | 'draft' | 'open' | 'full_bid' | 'waiting_confirmation' | 'confirmed';

type AllJobsSectionProps = {
  allJobs: JobCardResponse[];
  canPostJob: boolean;
};

export function AllJobsSection({ allJobs, canPostJob }: AllJobsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');

  // Calculate all 4 stats card values based on the fully fetch jobs data in client
  const stats = {
    activeJobs: allJobs.filter((job) => job.status === 'open' || job.status === 'full_bid').length,
    totalBids: allJobs.reduce((total, job) => total + job.bid_count, 0),
    confirmedJobs: allJobs.filter((job) => job.status === 'confirmed').length,
    savedDrafts: allJobs.filter((job) => job.status === 'draft').length,
  };

  // setup Filter options and calculate counts for each of the filter in the dropdown
  const filterOptions = [
    { value: 'all', label: 'All Jobs', count: allJobs.length },
    { value: 'draft', label: 'Drafts', count: stats.savedDrafts },
    { value: 'open', label: 'Open', count: allJobs.filter((j) => j.status === 'open').length },
    { value: 'full_bid', label: 'Full Bids', count: allJobs.filter((j) => j.status === 'full_bid').length },
    { value: 'waiting_confirmation', label: 'Waiting confirmation', count: allJobs.filter((j) => j.status === 'waiting_confirmation').length },
    { value: 'confirmed', label: 'Confirmed', count: stats.confirmedJobs },
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
      case 'full_bid':
        return 'Jobs with Full Bids';
      case 'waiting_confirmation':
        return 'Jobs waiting on confirmation';
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
      <Card>
        <CardHeader>
          <CardTitle className='font-roboto'>{getFilteredSectionTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <JobsList filteredJobs={filteredJobs} activeFilter={activeFilter} canPostJob={canPostJob} />
        </CardContent>
      </Card>
    </div>
  );
}
