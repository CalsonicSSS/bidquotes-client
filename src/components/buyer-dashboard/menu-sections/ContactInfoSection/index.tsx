'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { UpdateContactInfoModal } from './UpdateContactInfoModal';

type ContactInfo = {
  id: string;
  user_id: string;
  contact_email: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
};

type ContactInfoSectionProps = {
  contactInfo: ContactInfo | null | undefined;
};

export function ContactInfoSection({ contactInfo }: ContactInfoSectionProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  const handleModalClose = () => {
    setShowUpdateModal(false);
  };

  return (
    <div className='space-y-6'>
      <h2 className='font-roboto text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block'>Contact Information</h2>

      <Card className='lg:max-w-2xl'>
        <CardHeader>
          <CardTitle className='font-roboto flex items-center justify-between'>
            <span>Your Contact Details</span>
            {contactInfo && (
              // Button to only show up the UpdateModal
              <Button onClick={handleUpdateClick} size='sm' className='font-roboto text-sm px-5 bg-blue-600 hover:bg-blue-700 hidden lg:inline-flex'>
                Update
              </Button>
            )}
          </CardTitle>
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
                <p className='font-inter text-gray-900 mt-1'>{contactInfo.phone_number}</p>
              </div>
              <div className='pt-2'>
                <p className='font-inter text-xs text-gray-500 mb-3'>Last updated: {new Date(contactInfo.updated_at).toLocaleDateString()}</p>
                <Button onClick={handleUpdateClick} className='font-roboto bg-blue-600 hover:bg-blue-700 w-full lg:hidden'>
                  Update Contact Info
                </Button>
              </div>
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

      {/* Update Contact Info Modal */}
      {contactInfo && <UpdateContactInfoModal isOpen={showUpdateModal} onClose={handleModalClose} currentContactInfo={contactInfo} />}
    </div>
  );
}
