import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function BuyerDashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is actually a buyer (security check)
  const userType = user?.unsafeMetadata?.userType;
  if (userType !== 'buyer') {
    redirect('/contractor-dashboard');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='font-inter text-3xl font-bold text-gray-900 mb-6'>Welcome to your Buyer Dashboard</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Placeholder cards */}
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='font-roboto font-semibold text-lg mb-2'>Post New Job</h3>
              <p className='font-inter text-gray-600 mb-4'>Create a job posting and receive bids from contractors</p>
              <Button className='bg-blue-600 text-white px-4 py-2 rounded font-roboto hover:bg-blue-700'>Coming Soon</Button>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='font-roboto font-semibold text-lg mb-2'>My Jobs</h3>
              <p className='font-inter text-gray-600 mb-4'>View and manage your active job postings</p>
              <Button variant='outline' className='px-4 py-2 rounded font-roboto'>
                Coming Soon
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
