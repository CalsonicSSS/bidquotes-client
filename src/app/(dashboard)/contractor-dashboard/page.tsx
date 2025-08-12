'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContractorProfileModal } from '@/components/contractor-dashboard/menu-sections/ProfileSection/ContractorProfileModal';
import { ContractorSidebar } from '@/components/contractor-dashboard/Sidebar';
import { ContractorMobileHeader } from '@/components/contractor-dashboard/MobileHeader';
import { ProfileSection } from '@/components/contractor-dashboard/menu-sections/ProfileSection';
import { AllJobsSection } from '@/components/contractor-dashboard/menu-sections/AllJobsSection';
import { YourPassesSection } from '@/components/contractor-dashboard/menu-sections/YourPassesSection';
import { checkContractorProfileCompletion } from '@/lib/apis/contractor-profile';
import { YourBidsSection } from '@/components/contractor-dashboard/menu-sections/YourBidsSection';
import { Suspense } from 'react';

export default function ContractorDashboard() {
  return (
    <Suspense fallback={<div className='min-h-screen flex items-center justify-center text-gray-600'>Loading contractor dashboard...</div>}>
      <MainContractorDashboard />
    </Suspense>
  );
}

type ActiveSection = 'all-jobs' | 'your-bids' | 'profile' | 'your-passes';

function MainContractorDashboard() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for section parameter in URL
  const sectionParam = searchParams.get('section') as ActiveSection;
  const [activeSection, setActiveSection] = useState<ActiveSection>(
    sectionParam && ['all-jobs', 'your-bids', 'profile', 'your-passes'].includes(sectionParam) ? sectionParam : 'all-jobs'
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth redirections based on user type
  useEffect(() => {
    if (user) {
      const userType = user.unsafeMetadata?.userType;
      if (userType === 'buyer') {
        router.push('/buyer-dashboard');
      }
    }
  }, [userId, user, router]);

  // Update active section when URL changes
  useEffect(() => {
    if (sectionParam && ['all-jobs', 'your-bids', 'profile', 'your-passes'].includes(sectionParam)) {
      setActiveSection(sectionParam);
    }
  }, [sectionParam]);

  // Check contractor profile completion
  const { data: isProfileComplete = false, isLoading: isProfileLoading } = useQuery({
    queryKey: ['contractor-profile-completion'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return checkContractorProfileCompletion(token);
    },
    enabled: !!userId && !!getToken() && !!user,
  });

  // Show loading state
  if (!user || isProfileLoading) {
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
      <ContractorProfileModal isOpen={!isProfileComplete} />

      <div className='flex relative'>
        <ContractorSidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className='flex-1 min-h-screen'>
          <ContractorMobileHeader activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

          <div className='p-4 lg:p-8'>
            {activeSection === 'all-jobs' && <AllJobsSection />}
            {activeSection === 'your-bids' && <YourBidsSection setActiveSection={setActiveSection} />}
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'your-passes' && <YourPassesSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
