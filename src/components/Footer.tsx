import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className='bg-gray-800 text-white py-12'>
      <div className='container mx-auto px-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <div className='font-roboto text-2xl font-bold mb-4'>Bidquotes</div>
            <p className='font-inter text-gray-400'>Connecting homeowners with quality contractors.</p>
          </div>
          <div>
            <h4 className='font-roboto font-semibold mb-4'>Company</h4>
            <ul className='font-inter space-y-2 text-gray-400'>
              <li>
                <Link href='/how-it-works' className='hover:text-white'>
                  How It Works
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-white'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/terms' className='hover:text-white'>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href='/privacy' className='hover:text-white'>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-roboto font-semibold mb-4'>Follow Us</h4>
            <div className='flex gap-4 items-center'>
              <a href='#' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-blue-400 transition-colors'>
                <Facebook size={32} />
              </a>
              <a href='#' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-pink-400 transition-colors'>
                <Instagram size={32} />
              </a>
            </div>
          </div>
        </div>
        <div className='border-t border-gray-700 mt-8 pt-8 text-center'>
          <p className='font-inter text-gray-400'>© 2025 Bidquotes Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
