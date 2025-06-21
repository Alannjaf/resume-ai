import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ResumeParser } from '@/lib/resume-parser'
import { ResumeData } from '@/types/resume'
import { checkUserLimits } from '@/lib/db'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'https://resumeai.app',
    'X-Title': 'ResumeAI',
  },
})

export async function POST(request: NextRequest) {
  console.log('📂 Resume upload request received')
  
  try {
    // Check authentication
    const { userId } = await auth()
    console.log('👤 User ID:', userId ? 'authenticated' : 'not authenticated')
    
    if (!userId) {
      console.log('❌ Authentication failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check import limits (PRO feature)
    console.log('🔍 Checking user limits...')
    const limits = await checkUserLimits(userId)
    console.log('📊 User limits:', { canImport: limits.canImport, hasSubscription: !!limits.subscription })
    
    if (!limits.canImport) {
      console.log('❌ Import not allowed - upgrade required')
      return NextResponse.json({ 
        error: 'Resume import is a PRO feature. Please upgrade your plan to import resumes.' 
      }, { status: 403 })
    }

    if (!limits.subscription) {
      console.log('❌ No subscription found')
      return NextResponse.json({ 
        error: 'User subscription not found.' 
      }, { status: 404 })
    }

    // Get form data
    console.log('📋 Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    console.log('📁 File info:', {
      name: file?.name,
      type: file?.type,
      size: file?.size
    })
    
    if (!file) {
      console.log('❌ No file provided in form data')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]
    
    console.log('🔍 Validating file type...', { fileType: file.type, allowedTypes })
    
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    console.log('📏 Validating file size...', { fileSize: file.size, maxSize })
    
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    console.log('🔄 Converting file to buffer...')
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    console.log('✅ File converted to buffer, size:', buffer.length)

    // For PDF files, send directly to AI. For DOCX, extract text first
    if (file.type === 'application/pdf') {
      console.log('📄 Processing PDF file...')
      try {
        // Convert PDF to base64 according to OpenRouter documentation
        console.log('🔄 Converting PDF to base64...')
        const base64Pdf = buffer.toString('base64')
        const dataUrl = `data:application/pdf;base64,${base64Pdf}`
        console.log('✅ PDF converted to base64, length:', base64Pdf.length)

        // Single API call approach - extract structured data directly
        // Use 'any' type to bypass OpenAI SDK's strict typing for OpenRouter's file format
        const messages: any = [
          {
            role: 'system',
            content: `You are a resume data extractor. Your ONLY job is to read the PDF document provided and extract the REAL information from it.

CRITICAL INSTRUCTIONS:
- You MUST read and use ONLY the information from the PDF file provided
- Do NOT generate any fictional, example, or placeholder data
- If information is not found in the PDF, use empty strings or empty arrays
- Return ONLY valid JSON with no explanations or markdown
- The PDF contains a real person's resume - extract their actual details`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract the ACTUAL information from the attached PDF resume and format it as JSON:

{
  "personal": {
    "fullName": "",
    "email": "", 
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "title": ""
  },
  "summary": "",
  "experience": [],
  "education": [],
  "skills": [],
  "languages": [],
  "projects": [],
  "certifications": []
}

CRITICAL: Use the real person's name, email, phone, and details from the PDF. Do not use fake names like "John Doe" or "Ahmed Al-Ali".`
              },
              {
                type: 'file',
                file: {
                  filename: 'resume.pdf',
                  file_data: dataUrl
                }
              }
            ]
          }
        ]

        console.log('🤖 Sending request to OpenRouter AI...')
        const completion = await openai.chat.completions.create({
          model: 'google/gemini-2.5-flash-preview-05-20',
          messages,
          max_tokens: 2000,
          temperature: 0.0 // Zero temperature for exact extraction
        })

        console.log('✅ AI response received')
        const aiText = completion.choices[0]?.message?.content?.trim() || ''
        console.log('📝 Raw AI response length:', aiText.length)
        console.log('📝 Raw AI response preview:', aiText.substring(0, 200) + '...')
        
        // Clean the response to ensure valid JSON
        console.log('🧹 Cleaning AI response...')
        let cleanedText = aiText
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        
        const firstBrace = cleanedText.indexOf('{')
        if (firstBrace > 0) {
          cleanedText = cleanedText.substring(firstBrace)
        }
        
        const lastBrace = cleanedText.lastIndexOf('}')
        if (lastBrace > -1 && lastBrace < cleanedText.length - 1) {
          cleanedText = cleanedText.substring(0, lastBrace + 1)
        }
        
        console.log('🧹 Cleaned JSON preview:', cleanedText.substring(0, 200) + '...')
        
        // Parse the JSON
        console.log('🔍 Parsing JSON...')
        const aiData = JSON.parse(cleanedText) as any
        console.log('✅ JSON parsed successfully')

        // Helper function to convert date format from MM/YYYY to YYYY-MM
        const convertDateFormat = (date: string): string => {
          if (!date || date.trim() === '') return ''
          
          // Handle MM/YYYY format
          if (date.includes('/') && date.length <= 7) {
            const [month, year] = date.split('/')
            if (month && year && month.length <= 2 && year.length === 4) {
              return `${year}-${month.padStart(2, '0')}`
            }
          }
          
          // Return as-is if already in correct format or unrecognized
          return date
        }

        // Transform the data to match our ResumeData interface
        const transformedData: ResumeData = {
          personal: {
            fullName: aiData.personal?.fullName || '',
            email: aiData.personal?.email || '',
            phone: aiData.personal?.phone || '',
            location: aiData.personal?.location || '',
            linkedin: aiData.personal?.linkedin || '',
            website: aiData.personal?.website || '',
            title: aiData.personal?.title || '',
          },
          summary: aiData.summary || '',
          experience: (aiData.experience || []).map((exp: any, index: number) => ({
            id: exp.id || `exp_${index + 1}`,
            jobTitle: exp.title || exp.jobTitle || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: convertDateFormat(exp.startDate || ''),
            endDate: convertDateFormat(exp.endDate || ''),
            current: exp.endDate === 'Present' || exp.current || false,
            description: Array.isArray(exp.description) ? exp.description.join('\n• ') : (exp.description || ''),
          })),
          education: (aiData.education || []).map((edu: any, index: number) => ({
            id: edu.id || `edu_${index + 1}`,
            degree: edu.degree || '',
            field: edu.field || edu.major || '',
            school: edu.school || edu.university || '',
            location: edu.location || '',
            startDate: convertDateFormat(edu.startDate || ''),
            endDate: convertDateFormat(edu.endDate || edu.graduationDate || ''),
            gpa: edu.gpa || '',
            achievements: edu.achievements || '',
          })),
          skills: (aiData.skills || []).map((skill: any, index: number) => ({
            id: skill.id || `skill_${index + 1}`,
            name: typeof skill === 'string' ? skill : (skill.name || ''),
            level: typeof skill === 'object' ? (skill.level || '') : '',
          })),
          languages: (aiData.languages || []).map((lang: any, index: number) => {
            if (typeof lang === 'string') {
              // If language is a string, create object with name and default proficiency
              return {
                id: `lang_${index + 1}`,
                name: lang,
                proficiency: 'Fluent', // Default proficiency for simple string languages
              }
            } else {
              // If language is already an object
              return {
                id: lang.id || `lang_${index + 1}`,
                name: lang.name || '',
                proficiency: lang.proficiency || '',
              }
            }
          }),
          projects: (aiData.projects || []).map((proj: any, index: number) => ({
            id: proj.id || `proj_${index + 1}`,
            name: proj.name || '',
            description: proj.description || '',
            technologies: proj.technologies || '',
            link: proj.link || '',
          })),
          certifications: (aiData.certifications || []).map((cert: any, index: number) => ({
            id: cert.id || `cert_${index + 1}`,
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
          })),
        }

        // Update import count
        console.log('📊 Updating import count...')
        await prisma.subscription.update({
          where: { id: limits.subscription.id },
          data: { importCount: { increment: 1 } }
        })
        console.log('✅ Import count updated')

        console.log('🎉 PDF processing completed successfully')
        return NextResponse.json({
          success: true,
          data: transformedData,
          extractedText: 'PDF processed with single API call'
        })

      } catch (pdfError: any) {
        console.error('❌ PDF processing error:', pdfError)
        console.error('❌ Error details:', {
          message: pdfError.message,
          stack: pdfError.stack?.substring(0, 500)
        })
        return NextResponse.json(
          { error: 'Failed to process PDF. Please try again or convert to DOCX format.' },
          { status: 400 }
        )
      }
    } else {
      // For DOCX files, extract text first then send to AI
      try {
        const extractedText = await ResumeParser.extractText(buffer, file.type)
        
        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json(
            { error: 'Could not extract text from the file. Please ensure the file contains readable text.' },
            { status: 400 }
          )
        }

        // Get basic extraction as fallback
        const basicData = ResumeParser.basicExtraction(extractedText)

        // Use AI to extract structured data
        const messages = [
          {
            role: 'system' as const,
            content: 'You are a resume parser that extracts structured data from resume text. You must return ONLY valid JSON with no additional text, markdown, or formatting.'
          },
          {
            role: 'user' as const,
            content: `Extract information from this resume text and return ONLY a JSON object with the same structure as specified for PDF processing.

Resume Text:
${extractedText}

Return valid JSON only, no explanations.`
          }
        ]

        const completion = await openai.chat.completions.create({
          model: 'google/gemini-2.5-flash-preview-05-20',
          messages,
          max_tokens: 2000,
          temperature: 0.3,
        })

        const aiText = completion.choices[0]?.message?.content?.trim() || ''
        
        // Clean and parse JSON
        let cleanedText = aiText
        cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
        
        const firstBrace = cleanedText.indexOf('{')
        if (firstBrace > 0) {
          cleanedText = cleanedText.substring(firstBrace)
        }
        
        const lastBrace = cleanedText.lastIndexOf('}')
        if (lastBrace > -1 && lastBrace < cleanedText.length - 1) {
          cleanedText = cleanedText.substring(0, lastBrace + 1)
        }

        const aiData = JSON.parse(cleanedText) as ResumeData

        // Merge AI data with basic extraction
        const mergedData: ResumeData = {
          personal: {
            ...basicData.personal,
            ...aiData.personal,
          },
          summary: aiData.summary || basicData.summary || '',
          experience: aiData.experience || [],
          education: aiData.education || [],
          skills: aiData.skills || [],
          languages: aiData.languages || [],
          projects: aiData.projects || [],
          certifications: aiData.certifications || [],
        }

        // Update import count
        await prisma.subscription.update({
          where: { id: limits.subscription.id },
          data: { importCount: { increment: 1 } }
        })

        return NextResponse.json({
          success: true,
          data: mergedData,
          extractedText: extractedText.slice(0, 500),
        })

      } catch (aiError: any) {
        // Return basic extraction if AI fails
        const basicData = ResumeParser.basicExtraction(await ResumeParser.extractText(buffer, file.type))
        
        // Update import count even for basic extraction
        await prisma.subscription.update({
          where: { userId },
          data: { importCount: { increment: 1 } }
        })
        
        return NextResponse.json({
          success: true,
          data: basicData as ResumeData,
          extractedText: (await ResumeParser.extractText(buffer, file.type)).slice(0, 500),
          warning: 'AI extraction failed. Showing basic extraction results.',
        })
      }
    }

  } catch (error) {
    console.error('💥 Resume upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process resume. Please try again.' },
      { status: 500 }
    )
  }
}