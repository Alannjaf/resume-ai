'use client'

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-sm font-bold">W</span>
              </div>
              <span className="text-xl font-bold">Work<span className="text-blue-600">.krd</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('metadata.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.sections.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.features')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.pricing')}
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="/resume-builder" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.resumeBuilder')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.sections.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.contactUs')}
                </a>
              </li>
              <li>
                <a href="/billing" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.billing')}
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.links.termsOfService')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('nav.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>info@work.krd</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+964 750 491 0348</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Erbil, Kurdistan Region, Iraq</span>
              </li>
            </ul>
            
            {/* Language Support */}
            <div className="pt-4">
              <p className="text-xs text-gray-500 mb-2">{t('footer.languagesSupported')}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">English</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">کوردی</span>
                <span className="bg-gray-800 px-2 py-1 rounded text-xs">العربية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              {t('footer.copyright')}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>{t('footer.poweredBy')}</span>
              <span>•</span>
              <span>{t('footer.securePayments')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}