import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Define multiple components in a single file (server or client).
// Only the ones you export are usable from other files. Unexported components can still be used within the same file (like helpers).
// In the App Router (Next.js 13/14), FILES are Server Components by default unless they start with "use client". So here, every component is a Server Component by default.

// -------------------------------------

// Clerk server components:
// - currentUser: Retrieves the current user as the full user object.
// - auth: Provides authentication-related functionality.

// Clerk client hooosks (for Client Components):
// - useUser: Hook to access the current user and their information.
// - useAuth: Hook to access authentication-related functionality.

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
        {userType === 'buyer' ? 'Home Owner Account' : 'Contractor Account'}
      </span>

      {/* Mobile version - shorter text */}
      <span
        className={`sm:hidden px-2 py-1 rounded-full text-xs font-inter font-medium border ${
          userType === 'buyer' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'
        }`}
      >
        {userType === 'buyer' ? 'Home Owner' : 'Contractor'}
      </span>
    </div>
  );
}

async function ContractorYourCreditsNavLinks() {
  const user = await currentUser();
  const userType = user?.unsafeMetadata?.userType as string;

  // Only show for contractor users
  if (userType !== 'contractor') return null;

  return (
    <Link
      href='/contractor-dashboard?section=your-credits'
      className='font-inter font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-red-400 transition-colors duration-500 hover:opacity-80'
    >
      Your Credits
    </Link>
  );
}

export async function Header() {
  return (
    <header className='sticky top-0 z-50 bg-blue-theme text-white'>
      <div className='container mx-auto px-5 h-16 flex justify-between items-center'>
        {/* Left: Logo and Brand */}
        <Link href='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
          <Image src='/images/logo.jpg' alt='Bidquotes Logo' width={32} height={32} className='w-8 h-auto rounded-md object-contain' />{' '}
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

          {/* Contractor only "your credits" link */}
          <ContractorYourCreditsNavLinks />
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
