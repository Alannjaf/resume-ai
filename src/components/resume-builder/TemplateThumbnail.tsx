'use client'

import React from 'react'
import Image from 'next/image'

interface TemplateThumbnailProps {
  templateId: string
  className?: string
}

export function TemplateThumbnail({ templateId, className = '' }: TemplateThumbnailProps) {
  const getThumbnailSrc = () => {
    switch (templateId) {
      case 'modern':
        return '/thumbnails/modern.svg'
      case 'creative':
        return '/thumbnails/creative.svg'
      case 'executive':
        return '/thumbnails/executive.svg'
      case 'elegant':
        return '/thumbnails/elegant.svg'
      case 'minimalist':
        return '/thumbnails/minimalist.svg'
      case 'creative-artistic':
        return '/thumbnails/creative-artistic.svg'
      case 'developer':
        return '/thumbnails/developer.svg'
      default:
        return '/thumbnails/modern.svg'
    }
  }

  const getAltText = () => {
    switch (templateId) {
      case 'modern':
        return 'Modern Professional Resume Template Preview'
      case 'creative':
        return 'Creative Resume Template Preview'
      case 'executive':
        return 'Executive Professional Resume Template Preview'
      case 'elegant':
        return 'Elegant Professional Resume Template Preview'
      case 'minimalist':
        return 'Minimalist Modern Resume Template Preview'
      case 'creative-artistic':
        return 'Creative Artistic Resume Template Preview'
      case 'developer':
        return 'Developer Resume Template Preview'
      default:
        return 'Resume Template Preview'
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={getThumbnailSrc()}
        alt={getAltText()}
        width={300}
        height={400}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  )
}