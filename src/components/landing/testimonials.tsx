'use client'

import { useEffect, useState, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    content: 'Work.krd helped me create a stunning resume that got me multiple interviews. The AI suggestions were incredibly helpful!',
    rating: 5,
  },
  {
    name: 'Ahmed Al-Mansoori',
    role: 'Marketing Manager',
    content: 'The multilingual support is amazing. I created resumes in both Arabic and English with ease. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Lisa Chen',
    role: 'Product Designer',
    content: 'The templates are professional and ATS-friendly. Landed my dream job within weeks of using Work.krd!',
    rating: 5,
  },
  {
    name: 'Mohammed Hassan',
    role: 'Data Analyst',
    content: 'Best resume builder I\'ve used. The AI optimization feature helped me identify and fix key issues.',
    rating: 5,
  },
]

function TestimonialCard({ testimonial, index, isVisible }: { testimonial: Testimonial, index: number, isVisible: boolean }) {
  return (
    <Card
      className={`
        relative overflow-hidden border border-gray-200 shadow-lg
        transition-all duration-500 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        hover:shadow-xl hover:scale-105
        group
        bg-white
      `}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <CardContent className="p-6">
        {/* Quote icon */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote className="h-12 w-12 text-blue-600" />
        </div>

        {/* Rating stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Testimonial content */}
        <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author info */}
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{testimonial.name}</div>
            <div className="text-sm text-gray-500">{testimonial.role}</div>
          </div>
        </div>

        {/* Hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(testimonials.length).fill(false))
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards(new Array(testimonials.length).fill(true))
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
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900">
              Loved by Professionals
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            See what our users are saying about Work.krd
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
              isVisible={visibleCards[index]}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

