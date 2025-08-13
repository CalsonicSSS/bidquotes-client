import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Briefcase, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { JobCardResponse } from '@/lib/apis/buyer-jobs';

type ActiveFilter = 'all' | 'draft' | 'open' | 'full_bid' | 'waiting_confirmation' | 'confirmed';

type JobsListProps = {
  filteredJobs: JobCardResponse[];
  activeFilter: ActiveFilter;
  canPostJob: boolean;
};

export function JobsList({ filteredJobs, activeFilter, canPostJob }: JobsListProps) {
  const router = useRouter();

  if (filteredJobs.length === 0) {
    if (activeFilter === 'all') {
      return (
        <div className='text-center py-8 lg:py-12'>
          <Briefcase className='h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mx-auto mb-4' />
          <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 mb-2'>No jobs posted yet</h3>
          <p className='font-inter text-sm lg:text-base text-gray-600 mb-4 px-4'>Get started by posting your first job to receive bids from contractors.</p>
          <Link href='/buyer-dashboard/post-job'>
            <Button className='font-roboto bg-blue-600 hover:bg-blue-700 w-full lg:w-auto' disabled={!canPostJob}>
              {canPostJob ? 'Post Your First Job' : 'Complete Profile First'}
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className='text-center py-8'>
        <Briefcase className='h-12 w-12 text-gray-300 mx-auto mb-4' />
        <h3 className='font-roboto text-lg font-semibold text-gray-900 mb-2'>No {activeFilter === 'draft' ? 'drafts' : `${activeFilter.replace('_', ' ')} jobs`}</h3>
        <p className='font-inter text-gray-600'>
          {activeFilter === 'draft' ? 'Your saved drafts will appear here.' : `You don't have any ${activeFilter.replace('_', ' ')} jobs yet.`}
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {filteredJobs.map((job) => (
        <div
          key={job.id}
          className='bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer overflow-hidden h-32'
          onClick={() => {
            // important differentiation between draft and non-draft job type
            if (job.status === 'draft') {
              router.push(`/buyer-dashboard/post-job?draft=${job.id}`);
            } else {
              router.push(`/buyer-dashboard/jobs/${job.id}`);
            }
          }}
        >
          <div className='flex h-full relative'>
            {/* Image Section - Left side, full height, square */}
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
            <div className='flex-1 p-4 flex flex-col justify-between relative'>
              {/* Status badge - Top right */}
              <div className='absolute top-2 right-2'>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-bold font-roboto ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : job.status === 'draft'
                      ? 'bg-gray-100 text-gray-800'
                      : job.status === 'full_bid'
                      ? 'bg-blue-100 text-blue-800'
                      : job.status === 'confirmed'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {job.status === 'full_bid'
                    ? 'Full Bids'
                    : job.status === 'waiting_confirmation'
                    ? 'Waiting Confirmation'
                    : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>

              {/* Title and job type */}
              <div className='pr-16'>
                {' '}
                {/* Add padding to avoid overlap with status badge */}
                <h3 className='font-roboto font-semibold text-gray-900 text-sm line-clamp-2 leading-tight'>{job.title || 'Untitled Job'}</h3>
                <p className='font-inter text-xs text-gray-600 mt-1'>{job.job_type || 'No job type selected'}</p>
              </div>

              {/* Bottom row - Date and bids */}
              <div className='flex items-center justify-between text-xs lg:text-sm font-medium text-gray-500 font-inter'>
                <span>
                  {job.status === 'draft' ? 'Saved' : 'Posted'} {new Date(job.created_at).toLocaleDateString()}
                </span>

                {job.status !== 'draft' && (
                  <span>
                    {job.bid_count} {job.bid_count === 1 ? 'bid' : 'bids'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
