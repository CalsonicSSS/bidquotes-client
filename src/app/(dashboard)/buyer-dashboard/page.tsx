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
import { Briefcase, MessageCircle, Plus } from 'lucide-react';
import { formatPhoneDisplay } from '@/lib/utils/custom-format';
import Link from 'next/link';
import { isContactInfoCompleteChecker } from '@/lib/utils/condition-checkers';
import { getBuyerJobs } from '@/lib/apis/jobs';

type ActiveSection = 'all-jobs' | 'contact-info';

export default function BuyerDashboard() {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>('all-jobs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'open' | 'full_bid' | 'waiting_confirmation' | 'confirmed'>('all');

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

  const {
    data: allJobs = [],
    isLoading: jobsLoading,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['buyer-jobs'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getBuyerJobs(token); // Get all jobs, we'll filter on frontend
    },
    enabled: !!userId,
  });

  const handleContactInfoSaved = () => {
    refetch();
  };

  const filteredJobs = allJobs.filter((job) => {
    if (activeFilter === 'all') return true;
    return job.status === activeFilter;
  });

  // Directly Calculate stats from all jobs in real time
  const stats = {
    activeJobs: allJobs.filter((job) => job.status === 'open' || job.status === 'full_bid').length,
    totalBids: allJobs.reduce((total, job) => total + job.bid_count, 0),
    confirmedJobs: allJobs.filter((job) => job.status === 'confirmed').length,
    savedDrafts: allJobs.filter((job) => job.status === 'draft').length,
  };

  // Filter options for the dropdown
  const filterOptions = [
    { value: 'all', label: 'All Jobs', count: allJobs.length },
    { value: 'draft', label: 'Drafts', count: stats.savedDrafts },
    { value: 'open', label: 'Open', count: allJobs.filter((j) => j.status === 'open').length },
    { value: 'full_bid', label: 'Full Bids', count: allJobs.filter((j) => j.status === 'full_bid').length },
    { value: 'waiting_confirmation', label: 'Waiting confirmation', count: allJobs.filter((j) => j.status === 'waiting_confirmation').length },
    { value: 'confirmed', label: 'Confirmed', count: stats.confirmedJobs },
  ];

  // Updated jobs list renderer
  const renderJobsList = () => {
    if (filteredJobs.length === 0) {
      if (activeFilter === 'all') {
        return (
          <div className='text-center py-8 lg:py-12'>
            <Briefcase className='h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mx-auto mb-4' />
            <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 mb-2'>No jobs posted yet</h3>
            <p className='font-inter text-sm lg:text-base text-gray-600 mb-4 px-4'>Get started by posting your first job to receive bids from contractors.</p>
            <Link href='/buyer-dashboard/post-job'>
              <Button
                className='font-roboto bg-blue-600 hover:bg-blue-700 w-full lg:w-auto'
                disabled={
                  !isContactInfoCompleteChecker({
                    email: contactInfo?.contact_email || '',
                    phone: contactInfo?.phone_number || '',
                  })
                }
              >
                {isContactInfoCompleteChecker({
                  email: contactInfo?.contact_email || '',
                  phone: contactInfo?.phone_number || '',
                })
                  ? 'Post Your First Job'
                  : 'Complete Profile First'}
              </Button>
            </Link>
          </div>
        );
      }

      return (
        <div className='text-center py-8'>
          <Briefcase className='h-12 w-12 text-gray-300 mx-auto mb-4' />
          <h3 className='font-roboto text-lg font-semibold text-gray-900 mb-2'>No {activeFilter === 'draft' ? 'drafts' : `${activeFilter.replace('_', ' ')} jobs`}</h3>
          <p className='font-inter text-gray-600'>
            {activeFilter === 'draft' ? 'Your saved drafts will appear here.' : `You don't have any ${activeFilter.replace('_', ' ')} jobs yet.`}
          </p>
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className='bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer'
            onClick={() => {
              if (job.status === 'draft') {
                router.push(`/buyer-dashboard/post-job?draft=${job.id}`);
              } else {
                router.push(`/buyer-dashboard/jobs/${job.id}`);
              }
            }}
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  {job.thumbnail_image && <img src={job.thumbnail_image} alt='Job thumbnail' className='w-12 h-12 rounded-lg object-cover' />}
                  <div>
                    <h3 className='font-roboto font-semibold text-gray-900'>{job.title || 'Untitled Job'}</h3>
                    <p className='font-inter text-sm text-gray-600'>{job.job_type || 'No job type selected'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  {job.status !== 'draft' && (
                    <span className='font-inter'>
                      {job.bid_count} {job.bid_count === 1 ? 'bid' : 'bids'}
                    </span>
                  )}
                  <span className='font-inter'>
                    {job.status === 'draft' ? 'Saved' : 'Posted'} {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-roboto ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : job.status === 'draft'
                      ? 'bg-gray-100 text-gray-800'
                      : job.status === 'full_bid'
                      ? 'bg-blue-100 text-blue-800'
                      : job.status === 'confirmed'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {job.status === 'full_bid' ? 'Full Bids' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      {/* Contact Info Modal */}
      <BuyerContactInfoModal
        isOpen={
          !isContactInfoCompleteChecker({
            email: contactInfo?.contact_email || '',
            phone: contactInfo?.phone_number || '',
          })
        }
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
            {/* ------------------------------------------------------------------------------------------------------------------------------------ */}

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
                  {/* Left side - Filter tabs for mobile/desktop */}
                  <div className='flex gap-2 overflow-x-auto lg:gap-3'>
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setActiveFilter(option.value as any)}
                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-roboto transition-colors ${
                          activeFilter === option.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label} ({option.count})
                      </button>
                    ))}
                  </div>

                  {/* Right side - Post Job button */}
                  <div className='flex-shrink-0'>
                    <Link href='/buyer-dashboard/post-job'>
                      <Button
                        className='font-roboto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 w-full lg:w-auto'
                        disabled={
                          !isContactInfoCompleteChecker({
                            email: contactInfo?.contact_email || '',
                            phone: contactInfo?.phone_number || '',
                          })
                        }
                      >
                        <Plus className='h-4 w-4' />
                        <span className='hidden lg:inline'>
                          {isContactInfoCompleteChecker({
                            email: contactInfo?.contact_email || '',
                            phone: contactInfo?.phone_number || '',
                          })
                            ? 'Post New Job'
                            : 'Complete Profile First'}
                        </span>
                        <span className='lg:hidden'>
                          {isContactInfoCompleteChecker({
                            email: contactInfo?.contact_email || '',
                            phone: contactInfo?.phone_number || '',
                          })
                            ? 'Post Job'
                            : 'Complete Profile'}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Jobs List Area */}
                <Card>
                  <CardHeader>
                    <CardTitle className='font-roboto'>
                      {activeFilter === 'all'
                        ? 'All Jobs'
                        : activeFilter === 'draft'
                        ? 'Saved Drafts'
                        : activeFilter === 'full_bid'
                        ? 'Jobs with Full Bids'
                        : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Jobs`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{renderJobsList()}</CardContent>
                </Card>

                {/* Warning Banner */}
                {!isContactInfoCompleteChecker({
                  email: contactInfo?.contact_email || '',
                  phone: contactInfo?.phone_number || '',
                }) && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='font-inter text-sm lg:text-base text-red-800'>⚠️ Please complete your contact information to start posting jobs.</p>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------------------------------------------------------------------------------ */}

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
