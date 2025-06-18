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

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl executive-template" style={{ fontFamily: 'Garamond, Georgia, serif' }}>
      {/* Executive Header with Navy Blue accent */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-10">
        <h1 className="text-5xl font-light mb-4 tracking-wide">
          {data.personal.fullName || 'Executive Name'}
        </h1>
        <div className="h-0.5 w-24 bg-amber-400 mb-4"></div>
        
        {data.personal.title && (
          <p className="text-xl font-light text-slate-200 mb-6 tracking-wide">
            {data.personal.title}
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


      <div className="p-10">
        {/* Executive Summary */}
        {data.summary && (
          <>
            <div className="mb-16 pb-8" data-section="summary">
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
            <div className="mb-16 pb-8" data-section="experience">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Professional Experience
              </h2>
              <div className="pl-8">
                {data.experience.map((exp, index) => (
                    <div key={index} className="mb-6 pb-4 border-b border-slate-200 last:border-b-0 keep-together" data-section="experience-item">
                      <div className="mb-3">
                        <h3 className="text-xl font-semibold text-slate-800 mb-1">
                          <span className="text-amber-500 mr-2">▸</span>{exp.jobTitle}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <p className="text-lg text-slate-600">
                            {exp.company} {exp.location && `• ${exp.location}`}
                          </p>
                          <span className="text-sm text-slate-500 italic whitespace-nowrap">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <div className="text-gray-700 leading-relaxed">
                          {exp.description.split('\n').map((line, i) => (
                            <p key={i} className="mb-1">• {line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <>
            <div className="mb-16 pb-8" data-section="education">
              <h2 className="text-2xl font-light text-slate-800 mb-8 flex items-center">
                <span className="text-amber-500 mr-3">▸</span>
                Education
              </h2>
              <div className="pl-8">
                {data.education.map((edu, index) => (
                    <div key={index} className="mb-4 pb-3 border-b border-slate-200 last:border-b-0 keep-together" data-section="education-item">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            <span className="text-amber-500 mr-2">▸</span>{edu.degree} {edu.field && `in ${edu.field}`}
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
                        <div className="mt-2 text-gray-600">
                          {edu.achievements.split('\n').map((achievement, i) => (
                            <p key={i} className="mb-1">• {achievement}</p>
                          ))}
                        </div>
                      )}
                    </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Skills Section - Executive Style */}
        {data.skills.length > 0 && (
          <>
            <div className="mb-16 pb-8 keep-together" data-section="skills">
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
            <div className="mb-16 pb-8 keep-together" data-section="languages">
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
            <div className="mb-16 pb-8" data-section="certifications">
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
            <div className="mb-16 pb-8" data-section="projects">
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