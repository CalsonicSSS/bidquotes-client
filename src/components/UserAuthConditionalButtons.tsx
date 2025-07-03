import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';

// Conditional Component for signed-out users
function SignedOutButtons() {
  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
      <Link href='/sign-in'>
        <Button className='font-roboto w-full sm:w-auto px-8 py-4 text-lg bg-blue-500 hover:bg-blue-600 text-white'>Post a Job</Button>
      </Link>
      <Link href='/sign-in'>
        <Button variant='outline' className='font-roboto w-full sm:w-auto px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-700 bg-transparent'>
          Find Work
        </Button>
      </Link>
    </div>
  );
}

// Conditional Component for signed-in users (user can potentially be either a buyer or contractor)
// we will return different action buttons UI here based on the different user type
async function SignedInButtons() {
  const user = await currentUser();
  const userType = user?.unsafeMetadata?.userType as string;

  if (userType === 'buyer') {
    return (
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <Link href='/buyer-dashboard'>
          <Button className='font-roboto w-full sm:w-auto px-8 py-4 text-lg bg-blue-500 hover:bg-blue-600 text-white'>Go to Dashboard</Button>
        </Link>
        <Link href='/buyer-dashboard'>
          <Button variant='outline' className='font-roboto w-full sm:w-auto px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-700 bg-transparent'>
            Post New Job
          </Button>
        </Link>
      </div>
    );
  }

  if (userType === 'contractor') {
    return (
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <Link href='/contractor-dashboard'>
          <Button className='font-roboto w-full sm:w-auto px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white'>Go to Dashboard</Button>
        </Link>
        <Link href='/contractor-dashboard'>
          <Button variant='outline' className='font-roboto w-full sm:w-auto px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-700 bg-transparent'>
            Browse Jobs
          </Button>
        </Link>
      </div>
    );
  }

  // Fallback if user type is not set
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <Link href='/sign-up'>
        <Button className='font-roboto w-full sm:w-auto px-8 py-4 text-lg bg-orange-600 hover:bg-orange-700 text-white'>Complete Setup</Button>
      </Link>
    </div>
  );
}

// Main component
export async function UserAuthConditionalButtons() {
  const { userId } = await auth();

  // Check if user is signed in
  if (!userId) {
    return <SignedOutButtons />;
  }

  return <SignedInButtons />;
}
