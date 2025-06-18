'use client'

import React from 'react'
import { ResumeData } from './TemplateRenderer'

interface TechTemplateProps {
  data: ResumeData
}

export function TechTemplate({ data }: TechTemplateProps) {
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
    <div className="max-w-4xl mx-auto bg-white tech-template" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Tech Header with Terminal-style design */}
      <div className="bg-gray-900 text-gray-100 p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">resume.js</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="font-mono flex-1">
            <div className="text-green-400 text-sm mb-2">// {data.personal.title || getLatestJobTitle() || 'Developer'}</div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-cyan-400">const</span> name = <span className="text-yellow-400">"{data.personal.fullName || 'Your Name'}"</span>;
            </h1>
            
            <div className="space-y-1 text-sm">
              {data.personal.email && (
                <div>
                  <span className="text-purple-400">email:</span> <span className="text-green-400">"{data.personal.email}"</span>
                </div>
              )}
              {data.personal.phone && (
                <div>
                  <span className="text-purple-400">phone:</span> <span className="text-green-400">"{data.personal.phone}"</span>
                </div>
              )}
              {data.personal.location && (
                <div>
                  <span className="text-purple-400">location:</span> <span className="text-green-400">"{data.personal.location}"</span>
                </div>
              )}
              {data.personal.linkedin && (
                <div>
                  <span className="text-purple-400">linkedin:</span> <span className="text-blue-400">"{data.personal.linkedin}"</span>
                </div>
              )}
              {data.personal.website && (
                <div>
                  <span className="text-purple-400">portfolio:</span> <span className="text-blue-400">"{data.personal.website}"</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Picture */}
          {data.personal.profilePictureUrl && (
            <div className="flex-shrink-0 flex items-center">
              <img
                src={data.personal.profilePictureUrl}
                alt="Profile"
                className="w-32 h-32 rounded-lg object-cover border-2 border-green-400"
              />
            </div>
          )}
        </div>
      </div>


      <div className="p-8">
        {/* Summary */}
        {data.summary && (
          <>
            <div className="mb-12 pb-8" >
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                About
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div className="bg-gray-50 border-l-4 border-cyan-600 p-6 rounded">
                <p className="text-gray-700 leading-relaxed">{data.summary}</p>
              </div>
            </div>
          </>
        )}

        {/* Technical Skills - Featured Section */}
        {data.skills.length > 0 && (
          <>
            <div className="mb-12 pb-8 " >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                Tech Stack
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 flex items-center justify-between">
                    <span className="font-medium text-gray-800">{skill.name}</span>
                    {skill.level && (
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (skill.level === 'Expert' ? 5 : skill.level === 'Advanced' ? 4 : skill.level === 'Intermediate' ? 3 : 2)
                                ? 'bg-cyan-600'
                                : 'bg-gray-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Work Experience */}
        {data.experience.length > 0 && (
          <>
            <div className="mb-12 pb-8" >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                Experience
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div>
                {data.experience.map((exp, index) => (
                  <React.Fragment key={index}>
                    
                    <div className="border-l-2 border-gray-300 pl-6 relative mb-10 pb-8 border-b border-gray-100 last:border-b-0" >
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-600 rounded-full"></div>
                      
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {exp.jobTitle}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-gray-600 text-sm font-mono mb-2">
                          <span className="flex items-center gap-1">
                            <span className="text-cyan-600">@</span>
                            {exp.company}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <span className="text-cyan-600">📍</span>
                              {exp.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="text-cyan-600">📅</span>
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      
                      {exp.description && (
                        <div className="space-y-2 mt-4">
                          {exp.description.split('\n').map((line, i) => (
                            <div key={i} className="flex items-start">
                              <span className="text-cyan-600 mr-2 font-mono mt-1">▸</span>
                              <p className="text-gray-700 flex-1">{line}</p>
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

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <>
            <div className="mb-12 pb-8" >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                Projects
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {data.projects.map((project: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-3">{project.name}</h3>
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{project.description}</p>
                    )}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.split(',').map((tech: string, i: number) => (
                          <span key={i} className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded font-mono">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} className="text-cyan-600 text-sm font-mono hover:underline">
                        View Project →
                      </a>
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
            <div className="mb-12 pb-8" >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                Education
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div>
                {data.education.map((edu, index) => (
                  <React.Fragment key={index}>
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6 last:mb-0" >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-gray-600">
                            {edu.school} {edu.location && `• ${edu.location}`}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-gray-500 mt-1 font-mono">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 font-mono whitespace-nowrap">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.achievements && (
                        <div className="space-y-1">
                          {edu.achievements.split('\n').map((achievement, i) => (
                            <p key={i} className="text-sm text-gray-600 flex items-start">
                              <span className="text-cyan-600 mr-2">▸</span>
                              {achievement}
                            </p>
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

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <>
            <div className="mb-12 pb-8" >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                Certifications
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {data.certifications.map((cert: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                    <span className="text-cyan-600 text-xl">🏆</span>
                    <div>
                      <p className="font-medium text-gray-800">{cert.name}</p>
                      <p className="text-sm text-gray-600">
                        {cert.issuer} {cert.date && `• ${cert.date}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <>
            <div className="mb-12 pb-8 " >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-cyan-600 mr-2 font-mono">&lt;</span>
                Languages
                <span className="text-cyan-600 ml-2 font-mono">/&gt;</span>
              </h2>
              <div className="flex flex-wrap gap-4">
                {data.languages.map((lang, index) => (
                  <div key={index} className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
                    <span className="font-medium text-gray-800">{lang.name}</span>
                    <span className="text-gray-600 ml-2 text-sm">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
    </div>
  )
}