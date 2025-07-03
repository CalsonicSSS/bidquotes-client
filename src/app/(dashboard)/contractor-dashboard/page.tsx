import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ContractorDashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is actually a contractor (security check)
  const userType = user?.unsafeMetadata?.userType;
  if (userType !== 'contractor') {
    redirect('/buyer-dashboard');
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with home navigation */}
      <header className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-4 h-16 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <Link href='/' className='font-roboto text-green-600 hover:text-green-800 text-sm'>
              ← Back to Home
            </Link>
            <h1 className='font-roboto text-xl font-bold'>Contractor Dashboard</h1>
          </div>
          <div className='font-inter text-gray-600'>Welcome, {user?.firstName}!</div>
        </div>
      </header>

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
