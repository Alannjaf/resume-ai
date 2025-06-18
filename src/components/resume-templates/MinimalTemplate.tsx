'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface MinimalTemplateProps {
  data: ResumeData
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-light text-gray-900 mb-3">
              {data.personal.fullName || 'Your Name'}
            </h1>
            <div className="text-gray-600 text-sm space-y-1">
              {data.personal.email && <div>{data.personal.email}</div>}
              {data.personal.phone && <div>{data.personal.phone}</div>}
              {data.personal.location && <div>{data.personal.location}</div>}
              {data.personal.linkedin && <div>{data.personal.linkedin}</div>}
              {data.personal.website && <div>{data.personal.website}</div>}
            </div>
          </div>
          
          {/* Profile Picture */}
          {data.personal.profilePictureUrl && (
            <div className="flex-shrink-0">
              <img
                src={data.personal.profilePictureUrl}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border border-gray-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="mb-1">
                  <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                  <div className="text-gray-700 text-sm">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 text-sm mt-2">
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
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h3>
                <div className="text-gray-700 text-sm">
                  {edu.school} {edu.location && `• ${edu.location}`}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </div>
                {edu.gpa && (
                  <div className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</div>
                )}
                {edu.achievements && (
                  <div className="text-gray-700 text-sm mt-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="">
            <h2 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">
              Skills
            </h2>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-gray-700 text-sm">
                  {skill.name} {skill.level && `• ${skill.level}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="">
            <h2 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <div key={index} className="text-gray-700 text-sm">
                  {lang.name} • {lang.proficiency}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}