'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BuyerContactInfoModal } from '@/components/buyer-dashboard/BuyerContactInfoModal';
import { BuyerSidebar } from '@/components/buyer-dashboard/Sidebar';
import { BuyerMobileHeader } from '@/components/buyer-dashboard/MobileHeader';
import { AllJobsSection } from '@/components/buyer-dashboard/menu-sections/AllJobsSection';
import { getBuyerContactInfo } from '@/lib/apis/buyer-contact-info';
import { getBuyerJobs } from '@/lib/apis/buyer-jobs';
import { isContactInfoCompleteChecker } from '@/lib/utils/condition-checkers';
import { ContactInfoSection } from '@/components/buyer-dashboard/menu-sections/ContactInfoSection';

type ActiveSection = 'all-jobs' | 'contact-info';

export default function BuyerDashboard() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>('all-jobs'); // initial active section is 'all-jobs'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // real time redirection based on user type / auth status
  useEffect(() => {
    if (user) {
      const userType = user.unsafeMetadata?.userType;
      if (userType === 'contractor') {
        router.push('/contractor-dashboard');
      }
    }
  }, [userId, user, router]);

  // here, we use two (multiple) useQuery hooks to fetch buyer's contact info and their all jobs.
  // even though it's not always explicitly shown, useQuery relies entirely on the QueryClient that you provide via the QueryClientProvider
  // By default, each useQuery() fetches concurrently in Non-blocking (You don't need to wrap them in a Promise.all() or similar—the QueryClient handles it for you).
  // However, you can enable waterfall for dependent queries by using the `enabled` option.

  // the fn you pass to useQuery() or useMutation() must be a function object itself (not any other type)
  // "A query function can be literally any function (usually fetch api function) that returns a promise” -- tanstack/react-query docs
  // even "return await getBuyerContactInfo(token)" will work since the outer queryFn is already an async function.

  // as long as the queryFn you pass to useQuery() returns a promise, TanStack Query handles awaiting it automatically for the actual data object.
  // The final data you get in the hook is never a promise—it’s the fully resolved JSON object, with all code synchronized internally.

  const { data: buyerContactInfo, isLoading: isContactInfoLoading } = useQuery({
    queryKey: ['buyer-contact-info'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerContactInfo(token);
    },
    enabled: !!userId,
  });

  // Query to fetch buyer's jobs
  const { data: allJobs = [], isLoading: isJobsLoading } = useQuery({
    queryKey: ['buyer-jobs'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerJobs(token);
    },
    enabled: !!userId,
  });

  // Check if user can post jobs (based on contact info complete)
  const canPostJob = isContactInfoCompleteChecker({
    email: buyerContactInfo?.contact_email || '',
    phone: buyerContactInfo?.phone_number || '',
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Show loading state
  if (!user || isJobsLoading || isContactInfoLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Contact Info Modal Popup */}
      <BuyerContactInfoModal isOpen={!canPostJob} userEmail={user?.emailAddresses[0]?.emailAddress || ''} />

      <div className='flex relative'>
        {/* Sidebar Component */}
        <BuyerSidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className='flex-1 min-h-screen'>
          {/* Mobile Header Component */}
          <BuyerMobileHeader activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

          {/* Page Content */}
          <div className='p-4 lg:p-8'>
            {activeSection === 'all-jobs' && <AllJobsSection allJobs={allJobs} canPostJob={canPostJob} />}

            {activeSection === 'contact-info' && <ContactInfoSection contactInfo={buyerContactInfo} />}
          </div>
        </div>
      </div>
    </div>
  );
}
