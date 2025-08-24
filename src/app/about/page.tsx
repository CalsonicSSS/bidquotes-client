import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Users, Shield, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Bidquotes | Canadian Home Services Marketplace',
  description: 'Founded in 2025, Bidquotes transforms how Canadian homeowners find reliable contractors. Competitive bidding ensures fair pricing and quality service.',
};

export default function AboutUsPage() {
  return (
    <main className='min-h-screen'>
      {/* header section */}
      <Header />

      {/* Hero Section */}
      <section className='relative h-[300px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='container mx-auto px-5 relative z-10 text-center'>
          <h1 className='font-inter text-4xl md:text-5xl font-bold text-white mb-6 leading-tight'>About Bidquotes</h1>
          <p className='font-inter text-xl text-gray-200 max-w-2xl mx-auto'>We're transforming how homeowners connect with skilled contractors through competitive bidding</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='font-inter text-3xl md:text-4xl font-bold text-gray-900 mb-8'>Our Mission</h2>
            <div className='bg-blue-50 rounded-lg p-8 border-2 border-blue-200'>
              <p className='font-inter text-xl text-gray-700 leading-relaxed'>
                At Bidquotes, we believe every homeowner deserves access to quality contractors at fair prices. Our platform eliminates the guesswork from home maintenance by
                connecting you with pre-screened professionals who compete for your business, ensuring you get the best value for your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='font-inter text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center'>Our Story</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
              <div>
                <p className='font-inter text-gray-600 mb-6 leading-relaxed'>
                  Founded in 2025, Bidquotes was born from a simple frustration: finding reliable contractors shouldn't be a gamble. Our founders experienced firsthand the
                  challenges of home maintenance - from overpriced quotes to unreliable service providers.
                </p>
                <p className='font-inter text-gray-600 mb-6 leading-relaxed'>
                  We realized that homeowners needed a platform that not only connected them with skilled professionals but also fostered healthy competition to ensure fair pricing
                  and quality service.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>
                  Today, we're proud to serve thousands of homeowners and contractors across the region, facilitating connections that create lasting value for both sides of our
                  marketplace.
                </p>
              </div>
              <div className='bg-white p-8 rounded-lg shadow-lg'>
                <div className='grid grid-cols-2 gap-4 text-center'>
                  <div>
                    <div className='font-inter text-3xl font-bold text-blue-theme mb-2'>5,000+</div>
                    <div className='font-roboto text-gray-600 text-sm'>Jobs Completed</div>
                  </div>
                  <div>
                    <div className='font-inter text-3xl font-bold text-blue-theme mb-2'>2,500+</div>
                    <div className='font-roboto text-gray-600 text-sm'>Contractors</div>
                  </div>
                  <div>
                    <div className='font-inter text-3xl font-bold text-blue-theme mb-2'>95%</div>
                    <div className='font-roboto text-gray-600 text-sm'>Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className='font-inter text-3xl font-bold text-blue-theme mb-2'>4.7★</div>
                    <div className='font-roboto text-gray-600 text-sm'>Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='font-inter text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center'>Our Values</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <Card className='text-center p-6'>
                <CardContent className='pt-6'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <CheckCircle className='h-8 w-8 text-blue-600' />
                  </div>
                  <h3 className='font-roboto font-bold text-lg mb-3'>Quality First</h3>
                  <p className='font-inter text-gray-600 text-sm'>We rigorously vet all contractors to ensure they meet our high standards for craftsmanship and reliability.</p>
                </CardContent>
              </Card>

              <Card className='text-center p-6'>
                <CardContent className='pt-6'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Users className='h-8 w-8 text-green-600' />
                  </div>
                  <h3 className='font-roboto font-bold text-lg mb-3'>Community</h3>
                  <p className='font-inter text-gray-600 text-sm'>We build lasting relationships between homeowners and contractors, fostering a supportive community.</p>
                </CardContent>
              </Card>

              <Card className='text-center p-6'>
                <CardContent className='pt-6'>
                  <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Shield className='h-8 w-8 text-purple-600' />
                  </div>
                  <h3 className='font-roboto font-bold text-lg mb-3'>Trust & Safety</h3>
                  <p className='font-inter text-gray-600 text-sm'>Your security is paramount. We protect your information and ensure all transactions are safe and secure.</p>
                </CardContent>
              </Card>

              <Card className='text-center p-6'>
                <CardContent className='pt-6'>
                  <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Zap className='h-8 w-8 text-orange-600' />
                  </div>
                  <h3 className='font-roboto font-bold text-lg mb-3'>Innovation</h3>
                  <p className='font-inter text-gray-600 text-sm'>We continuously improve our platform to make home maintenance easier and more efficient for everyone.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='font-inter text-3xl md:text-4xl font-bold text-gray-900 mb-8'>Meet Our Team</h2>
            <p className='font-inter text-lg text-gray-600 mb-12'>We're a passionate team of professionals dedicated to revolutionizing the home services industry.</p>
            <div className='bg-white p-8 rounded-lg shadow-lg'>
              <p className='font-inter text-gray-700 mb-6 leading-relaxed'>
                Our diverse team brings together expertise in technology, construction, customer service, and business development. We're united by a shared vision of making home
                maintenance stress-free and affordable for everyone.
              </p>
              <p className='font-inter text-gray-700 leading-relaxed'>
                From our customer support specialists who ensure every interaction is positive, to our technical team that keeps the platform running smoothly, every team member
                plays a crucial role in our mission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer section */}
      <Footer />
    </main>
  );
}
