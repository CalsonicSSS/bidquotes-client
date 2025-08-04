import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type StatsCardsProps = {
  stats: {
    activeJobs: number;
    totalBids: number;
    confirmedJobs: number;
    savedDrafts: number;
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
          <div className='text-xl lg:text-3xl font-inter font-bold text-blue-600'>{stats.activeJobs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Total Bids</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-green-600'>{stats.totalBids}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Confirmed</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-purple-600'>{stats.confirmedJobs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2 lg:pb-3'>
          <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Drafts</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='text-xl lg:text-3xl font-inter font-bold text-yellow-600'>{stats.savedDrafts}</div>
        </CardContent>
      </Card>
    </div>
  );
}
