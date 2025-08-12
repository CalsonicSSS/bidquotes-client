'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRouter() {
  const { userId, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }

    if (userLoaded && user && isLoaded && userId) {
      const userType = user.unsafeMetadata?.userType;

      if (userType === 'buyer') {
        router.push('/buyer-dashboard');
      } else if (userType === 'contractor') {
        router.push('/contractor-dashboard');
      } else {
        // User exists but doesn't have userType set
        router.push('/complete-user-type');
      }
    }
  }, [isLoaded, userId, userLoaded, user, router]);

  return <></>;
}
