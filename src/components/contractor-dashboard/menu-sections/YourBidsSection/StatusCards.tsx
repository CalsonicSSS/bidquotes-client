import { Card, CardContent } from '@/components/ui/card';

export function StatusCard({ title, count, icon, bgColor }: { title: string; count: number; icon: any; bgColor: string }) {
  return (
    <Card className='border border-gray-200'>
      <CardContent className='p-4 lg:p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='font-inter text-sm text-gray-600 mb-1'>{title}</p>
            <p className='font-roboto text-2xl lg:text-3xl font-bold text-gray-900'>{count}</p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
