import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BriefcaseBusiness, Calendar, Users, Star, Shield, Phone, Mail, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { ContractorProfileResponse } from '@/lib/apis/contractor-profile';
import { ImagesGallery } from '@/components/ImagesGallery';

export default function ContractorProfileSection({ contractorProfile }: { contractorProfile: ContractorProfileResponse }) {
  return (
    <Card className='border-2 border-green-200 transition-colors'>
      <CardHeader className='pb-4'>
        <div className=' items-center justify-between sm:hidden lg:flex'>
          <CardTitle className='font-roboto text-xl text-gray-900 flex items-center gap-2'>
            <Award className='h-6 w-6 text-green-600' />
            Contractor Profile
          </CardTitle>
          <div className='mt-4 lg:hidden' />
          <Badge className='bg-green-100 text-green-800 border-green-200 font-inter text-xs'>
            <Shield className='h-3 w-3 mr-1' />
            Bidquotes Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Header Section with Avatar and Basic Info */}
        <div className='flex items-start gap-4 p-4 bg-gray-50 rounded-lg'>
          <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0'>
            <span className='font-roboto font-bold text-white text-xl'>{contractorProfile.contractor_name.charAt(0)}</span>
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='font-roboto font-bold text-lg text-gray-900 truncate'>{contractorProfile.contractor_name}</h3>
            </div>

            {/* Rating and Jobs */}
            <div className='flex items-center gap-4 mb-2'>
              {/* <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 text-yellow-400 fill-current' />
                <span className='font-inter text-sm font-semibold text-gray-900'>{contractorProfile.rating}</span>
                <span className='font-inter text-sm text-gray-600'>({contractorProfile.total_jobs} jobs)</span>
              </div> */}

              <Badge variant='outline' className='font-inter text-xs'>
                {contractorProfile.contractor_type === 'business' ? 'Business' : 'Individual'}
              </Badge>
              {<CheckCircle2 className='h-5 w-5 text-green-600 flex-shrink-0' />}
            </div>
          </div>
        </div>

        {/* Main Service Areas */}
        <div className=' text-gray-600 bg-gray-50 rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <BriefcaseBusiness className='h-4 w-4 flex-shrink-0' />
            <p className='font-roboto font-semibold'>Main Service Areas:</p>
          </div>
          <span className='font-inter truncate'>{contractorProfile.main_service_areas}</span>
        </div>

        {/* Key Stats */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-center p-3 bg-blue-50 rounded-lg'>
            <div className='flex items-center justify-center  mb-1'>
              <Calendar className='h-5 w-5 mr-2 text-blue-600' />
              <div className='font-roboto font-bold text-lg text-blue-700'>{contractorProfile.years_of_experience}</div>
            </div>
            <div className='font-inter text-sm text-blue-600'>Years Experience</div>
          </div>

          <div className='text-center p-3 bg-green-50 rounded-lg'>
            <div className='flex items-center justify-center mb-1'>
              <Users className='h-5 w-5 mr-2 text-green-600' />
              <div className='font-roboto font-bold text-lg text-green-700'>{contractorProfile.team_size}</div>
            </div>
            <div className='font-inter text-sm text-green-600'>Team {parseInt(contractorProfile.team_size) === 1 ? 'Member' : 'Members'}</div>
          </div>
        </div>

        {/* Contact Information */}
        <div className='space-y-3 p-4 border border-gray-200 rounded-lg'>
          <h4 className='font-roboto font-semibold text-gray-900 mb-3'>Contact Information</h4>

          <div className='flex items-center gap-3 text-sm'>
            <Mail className='h-4 w-4 text-gray-500 flex-shrink-0' />
            <a href={`mailto:${contractorProfile.email}`} className='font-inter text-blue-600 hover:text-blue-800 break-all'>
              {contractorProfile.email}
            </a>
          </div>

          <div className='flex items-center gap-3 text-sm'>
            <Phone className='h-4 w-4 text-gray-500 flex-shrink-0' />
            <a href={`tel:${contractorProfile.phone}`} className='font-inter text-blue-600 hover:text-blue-800'>
              {contractorProfile.phone}
            </a>
          </div>

          {contractorProfile.company_website && (
            <div className='flex items-center gap-3 text-sm'>
              <ExternalLink className='h-4 w-4 text-gray-500 flex-shrink-0' />
              <a href={contractorProfile.company_website} target='_blank' rel='noopener noreferrer' className='font-inter text-blue-600 hover:text-blue-800 break-all'>
                Visit Website
              </a>
            </div>
          )}
        </div>

        {/* About Section */}
        {contractorProfile.additional_information && (
          <div className='space-y-2'>
            <h4 className='font-roboto font-semibold text-gray-900'>About This Contractor</h4>
            <p className='font-inter text-gray-700 text-sm leading-relaxed whitespace-pre-wrap'>{contractorProfile.additional_information}</p>
          </div>
        )}

        {/* Work Sample Images */}
        {contractorProfile.images && contractorProfile.images.length > 0 && (
          <div className='space-y-3'>
            <h4 className='font-roboto font-semibold text-gray-900'>Recent Work Samples</h4>
            <div>
              <label className='font-roboto text-sm font-semibold text-gray-700 mb-3 block'>Work Sample Photos</label>
              {contractorProfile.images && contractorProfile.images.length > 0 ? (
                <ImagesGallery images={contractorProfile.images} />
              ) : (
                <p className='font-inter text-gray-500 mt-1'>None</p>
              )}
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          {/* <h4 className='font-roboto font-semibold text-green-900 mb-2'>Why Choose This Contractor?</h4> */}
          <div className='space-y-2'>
            {
              <div className='flex items-center gap-2 text-sm'>
                <CheckCircle2 className='h-4 w-4 text-green-600' />
                <span className='font-inter text-green-700'>Bidquotes Verified Professional</span>
              </div>
            }
            <div className='flex items-center gap-2 text-sm'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <span className='font-inter text-green-700'>{contractorProfile.years_of_experience}+ years of experience</span>
            </div>
            {/* <div className='flex items-center gap-2 text-sm'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <span className='font-inter text-green-700'>{contractorProfile.total_jobs}+ completed projects</span>
            </div> */}
            {/* <div className='flex items-center gap-2 text-sm'>
              <CheckCircle2 className='h-4 w-4 text-green-600' />
              <span className='font-inter text-green-700'>{contractorProfile.rating}/5.0 customer rating</span>
            </div> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
