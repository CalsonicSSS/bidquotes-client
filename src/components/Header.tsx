import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

async function UserTypeIndicator() {
  const user = await currentUser();
  const userType = user?.unsafeMetadata?.userType as string;

  if (!userType) return null;

  return (
    <div className='flex items-center gap-2'>
      {/* Desktop version */}
      <span
        className={`hidden sm:inline-flex px-2 py-1 rounded-full text-xs font-inter font-medium border ${
          userType === 'buyer' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'
        }`}
      >
        {userType === 'buyer' ? 'Buyer Account' : 'Contractor Account'}
      </span>

      {/* Mobile version - shorter text */}
      <span
        className={`sm:hidden px-2 py-1 rounded-full text-xs font-inter font-medium border ${
          userType === 'buyer' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'
        }`}
      >
        {userType === 'buyer' ? 'Buyer' : 'Contractor'}
      </span>
    </div>
  );
}

async function ContractorNavLinks() {
  const user = await currentUser();
  const userType = user?.unsafeMetadata?.userType as string;

  // Only show for contractor users
  if (userType !== 'contractor') return null;

  return (
    <Link
      href='/contractor-dashboard?section=your-passes'
      className='font-inter font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-red-400 transition-colors duration-500 hover:opacity-80'
    >
      Your Passes
    </Link>
  );
}

export async function Header() {
  return (
    <header className='sticky top-0 z-50 bg-blue-theme text-white'>
      <div className='container mx-auto px-5 h-16 flex justify-between items-center'>
        {/* Left: Logo and Brand */}
        <Link href='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
          <Image src='/images/logo.jpg' alt='Bidquotes Logo' width={32} height={32} className='rounded-md object-contain' />
          <span className='font-roboto text-2xl font-bold text-white'>Bidquotes</span>
        </Link>

        {/* Center: Navigation Links (Desktop Only) */}
        <nav className='hidden md:flex items-center gap-8'>
          {/* General navigation links */}
          <Link href='/how-it-works' className='font-inter text-white hover:text-blue-200 transition-colors font-medium'>
            How It Works
          </Link>
          <Link href='/about' className='font-inter text-white hover:text-blue-200 transition-colors font-medium'>
            About Us
          </Link>
          <Link href='/terms' className='font-inter text-white hover:text-blue-200 transition-colors font-medium'>
            Terms
          </Link>
          <Link href='/privacy' className='font-inter text-white hover:text-blue-200 transition-colors font-medium'>
            Privacy
          </Link>

          {/* Contractor-specific link */}
          <ContractorNavLinks />
        </nav>

        {/* Right: Auth Elements */}
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
            <UserTypeIndicator />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
// 'use client';

// import { UserButton, useAuth } from '@clerk/nextjs';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { useEffect, useState } from 'react';

// // The original header were implemented with clerk built-in wrapper for SignIn and SignUp components.
// // However, wrapper components can have sync delays, they might not immediately update when auth state changes, especially during social sign-in flows + header is always present.
// // This causes the "Login/Sign Up still showing" problem.

// // So under this app design, we convert the header to client-side component that directly uses Clerk's hooks to listen + update on the auth state DIRECTLY REAL TIME.

// export function Header() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const [mounted, setMounted] = useState(false);
//   const [authState, setAuthState] = useState<'loading' | 'signed-in' | 'signed-out'>('loading');

//   // Ensure component is mounted before rendering auth-dependent content
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Directly Update auth state when Clerk auth state changes
//   // useAuth():  actively and dynamically track the user's authentication state
//   useEffect(() => {
//     if (!isLoaded) {
//       setAuthState('loading');
//     } else if (isSignedIn) {
//       setAuthState('signed-in');
//     } else {
//       setAuthState('signed-out');
//     }
//   }, [isLoaded, isSignedIn]);

//   // Show loading state until mounted and auth is determined
//   if (!mounted || authState === 'loading') {
//     return (
//       <header className='sticky top-0 z-50 bg-blue-theme text-white'>
//         <div className='container mx-auto px-5 h-16 flex justify-between items-center'>
//           <Link href='/' className='font-roboto text-2xl font-bold hover:text-blue-200 transition-colors'>
//             Bidquotes
//           </Link>
//           <div className='flex items-center gap-4'>
//             {/* Loading placeholder */}
//             <div className='w-20 h-8 bg-blue-400 rounded animate-pulse'></div>
//             <div className='w-16 h-8 bg-blue-400 rounded animate-pulse'></div>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className='sticky top-0 z-50 bg-blue-theme text-white'>
//       <div className='container mx-auto px-5 h-16 flex justify-between items-center'>
//         <Link href='/' className='font-roboto text-2xl font-bold hover:text-blue-200 transition-colors'>
//           Bidquotes
//         </Link>
//         <div className='flex items-center gap-4'>
//           {authState === 'signed-out' ? (
//             // User is not signed in
//             <>
//               <Link href='/sign-in'>
//                 <Button variant='ghost' className='font-roboto text-white hover:bg-blue-300'>
//                   Login
//                 </Button>
//               </Link>
//               <Link href='/sign-up'>
//                 <Button className='font-roboto bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors'>Sign Up</Button>
//               </Link>
//             </>
//           ) : (
//             // User is signed in
//             <UserButton
//               appearance={{
//                 elements: {
//                   avatarBox: 'w-8 h-8',
//                 },
//               }}
//             />
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
