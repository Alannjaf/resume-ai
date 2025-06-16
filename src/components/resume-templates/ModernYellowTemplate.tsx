'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface ModernYellowTemplateProps {
  data: ResumeData
}

export function ModernYellowTemplate({ data }: ModernYellowTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getSkillLevel = (level: string) => {
    switch(level) {
      case 'Expert': return '100%'
      case 'Advanced': return '85%'
      case 'Intermediate': return '70%'
      case 'Beginner': return '50%'
      default: return '70%'
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg overflow-hidden modern-yellow-template" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-800 text-white p-8">
          {/* Profile Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">
              {data.personal.fullName || 'Your Name'}
            </h1>
            <p className="text-gray-300 text-lg">
              {data.personal.title || 'Your Title'}
            </p>
          </div>

          {/* Contact Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-800 text-sm">📞</span>
              </div>
              <h2 className="text-xl font-bold text-yellow-400">Contact</h2>
            </div>
            <div className="w-16 h-0.5 bg-yellow-400 mb-4"></div>
            
            <div className="space-y-3 text-sm">
              {data.personal.email && (
                <div>
                  <p className="text-yellow-400 font-medium">Email</p>
                  <p className="text-gray-300 break-all">{data.personal.email}</p>
                </div>
              )}
              {data.personal.phone && (
                <div>
                  <p className="text-yellow-400 font-medium">Phone</p>
                  <p className="text-gray-300">{data.personal.phone}</p>
                </div>
              )}
              {data.personal.website && (
                <div>
                  <p className="text-yellow-400 font-medium">Website</p>
                  <p className="text-gray-300 break-all">{data.personal.website}</p>
                </div>
              )}
              {data.personal.location && (
                <div>
                  <p className="text-yellow-400 font-medium">Location</p>
                  <p className="text-gray-300">{data.personal.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {data.skills.length > 0 && (
            <div className="mb-8 keep-together">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 text-sm">💡</span>
                </div>
                <h2 className="text-xl font-bold text-yellow-400">Skills</h2>
              </div>
              <div className="w-16 h-0.5 bg-yellow-400 mb-4"></div>
              
              <div className="space-y-4">
                {data.skills.slice(0, 6).map((skill, index) => (
                  <div key={index}>
                    <p className="text-white font-medium mb-2">{skill.name}</p>
                    <div className="w-full bg-gray-600 h-2 rounded-full">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: getSkillLevel(skill.level || 'Intermediate') }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {data.languages.length > 0 && (
            <div className="keep-together">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 text-sm">🌐</span>
                </div>
                <h2 className="text-xl font-bold text-yellow-400">Languages</h2>
              </div>
              <div className="w-16 h-0.5 bg-yellow-400 mb-4"></div>
              
              <div className="space-y-2 text-gray-300">
                {data.languages.map((lang, index) => (
                  <p key={index}>• {lang.name} ({lang.proficiency})</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content Area */}
        <div className="w-2/3 bg-gray-50 p-8">
          {/* Profile Section */}
          {data.summary && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 text-sm">👤</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
              </div>
              <div className="w-16 h-0.5 bg-yellow-400 mb-4"></div>
              <p className="text-gray-700 leading-relaxed text-justify">
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience Section */}
          {data.experience.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 text-sm">💼</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Experience</h2>
              </div>
              <div className="w-16 h-0.5 bg-yellow-400 mb-6"></div>
              
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6 keep-together">
                    <div className="absolute left-0 top-2 w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="absolute left-1.5 top-6 w-0.5 h-full bg-gray-300"></div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{exp.jobTitle}</h3>
                    <p className="text-gray-600 font-medium mb-1">
                      {exp.company} | {exp.location}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                    
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {data.education.length > 0 && (
            <div className="mb-8 page-break-before">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 text-sm">🎓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
              </div>
              <div className="w-16 h-0.5 bg-yellow-400 mb-6"></div>
              
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="keep-together">
                    <h3 className="text-lg font-bold text-gray-800">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {edu.school} | {edu.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      Graduated: {formatDate(edu.endDate)}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio/Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-800 text-sm">📁</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Portfolio</h2>
              </div>
              <div className="w-16 h-0.5 bg-yellow-400 mb-6"></div>
              
              <div className="space-y-4">
                {data.projects.map((project: any, index: number) => (
                  <div key={index} className="keep-together">
                    <h3 className="font-bold text-gray-800 mb-2">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-700 mb-2 italic">{project.description}</p>
                    )}
                    {project.link && (
                      <p className="text-yellow-600 text-sm">{project.link}</p>
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