'use client'

import { useMemo } from 'react'
import { ResumeData } from '@/types/resume'

interface ResumePreviewProps {
  data: ResumeData
  template?: string
}

export function ResumePreview({ data, template = 'modern' }: ResumePreviewProps) {
  // Transform data to ensure all required fields have default values
  const transformedData: ResumeData = useMemo(() => ({
    ...data,
    education: data.education.map(edu => ({
      ...edu,
      gpa: edu.gpa || '',
      achievements: edu.achievements || ''
    })),
    skills: data.skills.map(skill => ({
      ...skill,
      level: skill.level || ''
    }))
  }), [data])

  return (
    <div data-resume-preview className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{transformedData.personal.fullName}</h1>
          <div className="text-gray-600 mt-2">
            {transformedData.personal.email} | {transformedData.personal.phone}
            {transformedData.personal.location && ` | ${transformedData.personal.location}`}
          </div>
          {(transformedData.personal.linkedin || transformedData.personal.website) && (
            <div className="text-gray-600 mt-1">
              {transformedData.personal.linkedin && <span>{transformedData.personal.linkedin}</span>}
              {transformedData.personal.linkedin && transformedData.personal.website && ' | '}
              {transformedData.personal.website && <span>{transformedData.personal.website}</span>}
            </div>
          )}
          {/* Optional Demographics */}
          {(transformedData.personal.dateOfBirth || transformedData.personal.gender || transformedData.personal.nationality || transformedData.personal.maritalStatus || transformedData.personal.country) && (
            <div className="text-gray-500 text-sm mt-2">
              {[
                transformedData.personal.dateOfBirth && `Born: ${transformedData.personal.dateOfBirth}`,
                transformedData.personal.gender && `Gender: ${transformedData.personal.gender}`,
                transformedData.personal.nationality && `Nationality: ${transformedData.personal.nationality}`,
                transformedData.personal.maritalStatus && `Marital Status: ${transformedData.personal.maritalStatus}`,
                transformedData.personal.country && `Country: ${transformedData.personal.country}`
              ].filter(Boolean).join(' | ')}
            </div>
          )}
        </div>

        {transformedData.summary && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Professional Summary</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">{transformedData.summary}</p>
          </div>
        )}

        {transformedData.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Work Experience</h2>
            <div className="mt-4 space-y-4">
              {transformedData.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-gray-600">{exp.location}</p>}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-gray-700 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {transformedData.education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Education</h2>
            <div className="mt-4 space-y-3">
              {transformedData.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.field} - {edu.school}</p>
                      {edu.location && <p className="text-gray-600">{edu.location}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                  {edu.achievements && (
                    <p className="mt-2 text-gray-700">{edu.achievements}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {transformedData.skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {transformedData.skills.map((skill) => (
                <span key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.name}{skill.level && ` (${skill.level})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {transformedData.languages.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Languages</h2>
            <div className="mt-3 space-y-1">
              {transformedData.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="text-gray-700">{lang.name}</span>
                  <span className="text-gray-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {transformedData.projects && transformedData.projects.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Projects</h2>
            <div className="mt-4 space-y-4">
              {transformedData.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-green-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      {project.technologies && (
                        <p className="text-gray-600 text-sm">Technologies: {project.technologies}</p>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <p className="text-gray-600 text-sm">
                        {project.startDate} - {project.endDate || 'Present'}
                      </p>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-2 text-gray-700 leading-relaxed">{project.description}</p>
                  )}
                  {project.link && (
                    <p className="mt-1 text-blue-600 text-sm">{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {transformedData.certifications && transformedData.certifications.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2">Certifications</h2>
            <div className="mt-4 space-y-3">
              {transformedData.certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                      <p className="text-gray-700">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>
                      )}
                    </div>
                    {cert.date && (
                      <div className="text-right">
                        <p className="text-gray-600 text-sm">Issued: {cert.date}</p>
                        {cert.expiryDate && (
                          <p className="text-gray-600 text-sm">Expires: {cert.expiryDate}</p>
                        )}
                      </div>
                    )}
                  </div>
                  {cert.url && (
                    <p className="mt-1 text-blue-600 text-sm">{cert.url}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}