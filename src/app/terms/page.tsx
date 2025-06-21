'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function TermsOfService() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-indigo-100 opacity-20 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-xl text-gray-600 mb-4">
              Terms and conditions for using Work.krd services
            </p>
            <p className="text-sm text-gray-500">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
          
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                By accessing and using Work.krd ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Description of Service</h2>
              <p className="mb-6 text-lg text-gray-700 leading-relaxed">
                Work.krd is an AI-powered resume building platform that helps users create professional resumes. Our service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Professional resume templates and design tools</li>
                <li>AI-powered content generation using Google Gemini</li>
                <li>PDF export and online sharing capabilities</li>
                <li>Multi-language support (English, Arabic, Kurdish)</li>
                <li>Secure user account management via Clerk</li>
                <li>Payment processing through FIB and Nasspay</li>
              </ul>
            </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Registration</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              You must create an account through Clerk authentication to access our resume building features. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Security</h3>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. Clerk handles secure authentication. You must notify us immediately of any unauthorized access to your account.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Subscription and Payments</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Subscription Plans</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Work.krd offers both free and paid subscription plans. Paid subscriptions provide access to premium features including advanced AI content generation and additional resume templates.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Processing</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              Payments are processed securely through our payment partners (FIB and Nasspay) for users in Kurdistan Region and Iraq. By subscribing to a paid plan, you authorize us to charge your payment method.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Refunds and Cancellation</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You may cancel your subscription at any time through your dashboard</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>Refunds are handled on a case-by-case basis</li>
              <li>No refunds for partial months of service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Content and Data</h2>
            <h3 className="text-xl font-medium mb-3">Your Content</h3>
            <p className="mb-4">
              You retain ownership of all content you upload or create using our service, including resume data, personal information, and documents.
            </p>
            
            <h3 className="text-xl font-medium mb-3">License to Use</h3>
            <p className="mb-4">
              By using our service, you grant us a non-exclusive license to use your content solely for the purpose of providing our services to you.
            </p>
            
            <h3 className="text-xl font-medium mb-3">Data Backup and Storage</h3>
            <p>
              While we make reasonable efforts to backup your data, you are responsible for maintaining your own copies of important information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use Policy</h2>
            <p className="mb-4">You agree not to use the service to:</p>
            <ul className="list-disc pl-6">
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious software or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for any commercial purpose not expressly permitted</li>
              <li>Share false, misleading, or fraudulent information</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. AI-Generated Content</h2>
            <p className="mb-4">
              Our service uses artificial intelligence to generate resume content and suggestions. You acknowledge that:
            </p>
            <ul className="list-disc pl-6">
              <li>AI-generated content is for assistance purposes only</li>
              <li>You are responsible for reviewing and verifying all content accuracy</li>
              <li>We do not guarantee the quality or suitability of AI-generated content</li>
              <li>Final resume content and accuracy is your responsibility</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              The Work.krd service, including its design, functionality, and content (excluding user-generated content), is owned by us and protected by intellectual property laws.
            </p>
            <p>
              Our resume templates and design elements are licensed for use within our platform only. You may not extract, reproduce, or distribute our templates outside of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p>
              Upon termination, your right to use the service will cease immediately, and we may delete your account and data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Kurdistan Region of Iraq, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
            <ul className="list-none">
              <li><strong>Email:</strong> info@work.krd</li>
              <li><strong>Phone:</strong> +964 750 491 0348</li>
              <li><strong>Address:</strong> Erbil, Kurdistan Region, Iraq</li>
            </ul>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}