import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function TermsOfServicePage() {
  return (
    <main className='min-h-screen'>
      {/* header section */}
      <Header />

      {/* Hero Section */}
      <section className='relative h-[250px] bg-gradient-to-r from-blue-900 to-blue-700 flex items-center'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='container mx-auto px-5 relative z-10 text-center'>
          <h1 className='font-inter text-4xl md:text-5xl font-bold text-white mb-4 leading-tight'>Terms of Service</h1>
          <p className='font-inter text-lg text-gray-200'>Last updated: July 1, 2025</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-5'>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-blue-50 p-6 rounded-lg mb-8'>
              <p className='font-inter text-gray-700 leading-relaxed'>
                Welcome to Bidquotes. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using Bidquotes, you agree to be bound by these
                Terms.
              </p>
            </div>

            <div className='space-y-8'>
              {/* Section 1 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>1. Acceptance of Terms</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  By using Bidquotes's services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to
                  these Terms, please do not use our services.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services
                  after any changes constitutes acceptance of the new Terms.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>2. Description of Service</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  Bidquotes is a marketplace platform that connects homeowners ("Buyers") with service providers and contractors ("Contractors") for home maintenance and
                  construction projects. We facilitate the bidding process but are not party to any agreements between Buyers and Contractors.
                </p>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='font-roboto font-semibold text-lg mb-2'>Key Features:</h3>
                  <ul className='font-inter text-gray-600 space-y-1 list-disc list-inside'>
                    <li>Job posting and bidding system</li>
                    <li>Contractor verification and background checks</li>
                    <li>Secure payment processing for commission fees</li>
                    <li>Rating and review system</li>
                    <li>Customer support services</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>3. User Responsibilities</h2>
                <div className='space-y-4'>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>For Buyers:</h3>
                    <ul className='font-inter text-gray-600 space-y-2 list-disc list-inside ml-4'>
                      <li>Provide accurate job descriptions and requirements</li>
                      <li>Respond to bids in a timely manner</li>
                      <li>Maintain respectful communication with contractors</li>
                      <li>Honor agreements made through our platform</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className='font-roboto font-semibold text-lg mb-2'>For Contractors:</h3>
                    <ul className='font-inter text-gray-600 space-y-2 list-disc list-inside ml-4'>
                      <li>Maintain current licenses and insurance</li>
                      <li>Provide honest and competitive bids</li>
                      <li>Complete work according to agreed specifications</li>
                      <li>Pay commission fees upon job acceptance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>4. Payment Terms</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  Bidquotes operates on a commission-based model. Contractors pay a fixed fee of $30 CAD per accepted job. This fee is due upon job acceptance and grants access to
                  buyer contact information.
                </p>
                <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
                  <h3 className='font-roboto font-semibold text-lg mb-2'>Important Payment Information:</h3>
                  <ul className='font-inter text-gray-700 space-y-1 list-disc list-inside'>
                    <li>All payments are processed securely through Stripe</li>
                    <li>Commission fees are non-refundable once paid</li>
                    <li>Payment is required before contractor-buyer communication begins</li>
                    <li>Additional fees may apply for premium services</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>5. Bidding System</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  Our platform allows up to 5 contractors to bid on each job posting. Bidding slots are allocated on a first-come, first-served basis. Buyers may close jobs before
                  reaching the maximum number of bids.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>
                  Contractors may edit their bids before job acceptance. Once a job is accepted by a contractor and payment is made, the job is considered closed to further
                  bidding.
                </p>
              </div>

              {/* Section 6 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>6. Prohibited Activities</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>Users are prohibited from engaging in the following activities:</p>
                <ul className='font-inter text-gray-600 space-y-2 list-disc list-inside ml-4'>
                  <li>Providing false or misleading information</li>
                  <li>Attempting to circumvent our commission system</li>
                  <li>Harassing, threatening, or discriminating against other users</li>
                  <li>Posting jobs or bids that violate local laws or regulations</li>
                  <li>Using our platform for illegal activities</li>
                  <li>Attempting to hack, disrupt, or compromise platform security</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>7. Limitation of Liability</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  Bidquotes acts as a platform facilitator and is not responsible for the quality of work, disputes between users, or any damages arising from contractor-buyer
                  relationships. We do not guarantee the accuracy of user-provided information or the completion of any projects.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>
                  Users engage with each other at their own risk. We strongly recommend verifying contractor credentials and obtaining appropriate insurance coverage for all
                  projects.
                </p>
              </div>

              {/* Section 8 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>8. Dispute Resolution</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  While we strive to maintain a positive platform experience, disputes may arise between users. We encourage direct communication to resolve issues. For serious
                  disputes, we may provide mediation services but are not obligated to do so.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>Users agree to first attempt resolution through our customer support before pursuing legal action.</p>
              </div>

              {/* Section 9 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>9. Termination</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>
                  We reserve the right to suspend or terminate user accounts for violations of these Terms, suspicious activity, or at our discretion. Users may also terminate
                  their accounts at any time.
                </p>
                <p className='font-inter text-gray-600 leading-relaxed'>
                  Upon termination, users lose access to platform features, but these Terms remain in effect for any ongoing obligations.
                </p>
              </div>

              {/* Section 10 */}
              <div>
                <h2 className='font-roboto text-2xl font-bold text-gray-900 mb-4'>10. Contact Information</h2>
                <p className='font-inter text-gray-600 mb-4 leading-relaxed'>For questions about these Terms of Service, please contact us at:</p>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='font-inter text-gray-700'>
                    <strong>Email:</strong> support@bidquotes.ca
                    <br />
                    <strong>Phone:</strong> 1-800-BIDQUOTES
                    <br />
                    <strong>Address:</strong> [Your Business Address]
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-12 p-6 bg-blue-50 rounded-lg'>
              <p className='font-inter text-gray-700 text-center'>
                By using Bidquotes, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
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
