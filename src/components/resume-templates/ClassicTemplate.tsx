'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface ClassicTemplateProps {
  data: ResumeData
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg" style={{ fontFamily: 'Times, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {data.personal.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-700 space-y-1">
          {data.personal.email && <div>{data.personal.email}</div>}
          <div className="flex justify-center gap-4 text-sm">
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
          </div>
          <div className="flex justify-center gap-4 text-sm">
            {data.personal.linkedin && <span>{data.personal.linkedin}</span>}
            {data.personal.website && <span>{data.personal.website}</span>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {data.summary && (
        <div className="mb-6" data-section="summary">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed text-justify">{data.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6" data-section="experience">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-1">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="keep-together" data-section="experience-item">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 text-base">{exp.jobTitle}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="font-semibold text-gray-700 mb-2">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                {exp.description && (
                  <div className="text-gray-800 text-sm ml-4">
                    {exp.description.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">• {line}</p>
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
        <div className="mb-6" data-section="education">
          <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-400 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="keep-together" data-section="education-item">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <span className="text-sm text-gray-600 italic">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="font-semibold text-gray-700">
                  {edu.school} {edu.location && `• ${edu.location}`}
                </div>
                {edu.gpa && (
                  <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
                )}
                {edu.achievements && (
                  <div className="text-gray-800 text-sm ml-4 mt-1">
                    {edu.achievements.split('\n').map((line, i) => (
                      <p key={i} className="mb-1">• {line}</p>
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
          <div className="keep-together" data-section="skills">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
              Skills
            </h2>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-900">{skill.name}</span>
                  {skill.level && <span className="text-gray-600 text-sm italic">{skill.level}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="keep-together" data-section="languages">
            <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-400 pb-1">
              Languages
            </h2>
            <div className="space-y-1">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-900">{lang.name}</span>
                  <span className="text-gray-600 text-sm italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}