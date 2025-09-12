import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const JOB_TYPES = ['Plumbing', 'Painting', 'Landscaping', 'Roofing', 'Indoor', 'Backyard', 'Fencing & Decking', 'Design'] as const;

interface JobFiltersProps {
  cityFilter: string;
  setCityFilter: (value: string) => void;
  jobTypeFilter: string;
  setJobTypeFilter: (value: string) => void;
  cityFilterOptions: string[];
  handleClearAllFilters: () => void;
  jobsCount: number;
}

export function JobFilters({ cityFilter, setCityFilter, jobTypeFilter, setJobTypeFilter, cityFilterOptions, handleClearAllFilters, jobsCount }: JobFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-roboto'>Find Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {/* City Filter */}
          <div className='space-y-2'>
            <label className='font-roboto text-sm font-medium'>City / Area</label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className='font-inter'>
                <SelectValue placeholder='All Cities' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all' className='font-inter'>
                  All Cities
                </SelectItem>
                {cityFilterOptions.map((city) => (
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
              <Button onClick={handleClearAllFilters} className='font-roboto hover:opacity-80'>
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className='text-sm text-gray-600 font-inter'>{`${jobsCount} jobs available`}</div>
      </CardContent>
    </Card>
  );
}
