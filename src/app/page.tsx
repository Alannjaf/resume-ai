import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { About } from '@/components/landing/about'
import { Contact } from '@/components/landing/contact'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}