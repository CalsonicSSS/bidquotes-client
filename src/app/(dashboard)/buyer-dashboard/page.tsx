'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BuyerContactInfoModal } from '@/components/BuyerContactInfoModal';
import { useState, useEffect } from 'react';

export default function BuyerDashboard() {
  const [hasContactInfo, setHasContactInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    // For now, simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Redirect if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is actually a buyer (security check)
  const userType = user?.unsafeMetadata?.userType;
  if (userType !== 'buyer') {
    redirect('/contractor-dashboard');
  }

  const handleContactInfoSaved = () => {
    setHasContactInfo(true);
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Wait for auth to load
  if (!isLoaded) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <p>Loading...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Contact Info Modal - only shows if contact info is missing */}
      <BuyerContactInfoModal isOpen={!hasContactInfo} userEmail={user?.emailAddresses[0]?.emailAddress || ''} onSaved={handleContactInfoSaved} />

      {/* Main content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='font-inter text-3xl font-bold text-gray-900 mb-6'>Welcome {user?.firstName}, to your Buyer Dashboard</h2>

          {/* Warning banner if contact info is missing */}
          {!hasContactInfo && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
              <p className='font-inter text-red-800'>⚠️ Please complete your contact information to start posting jobs.</p>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Post New Job Card */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='font-roboto font-semibold text-lg mb-2'>Post New Job</h3>
              <p className='font-inter text-gray-600 mb-4'>Create a job posting and receive bids from contractors</p>
              <Button className='bg-blue-600 text-white px-4 py-2 rounded font-roboto hover:bg-blue-700' disabled={!hasContactInfo}>
                {hasContactInfo ? 'Post a Job' : 'Complete Profile First'}
              </Button>
            </div>

            {/* My Jobs Card */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='font-roboto font-semibold text-lg mb-2'>My Jobs</h3>
              <p className='font-inter text-gray-600 mb-4'>View and manage your active job postings</p>
              <Button variant='outline' className='px-4 py-2 rounded font-roboto'>
                View All Jobs
              </Button>
            </div>
          </div>

          <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
            <p className='font-inter text-gray-700'>🚧 This dashboard is under development. Soon you will be able to post jobs, review bids, and manage your projects!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
