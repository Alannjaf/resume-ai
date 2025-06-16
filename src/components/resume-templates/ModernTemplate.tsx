'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface ModernTemplateProps {
  data: ResumeData
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.personal.email && (
            <span className="flex items-center">
              📧 {data.personal.email}
            </span>
          )}
          {data.personal.phone && (
            <span className="flex items-center">
              📞 {data.personal.phone}
            </span>
          )}
          {data.personal.location && (
            <span className="flex items-center">
              📍 {data.personal.location}
            </span>
          )}
          {data.personal.linkedin && (
            <span className="flex items-center">
              💼 {data.personal.linkedin}
            </span>
          )}
          {data.personal.website && (
            <span className="flex items-center">
              🌐 {data.personal.website}
            </span>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6" data-section="summary">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8" data-section="experience">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-1">
            Work Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-100 pl-4 mb-6" data-section="experience-item">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-blue-600 font-medium mb-1">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm">
                    {exp.description.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-8" data-section="education">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="border-l-2 border-blue-100 pl-4 mb-4" data-section="education-item">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="text-blue-600 font-medium">
                  {edu.school} {edu.location && `• ${edu.location}`}
                </div>
                {edu.gpa && (
                  <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                )}
                {edu.achievements && (
                  <div className="text-gray-700 text-sm mt-1">
                    {edu.achievements.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills */}
        {data.skills.length > 0 && (
          <div data-section="skills" className="keep-together">
            <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap"
                >
                  {skill.name} {skill.level && `(${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div data-section="languages" className="keep-together">
            <h2 className="text-xl font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-900">{lang.name}</span>
                  <span className="text-gray-600 text-sm">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}