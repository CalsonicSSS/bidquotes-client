'use client';

import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// this new implementation handles the case where a user might sign in through social auth directly without previous registered account
// When a user clicks "Sign in with Google" but doesn't have an existing account, this happens:
// 1. User clicks "Sign in with Google"
// 2. Google OAuth creates a new Clerk account on the clerk side first
// 3. But the sign-in page doesn't IMMEDIATELY know the user is now created & authenticated
// 4. Sign-in form keeps showing (causing the flash you saw)
// 5. Eventually Clerk's afterSignInUrl redirect happens, but there's a DELAY

// Solution:
// - Listens directly to Clerk's auth state changes via useAuth()
// - As soon as isSignedIn becomes true (right after Google OAuth completes), we immediately redirect
// - No waiting for Clerk's built-in redirect mechanism

export default function SignInPage() {
  // isSignedIn: true when user is created -> authenticated and their session is active.
  // isLoaded: true when "Clerk" client-side next.js hook is ready, so you can meaningfully use isSignedIn, getToken(), etc.
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Redirect if user becomes authenticated (handles social sign-in account creation)
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading if auth is not loaded yet or if user is already signed in
  // this prevents the flash of the sign-in form when user is already authenticated
  // the sign in form will only be shown if user is not signed in and auth hook fully is loaded as true
  if (!isLoaded || isSignedIn) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>{!isLoaded ? 'Loading...' : 'Redirecting to dashboard...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-6'>
          <h2 className='font-roboto text-2xl font-bold'>Welcome back to Bidquote</h2>
          <p className='font-inter text-gray-600 mt-2'>Sign in to your existing account</p>
        </div>

        <div className='flex justify-center'>
          <SignIn
            appearance={{
              elements: {
                footerAction: 'hidden', // Hide default signup link
              },
            }}
            signUpUrl='/sign-up'
            forceRedirectUrl='/dashboard'
            signUpForceRedirectUrl='/dashboard'
          />
        </div>

        <div className='text-center mt-8'>
          {/* Sign-up link */}
          <div className='text-center mt-3'>
            <p className='font-inter text-gray-600'>
              Don't have an account yet?{' '}
              <Link href='/sign-up' className='text-blue-600 font-roboto font-semibold'>
                Sign up here
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
