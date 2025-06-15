import { Sparkles, Languages, Palette, Download, Shield, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Generate and enhance your resume content with advanced AI that understands your industry and role.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Create resumes in Kurdish Sorani, Arabic, and English with proper RTL text support.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Palette,
    title: 'Professional Templates',
    description: 'Choose from dozens of modern, ATS-friendly templates designed by professionals.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Download,
    title: 'Export Options',
    description: 'Download your resume in PDF, DOCX formats, or share via direct link.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Your data is encrypted and secure. We never share your personal information.',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    icon: Zap,
    title: 'Real-time Preview',
    description: 'See changes instantly as you build your resume with live preview functionality.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Every Professional
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to create a standout resume that gets you noticed by employers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}