'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface CleanModernTemplateProps {
  data: ResumeData
}

export function CleanModernTemplate({ data }: CleanModernTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getSkillLevel = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'expert': 
      case 'native': 
      case 'fluent': return 5
      case 'advanced': 
      case 'proficient': return 4
      case 'intermediate': return 3
      case 'beginner':
      case 'basic': return 2
      case 'elementary': return 1
      default: return 3
    }
  }

  const renderStars = (level: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-2 h-2 rounded-full ${
              star <= level ? 'bg-gray-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden clean-modern-template" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="flex min-h-screen">
        {/* Left Main Content */}
        <div className="w-2/3 bg-white p-8 pr-4">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {data.personal.fullName || 'ZANYAR KAMARAN'}
              </h1>
              <p className="text-lg text-teal-600 mb-3">
                {data.experience.length > 0 ? data.experience[0].jobTitle : 'Producer and Event Designer'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {data.personal.email && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>{data.personal.email}</span>
                  </div>
                )}
                {data.personal.phone && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                    <span>{data.personal.phone}</span>
                  </div>
                )}
                {data.personal.location && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <span>{data.personal.location}</span>
                  </div>
                )}
                {data.personal.linkedin && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                    </svg>
                    <span>{data.personal.linkedin}</span>
                  </div>
                )}
                {data.personal.website && (
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.029 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd"/>
                    </svg>
                    <span>{data.personal.website}</span>
                  </div>
                )}
              </div>
            </div>
            {/* Profile Photo - Right aligned */}
            <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0 ml-4">
              <img 
                src="/api/placeholder/80/80" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 border-b border-gray-300 pb-1">
              EXPERIENCE
            </h2>
            
            <div className="space-y-6">
              {data.experience.length > 0 ? data.experience.map((exp, index) => (
                <div key={index} className="keep-together">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-blue-600">{exp.jobTitle}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 font-bold text-sm">{exp.company}</p>
                        <div className="flex items-center text-xs text-gray-600 ml-4">
                          <svg className="w-3 h-3 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                          </svg>
                          <span>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                          {exp.location && (
                            <>
                              <svg className="w-3 h-3 ml-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                              </svg>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <div className="mt-2">
                      <ul className="text-gray-700 text-sm space-y-1">
                        {exp.description.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                          <li key={lineIndex} className="flex items-start">
                            <span className="text-teal-600 mr-2 mt-1 text-xs">•</span>
                            <span className="leading-relaxed">{line.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )) : (
                <div className="space-y-6">
                  {/* Sample experience entries */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-blue-600">Management Rep</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-900 font-bold text-sm">Multi Star Event</p>
                          <div className="flex items-center text-xs text-gray-600 ml-4">
                            <svg className="w-3 h-3 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span>04/2025 - Present</span>
                            <svg className="w-3 h-3 ml-4 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            <span>Erbil, Iraq</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li className="flex items-start">
                        <span className="text-teal-600 mr-2 mt-1 text-xs">•</span>
                        <span>Managed administrative and sales operations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/3 bg-gray-50 p-6 pl-4">
          {/* Summary Section */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
                SUMMARY
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed">
                {data.summary}
              </p>
            </div>
          )}


          {/* Languages Section */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
              LANGUAGES
            </h2>
            <div className="space-y-2">
              {data.languages.length > 0 ? data.languages.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 text-xs font-medium">{lang.name}</span>
                  {renderStars(getSkillLevel(lang.proficiency))}
                </div>
              )) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-xs font-medium">English</span>
                    {renderStars(5)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-xs font-medium">Kurdish</span>
                    {renderStars(5)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-xs font-medium">Turkish</span>
                    {renderStars(4)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
              SKILLS
            </h2>
            <div className="space-y-2">
              {data.skills.length > 0 ? data.skills.slice(0, 8).map((skill, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700 text-xs">{skill.name}</span>
                  {renderStars(getSkillLevel(skill.level))}
                </div>
              )) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-xs">Film & Video Production</span>
                    <span className="text-gray-600 text-xs">Your Skill</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-xs">Event Media Management</span>
                    <span className="text-gray-600 text-xs"></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-xs">Budgeting & Cost Control</span>
                    <span className="text-gray-600 text-xs"></span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.length > 0 ? data.education.map((edu, index) => (
                <div key={index} className="keep-together">
                  <h3 className="text-xs font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-teal-600 text-xs font-medium">{edu.school}</p>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <svg className="w-3 h-3 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    {edu.gpa && (
                      <>
                        <span className="mx-2 text-gray-600">•</span>
                        <span>GPA: {edu.gpa}</span>
                      </>
                    )}
                  </div>
                </div>
              )) : (
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Bachelor of Science</h3>
                  <p className="text-teal-600 text-xs font-medium">Soran University</p>
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <svg className="w-3 h-3 mr-1 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    <span>10/2011 - 06/2015</span>
                    <svg className="w-3 h-3 mx-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <span>Erbil</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}