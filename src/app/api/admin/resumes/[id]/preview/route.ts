import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ResumeData } from '@/types/resume';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch resume with all related data
    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        user: true,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Parse personalInfo as JSON if it's stored as JSON
    let personalInfo: any = {};
    try {
      personalInfo = resume.personalInfo ? (typeof resume.personalInfo === 'string' ? JSON.parse(resume.personalInfo) : resume.personalInfo) : {};
    } catch (e) {
      // Failed to parse personalInfo
    }

    // Transform database resume to ResumeData format
    const transformedData: ResumeData = {
      personal: {
        fullName: personalInfo?.fullName || personalInfo?.name || resume.user.name || '',
        email: personalInfo?.email || resume.user.email,
        phone: personalInfo?.phone || '',
        location: personalInfo?.location || '',
        linkedin: personalInfo?.linkedin || '',
        website: personalInfo?.website || '',
        title: personalInfo?.title || '',
        profileImage: personalInfo?.profileImage || '',
        // Optional demographic fields
        dateOfBirth: personalInfo?.dateOfBirth || '',
        gender: personalInfo?.gender || '',
        nationality: personalInfo?.nationality || '',
        maritalStatus: personalInfo?.maritalStatus || '',
        country: personalInfo?.country || '',
      },
      summary: resume.summary || '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
    };

    // Transform sections based on their type
    resume.sections.forEach((section) => {
      const content = section.content as any;
      
      switch (section.type) {
        case 'WORK_EXPERIENCE':
          if (content.experiences && Array.isArray(content.experiences)) {
            transformedData.experience = content.experiences.map((exp: any) => ({
              id: exp.id || Math.random().toString(),
              jobTitle: exp.jobTitle || '',
              company: exp.company || '',
              location: exp.location || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              current: exp.current || false,
              description: exp.description || '',
            }));
          } else if (content && typeof content === 'object') {
            // Sometimes content might be directly the experience data
            const expArray = Object.values(content).filter(item => 
              item && typeof item === 'object' && (item as any).jobTitle
            );
            if (expArray.length > 0) {
              transformedData.experience = expArray.map((exp: any) => ({
                id: exp.id || Math.random().toString(),
                jobTitle: exp.jobTitle || '',
                company: exp.company || '',
                location: exp.location || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                current: exp.current || false,
                description: exp.description || '',
              }));
            }
          }
          break;

        case 'EDUCATION':
          if (content.education) {
            transformedData.education = content.education.map((edu: any) => ({
              id: edu.id || Math.random().toString(),
              degree: edu.degree || '',
              field: edu.field || '',
              school: edu.school || '',
              location: edu.location || '',
              startDate: edu.startDate || '',
              endDate: edu.endDate || '',
              gpa: edu.gpa || '',
              achievements: edu.achievements || '',
            }));
          }
          break;

        case 'SKILLS':
          if (content.skills) {
            transformedData.skills = content.skills.map((skill: any) => ({
              id: skill.id || Math.random().toString(),
              name: skill.name || '',
              level: skill.level || '',
            }));
          }
          break;

        case 'LANGUAGES':
          if (content.languages) {
            transformedData.languages = content.languages.map((lang: any) => ({
              id: lang.id || Math.random().toString(),
              name: lang.name || '',
              proficiency: lang.proficiency || '',
            }));
          }
          break;

        case 'PROJECTS':
          if (content.projects) {
            transformedData.projects = content.projects.map((proj: any) => ({
              id: proj.id || Math.random().toString(),
              name: proj.name || '',
              description: proj.description || '',
              technologies: proj.technologies || '',
              link: proj.link || '',
              startDate: proj.startDate || '',
              endDate: proj.endDate || '',
            }));
          }
          break;

        case 'CERTIFICATIONS':
          if (content.certifications) {
            transformedData.certifications = content.certifications.map((cert: any) => ({
              id: cert.id || Math.random().toString(),
              name: cert.name || '',
              issuer: cert.issuer || '',
              date: cert.date || '',
              expiryDate: cert.expiryDate || '',
              credentialId: cert.credentialId || '',
              url: cert.url || '',
            }));
          }
          break;
      }
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}