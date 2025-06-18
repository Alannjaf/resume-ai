'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface ExecutiveTemplateProps {
  data: ResumeData
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getLatestJobTitle = () => {
    if (!data.experience || data.experience.length === 0) return ''
    
    // First check for current job
    const currentJob = data.experience.find(exp => exp.current)
    if (currentJob) return currentJob.jobTitle
    
    // If no current job, find the most recent by end date
    const sortedByEndDate = [...data.experience].sort((a, b) => {
      const dateA = new Date(a.endDate + '-01')
      const dateB = new Date(b.endDate + '-01')
      return dateB.getTime() - dateA.getTime()
    })
    
    return sortedByEndDate[0]?.jobTitle || ''
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl executive-template" style={{ fontFamily: 'Garamond, Georgia, serif' }}>
      {/* Executive Header with Navy Blue accent */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-10">
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <h1 className="text-5xl font-light mb-4 tracking-wide">
              {data.personal.fullName || 'Executive Name'}
            </h1>
            <div className="h-0.5 w-24 bg-amber-400 mb-4"></div>
            
            {(data.personal.title || getLatestJobTitle()) && (
              <p className="text-xl font-light text-slate-200 mb-6 tracking-wide">
                {data.personal.title || getLatestJobTitle()}
              </p>
            )}
            
            <div className="flex flex-wrap gap-6 text-sm">
              {data.personal.email && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">✉</span>
                  <span>{data.personal.email}</span>
                </div>
              )}
              {data.personal.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">☎</span>
                  <span>{data.personal.phone}</span>
                </div>
              )}
              {data.personal.location && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">📍</span>
                  <span>{data.personal.location}</span>
                </div>
              )}
              {data.personal.linkedin && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">in</span>
                  <span>{data.personal.linkedin}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Picture */}
          {data.personal.profilePictureUrl && (
            <div className="flex-shrink-0">
              <img
                src={data.personal.profilePictureUrl}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-amber-400"
              />
            </div>
          )}
        </div>
      </div>


      <div className="p-10">
        {/* Executive Summary */}
        {data.summary && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-6 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Executive Summary
              </h2>
              <div className="pl-8">
                <p className="text-gray-700 leading-relaxed text-justify italic text-lg">
                  {data.summary}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Professional Experience */}
        {data.experience.length > 0 && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Professional Experience
              </h2>
              <div className="pl-8">
                {data.experience.map((exp, index) => (
                  <React.Fragment key={index}>
                    
                    <div className="relative mb-12 pb-8 border-b border-slate-200 last:border-b-0">
                      <div className="absolute -left-8 top-1 w-2 h-2 bg-amber-500 rounded-full"></div>
                      
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">
                          {exp.jobTitle}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <p className="text-lg text-slate-600">
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </p>
                          <span className="text-sm text-slate-500 italic whitespace-nowrap">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <div className="mt-4 space-y-3">
                          {exp.description.split('\n').map((line, i) => (
                            <div key={i} className="flex items-start">
                              <span className="text-amber-500 mr-3 mt-1">•</span>
                              <p className="text-gray-700 flex-1 leading-relaxed">{line}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Education
              </h2>
              <div className="pl-8">
                {data.education.map((edu, index) => (
                  <React.Fragment key={index}>
                    
                    <div className="relative mb-10 pb-6 border-b border-slate-200 last:border-b-0">
                      <div className="absolute -left-8 top-1 w-2 h-2 bg-amber-500 rounded-full"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-slate-600">
                            {edu.school} {edu.location && `• ${edu.location}`}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-slate-500 mt-1">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <span className="text-sm text-slate-500 italic whitespace-nowrap">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      
                      {edu.achievements && (
                        <div className="mt-3 space-y-2">
                          {edu.achievements.split('\n').map((achievement, i) => (
                            <div key={i} className="flex items-start">
                              <span className="text-amber-500 mr-3 mt-1">•</span>
                              <p className="text-gray-600 flex-1">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Skills Section - Executive Style */}
        {data.skills.length > 0 && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Core Competencies
              </h2>
              <div className="pl-8 grid grid-cols-2 gap-x-12 gap-y-4">
                {data.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-amber-500 mr-3">◆</span>
                    <span className="text-gray-700">
                      {skill.name}
                      {skill.level && (
                        <span className="text-slate-500 text-sm ml-2">
                          ({skill.level})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Languages
              </h2>
              <div className="pl-8 flex flex-wrap gap-x-8 gap-y-3">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-amber-500 mr-3">◆</span>
                    <span className="text-gray-700">
                      {lang.name} 
                      <span className="text-slate-500 text-sm ml-2">
                        ({lang.proficiency})
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Additional Sections */}
        {data.certifications && data.certifications.length > 0 && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Professional Certifications
              </h2>
              <div className="pl-8 space-y-3">
                {data.certifications.map((cert: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <span className="text-amber-500 mr-3 mt-1">◆</span>
                    <div>
                      <span className="text-gray-700 font-medium">{cert.name}</span>
                      {cert.issuer && <span className="text-slate-500 ml-2">• {cert.issuer}</span>}
                      {cert.date && <span className="text-slate-500 ml-2">({cert.date})</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {data.projects && data.projects.length > 0 && (
          <>
            <div className="mb-16 pb-8">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Key Projects
              </h2>
              <div className="pl-8 space-y-6">
                {data.projects.map((project: any, index: number) => (
                  <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                    <h3 className="text-lg font-medium text-slate-800 mb-2">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-600 mb-2">{project.description}</p>
                    )}
                    {project.link && (
                      <p className="text-amber-600">{project.link}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Executive Footer */}
      <div className="bg-slate-800 h-2"></div>
      
    </div>
  )
}