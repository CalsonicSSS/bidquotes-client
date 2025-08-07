import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const JOB_TYPES = ['Plumbing', 'Painting', 'Landscaping', 'Roofing', 'Indoor', 'Backyard', 'Fencing & Decking', 'Design'] as const;

interface JobFiltersProps {
  cityFilter: string;
  setCityFilter: (value: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (value: string) => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (value: boolean) => void;
  cityFilters: string[];
  handleClearAllFilters: () => void;
  jobsCount: number;
  isJobsLoading: boolean;
}

export function JobFilters({
  cityFilter,
  setCityFilter,
  jobTypeFilter,
  setJobTypeFilter,
  showSavedOnly,
  setShowSavedOnly,
  cityFilters,
  handleClearAllFilters,
  jobsCount,
  isJobsLoading,
}: JobFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-roboto'>Find Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {/* City Filter */}
          <div className='space-y-2'>
            <label className='font-roboto text-sm font-medium'>City</label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className='font-inter'>
                <SelectValue placeholder='All Cities' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all' className='font-inter'>
                  All Cities
                </SelectItem>
                {cityFilters.map((city) => (
                  <SelectItem key={city} value={city} className='font-inter'>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Type Filter */}
          <div className='space-y-2'>
            <label className='font-roboto text-sm font-medium'>Job Type</label>
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className='font-inter'>
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all' className='font-inter'>
                  All Types
                </SelectItem>
                {JOB_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className='font-inter'>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className='space-y-2'>
            <label className='font-roboto text-sm font-medium'>Actions</label>
            <div className='flex gap-2'>
              <Button
                variant={showSavedOnly ? 'default' : 'outline'}
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className='font-roboto'
                disabled // TODO: Implement saved jobs functionality
              >
                Saved Jobs
              </Button>
              <Button variant='ghost' onClick={handleClearAllFilters} className='font-roboto text-gray-600'>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className='text-sm text-gray-600 font-inter'>{isJobsLoading ? 'Loading jobs...' : `${jobsCount} jobs available`}</div>
      </CardContent>
    </Card>
  );
}
