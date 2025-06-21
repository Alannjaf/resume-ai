'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function PrivacyPolicy() {
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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-gray-600 mb-4">
              How we protect and handle your personal information
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Introduction</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Work.krd ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our AI-powered resume building services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials managed securely through Clerk authentication</li>
                <li>Professional information (work history, education, skills, resume content)</li>
                <li>Payment information (processed securely by FIB and Nasspay payment providers)</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Usage Data</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                <li>IP address and browser information</li>
                <li>Pages visited and time spent on our service</li>
                <li>Device information and operating system</li>
                <li>Resume creation and export activities</li>
                <li>AI content generation usage patterns</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, operate, and maintain our AI-powered resume building services</li>
                <li>Process your account registration and authentication through Clerk</li>
                <li>Generate AI-powered resume content and suggestions using Google Gemini</li>
                <li>Process payments securely through FIB and Nasspay</li>
                <li>Send you service notifications, updates, and support messages via email</li>
                <li>Respond to your contact form submissions and support requests</li>
                <li>Improve our website and services based on usage analytics</li>
                <li>Provide multi-language support (English, Arabic, Kurdish)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Information Sharing and Disclosure</h2>
              <p className="mb-6 text-lg text-gray-700 leading-relaxed">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li><strong className="text-gray-900">Service Providers:</strong> With Clerk (authentication), Google Gemini (AI services), FIB/Nasspay (payments), and Resend (email services)</li>
                <li><strong className="text-gray-900">Legal Compliance:</strong> When required by law or to protect our rights and safety</li>
                <li><strong className="text-gray-900">Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
                <li><strong className="text-gray-900">Consent:</strong> With your explicit consent for other purposes</li>
              </ul>
            </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Data Security</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our data is securely stored and transmitted using industry-standard encryption. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Your Rights</h2>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access and review your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Object to processing of your personal information</li>
              <li>Data portability (receive a copy of your data)</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences, though some features may not function properly if cookies are disabled.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="mb-4">Our website integrates with third-party services:</p>
            <ul className="list-disc pl-6">
              <li><strong>Clerk:</strong> User authentication and account management</li>
              <li><strong>Google Gemini AI:</strong> AI-powered resume content generation</li>
              <li><strong>Payment Processors:</strong> FIB and Nasspay for secure payment processing</li>
              <li><strong>Email Services:</strong> For transactional and marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
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