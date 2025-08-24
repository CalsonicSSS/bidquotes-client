import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, User, FileText, MessageSquare, CreditCard, Handshake } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Home Contractor Bidding Process | Bidquotes',
  description: 'Learn how Bidquotes connects homeowners with contractors through competitive bidding. Simple 3-step process to get multiple bids for your home project.',
};

export default function HowItWorksPage() {
  return (
    <main className='min-h-screen'>
      {/* Header section */}
      <Header />

      {/* Hero Section */}
      <section className='relative h-[300px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='container mx-auto px-5 relative z-10 text-center'>
          <h1 className='font-inter text-4xl md:text-5xl font-bold text-white mb-6 leading-tight'>How It Works</h1>
          <p className='font-inter text-xl text-gray-200 max-w-2xl mx-auto'>Simple steps to connect homeowners with quality contractors</p>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <div className='max-w-6xl mx-auto'>
            {/* Introduction */}
            <div className='text-center mb-16'>
              <div className='bg-blue-50 p-6 rounded-lg max-w-4xl mx-auto'>
                <p className='font-inter text-lg text-gray-700 leading-relaxed'>
                  Bidquotes makes it easy to connect homeowners with skilled contractors through competitive bidding. Choose your role below to see how our platform works for you.
                </p>
              </div>
            </div>

            {/* Two-Column Layout for Buyers and Contractors */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
              {/* For Buyers Section */}
              <div>
                <div className='text-center mb-8'>
                  <div className='inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-200 mb-4'>
                    <span className='font-inter font-semibold'>🏠 For Homeowners (Buyers)</span>
                  </div>
                  <h2 className='font-roboto text-2xl font-bold text-gray-900'>Get Multiple Bids for Your Project</h2>
                </div>

                <div className='space-y-6'>
                  {/* Step 1 */}
                  <Card className='border-l-4 border-l-blue-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>1</div>
                        Sign Up & Complete Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        Create your buyer account and add your contact information. This will be shared with contractors only after you confirm a job.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 2 */}
                  <Card className='border-l-4 border-l-blue-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>2</div>
                        Post Your Job
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        Describe your project with details like job type, budget, location, and requirements. Add photos to help contractors understand your needs.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 3 */}
                  <Card className='border-l-4 border-l-blue-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>3</div>
                        Review Bids
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        Receive up to 5 competitive bids from qualified contractors. Compare prices, timelines, and work details to find the best fit.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 4 */}
                  <Card className='border-l-4 border-l-blue-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>4</div>
                        Select & Connect
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        Choose your preferred contractor and they'll pay a small confirmation fee. Once confirmed, you'll receive their full contact details to start your project.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* For Contractors Section */}
              <div>
                <div className='text-center mb-8'>
                  <div className='inline-flex px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-200 mb-4'>
                    <span className='font-inter font-semibold'>🔧 For Contractors</span>
                  </div>
                  <h2 className='font-roboto text-2xl font-bold text-gray-900'>Find & Bid on Projects</h2>
                </div>

                <div className='space-y-6'>
                  {/* Step 1 */}
                  <Card className='border-l-4 border-l-green-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>1</div>
                        Create Contractor Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        Sign up as a contractor and complete your profile with experience, services, work samples, and business information.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 2 */}
                  <Card className='border-l-4 border-l-green-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>2</div>
                        Browse Available Jobs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        View posted jobs in your area and expertise. See project details, budget ranges, and requirements before deciding to bid.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 3 */}
                  <Card className='border-l-4 border-l-green-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>3</div>
                        Submit Competitive Bids
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        Create detailed bids with your pricing, timeline, and work approach. Only 5 contractors can bid per job, so act quickly on good opportunities.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Step 4 */}
                  <Card className='border-l-4 border-l-green-500'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='flex items-center gap-3 font-roboto text-lg'>
                        <div className='w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm'>4</div>
                        Get Selected & Start Work
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className='font-inter text-gray-600 leading-relaxed'>
                        If selected, pay the $30 CAD confirmation fee to access the homeowner's contact details and begin your project.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Key Benefits Section */}
            <div className='mt-16 pt-12 border-t border-gray-200'>
              <h2 className='font-roboto text-2xl font-bold text-gray-900 text-center mb-8'>Why Choose Bidquotes?</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <CheckCircle className='h-8 w-8 text-blue-600' />
                  </div>
                  <h3 className='font-roboto font-semibold text-lg mb-2'>Quality Assured</h3>
                  <p className='font-inter text-gray-600 text-sm'>All contractors are verified and background-checked for your peace of mind.</p>
                </div>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <CreditCard className='h-8 w-8 text-green-600' />
                  </div>
                  <h3 className='font-roboto font-semibold text-lg mb-2'>Fair Pricing</h3>
                  <p className='font-inter text-gray-600 text-sm'>Competitive bidding ensures you get the best value for your project.</p>
                </div>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Handshake className='h-8 w-8 text-purple-600' />
                  </div>
                  <h3 className='font-roboto font-semibold text-lg mb-2'>Easy Process</h3>
                  <p className='font-inter text-gray-600 text-sm'>Simple, streamlined platform that saves time for both buyers and contractors.</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className='mt-16 text-center'>
              <div className='bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg lg:px-28'>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>Ready to Get Started?</h2>
                <p className='font-inter text-gray-600 mb-6'>Join thousands of homeowners and contractors using Bidquotes</p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Link href='/sign-up' className='flex-1'>
                    <button className='w-full font-roboto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>Sign Up as Buyer</button>
                  </Link>
                  <Link href='/sign-up' className='flex-1'>
                    <button className='w-full font-roboto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>Sign Up as Contractor</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <Footer />
    </main>
  );
}
