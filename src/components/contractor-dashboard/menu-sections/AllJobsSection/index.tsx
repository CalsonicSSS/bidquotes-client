'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { getAvailableJobs, getJobCities } from '@/lib/apis/contractor-jobs';
import { JobFilters } from './JobFilters';
import { JobsGrid } from './JobsGrid';

export function AllJobsSection() {
  const { getToken } = useAuth();
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Fetch available jobs with filters
  // we use state in the query key to refetch when filters change immediately, by pass the stale time and other triggers all
  // recall that stale time is respected only on specific query key used
  const {
    data: availableJobs = [],
    isLoading: isJobsLoading,
    error: jobsError,
  } = useQuery({
    queryKey: ['contractor-available-jobs', cityFilter, jobTypeFilter],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');

      return getAvailableJobs(token, cityFilter === 'all' ? undefined : cityFilter, jobTypeFilter === 'all' ? undefined : jobTypeFilter);
    },
    enabled: !!getToken,
  });

  // Fetch available cities for filter
  const { data: cityFilters = [] } = useQuery({
    queryKey: ['job-cities'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getJobCities(token);
    },
    enabled: !!getToken,
  });

  const handleClearAllFilters = () => {
    setCityFilter('all');
    setJobTypeFilter('all');
    setShowSavedOnly(false);
  };

  if (jobsError) {
    return (
      <div className='space-y-6'>
        <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>All Jobs</h2>
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-2xl'>⚠️</span>
          </div>
          <h3 className='font-roboto font-semibold text-lg mb-2'>Error Loading Jobs</h3>
          <p className='font-inter text-gray-600'>{jobsError instanceof Error ? jobsError.message : 'Failed to load available jobs'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>All Jobs</h2>

      <JobFilters
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        jobTypeFilter={jobTypeFilter}
        setJobTypeFilter={setJobTypeFilter}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={setShowSavedOnly}
        cityFilters={cityFilters}
        handleClearAllFilters={handleClearAllFilters}
        jobsCount={availableJobs.length}
        isJobsLoading={isJobsLoading}
      />

      <JobsGrid availableJobs={availableJobs} isJobsLoading={isJobsLoading} cityFilter={cityFilter} jobTypeFilter={jobTypeFilter} handleClearAllFilters={handleClearAllFilters} />
    </div>
  );
}
