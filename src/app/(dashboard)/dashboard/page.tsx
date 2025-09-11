import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardRouter() {
  const { isAuthenticated, userId } = await auth();
  const user = await currentUser();

  // Combined check: if any of these is falsy, treat as not signed in / no valid user
  if (!isAuthenticated || !userId || !user) {
    return redirect('/sign-in');
  }

  // Assuming unsafeMetadata is available on user and has userType
  const userType = user.unsafeMetadata?.userType;

  if (userType === 'buyer') {
    return redirect('/buyer-dashboard');
  } else if (userType === 'contractor') {
    return redirect('/contractor-dashboard');
  } else {
    // user exists but userType not set
    return redirect('/complete-user-type');
  }
}
