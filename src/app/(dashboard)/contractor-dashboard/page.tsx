'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContractorSidebar } from '@/components/contractor-dashboard/Sidebar';
import { ContractorMobileHeader } from '@/components/contractor-dashboard/MobileHeader';
import { ProfileSection } from '@/components/contractor-dashboard/menu-sections/ProfileSection';
import { AllJobsSection } from '@/components/contractor-dashboard/menu-sections/AllJobsSection';
import { YourCreditsSection } from '@/components/contractor-dashboard/menu-sections/YourPassesSection';
import { checkContractorProfileCompletion } from '@/lib/apis/contractor-profile';
import { YourBidsSection } from '@/components/contractor-dashboard/menu-sections/YourBidsSection';
import { Suspense } from 'react';
import { ContractorProfileCompletionModal } from '@/components/contractor-dashboard/ContractorProfileCompletionModal';

export default function ContractorDashboard() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center text-gray-600'>Loading contractor dashboard...</div>}>
      <MainContractorDashboard />
    </Suspense>
  );
}

export type ActiveSection = 'all-jobs' | 'your-bids' | 'profile' | 'your-credits';

function MainContractorDashboard() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for "section" parameter in URL
  const sectionParam = searchParams.get('section') as ActiveSection;
  const [activeSection, setActiveSection] = useState<ActiveSection>('all-jobs'); // initial active section is 'all-jobs'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Upon onMount this page, we will first fetch contractor profile completion query
  const { data: isProfileComplete, isLoading: isProfileCompleteLoading } = useQuery({
    queryKey: ['contractor-profile-completion'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return checkContractorProfileCompletion(token);
    },
    enabled: !!userId && !!getToken() && !!user,
  });

  // Auth redirections based on user type
  useEffect(() => {
    if (user) {
      const userType = user.unsafeMetadata?.userType;
      if (userType === 'buyer') {
        router.push('/buyer-dashboard');
      }
    }
  }, [userId, user, router]);

  // Update active section when URL changes with search params on certain sections
  useEffect(() => {
    if (sectionParam && ['all-jobs', 'your-bids', 'profile', 'your-credits'].includes(sectionParam)) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Show loading state
  if (!user || isProfileCompleteLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='font-inter text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {isProfileComplete !== undefined ? <ContractorProfileCompletionModal isOpen={!isProfileComplete} userEmail={user?.emailAddresses[0]?.emailAddress || ''} /> : null}

      <div className='flex relative'>
        <ContractorSidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className='flex-1 min-h-screen'>
          <ContractorMobileHeader activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

          {/* main section area and content */}
          <div className='p-4 lg:p-8'>
            {activeSection === 'all-jobs' && <AllJobsSection />}
            {activeSection === 'your-bids' && <YourBidsSection setActiveSection={setActiveSection} />}
            {activeSection === 'profile' && <ProfileSection setActiveSection={setActiveSection} />}
            {activeSection === 'your-credits' && <YourCreditsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
