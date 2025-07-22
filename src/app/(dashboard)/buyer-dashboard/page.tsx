'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BuyerContactInfoModal } from '@/components/BuyerContactInfoModal';
import { BuyerSidebar } from '@/components/buyer-dashboard/BuyerSidebar';
import { BuyerMobileHeader } from '@/components/buyer-dashboard/BuyerMobileHeader';
import { getBuyerContactInfo } from '@/lib/apis/buyer-contact-info';
import { Briefcase, MessageCircle, Plus, Archive, Filter } from 'lucide-react';
import { formatPhoneDisplay } from '@/lib/utils/phone-format';

type ActiveSection = 'all-jobs' | 'contact-info';

export default function BuyerDashboard() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>('all-jobs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Client side real time redirect logic based on user type
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
    refetch,
  } = useQuery({
    queryKey: ['buyer-contact-info'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerContactInfo(token);
    },
    enabled: !!userId,
  });

  const handleContactInfoSaved = () => {
    refetch();
  };

  // Mock stats data
  const stats = {
    activeJobs: 0,
    totalBids: 0,
    confirmedJobs: 0,
    savedDrafts: 0,
  };

  if (!user || isLoading) {
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
      {/* Contact Info Modal */}
      <BuyerContactInfoModal
        isOpen={!contactInfo?.contact_email || !contactInfo?.phone_number}
        userEmail={user?.emailAddresses[0]?.emailAddress || ''}
        onSaved={handleContactInfoSaved}
      />

      <div className='flex relative'>
        {/* Sidebar Component */}
        <BuyerSidebar user={user} activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Main Content Area */}
        <div className='flex-1 min-h-screen'>
          {/* Mobile Header Component */}
          <BuyerMobileHeader activeSection={activeSection} setSidebarOpen={setSidebarOpen} />

          {/* Page Content */}
          <div className='p-4 lg:p-8'>
            {activeSection === 'all-jobs' && (
              <div className='space-y-6'>
                {/* Stats Cards */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6'>
                  <Card>
                    <CardHeader className='pb-2 lg:pb-3'>
                      <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Active Jobs</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='text-xl lg:text-3xl font-inter font-bold text-blue-600'>{stats.activeJobs}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='pb-2 lg:pb-3'>
                      <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Total Bids</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='text-xl lg:text-3xl font-inter font-bold text-green-600'>{stats.totalBids}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='pb-2 lg:pb-3'>
                      <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Confirmed</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='text-xl lg:text-3xl font-inter font-bold text-purple-600'>{stats.confirmedJobs}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className='pb-2 lg:pb-3'>
                      <CardTitle className='text-xs lg:text-sm font-roboto text-gray-600 uppercase tracking-wide'>Drafts</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                      <div className='text-xl lg:text-3xl font-inter font-bold text-yellow-600'>{stats.savedDrafts}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4'>
                  <Button variant='outline' className='font-roboto flex items-center justify-center gap-2 w-full lg:w-auto'>
                    <Archive className='h-4 w-4' />
                    Saved Drafts
                  </Button>

                  <div className='flex flex-col lg:flex-row gap-3'>
                    <Button variant='outline' className='font-roboto flex items-center justify-center gap-2 w-full lg:w-auto'>
                      <Filter className='h-4 w-4' />
                      Filter Jobs
                    </Button>

                    <Button className='font-roboto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full lg:w-auto' disabled={!contactInfo}>
                      <Plus className='h-4 w-4' />
                      <span className='hidden lg:inline'>{contactInfo ? 'Post New Job' : 'Complete Profile First'}</span>
                      <span className='lg:hidden'>{contactInfo ? 'Post Job' : 'Complete Profile'}</span>
                    </Button>
                  </div>
                </div>

                {/* Jobs List Area */}
                <Card>
                  <CardHeader>
                    <CardTitle className='font-roboto'>Your Posted Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-center py-8 lg:py-12'>
                      <Briefcase className='h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mx-auto mb-4' />
                      <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 mb-2'>No jobs posted yet</h3>
                      <p className='font-inter text-sm lg:text-base text-gray-600 mb-4 px-4'>Get started by posting your first job to receive bids from contractors.</p>
                      <Button className='font-roboto bg-blue-600 hover:bg-blue-700 w-full lg:w-auto' disabled={!contactInfo}>
                        {contactInfo ? 'Post Your First Job' : 'Complete Profile First'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Warning Banner */}
                {!contactInfo && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='font-inter text-sm lg:text-base text-red-800'>⚠️ Please complete your contact information to start posting jobs.</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'contact-info' && (
              <div className='space-y-6'>
                <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Contact Information</h2>

                <Card className='lg:max-w-2xl'>
                  <CardHeader>
                    <CardTitle className='font-roboto'>Your Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contactInfo ? (
                      <div className='space-y-4'>
                        <div>
                          <label className='font-roboto text-sm font-semibold text-gray-700'>Contact Email</label>
                          <p className='font-inter text-gray-900 mt-1 break-all'>{contactInfo.contact_email}</p>
                        </div>
                        <div>
                          <label className='font-roboto text-sm font-semibold text-gray-700'>Phone Number</label>
                          <p className='font-inter text-gray-900 mt-1'>{formatPhoneDisplay(contactInfo.phone_number)}</p>
                        </div>
                        <Button className='font-roboto bg-blue-600 hover:bg-blue-700 w-full lg:w-auto'>Update Contact Info</Button>
                      </div>
                    ) : (
                      <div className='text-center py-6 lg:py-8'>
                        <MessageCircle className='h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mx-auto mb-4' />
                        <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 mb-2'>Contact information required</h3>
                        <p className='font-inter text-sm lg:text-base text-gray-600'>Please provide your contact details to start using the platform.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
