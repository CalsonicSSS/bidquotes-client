import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// The SignedIn and SignedOut components are entirely managed by Clerk
// components work dynamically because they: Subscribe to Authentication State Changes
// each of them leverage user state to determine the user's auth status in real-time and decide to either render null or their children components
// Any children components wrapped by a <SignedIn> component will be rendered only if there's a User with an active Session signed in your application.
// These components are React Context consumers that automatically re-render when the authentication state changes
// They use Clerk's internal useAuth() hook under the hood to access the CURRENT authentication state

// How it works:
// When a user signs in/out, Clerk updates the authentication state in the React Context
// SignedIn/SignedOut component consumes React Context provided by ClerkProvider -> Subscribe to authentication state changes
// Automatically re-render when auth state changes
// They are essentially client-side components that use hooks like useAuth() internally

export function Header() {
  return (
    <header className='sticky top-0 z-50 bg-blue-theme text-white'>
      <div className='container mx-auto px-5 h-16 flex justify-between items-center'>
        <Link href='/' className='font-roboto text-2xl font-bold hover:text-blue-200 transition-colors'>
          Bidquotes
        </Link>
        <div className='flex items-center gap-4'>
          <SignedOut>
            <Link href='/sign-in'>
              <Button variant='ghost' className='font-roboto text-white hover:bg-blue-300'>
                Login
              </Button>
            </Link>
            <Link href='/sign-up'>
              <Button className='font-roboto bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors'>Sign Up</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
