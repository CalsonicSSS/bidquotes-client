'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { getContractorProfile } from '@/lib/apis/contractor-profile';
import { ImagesGallery } from '@/components/ImagesGallery';
import { UpdateContractorProfileModal } from './UpdateContractorProfileModal';

export function ProfileSection() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { getToken } = useAuth();

  // Fetch contractor profile
  const { data: contractorProfile, isLoading } = useQuery({
    queryKey: ['contractor-profile'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('No token available');
      return getContractorProfile(token);
    },
    enabled: !!getToken,
  });

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Contractor Profile</h2>
        <div className='flex items-center justify-center py-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2'></div>
            <p className='font-inter text-sm text-gray-600'>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Contractor Profile</h2>

      <Card className='lg:max-w-4xl'>
        <CardHeader>
          <CardTitle className='font-roboto flex items-center justify-between'>
            <span>Your Profile</span>
            {contractorProfile && (
              <Button onClick={handleUpdateClick} size='sm' className='font-roboto text-sm px-5 bg-green-600 hover:bg-green-700 hidden lg:inline-flex'>
                Update
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contractorProfile ? (
            <div className='space-y-6'>
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Contractor Name</label>
                  <p className='font-inter text-gray-900 mt-1'>{contractorProfile.contractor_name}</p>
                </div>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Email</label>
                  <p className='font-inter text-gray-900 mt-1'>{contractorProfile.email}</p>
                </div>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Phone</label>
                  <p className='font-inter text-gray-900 mt-1'>{contractorProfile.phone}</p>
                </div>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Main Service Areas</label>
                  <p className='font-inter text-gray-900 mt-1'>{contractorProfile.main_service_areas}</p>
                </div>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Years of Experience</label>
                  <p className='font-inter text-gray-900 mt-1'>{contractorProfile.years_of_experience} years</p>
                </div>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Contractor Type</label>
                  <p className='font-inter text-gray-900 mt-1 capitalize'>{contractorProfile.contractor_type}</p>
                </div>
                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Team Size</label>
                  <p className='font-inter text-gray-900 mt-1'>
                    {contractorProfile.team_size} {parseInt(contractorProfile.team_size) === 1 ? 'person' : 'people'}
                  </p>
                </div>

                <div>
                  <label className='font-roboto text-sm font-semibold text-gray-700'>Company Website</label>
                  {contractorProfile.company_website ? (
                    <a
                      href={contractorProfile.company_website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-inter text-blue-600 hover:text-blue-800 mt-1 block break-all'
                    >
                      {contractorProfile.company_website || 'None'}
                    </a>
                  ) : (
                    <p className='font-inter text-gray-500 mt-1'>None</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}

              <div>
                <label className='font-roboto text-sm font-semibold text-gray-700'>Additional Information</label>
                <p className='font-inter text-gray-900 mt-1 whitespace-pre-wrap'>{contractorProfile.additional_information || 'None'}</p>
              </div>

              {/* Work Sample Images */}
              <div>
                <label className='font-roboto text-sm font-semibold text-gray-700 mb-3 block'>Work Sample Photos</label>
                {contractorProfile.images && contractorProfile.images.length > 0 ? (
                  <ImagesGallery images={contractorProfile.images} />
                ) : (
                  <p className='font-inter text-gray-500 mt-1'>None</p>
                )}
              </div>

              <div className='pt-2'>
                <p className='font-inter text-xs text-gray-500 mb-3'>Last updated: {new Date(contractorProfile.updated_at).toLocaleDateString()}</p>
                <Button onClick={handleUpdateClick} className='font-roboto bg-green-600 hover:bg-green-700 w-full lg:hidden'>
                  Update Profile
                </Button>
              </div>
            </div>
          ) : (
            <div className='text-center py-6 lg:py-8'>
              <User className='h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mx-auto mb-4' />
              <h3 className='font-roboto text-base lg:text-lg font-semibold text-gray-900 mb-2'>Profile not found</h3>
              <p className='font-inter text-sm lg:text-base text-gray-600'>Please complete your profile to start using the platform.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Profile Modal */}
      {contractorProfile && <UpdateContractorProfileModal isOpen={showUpdateModal} onClose={handleModalClose} currentProfile={contractorProfile} />}
    </div>
  );
}
