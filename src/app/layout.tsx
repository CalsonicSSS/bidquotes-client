import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Header } from '@/components/Header';

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
  title: 'Bidquotes Service',
  description: 'Home services marketplace connecting buyers with contractors',
};

// The root layout will only be rendered once, and its children is only the current navigated route page rendered (all other are not rendered / executed) at a time (very efficient).
// we have checked that any component that initializes context and any components that consumes context as subscriber, all must be client components
// we have also checked that if any child component passed as children prop under the parent component, then:
// 1. Children props don't re-render when parent re-renders
// 2. if children component is SC, then it will continue to be SC (this is very important to realize)
// above two rules will not be the case if child component is directly passed / called under parent through import

// so now we can make some conclusions
// this ClerkProvider should be a client component, because it initializes context
// other SignedIn and SignedOut components must also be client components that consume the context as subscribers
// all the children of ClerkProvider will be rendered continued as SC as default.
// as we have also tested, even if this ClerkProvider re-renders, the children will not re-render, so we can safely use ClerkProvider here as a parent component even as CC

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${roboto.variable} ${inter.variable} antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
