'use client';

import { Menu } from 'lucide-react';

type ActiveSection = 'all-jobs' | 'your-bids' | 'profile' | 'your-passes';

type ContractorMobileHeaderProps = {
  activeSection: ActiveSection;
  setSidebarOpen: (open: boolean) => void;
};

export function ContractorMobileHeader({ activeSection, setSidebarOpen }: ContractorMobileHeaderProps) {
  const getTitle = (section: ActiveSection) => {
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
    <div className='lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between'>
      <button onClick={() => setSidebarOpen(true)} className='p-2 rounded-md hover:bg-gray-100'>
        <Menu className='h-5 w-5' />
      </button>
      <h2 className='font-roboto font-semibold text-gray-900'>{getTitle(activeSection)}</h2>
      <div className='w-9' /> {/* Spacer for centering */}
    </div>
  );
}
