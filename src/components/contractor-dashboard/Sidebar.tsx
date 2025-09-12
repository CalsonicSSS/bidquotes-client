'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Briefcase, MessageSquare, User, CreditCard, Home, X } from 'lucide-react';

type ActiveSection = 'all-jobs' | 'your-bids' | 'profile' | 'your-credits';

type MenuItem = {
  id: ActiveSection;
  label: string;
  icon: typeof Briefcase;
};

type ContractorSidebarProps = {
  user: any; // Clerk user type
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const menuItems: MenuItem[] = [
  { id: 'all-jobs', label: 'All Jobs', icon: Briefcase },
  { id: 'your-bids', label: 'Your Bids', icon: MessageSquare },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'your-credits', label: 'Your Credits', icon: CreditCard },
];

export function ContractorSidebar({ user, activeSection, setActiveSection, sidebarOpen, setSidebarOpen }: ContractorSidebarProps) {
  const handleMenuItemClick = (sectionId: ActiveSection) => {
    setActiveSection(sectionId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && <div className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden' onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile Close Button Header */}
        <div className='flex items-center justify-end p-4 border-b lg:hidden'>
          <button onClick={() => setSidebarOpen(false)} className='lg:hidden p-1 rounded-md hover:bg-gray-100'>
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className='p-4 lg:p-6'>
          {/* Enhanced User Info Header with User Type Indicator */}
          <div className='mb-8'>
            <div className='flex justify-between items-center font-roboto text-lg lg:text-xl font-bold text-gray-900 mb-3'>
              <h1>Hi, {user?.firstName}</h1>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </div>

            {/* User Type Badge */}
            <div className='flex items-center gap-2'>
              <span className='inline-flex px-3 py-1 rounded-full text-xs font-inter font-medium bg-green-200 text-green-800 border border-green-300'>🔧 Contractor Account</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className='space-y-2'>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id ? 'bg-green-100 text-green-700 font-roboto font-semibold' : 'text-gray-700 hover:bg-gray-50 font-inter'
                  }`}
                >
                  <Icon className='h-5 w-5' />
                  {item.label}
                </button>
              );
            })}

            {/* Home Link */}
            <Link href='/' className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 font-inter'>
              <Home className='h-5 w-5' />
              Home
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
