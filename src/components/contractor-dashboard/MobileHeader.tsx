'use client';

import { Menu } from 'lucide-react';

type ContractorActiveSection = 'all-jobs' | 'your-bids' | 'profile' | 'your-passes';

type ContractorMobileHeaderProps = {
  activeSection: ContractorActiveSection;
  setSidebarOpen: (open: boolean) => void;
};

export function ContractorMobileHeader({ activeSection, setSidebarOpen }: ContractorMobileHeaderProps) {
  const getTitle = (section: ContractorActiveSection) => {
    switch (section) {
      case 'all-jobs':
        return 'All Jobs';
      case 'your-bids':
        return 'Your Bids';
      case 'profile':
        return 'Profile';
      case 'your-passes':
        return 'Your Passes';
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
        <span className='inline-flex px-2 py-1 rounded-full text-xs font-inter font-medium bg-green-100 text-green-800 border border-green-200'>🔧 Contractor Account</span>
      </div>
    </div>
  );
}
