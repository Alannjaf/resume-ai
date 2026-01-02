'use client'

import { useEffect, useState, useRef } from 'react'
import { FileText, Sparkles, Palette, Download, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: FileText,
    title: 'Sign Up & Start',
    description: 'Create your free account in seconds. No credit card required to get started.',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Creation',
    description: 'Let our AI help you write compelling content, optimize keywords, and enhance your resume.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Palette,
    title: 'Choose Template',
    description: 'Select from professional, ATS-friendly templates that match your style and industry.',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Download,
    title: 'Export & Apply',
    description: 'Download your resume as PDF or share it online. Start applying to your dream jobs!',
    gradient: 'from-green-500 to-emerald-600',
  },
]

function StepCard({ step, index, isVisible, isLast }: { step: typeof steps[0], index: number, isVisible: boolean, isLast: boolean }) {
  return (
    <div className="relative">
      <div
        className={`
          relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100
          transition-all duration-500 transform
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          hover:shadow-xl hover:scale-105
          group
        `}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        {/* Step number */}
        <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
          {index + 1}
        </div>

        {/* Icon */}
        <div className={`
          w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient}
          flex items-center justify-center mb-6
          shadow-lg group-hover:scale-110 group-hover:rotate-3
          transition-transform duration-300
        `}>
          <step.icon className="h-8 w-8 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
          {step.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {step.description}
        </p>

        {/* Hover gradient background */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${step.gradient} 
          opacity-0 group-hover:opacity-5 rounded-2xl
          transition-opacity duration-300 pointer-events-none
        `}></div>
      </div>

      {/* Connector arrow (not on last item) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-0">
          <ArrowRight className="h-8 w-8 text-gray-300" />
        </div>
      )}
    </div>
  )
}

export function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(new Array(steps.length).fill(false))
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSteps(new Array(steps.length).fill(true))
          }
        })
      },
      { threshold: 0.1 }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900">
              How It Works
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in 4 simple steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isVisible={visibleSteps[index]}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

