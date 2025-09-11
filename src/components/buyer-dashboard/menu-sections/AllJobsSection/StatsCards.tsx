import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatsCardsProps = {
  stats: {
    activeJobsCount: number;
    totalBidsCount: number;
    savedDraftsCount: number;
    closedJobsCount: number;
  };
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6'>
      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Active Jobs</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-blue-600'>{stats.activeJobsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Total Bids</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-blue-600'>{stats.totalBidsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Closed</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-blue-600'>{stats.closedJobsCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Drafts</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-blue-600'>{stats.savedDraftsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
