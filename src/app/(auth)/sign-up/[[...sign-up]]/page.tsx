'use client';

import { SignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [userType, setUserType] = useState<'buyer' | 'contractor' | null>(null);

  // first stage: user type selection when user first nav here (userType is null)
  if (!userType) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='max-w-md w-full mx-4'>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle className='font-roboto text-2xl'>Join Bidquotes</CardTitle>
              <p className='font-inter text-gray-600'>Choose how you want to use our platform</p>
            </CardHeader>
            <CardContent className='space-y-6'>
              <Button onClick={() => setUserType('buyer')} className='w-full h-20 font-roboto text-lg bg-blue-600 hover:bg-blue-700 flex flex-col'>
                <div className='py-5 flex flex-col'>
                  <span>I need services (as Buyer)</span>
                  <span className='text-sm font-inter opacity-80'>Post jobs and get bids</span>
                </div>
              </Button>
              <Button
                onClick={() => setUserType('contractor')}
                variant='outline'
                className='w-full h-20 font-roboto text-lg border-green-600 text-green-600 hover:bg-green-50 flex flex-col'
              >
                <div className='py-5 flex flex-col'>
                  <span>I provide services (as Contractor)</span>
                  <span className='text-sm font-inter opacity-80'>Bid on jobs and grow your business</span>
                </div>
              </Button>

              {/* Account Policy Notice */}
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3'>
                <AlertCircle className='h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='text-sm'>
                  <p className='font-inter text-blue-800'>
                    <span className='font-semibold'>Account Policy:</span> Only one account per type. Choose carefully — you can&apos;t switch between buyer and contractor later on
                    this account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className='text-center mt-6'>
            <p className='font-inter text-gray-600 mb-3'>
              Already have an account?{' '}
              <Link href='/sign-in' className='text-blue-600 font-roboto font-semibold'>
                Sign in here
              </Link>
            </p>
            <p className='font-inter text-gray-600'>
              <Link href='/' className='text-blue-600 font-roboto font-semibold'>
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // second stage: actual clerk sign up form when userType is set
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-6'>
          <h2 className='font-roboto text-2xl font-bold'>Sign up as {userType === 'buyer' ? 'a Buyer' : 'a Contractor'}</h2>
          <button onClick={() => setUserType(null)} className='font-inter text-blue-600 hover:underline text-sm mt-2'>
            ← Change account type selection
          </button>
        </div>

        {/* Account Type Confirmation Notice */}
        <div className='bg-yellow-50 border-y sm:border sm:border-yellow-200 border-yellow-200 lg:rounded-lg p-4 mb-6 flex items-start gap-3'>
          <AlertCircle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
          <div className='text-sm'>
            <p className='font-inter text-yellow-800'>
              <span className='font-semibold'>Creating {userType} account:</span> This will be your permanent account type on Bidquotes. You cannot change this later on this
              account.
            </p>
          </div>
        </div>

        <div className='flex justify-center'>
          <SignUp
            // Pass the userType as unsafeMetadata to Clerk
            unsafeMetadata={{
              userType: userType,
            }}
            appearance={{
              elements: {
                footerAction: 'hidden', // Hide default sign-in link
              },
            }}
            forceRedirectUrl='/dashboard'
            signInForceRedirectUrl='/dashboard'
          />
        </div>

        <div className='text-center mt-8'>
          {/* Sign-in link */}
          <div className='text-center mt-3'>
            <p className='font-inter text-gray-600'>
              Already have an account?{' '}
              <Link href='/sign-in' className='text-blue-600 font-roboto font-semibold'>
                Sign in here
              </Link>
            </p>
          </div>

          {/* back to home link */}
          <div className='text-center mt-6'>
            <p className='font-inter text-gray-600'>
              <Link href='/' className='text-blue-600 font-roboto font-semibold'>
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
