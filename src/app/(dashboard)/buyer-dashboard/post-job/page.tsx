import MainJobForm from '@/components/buyer-dashboard/forms/MainJobForm';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center text-gray-600'>Loading post job form...</div>}>
      <MainJobForm />
    </Suspense>
  );
}
