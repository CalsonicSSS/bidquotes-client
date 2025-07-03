import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardRouter() {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Get user type from metadata
  const userType = user?.unsafeMetadata?.userType;

  if (userType === 'buyer') {
    redirect('/buyer-dashboard');
  } else if (userType === 'contractor') {
    redirect('/contractor-dashboard');
  } else {
    // User exists but doesn't have userType set
    // This happens when someone signs first directly, but never went through our signup flow first to identify their user type
    // Redirect them to the complete profile page to set their user type
    redirect('/complete-profile');
  }
}
