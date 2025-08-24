import Image from 'next/image';
import { UserAuthConditionalButtons } from '@/components/UserAuthConditionalButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, CheckCircle, Facebook, Instagram } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className='min-h-screen'>
      {/* header section */}
      <Header />

      {/* Hero Section */}
      <section className='relative h-[450px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center'>
        <Image src='/images/hero/hero-background.jpg' alt='Home maintenance professionals at work' fill className='object-cover object-[center_30%]' priority />
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <div className='container mx-auto px-5 relative z-10 text-center'>
          <div className='font-inter text-3xl md:text-5xl md:px-96 font-bold text-white mb-14 leading-tight'>
            <h1 className='mb-3'>Home Maintenance</h1>
            <h1 className='mb-3'>With</h1>
            <h1>Competitive Bidding</h1>
          </div>
          <p className='font-inter text-xl text-gray-100 mb-8 font-medium'>Post your jobs and get multiple bids from qualified contractors with us.</p>

          {/* Conditional buttons based on auth status */}
          <UserAuthConditionalButtons />
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5 md:w-4/6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='font-inter text-2xl font-bold text-blue-theme mb-2'>5,000+</div>
              <div className='font-roboto text-gray-800  uppercase tracking-wide text-sm'>Jobs Posted</div>
            </div>
            <div>
              <div className='font-inter text-2xl font-bold text-blue-theme mb-2'>15,000+</div>
              <div className='font-roboto text-gray-800  uppercase tracking-wide text-sm'>bids submitted</div>
            </div>
            <div>
              <div className='font-inter text-2xl font-bold text-blue-theme mb-2'>95%</div>
              <div className='font-roboto text-gray-800  uppercase tracking-wide text-sm'>Customer Satisfaction</div>
            </div>
            <div>
              <div className='font-inter text-2xl font-bold text-blue-theme mb-2'>4.7 ★</div>
              <div className='font-roboto text-gray-800  uppercase tracking-wide text-sm'>Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* mission statement section */}
      <section className='pb-16 pt-4 bg-white overflow-hidden'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200'>
              <p className='font-inter text-xl font-semibold text-gray-700 leading-relaxed md:px-20'>Your job shouldn't break the bank or leave you helpless.</p>
              <br />
              <p className='font-normal text-md font-inter'> We connect you with qualified contractors who bid for your job, ensuring the best deal!</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <h2 className='font-inter text-4xl font-bold text-center text-gray-900 mb-20'>How it works</h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl'>1</div>
              <h3 className='font-roboto font-semibold mb-2'>Post Your Job</h3>
              <p className='font-inter text-gray-600'>Describe your project with details and requirements</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl'>2</div>
              <h3 className='font-roboto font-semibold mb-2'>Get Bids</h3>
              <p className='font-inter text-gray-600'>Receive up to 5 competitive bids from qualified contractors</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl'>3</div>
              <h3 className='font-roboto font-semibold mb-2'>Choose & Pay</h3>
              <p className='font-inter text-gray-600'>Select your preferred contractor and confirm the job</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl'>4</div>
              <h3 className='font-roboto font-semibold mb-2'>Get It Done</h3>
              <p className='font-inter text-gray-600'>Work directly with your chosen contractor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className='py-16 bg-blue-50'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='flex justify-center mb-4'>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className='h-6 w-6 text-yellow-400 fill-current' />
              ))}
            </div>
            <blockquote className='font-inter text-xl md:text-2xl text-gray-700 mb-6 italic'>
              &apos;Bidquotes made it so easy to setup my service on the platform and and expose my business to new customers. The bidding process is straightforward and I love how
              I can compare multiple contractors quickly.&apos;
            </blockquote>
            <cite className='font-roboto text-gray-600'>— Xuhan S., PVC Contracting Inc.</cite>
          </div>
        </div>
      </section>

      {/* Illustration Section - Mobile Responsive Fix */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          {/* First Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-14'>
            {/* Left side - Cards in diagonal arrangement - Mobile Responsive */}
            <div className='relative h-72 md:h-96 flex justify-center lg:justify-center'>
              {/* Background card - rotated - Responsive positioning */}
              <div className='absolute top-2 sm:top-4 left-4 sm:left-8 lg:left-24 w-64 sm:w-72 lg:w-80 h-56 sm:h-64 lg:h-72 bg-blue-100 rounded-lg rotate-3'></div>
              {/* Main job card - Responsive positioning */}
              <div className='absolute top-0 left-0 sm:left-4 lg:left-12 w-64 sm:w-72 lg:w-80 bg-white rounded-lg shadow-lg -rotate-2 p-4 sm:p-6'>
                <div className='text-blue-500 font-roboto font-semibold text-xs sm:text-sm mb-2 sm:mb-3 uppercase tracking-wide'>BID SUBMITTED</div>
                <h3 className='font-inter text-base sm:text-lg font-bold mb-2 text-gray-900'>Hi Sarah,</h3>
                <p className='text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base'>Meet Mike, your Kitchen Renovation Pro.</p>
                <div className='flex items-center gap-2 sm:gap-3'>
                  <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center'>
                    <span className='font-roboto font-semibold text-gray-600 text-sm sm:text-base'>M</span>
                  </div>
                  <div>
                    <div className='font-roboto font-semibold text-gray-900 text-sm sm:text-base'>Mike</div>
                    <div className='text-blue-600 text-xs sm:text-sm'>✓ Bidquotes Verified Pro</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className='text-center lg:text-left'>
              <h2 className='font-inter text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>Get multiple competitive bids in minutes.</h2>
              <div className='flex items-center gap-3 mb-4 sm:mb-6 justify-center lg:justify-start'>
                <Clock className='h-5 w-5 sm:h-6 sm:w-6 text-blue-600' />
                <span className='font-inter text-base sm:text-lg text-blue-600'>Average 10 minute response time</span>
              </div>
              <p className='font-inter text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg'>
                Your job posting instantly goes out to our network of contractors. Post your anytime, bid on jobs anytime!
              </p>
            </div>
          </div>

          {/* Second Row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            {/* Left side - Content */}
            <div className='text-center lg:text-left order-2 lg:order-1'>
              <h2 className='font-inter text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6'>Quality contractors you can trust.</h2>
              <div className='flex items-center gap-3 mb-4 sm:mb-6 justify-center lg:justify-start'>
                <CheckCircle className='h-5 w-5 sm:h-6 sm:w-6 text-green-600' />
                <span className='font-inter text-base sm:text-lg text-green-600'>Background checked & verified</span>
              </div>
              <p className='font-inter text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg'>
                All contractors on Bidquotes are licensed, insured, and background-checked. If you&apos;re not satisfied with the work, we&apos;ll make it right with our
                satisfaction guarantee.
              </p>
            </div>

            {/* Right side - Image - Mobile Responsive */}
            <div className='relative h-64 sm:h-80 lg:h-96 flex justify-center lg:justify-end order-1 lg:order-2'>
              <div className='w-64 h-48 sm:w-80 sm:h-64 lg:h-72 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden'>
                <Image src='/images/contractor-profile.jpg' alt='Professional contractor at work' fill className='object-cover rounded-lg shadow-xl' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Images */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <h2 className='font-inter text-4xl font-bold text-center text-gray-900 mb-12'>What jobs are done with Bidquotes</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                title: 'Plumbing',
                desc: 'Repairs, installations, and maintenance',
                image: '/images/services/plumbing.jpg',
                alt: 'Plumbing services',
              },
              {
                title: 'Fencing & Decking',
                desc: 'Installation and repair of fences and decks',
                image: '/images/services/fencing.jpg',
                alt: 'Fencing services',
              },
              {
                title: 'Painting',
                desc: 'Interior and exterior painting services',
                image: '/images/services/painting.jpg',
                alt: 'Painting services',
              },
              {
                title: 'Landscaping',
                desc: 'Garden design and maintenance',
                image: '/images/services/landscaping.jpg',
                alt: 'Landscaping services',
              },
            ].map((service, index) => (
              <Card key={index} className='hover:shadow-lg transition-shadow overflow-hidden'>
                <div className='relative h-48 bg-gray-200'>
                  <Image src={service.image} alt={service.alt} fill className='object-cover' />
                </div>
                <CardContent className='p-6'>
                  <h3 className='font-roboto font-semibold text-lg mb-2'>{service.title}</h3>
                  <p className='font-inter text-gray-600 text-sm'>{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer section - Optimized with Static Icons */}
      <Footer />

      {/* ✅ Add structured data here */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Bidquotes',
            description: 'Home services marketplace connecting Canadian homeowners with verified contractors through competitive bidding',
            url: 'https://bidquotes.ca',
            telephone: '+1(437)688-8669',
            email: 'support@bidquotes.ca',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'CA',
            },
            serviceArea: {
              '@type': 'Country',
              name: 'Canada',
            },
            knowsAbout: ['Home Contractors', 'Home Renovation', 'Home Maintenance', 'Contractor Bidding'],
            areaServed: 'Canada',
          }),
        }}
      />
    </main>
  );
}
