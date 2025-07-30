'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BuyerContactInfoModal } from '@/components/BuyerContactInfoModal';
import { BuyerSidebar } from '@/components/buyer-dashboard/Sidebar';
import { BuyerMobileHeader } from '@/components/buyer-dashboard/MobileHeader';
import { AllJobsSection } from '@/components/buyer-dashboard/menu-sections/AllJobsSection';
import { getBuyerContactInfo } from '@/lib/apis/buyer-contact-info';
import { getBuyerJobs } from '@/lib/apis/jobs';
import { isContactInfoCompleteChecker } from '@/lib/utils/condition-checkers';
import { ContactInfoSection } from '@/components/buyer-dashboard/menu-sections/ContactInfoSection';

type ActiveSection = 'all-jobs' | 'contact-info';

export default function BuyerDashboard() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>('all-jobs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Client side real time redirection based on user type
  useEffect(() => {
    if (user) {
      const userType = user.unsafeMetadata?.userType;
      if (userType === 'contractor') {
        router.push('/contractor-dashboard');
      }
    }
  }, [userId, user, router]);

  // Query to fetch buyer's contact info
  const {
    data: contactInfo,
    isLoading,
    refetch: refetchContactInfo,
  } = useQuery({
    queryKey: ['buyer-contact-info'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerContactInfo(token);
    },
    enabled: !!userId,
  });

  // Query to fetch buyer's jobs
  const {
    data: allJobs = [],
    isLoading: jobsLoading,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['buyer-jobs'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerJobs(token);
    },
    enabled: !!userId,
  });

  const handleContactInfoSaved = () => {
    refetchContactInfo();
  };

  const handleContactInfoUpdated = () => {
    refetchContactInfo();
  };

  // Check if user can post jobs (contact info complete)
  const canPostJob = isContactInfoCompleteChecker({
    email: contactInfo?.contact_email || '',
    phone: contactInfo?.phone_number || '',
  });

  // Show loading state
  if (!user || isLoading || jobsLoading) {
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
      <BuyerContactInfoModal isOpen={!canPostJob} userEmail={user?.emailAddresses[0]?.emailAddress || ''} onSaved={handleContactInfoSaved} />

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

            {activeSection === 'contact-info' && <ContactInfoSection contactInfo={contactInfo} onContactInfoUpdated={handleContactInfoUpdated} />}
          </div>
        </div>
      </div>
    </div>
  );
}
