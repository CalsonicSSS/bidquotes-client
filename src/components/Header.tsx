import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
