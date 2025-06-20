import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export default function Home() {
  // Debug: Log Clerk key to console (remove after testing)
  console.log('Clerk PK:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 30) + '...')
  
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  )
}