// Shared type definitions for resume data

export interface WorkExperience {
  id: string
  jobTitle: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export interface Education {
  id: string
  degree: string
  field?: string
  school: string
  location?: string
  startDate: string
  endDate?: string
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
  startDate?: string
  endDate?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date?: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location?: string
  linkedin?: string
  website?: string
  title?: string
  profileImage?: string
  originalProfileImage?: string
  profileImageCrop?: {
    x: number
    y: number
    width: number
    height: number
    scale: number
  }
  // Optional demographic fields
  dateOfBirth?: string
  gender?: string
  nationality?: string
  maritalStatus?: string
  country?: string
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