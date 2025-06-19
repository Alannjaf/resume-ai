'use client'

import React from 'react'

interface TemplateThumbnailProps {
  templateId: string
  className?: string
}

export function TemplateThumbnail({ templateId, className = '' }: TemplateThumbnailProps) {
  const getThumbnailContent = () => {
    switch (templateId) {
      case 'modern':
        return (
          <div className={`bg-white border border-gray-200 ${className}`}>
            {/* Modern template preview */}
            <div className="flex h-full">
              {/* Left sidebar */}
              <div className="w-1/3 bg-slate-600 p-2">
                <div className="bg-white rounded-full w-8 h-8 mb-2 mx-auto"></div>
                <div className="space-y-1">
                  <div className="bg-slate-400 h-1 rounded"></div>
                  <div className="bg-slate-400 h-1 rounded w-3/4"></div>
                  <div className="bg-slate-400 h-1 rounded w-1/2"></div>
                </div>
                <div className="mt-3">
                  <div className="bg-slate-300 h-1 rounded mb-1"></div>
                  <div className="bg-slate-300 h-1 rounded w-5/6 mb-1"></div>
                  <div className="bg-slate-300 h-1 rounded w-2/3"></div>
                </div>
              </div>
              {/* Right content */}
              <div className="w-2/3 p-2">
                <div className="bg-gray-300 h-2 rounded mb-2"></div>
                <div className="bg-gray-200 h-1 rounded mb-1"></div>
                <div className="bg-gray-200 h-1 rounded w-4/5 mb-2"></div>
                <div className="space-y-2">
                  <div className="border-b border-gray-200 pb-1">
                    <div className="bg-gray-400 h-1 rounded w-1/2 mb-1"></div>
                    <div className="bg-gray-300 h-0.5 rounded w-3/4"></div>
                  </div>
                  <div className="border-b border-gray-200 pb-1">
                    <div className="bg-gray-400 h-1 rounded w-2/3 mb-1"></div>
                    <div className="bg-gray-300 h-0.5 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'creative':
        return (
          <div className={`bg-gray-50 border border-gray-200 relative overflow-hidden ${className}`}>
            {/* Creative template preview */}
            {/* Background circles */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full opacity-60 -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-100 rounded-full opacity-40 -ml-10 -mb-10"></div>
            {/* Blue accent line */}
            <div className="absolute left-0 top-0 w-0.5 h-full bg-blue-500"></div>
            
            <div className="p-2 relative">
              {/* Header with profile */}
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white mr-2"></div>
                <div>
                  <div className="bg-gray-800 h-1.5 rounded w-16 mb-0.5"></div>
                  <div className="bg-blue-500 h-0.5 rounded w-12"></div>
                </div>
              </div>
              {/* Contact chips */}
              <div className="flex flex-wrap gap-0.5 mb-2">
                <div className="bg-white border border-gray-200 rounded-full px-1 py-0.5 text-xs">Email</div>
                <div className="bg-white border border-gray-200 rounded-full px-1 py-0.5 text-xs">Phone</div>
              </div>
              {/* Content sections */}
              <div className="flex">
                <div className="w-1/3 pr-1">
                  <div className="mb-2">
                    <div className="bg-gray-700 h-0.5 rounded w-8 mb-1"></div>
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      <div className="bg-blue-500 text-xs px-1 rounded text-white">JS</div>
                      <div className="bg-blue-500 text-xs px-1 rounded text-white">React</div>
                    </div>
                  </div>
                </div>
                <div className="w-2/3">
                  <div className="bg-gray-100 p-1 rounded mb-1">
                    <div className="bg-gray-600 h-0.5 rounded w-8 mb-0.5"></div>
                    <div className="bg-gray-400 h-0.5 rounded w-full"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="bg-gray-300 h-0.5 rounded w-6"></div>
                    <div className="bg-gray-200 h-0.5 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className={`bg-gray-100 border border-gray-200 flex items-center justify-center ${className}`}>
            <span className="text-gray-500 text-xs">Preview</span>
          </div>
        )
    }
  }

  return getThumbnailContent()
}