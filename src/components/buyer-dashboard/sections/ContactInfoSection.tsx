import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { formatPhoneDisplay } from '@/lib/utils/custom-format';

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
  return (
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
  );
}
