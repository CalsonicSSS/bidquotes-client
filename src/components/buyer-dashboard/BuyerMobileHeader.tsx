'use client';

import { Menu } from 'lucide-react';

type ActiveSection = 'all-jobs' | 'contact-info';

type BuyerMobileHeaderProps = {
  activeSection: ActiveSection;
  setSidebarOpen: (open: boolean) => void;
};

export function BuyerMobileHeader({ activeSection, setSidebarOpen }: BuyerMobileHeaderProps) {
  const getTitle = (section: ActiveSection) => {
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
    <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between'>
      <button onClick={() => setSidebarOpen(true)} className='p-2 rounded-md hover:bg-gray-100'>
        <Menu className='h-5 w-5' />
      </button>
      <h2 className='font-roboto font-semibold text-gray-900'>{getTitle(activeSection)}</h2>
      <div className='w-9' /> {/* Spacer for centering */}
    </div>
  );
}
