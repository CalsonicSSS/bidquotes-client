import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/buyer-dashboard(.*)', '/contractor-dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url).toString();
    await auth.protect({
      unauthenticatedUrl: signInUrl,
      unauthorizedUrl: signInUrl,
    });
  }
});

// This tells Next.js which routes middleware should run on.
export const config = {
  matcher: [
    // '/dashboard(.*)',
    // '/buyer-dashboard(.*)',
    // '/contractor-dashboard(.*)',

    // Excludes Next.js internals (/_next/...) and static assets (.png, .css, .js, etc.). Otherwise, every other route runs through middleware.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
