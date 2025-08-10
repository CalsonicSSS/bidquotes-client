import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export type ActiveFilter = 'all' | 'draft' | 'pending' | 'selected' | 'confirmed' | 'declined';

export function Actions({
  activeFilter,
  setActiveFilter,
  filterOptions,
  onBrowseJobs,
}: {
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
  filterOptions: Array<{ value: string; label: string; count: number }>;
  onBrowseJobs: () => void;
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
      {/* Left side - Filter dropdown */}
      <div className='flex-1 max-w-sm'>
        <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as ActiveFilter)}>
          <SelectTrigger className='w-full font-roboto'>
            <SelectValue placeholder='Filter bids...' />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className='font-roboto'>
                {option.label} ({option.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right side - Browse Jobs button */}
      <div className='flex-shrink-0'>
        <Button onClick={onBrowseJobs} className='font-roboto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto'>
          <Plus className='h-4 w-4' />
          <span className='hidden lg:inline'>Browse Jobs</span>
          <span className='lg:hidden'>Browse</span>
        </Button>
      </div>
    </div>
  );
}
