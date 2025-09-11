import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

type ActiveFilter = 'all' | 'open' | 'closed' | 'draft';

type ActionsProps = {
  activeJobFilter: ActiveFilter;
  setActiveJobFilter: (filter: ActiveFilter) => void;
  jobFilterOptions: Array<{
    value: string;
    label: string;
    count: number;
  }>;
  canPostJob: boolean;
};

export function Actions({ activeJobFilter, setActiveJobFilter, jobFilterOptions, canPostJob }: ActionsProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
      {/* Left side - Job Filter Option Dropdown */}
      <div className='flex-1 max-w-sm'>
        <Select value={activeJobFilter} onValueChange={(value) => setActiveJobFilter(value as ActiveFilter)}>
          <SelectTrigger className='w-full font-roboto'>
            <SelectValue placeholder='Filter jobs...' />
          </SelectTrigger>
          <SelectContent>
            {jobFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className='font-roboto'>
                {option.label} ({option.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right side - Post Job button */}
      <div className='flex-shrink-0'>
        <Link href='/buyer-dashboard/post-job'>
          <Button className='font-roboto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto' disabled={!canPostJob}>
            <Plus className='h-4 w-4' />
            <span className='hidden lg:inline'>{canPostJob ? 'Post New Job' : 'Complete Profile First'}</span>
            <span className='lg:hidden'>{canPostJob ? 'Post Job' : 'Complete Profile'}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
