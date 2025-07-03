import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
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
            signUpUrl='/sign-up' // Explicitly set sign-up URL
          />
        </div>

        <div className='text-center mt-8'>
          {/* Sign-in link */}
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
