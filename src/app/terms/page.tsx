'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function TermsOfService() {
  const { t } = useLanguage()
  
  // Helper function to safely get array translations
  const getArrayTranslation = (key: string): string[] => {
    const translation = t(key)
    return Array.isArray(translation) ? translation : []
  }

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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{t('terms.title')}</h1>
            <p className="text-xl text-gray-600 mb-4">
              {t('terms.subtitle')}
            </p>
            <p className="text-sm text-gray-500">
              {t('terms.lastUpdated')}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
          
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('terms.sections.acceptance.title')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('terms.sections.acceptance.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('terms.sections.description.title')}</h2>
              <p className="mb-6 text-lg text-gray-700 leading-relaxed">
                {t('terms.sections.description.content')}
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {getArrayTranslation('terms.sections.description.features').map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('terms.sections.userAccounts.title')}</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('terms.sections.userAccounts.registration.title')}</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              {t('terms.sections.userAccounts.registration.content')}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('terms.sections.userAccounts.security.title')}</h3>
            <p className="text-gray-700 leading-relaxed">
              {t('terms.sections.userAccounts.security.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('terms.sections.payments.title')}</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('terms.sections.payments.plans.title')}</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              {t('terms.sections.payments.plans.content')}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('terms.sections.payments.processing.title')}</h3>
            <p className="mb-6 text-gray-700 leading-relaxed">
              {t('terms.sections.payments.processing.content')}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('terms.sections.payments.refunds.title')}</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {getArrayTranslation('terms.sections.payments.refunds.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.userContent.title')}</h2>
            <h3 className="text-xl font-medium mb-3">{t('terms.sections.userContent.content.title')}</h3>
            <p className="mb-4">
              {t('terms.sections.userContent.content.text')}
            </p>
            
            <h3 className="text-xl font-medium mb-3">{t('terms.sections.userContent.license.title')}</h3>
            <p className="mb-4">
              {t('terms.sections.userContent.license.text')}
            </p>
            
            <h3 className="text-xl font-medium mb-3">{t('terms.sections.userContent.backup.title')}</h3>
            <p>
              {t('terms.sections.userContent.backup.text')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.acceptableUse.title')}</h2>
            <p className="mb-4">{t('terms.sections.acceptableUse.content')}</p>
            <ul className="list-disc pl-6">
              {getArrayTranslation('terms.sections.acceptableUse.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.aiContent.title')}</h2>
            <p className="mb-4">
              {t('terms.sections.aiContent.content')}
            </p>
            <ul className="list-disc pl-6">
              {getArrayTranslation('terms.sections.aiContent.items').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.intellectualProperty.title')}</h2>
            <p className="mb-4">
              {t('terms.sections.intellectualProperty.content')}
            </p>
            <p>
              {t('terms.sections.intellectualProperty.templates')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.warranties.title')}</h2>
            <p>
              {t('terms.sections.warranties.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.liability.title')}</h2>
            <p>
              {t('terms.sections.liability.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.termination.title')}</h2>
            <p className="mb-4">
              {t('terms.sections.termination.content')}
            </p>
            <p>
              {t('terms.sections.termination.effect')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.governingLaw.title')}</h2>
            <p>
              {t('terms.sections.governingLaw.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.changes.title')}</h2>
            <p>
              {t('terms.sections.changes.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.contact.title')}</h2>
            <p className="mb-4">{t('terms.sections.contact.content')}</p>
            <ul className="list-none">
              <li><strong>Email:</strong> {t('terms.sections.contact.email')}</li>
              <li><strong>Phone:</strong> {t('terms.sections.contact.phone')}</li>
              <li><strong>Address:</strong> {t('terms.sections.contact.address')}</li>
            </ul>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}