import type { Metadata } from 'next';
import { Inter, Roboto } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

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
  title: 'Bidquote Service',
  description: 'Home services marketplace connecting buyers with contractors',
};

// ClerkProvider is the foundation as Loads Clerk's JavaScript SDK on the client side
// Manages authentication state in React context
// Handles token refresh and session management
// Provides auth state to all child components
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${roboto.variable} ${inter.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
