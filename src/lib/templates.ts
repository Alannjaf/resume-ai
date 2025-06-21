// Dynamically get all available templates from the system
export interface TemplateInfo {
  id: string
  name: string
  description: string
  category: 'professional' | 'creative' | 'minimal'
}

// This should match the templates defined in TemplateGallery.tsx
export const getAllTemplates = (): TemplateInfo[] => {
  return [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean, professional layout with dual columns',
      category: 'professional'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Artistic design with visual elements and colors',
      category: 'creative'
    },
    {
      id: 'executive',
      name: 'Executive Professional',
      description: 'Clean executive layout with elegant typography',
      category: 'professional'
    },
    {
      id: 'elegant',
      name: 'Elegant Professional',
      description: 'Sophisticated single-column design with navy accents',
      category: 'professional'
    },
    {
      id: 'minimalist',
      name: 'Minimalist Modern',
      description: 'Clean typography-focused design with minimal visual elements',
      category: 'minimal'
    },
    {
      id: 'creative-artistic',
      name: 'Creative Artistic',
      description: 'Vibrant and artistic design with colorful accents and decorative elements',
      category: 'creative'
    }
  ]
}

// Get just the template IDs
export const getTemplateIds = (): string[] => {
  return getAllTemplates().map(template => template.id)
}