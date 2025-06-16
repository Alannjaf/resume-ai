export interface Template {
  id: string
  name: string
  description: string
  preview: string // Preview image path
  category: 'professional' | 'modern' | 'creative' | 'minimal'
  isPopular: boolean
  isPremium: boolean
}

export const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design with subtle accents',
    preview: '/templates/modern-preview.png',
    category: 'modern',
    isPopular: true,
    isPremium: false
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional layout perfect for corporate environments',
    preview: '/templates/classic-preview.png',
    category: 'professional',
    isPopular: true,
    isPremium: false
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and elegant with focus on content',
    preview: '/templates/minimal-preview.png',
    category: 'minimal',
    isPopular: false,
    isPremium: false
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Eye-catching design for creative professionals',
    preview: '/templates/creative-preview.png',
    category: 'creative',
    isPopular: false,
    isPremium: true
  },
  {
    id: 'executive',
    name: 'Executive Premium',
    description: 'Sophisticated layout for senior positions',
    preview: '/templates/executive-preview.png',
    category: 'professional',
    isPopular: false,
    isPremium: true
  },
  {
    id: 'tech',
    name: 'Tech Focus',
    description: 'Modern layout optimized for tech professionals',
    preview: '/templates/tech-preview.png',
    category: 'modern',
    isPopular: false,
    isPremium: true
  },
  {
    id: 'modern-yellow',
    name: 'Modern Yellow',
    description: 'Contemporary design with yellow accents and sidebar layout',
    preview: '/templates/modern-yellow-preview.png',
    category: 'modern',
    isPopular: true,
    isPremium: true
  }
]

export const getTemplate = (id: string): Template | undefined => {
  return templates.find(template => template.id === id)
}

export const getTemplatesByCategory = (category: string) => {
  return templates.filter(template => template.category === category)
}

export const getFreeTemplates = () => {
  return templates.filter(template => !template.isPremium)
}

export const getPremiumTemplates = () => {
  return templates.filter(template => template.isPremium)
}