'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ContractorDashboard() {
  const { userId, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  // Handle redirects with useEffect instead of redirect() function
  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
      return;
    }

    if (userLoaded && user) {
      const userType = user.unsafeMetadata?.userType;
      if (userType === 'buyer') {
        router.push('/buyer-dashboard');
        return;
      }
    }
  }, [userId, userLoaded, user, router]);

  // Show loading while auth is loading or during redirects
  if (!isLoaded || !userLoaded || !userId) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='font-inter text-3xl font-bold text-gray-900 mb-6'>Welcome to your Contractor Dashboard</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Placeholder cards */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='font-roboto font-semibold text-lg mb-2'>Browse Jobs</h3>
              <p className='font-inter text-gray-600 mb-4'>Find jobs to bid on in your area</p>
              <Button className='bg-green-600 text-white px-4 py-2 rounded font-roboto hover:bg-green-700'>Coming Soon</Button>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='font-roboto font-semibold text-lg mb-2'>My Bids</h3>
              <p className='font-inter text-gray-600 mb-4'>Track your submitted bids and responses</p>
              <Button variant='outline' className='px-4 py-2 rounded font-roboto'>
                Coming Soon
              </Button>
            </div>
          </div>

          <div className='mt-8 p-4 bg-green-50 rounded-lg'>
            <p className='font-inter text-gray-700'>🚧 This dashboard is under development. Soon you&apos;ll be able to browse jobs, submit bids, and manage your projects!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
