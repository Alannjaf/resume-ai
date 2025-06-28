'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'

export default function PrivacyPolicy() {
  const { t } = useLanguage()
  
  // Helper function to safely get array translations
  const getArrayTranslation = (key: string): string[] => {
    const translation = t(key)
    return Array.isArray(translation) ? translation : []
  }
  
  // Helper function to safely get object array translations
  const getObjectArrayTranslation = (key: string): Array<{ title?: string; content?: string; name?: string; purpose?: string }> => {
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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">{t('privacy.title')}</h1>
            <p className="text-xl text-gray-600 mb-4">
              {t('privacy.subtitle')}
            </p>
            <p className="text-sm text-gray-500">
              {t('privacy.lastUpdated')}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
          
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.sections.introduction.title')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('privacy.sections.introduction.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.sections.dataCollection.title')}</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('privacy.sections.dataCollection.personal.title')}</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                {getArrayTranslation('privacy.sections.dataCollection.personal.items').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('privacy.sections.dataCollection.usage.title')}</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                {getArrayTranslation('privacy.sections.dataCollection.usage.items').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.sections.dataUsage.title')}</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {getArrayTranslation('privacy.sections.dataUsage.items').map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.sections.dataSharing.title')}</h2>
              <p className="mb-6 text-lg text-gray-700 leading-relaxed">{t('privacy.sections.dataSharing.content')}</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                {getObjectArrayTranslation('privacy.sections.dataSharing.circumstances').map((circumstance, index) => (
                  <li key={index}><strong className="text-gray-900">{circumstance.title}:</strong> {circumstance.content}</li>
                ))}
              </ul>
            </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.sections.dataSecurity.title')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('privacy.sections.dataSecurity.content')}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('privacy.sections.userRights.title')}</h2>
            <p className="mb-6 text-lg text-gray-700 leading-relaxed">{t('privacy.sections.userRights.content')}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {getArrayTranslation('privacy.sections.userRights.rights').map((right, index) => (
                <li key={index}>{right}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.cookies.title')}</h2>
            <p>
              {t('privacy.sections.cookies.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.thirdPartyServices.title')}</h2>
            <p className="mb-4">{t('privacy.sections.thirdPartyServices.content')}</p>
            <ul className="list-disc pl-6">
              {getObjectArrayTranslation('privacy.sections.thirdPartyServices.services').map((service, index) => (
                <li key={index}><strong>{service.name}:</strong> {service.purpose}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.childrenPrivacy.title')}</h2>
            <p>
              {t('privacy.sections.childrenPrivacy.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.policyChanges.title')}</h2>
            <p>
              {t('privacy.sections.policyChanges.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.contact.title')}</h2>
            <p className="mb-4">{t('privacy.sections.contact.content')}</p>
            <ul className="list-none">
              <li><strong>Email:</strong> {t('privacy.sections.contact.email')}</li>
              <li><strong>Phone:</strong> {t('privacy.sections.contact.phone')}</li>
              <li><strong>Address:</strong> {t('privacy.sections.contact.address')}</li>
            </ul>
            </section>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}