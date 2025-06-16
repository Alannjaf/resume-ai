// Shared type definitions for resume data

export interface WorkExperience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  field: string
  school: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  achievements?: string
}

export interface Skill {
  id: string
  name: string
  level?: string
}

export interface Language {
  id: string
  name: string
  proficiency: string
}

export interface Project {
  id: string
  name: string
  description?: string
  technologies?: string
  link?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date?: string
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  title?: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  projects?: Project[]
  certifications?: Certification[]
}