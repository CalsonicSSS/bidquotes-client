import { Header } from '@/components/Header';
import { Shield, Eye, Lock, Users } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className='min-h-screen'>
      {/* header section */}
      <Header />

      {/* Hero Section */}
      <section className='relative h-[250px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='container mx-auto px-5 relative z-10 text-center'>
          <h1 className='font-inter text-4xl md:text-5xl font-bold text-white mb-4 leading-tight'>Privacy Policy</h1>
          <p className='font-inter text-lg text-gray-200'>Last updated: July 1, 2025</p>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-blue-50 p-6 rounded-lg mb-8'>
              <p className='font-inter text-gray-700 leading-relaxed'>
                At Bidquotes, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our platform. We are
                committed to maintaining the trust and confidence of our users.
              </p>
            </div>

            {/* Privacy Principles */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
              <div className='text-center p-4'>
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Shield className='h-8 w-8 text-blue-600' />
                </div>
                <h3 className='font-roboto font-semibold text-lg mb-2'>Data Protection</h3>
                <p className='font-inter text-gray-600 text-sm'>We use industry-standard security measures to protect your data</p>
              </div>
              <div className='text-center p-4'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Eye className='h-8 w-8 text-green-600' />
                </div>
                <h3 className='font-roboto font-semibold text-lg mb-2'>Transparency</h3>
                <p className='font-inter text-gray-600 text-sm'>We're clear about what data we collect and how we use it</p>
              </div>
              <div className='text-center p-4'>
                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Lock className='h-8 w-8 text-purple-600' />
                </div>
                <h3 className='font-roboto font-semibold text-lg mb-2'>User Control</h3>
                <p className='font-inter text-gray-600 text-sm'>You have control over your personal information and privacy settings</p>
              </div>
              <div className='text-center p-4'>
                <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                  <Users className='h-8 w-8 text-orange-600' />
                </div>
                <h3 className='font-roboto font-semibold text-lg mb-2'>Limited Sharing</h3>
                <p className='font-inter text-gray-600 text-sm'>We only share information when necessary for our services</p>
              </div>
            </div>

            <div className='space-y-8'>
              {/* Section 1 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>1. Information We Collect</h2>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Personal Information</h3>
                    <p className='font-inter text-gray-600 mb-3 leading-relaxed'>When you create an account with Bidquotes, we collect the following information:</p>
                    <ul className='font-inter text-gray-600 space-y-1 list-disc list-inside ml-4'>
                      <li>Name and contact information (email, phone number)</li>
                      <li>Account credentials (username and encrypted password)</li>
                      <li>Profile information (bio, experience, specializations for contractors)</li>
                      <li>Payment information (processed securely through Stripe)</li>
                      <li>Business information (licenses, insurance, certifications for contractors)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Usage Information</h3>
                    <p className='font-inter text-gray-600 mb-3 leading-relaxed'>We automatically collect information about how you use our platform:</p>
                    <ul className='font-inter text-gray-600 space-y-1 list-disc list-inside ml-4'>
                      <li>Job postings and bid submissions</li>
                      <li>Messages and communications through our platform</li>
                      <li>Search queries and preferences</li>
                      <li>Device information and IP addresses</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>2. How We Use Your Information</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>We use the information we collect to provide, maintain, and improve our services:</p>
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <ul className='font-inter text-gray-600 space-y-2 list-disc list-inside'>
                    <li>Facilitate connections between buyers and contractors</li>
                    <li>Process payments and manage transactions</li>
                    <li>Verify contractor credentials and background information</li>
                    <li>Provide customer support and resolve disputes</li>
                    <li>Send important updates and notifications</li>
                    <li>Improve platform functionality and user experience</li>
                    <li>Prevent fraud and maintain platform security</li>
                    <li>Comply with legal obligations and enforce our Terms of Service</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>3. Information Sharing</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  We do not sell your personal information to third parties. We may share your information in the following limited circumstances:
                </p>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Between Platform Users</h3>
                    <p className='font-inter text-gray-600 mb-2 leading-relaxed'>
                      When a contractor is selected for a job and pays the commission fee, we share buyer contact information to facilitate the work arrangement.
                    </p>
                  </div>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Service Providers</h3>
                    <p className='font-inter text-gray-600 mb-2 leading-relaxed'>We work with trusted third-party service providers including:</p>
                    <ul className='font-inter text-gray-600 space-y-1 list-disc list-inside ml-4'>
                      <li>Stripe for payment processing</li>
                      <li>Clerk for authentication services</li>
                      <li>Supabase for data storage</li>
                      <li>Background check services for contractor verification</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Legal Requirements</h3>
                    <p className='font-inter text-gray-600 leading-relaxed'>We may disclose information when required by law, court order, or to protect our rights and safety.</p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>4. Data Security</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>We implement robust security measures to protect your information:</p>
                <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
                  <ul className='font-inter text-gray-700 space-y-2 list-disc list-inside'>
                    <li>End-to-end encryption for sensitive data transmission</li>
                    <li>Secure servers with regular security audits</li>
                    <li>Two-factor authentication options</li>
                    <li>Regular security updates and patches</li>
                    <li>Limited access to personal information by authorized personnel only</li>
                    <li>Secure payment processing through PCI-compliant providers</li>
                  </ul>
                </div>
                <p className='font-inter text-gray-600 mt-4 leading-relaxed'>
                  While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed
                  to maintaining the highest standards.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>5. Your Rights and Choices</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>You have several rights regarding your personal information:</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Access and Update</h3>
                    <p className='font-inter text-gray-600 text-sm'>You can access and update your profile information at any time through your account settings.</p>
                  </div>
                  <div className='bg-purple-50 p-4 rounded-lg'>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Data Portability</h3>
                    <p className='font-inter text-gray-600 text-sm'>You can request a copy of your personal information in a structured, machine-readable format.</p>
                  </div>
                  <div className='bg-red-50 p-4 rounded-lg'>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Account Management</h3>
                    <p className='font-inter text-gray-600 text-sm'>You can manage your account and associated data at any time through your account settings.</p>
                  </div>
                  <div className='bg-orange-50 p-4 rounded-lg'>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>Communication Preferences</h3>
                    <p className='font-inter text-gray-600 text-sm'>You can control what communications you receive from us through your notification settings.</p>
                  </div>
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>6. Cookies and Tracking</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>We use cookies and similar tracking technologies to enhance your experience on our platform:</p>
                <div className='space-y-3'>
                  <div className='flex items-start gap-3'>
                    <div className='w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0'></div>
                    <div>
                      <h3 className='font-roboto font-semibold mb-1'>Essential Cookies</h3>
                      <p className='font-inter text-gray-600 text-sm'>Required for basic platform functionality and security</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                    <div>
                      <h3 className='font-roboto font-semibold mb-1'>Analytics Cookies</h3>
                      <p className='font-inter text-gray-600 text-sm'>Help us understand how users interact with our platform</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0'></div>
                    <div>
                      <h3 className='font-roboto font-semibold mb-1'>Preference Cookies</h3>
                      <p className='font-inter text-gray-600 text-sm'>Remember your settings and preferences</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>7. Data Retention</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  We retain your information for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className='font-inter text-gray-600 space-y-2 list-disc list-inside ml-4'>
                  <li>Account information: Until you delete your account</li>
                  <li>Job postings and bids: For historical records and dispute resolution</li>
                  <li>Communication records: Up to 3 years for customer support purposes</li>
                  <li>Payment records: As required by financial regulations</li>
                  <li>Usage data: Anonymized and aggregated for analytics</li>
                </ul>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>8. Children's Privacy</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  Bidquotes is not intended for use by children under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware
                  that we have collected personal information from a child under 18, we will take steps to remove that information from our servers.
                </p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>9. Changes to This Privacy Policy</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by
                  posting the new Privacy Policy on our website and updating the "Last updated" date.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>
                  We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>10. Contact Us</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <div className='space-y-2'>
                    <p className='font-inter text-gray-700'>
                      <strong>Email:</strong> support@bidquotes.ca
                    </p>
                    <p className='font-inter text-gray-700'>
                      <strong>Phone:</strong> 1-800-BIDQUOTES
                    </p>
                    <p className='font-inter text-gray-700'>
                      <strong>Address:</strong> [Your Business Address]
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-12 p-6 bg-blue-50 rounded-lg'>
              <p className='font-inter text-gray-700 text-center leading-relaxed'>
                By using Bidquotes, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described
                herein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
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
                  <a href='/about' className='hover:text-white'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='/terms' className='hover:text-white'>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href='/privacy' className='hover:text-white'>
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-roboto font-semibold mb-4'>Contact</h4>
              <ul className='font-inter space-y-2 text-gray-400'>
                <li>support@bidquotes.ca</li>
                <li>1-800-BIDQUOTES</li>
              </ul>
            </div>
          </div>
          <div className='border-t border-gray-700 mt-8 pt-8 text-center'>
            <p className='font-inter text-gray-400'>© 2025 Bidquotes Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
