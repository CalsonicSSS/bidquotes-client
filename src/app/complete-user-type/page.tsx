'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function CompleteUserTypeSelectionPage() {
  const [userType, setUserType] = useState<'buyer' | 'contractor' | null>(null);

  const { user } = useUser();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCompleteProfile = async () => {
    if (!userType || !user) return;

    setIsUpdating(true);

    try {
      // Update user metadata with selected type
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          userType: userType,
        },
      });

      // Redirect to appropriate dashboard
      if (userType === 'buyer') {
        router.push('/buyer-dashboard');
      } else {
        router.push('/contractor-dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsUpdating(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <div className='max-w-md w-full mx-4 '>
        {/* notifcation you are sign in a new acount without sign up first */}
        <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 mb-5'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
          <div className='text-sm'>
            <p className='font-inter text-yellow-800'>You are signed in to a new account without signing up first. Please complete this user type selection.</p>
          </div>
        </div>
        {/* Account Policy Notice */}
        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 mb-5'>
          <AlertCircle className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
          <div className='text-sm'>
            <p className='font-inter text-blue-800'>
              <span className='font-semibold'>Important:</span> This selection will set your permanent account type. You cannot change between Home Owner and Contractor roles later
              on this account.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='font-roboto text-2xl'>Complete Your Profile</CardTitle>
            <p className='font-inter text-gray-600'>Hi {user?.firstName}! Please tell us how you plan to use Bidquotes</p>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Button
              onClick={() => setUserType('buyer')}
              variant={userType === 'buyer' ? 'default' : 'outline'}
              className={`w-full h-16 font-roboto text-lg flex flex-col ${
                userType === 'buyer' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <span>I need services (Home Owner)</span>
              <span className='text-sm font-inter opacity-80'>Post jobs and get bids</span>
            </Button>

            <Button
              onClick={() => setUserType('contractor')}
              variant={userType === 'contractor' ? 'default' : 'outline'}
              className={`w-full h-16 font-roboto text-lg flex flex-col ${
                userType === 'contractor' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-600 text-green-600 hover:bg-green-50'
              }`}
            >
              <span>I provide services (Contractor)</span>
              <span className='text-sm font-inter opacity-80'>Bid on jobs and grow your business</span>
            </Button>

            <Button onClick={handleCompleteProfile} disabled={!userType || isUpdating} className='w-full mt-6 font-roboto'>
              {isUpdating ? 'Setting up your account...' : 'Continue to Dashboard'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
