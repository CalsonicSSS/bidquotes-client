import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, ImageIcon, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  job_type: string;
  city: string;
  created_at: string;
  bid_count: number;
  thumbnail_image?: string;
}

interface JobsGridProps {
  availableJobs: Job[];
  isJobsLoading: boolean;
  cityFilter: string;
  jobTypeFilter: string;
  handleClearAllFilters: () => void;
}

export function JobsGrid({ availableJobs, isJobsLoading, cityFilter, jobTypeFilter, handleClearAllFilters }: JobsGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-roboto'>Available Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        {isJobsLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
              <p className='font-inter text-gray-600'>Loading available jobs...</p>
            </div>
          </div>
        ) : availableJobs.length === 0 ? (
          <div className='text-center py-12'>
            <Briefcase className='h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 mb-2'>No jobs available</h3>
            <p className='font-inter text-sm lg:text-base text-gray-600 mb-4'>
              {cityFilter !== 'all' || jobTypeFilter !== 'all' ? 'Try adjusting your filters to see more jobs.' : 'Check back later for new job opportunities.'}
            </p>
            {(cityFilter !== 'all' || jobTypeFilter !== 'all') && (
              <Button onClick={handleClearAllFilters} variant='outline' className='font-roboto'>
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {availableJobs.map((job) => (
              <Link key={job.id} href={`/contractor-dashboard/jobs/${job.id}`} className='block'>
                <div className='bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer overflow-hidden h-40'>
                  <div className='flex h-full'>
                    {/* Image Section - Left side */}
                    <div className='w-24 lg:w-32 h-full bg-gray-100 flex-shrink-0 relative'>
                      {job.thumbnail_image ? (
                        <Image src={job.thumbnail_image} alt='Job thumbnail' fill className='object-cover' quality={100} />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                          <ImageIcon className='h-8 w-8 text-gray-400' />
                        </div>
                      )}
                    </div>

                    {/* Content Section - Right side */}
                    <div className='flex-1 p-3 flex flex-col justify-between'>
                      {/* Header - Title and Job Type */}
                      <div>
                        <h3 className='font-roboto font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-1'>{job.title || 'Untitled Job'}</h3>
                        <p className='font-inter text-xs text-gray-600 mb-2'>{job.job_type}</p>
                      </div>

                      {/* Middle - Location */}
                      <div className='flex items-center gap-1 mb-2'>
                        <MapPin className='h-3 w-3 text-gray-500' />
                        <span className='font-inter text-xs text-gray-600 truncate'>{job.city}</span>
                      </div>

                      {/* Footer - Date and Bids */}
                      <div className='flex items-center justify-between text-xs font-inter text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold'>{job.bid_count}/5 bids</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
