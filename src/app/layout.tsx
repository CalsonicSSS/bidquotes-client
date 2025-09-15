import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/providers/QueryProvider';
import { StripeProvider } from '@/providers/StripeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Find Home Contractors in Canada | Get Multiple Bids | Bidquotes',
  description:
    'Connect with verified contractors for home maintenance, renovations, and repairs. Post your job, get competitive bids from our contractor, choose the best contractor. Serving all of Canada.',
  verification: {
    google: 'NKbHHIjFv8cWImJmmUv9jl1_91oLXK9aviqGdXOsDMg',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// The root layout will only be rendered once, and its child is the current navigated route page rendered (all others are not rendered / executed -> very efficient).
// we have checked that any component that need to initialize react context and any components that consumes context as subscriber, all must be client components
// we have also checked that if any lower child component passed as "children prop" under the higher parent component, then:
// 1. Children components don't auto re-render when parent re-renders
// 2. if children component is SC, then it will continue to be SC if parent is CC (this is very important to realize)
// we have fully fully tested BOTH of these cases !!!!
// above two rules will not be the case if child component is directly passed / called under parent through import

// what we have tested:
// - a child login comopnent (under home page component) that consumes context for user login state update (this must be client component)
// - this will trigger the top level AuthProvider component (must be client component under root layout) to re-render
// - only this login component, AuthProvider and componets inside AuthProvider will re-render
// what DO NOT re-render:
//    - all other server components and other page route server component
//    - all other client components that are not directly imported under the AuthProvider component nor they are the context subscribers
// all server component remains the same.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl='/' signInUrl='/sign-in' signUpUrl='/sign-up'>
      <html lang='en'>
        <body className={`${roboto.variable} ${inter.variable} antialiased`} cz-shortcut-listen='true'>
          <QueryProvider>
            <StripeProvider>{children}</StripeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
