'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBuyerJobCards } from '@/lib/apis/buyer-jobs';
import { Actions } from './Actions';
import { StatsCards } from './StatsCards';
import { JobsList } from './JobList';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/nextjs';
import { Briefcase } from 'lucide-react';

type JobFilterOptions = 'all' | 'open' | 'draft' | 'closed';

export function AllJobsSection({ canPostJob }: { canPostJob: boolean }) {
  const [activeJobFilter, setActiveJobFilter] = useState<JobFilterOptions>('all');
  const { userId, getToken } = useAuth();
  const { user } = useUser();

  // Query to fetch buyer's job cards
  // only filtered by buyer / home owner id, fetch all jobs existing with no filters
  const { data: allJobs = [], isLoading: isAllJobsLoading } = useQuery({
    queryKey: ['buyer-jobs'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerJobCards(token);
    },
    enabled: !!userId && !!getToken() && !!user,
  });

  // Calculate all 4 stats card values based on the fully fetch jobs data in client side directly
  const stats = {
    activeJobsCount: allJobs.filter((job) => job.status === 'open').length,
    totalBidsCount: allJobs.reduce((total, job) => total + job.bid_count, 0),
    savedDraftsCount: allJobs.filter((job) => job.status === 'draft').length,
    closedJobsCount: allJobs.filter((job) => job.status === 'closed').length,
  };

  // setup Filter options and calculate counts for each of the filter in the dropdown
  const jobFilterOptions = [
    { value: 'all', label: 'All Jobs', count: allJobs.length },
    { value: 'open', label: 'Open', count: allJobs.filter((j) => j.status === 'open').length },
    { value: 'closed', label: 'Closed', count: allJobs.filter((j) => j.status === 'closed').length },
    { value: 'draft', label: 'Drafts', count: allJobs.filter((j) => j.status === 'draft').length },
  ];

  // Filter jobs view based on active job filter value
  const filteredJobs = allJobs.filter((job) => {
    if (activeJobFilter === 'all') return true;
    return job.status === activeJobFilter;
  });

  // Get section title based on active filter
  const getFilteredSectionTitle = () => {
    switch (activeJobFilter) {
      case 'draft':
        return 'Saved Drafts';
      default:
        return `${activeJobFilter.charAt(0).toUpperCase() + activeJobFilter.slice(1)} Jobs`;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Action Buttons */}
      <Actions activeJobFilter={activeJobFilter} setActiveJobFilter={setActiveJobFilter} jobFilterOptions={jobFilterOptions} canPostJob={canPostJob} />

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
            <JobsList filteredJobs={filteredJobs} activeJobFilter={activeJobFilter} canPostJob={canPostJob} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
