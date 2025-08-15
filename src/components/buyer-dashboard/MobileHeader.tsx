'use client';

import { Menu } from 'lucide-react';

type BuyerActiveSection = 'all-jobs' | 'contact-info';

type BuyerMobileHeaderProps = {
  activeSection: BuyerActiveSection;
  setSidebarOpen: (open: boolean) => void;
};

export function BuyerMobileHeader({ activeSection, setSidebarOpen }: BuyerMobileHeaderProps) {
  const getTitle = (section: BuyerActiveSection) => {
    switch (section) {
      case 'all-jobs':
        return 'All Jobs';
      case 'contact-info':
        return 'Contact Info';
      default:
        return '';
    }
  };

  return (
    <div className='lg:hidden bg-white border-b px-4 py-3'>
      <div className='flex items-center justify-between mb-2'>
        <button onClick={() => setSidebarOpen(true)} className='p-2 rounded-md hover:bg-gray-100'>
          <Menu className='h-5 w-5' />
        </button>
        <h2 className='font-roboto font-semibold text-gray-900'>{getTitle(activeSection)}</h2>
        <div className='w-9' /> {/* Spacer for centering */}
      </div>

      {/* User Type Indicator for Mobile */}
      <div className='flex justify-center'>
        <span className='inline-flex px-2 py-1 rounded-full text-xs font-inter font-medium bg-blue-100 text-blue-800 border border-blue-200'>🏠 Home Owner Account</span>
      </div>
    </div>
  );
}
