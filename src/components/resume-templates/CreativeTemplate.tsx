'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface CreativeTemplateProps {
  data: ResumeData
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-purple-800 text-white p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {data.personal.fullName || 'Your Name'}
            </h1>
            <div className="h-1 w-16 bg-yellow-400 mb-4"></div>
            <div className="space-y-2 text-sm">
              {data.personal.email && (
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span className="break-all">{data.personal.email}</span>
                </div>
              )}
              {data.personal.phone && (
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>{data.personal.phone}</span>
                </div>
              )}
              {data.personal.location && (
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>{data.personal.location}</span>
                </div>
              )}
              {data.personal.linkedin && (
                <div className="flex items-center">
                  <span className="mr-2">💼</span>
                  <span className="break-all">{data.personal.linkedin}</span>
                </div>
              )}
              {data.personal.website && (
                <div className="flex items-center">
                  <span className="mr-2">🌐</span>
                  <span className="break-all">{data.personal.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-8 keep-together" data-section="skills">
              <h2 className="text-lg font-bold mb-4">Skills</h2>
              <div className="space-y-3">
                {data.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      {skill.level && <span>{skill.level}</span>}
                    </div>
                    <div className="h-2 bg-purple-400 rounded-full">
                      <div 
                        className="h-2 bg-yellow-400 rounded-full" 
                        style={{ 
                          width: skill.level === 'Expert' ? '100%' : 
                                 skill.level === 'Advanced' ? '80%' : 
                                 skill.level === 'Intermediate' ? '60%' : '40%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div className="keep-together" data-section="languages">
              <h2 className="text-lg font-bold mb-4">Languages</h2>
              <div className="space-y-2">
                {data.languages.map((lang, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{lang.name}</span>
                      <span>{lang.proficiency}</span>
                    </div>
                    <div className="h-1 bg-purple-400 rounded-full">
                      <div 
                        className="h-1 bg-yellow-400 rounded-full" 
                        style={{ 
                          width: lang.proficiency === 'Native' ? '100%' : 
                                 lang.proficiency === 'Fluent' ? '90%' : 
                                 lang.proficiency === 'Advanced' ? '80%' : 
                                 lang.proficiency === 'Intermediate' ? '60%' : '40%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-6">
          {/* Professional Summary */}
          {data.summary && (
            <div className="mb-6" data-section="summary">
              <h2 className="text-xl font-bold text-purple-600 mb-3 flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
                About Me
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6" data-section="experience">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="mb-4 pb-3 border-b border-purple-200 last:border-b-0 keep-together" data-section="experience-item">
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                        {exp.jobTitle}
                      </h3>
                      <div className="text-purple-600 font-semibold ml-5">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                      <div className="text-gray-500 text-sm ml-5">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 text-sm ml-5">
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
            <div data-section="education">
              <h2 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full mr-3"></div>
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-3 pb-2 border-b border-purple-200 last:border-b-0 keep-together" data-section="education-item">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <div className="text-purple-600 font-semibold ml-5">
                      {edu.school} {edu.location && `• ${edu.location}`}
                    </div>
                    <div className="text-gray-500 text-sm ml-5">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                    {edu.gpa && (
                      <div className="text-sm text-gray-600 ml-5">GPA: {edu.gpa}</div>
                    )}
                    {edu.achievements && (
                      <div className="text-gray-700 text-sm mt-1 ml-5">
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
        </div>
      </div>
    </div>
  )
}