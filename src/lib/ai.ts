import OpenAI from 'openai'

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': 'https://resumeai.app', // Your site URL for rankings
    'X-Title': 'ResumeAI', // Your site title for rankings
  },
})

export interface AIGenerationOptions {
  jobTitle?: string
  industry?: string
  experience?: string
  skills?: string[]
  language?: 'en' | 'ar' | 'ku'
}

export class AIService {
  static async generateProfessionalSummary(options: AIGenerationOptions): Promise<string> {
    const { jobTitle = '', industry = '', experience = '', skills = [], language = 'en' } = options

    const languageInstructions = {
      en: 'Write in English',
      ar: 'Write in Arabic with proper RTL formatting',
      ku: 'Write in Kurdish Sorani'
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional resume writer specializing in creating compelling professional summaries. Always follow the language requirements and formatting guidelines exactly.`
      },
      {
        role: 'user' as const,
        content: `Generate a professional resume summary for the following profile:
- Job Title: ${jobTitle}
- Industry: ${industry}
- Experience Level: ${experience}
- Key Skills: ${skills.join(', ')}

Requirements:
- ${languageInstructions[language]}
- 2-3 sentences maximum
- Focus on value proposition and key achievements
- Use action-oriented language
- Highlight relevant skills and experience
- Make it ATS-friendly
- Sound professional but not overly formal

Please provide only the summary text without any additional formatting or explanations.`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 200,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      // AI generation error
      throw new Error('Failed to generate professional summary')
    }
  }

  static async enhanceJobDescription(
    originalDescription: string,
    jobTitle: string,
    options: AIGenerationOptions
  ): Promise<string> {
    const { language = 'en' } = options

    const languageInstructions = {
      en: 'Write in English',
      ar: 'Write in Arabic with proper RTL formatting', 
      ku: 'Write in Kurdish Sorani'
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional resume writer who enhances job descriptions to make them more impactful and ATS-friendly. Always use proper bullet formatting with "• " (bullet + space).`
      },
      {
        role: 'user' as const,
        content: `Enhance the following job description to make it more impactful and ATS-friendly:

Original Description: "${originalDescription}"
Job Title: ${jobTitle}

Requirements:
- ${languageInstructions[language]}
- Use strong action verbs (e.g., "Developed", "Implemented", "Led", "Achieved")
- Quantify achievements where possible (e.g., "Increased efficiency by 30%")
- Add relevant keywords for ATS optimization
- Format as bullet points using "•" (bullet symbol), NOT asterisks (*)
- Keep each bullet point concise (1-2 lines maximum)
- Focus on accomplishments and results rather than basic duties
- Make it sound professional and impressive
- Start each bullet point with "• " followed by the content

IMPORTANT: Use only "• " (bullet + space) to start each point, never use "*" or "-" or numbers.

Please provide only the enhanced description without any additional formatting or explanations.`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 400,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      // AI generation error
      throw new Error('Failed to enhance job description')
    }
  }

  static async generateSkillSuggestions(
    jobTitle: string,
    industry: string,
    options: AIGenerationOptions
  ): Promise<string[]> {
    const { language = 'en' } = options

    const languageInstructions = {
      en: 'Provide skills in English',
      ar: 'Provide skills in Arabic',
      ku: 'Provide skills in Kurdish Sorani'
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a career advisor who suggests relevant skills for specific job roles. Provide only skill names, one per line.`
      },
      {
        role: 'user' as const,
        content: `Suggest 8-12 relevant skills for the following position:
- Job Title: ${jobTitle}
- Industry: ${industry}

Requirements:
- ${languageInstructions[language]}
- Include both technical and soft skills
- Make them specific and relevant to the role
- Include current industry trends
- Make them ATS-friendly keywords
- Provide only the skill names, one per line
- No descriptions or explanations

Format: Return only skill names separated by newlines.`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 300,
        temperature: 0.6,
      })

      const skillsText = completion.choices[0]?.message?.content?.trim() || ''
      return skillsText.split('\n').map(skill => skill.trim()).filter(skill => skill.length > 0)
    } catch (error) {
      // AI generation error
      throw new Error('Failed to generate skill suggestions')
    }
  }

  static async generateBulletPoints(
    jobTitle: string,
    company: string,
    industry: string,
    options: AIGenerationOptions
  ): Promise<string[]> {
    const { language = 'en' } = options

    const languageInstructions = {
      en: 'Write in English',
      ar: 'Write in Arabic with proper RTL formatting',
      ku: 'Write in Kurdish Sorani'
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional resume writer who creates impactful bullet points for work experience sections. Always use "• " (bullet + space) formatting.`
      },
      {
        role: 'user' as const,
        content: `Generate 3-5 impactful bullet points for a resume work experience section:
- Job Title: ${jobTitle}
- Company: ${company}
- Industry: ${industry}

Requirements:
- ${languageInstructions[language]}
- Start each bullet with strong action verbs (e.g., "Developed", "Led", "Implemented")
- Include quantifiable achievements where appropriate (e.g., percentages, numbers)
- Make them ATS-friendly with relevant keywords
- Focus on results and impact, not just duties
- Keep each bullet point to 1-2 lines maximum
- Use present tense for current roles, past tense for previous roles

FORMATTING REQUIREMENTS:
- Start each bullet point with "• " (bullet symbol + space)
- Do NOT use "*", "-", or numbers
- One bullet point per line
- No additional text or explanations

Example format:
• Developed and implemented new software features
• Led cross-functional team of 8 developers
• Increased system performance by 40%`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 400,
        temperature: 0.7,
      })

      const bulletsText = completion.choices[0]?.message?.content?.trim() || ''
      return bulletsText.split('\n').map(bullet => bullet.replace(/^[•\-\*]\s*/, '').trim()).filter(bullet => bullet.length > 0)
    } catch (error) {
      // AI generation error
      throw new Error('Failed to generate bullet points')
    }
  }

  static async improveContent(
    content: string,
    contentType: 'summary' | 'description' | 'achievement',
    options: AIGenerationOptions
  ): Promise<string> {
    const { language = 'en' } = options

    const languageInstructions = {
      en: 'Write in English',
      ar: 'Write in Arabic with proper RTL formatting',
      ku: 'Write in Kurdish Sorani'
    }

    const typeInstructions = {
      summary: 'professional summary',
      description: 'job description',
      achievement: 'achievement or accomplishment'
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional resume writer who improves content to make it more impactful and ATS-friendly.`
      },
      {
        role: 'user' as const,
        content: `Improve the following ${typeInstructions[contentType]} for a resume:

Original Content: "${content}"

Requirements:
- ${languageInstructions[language]}
- Make it more impactful and professional
- Use stronger action verbs
- Add quantifiable elements where appropriate
- Make it ATS-friendly
- Keep the same general meaning but improve the expression
- Ensure proper grammar and clarity

Please provide only the improved content without any additional formatting or explanations.

IMPORTANT: Do NOT use any markdown formatting like **bold**, *italic*, or other symbols. Provide plain text only.`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      // AI generation error
      throw new Error('Failed to improve content')
    }
  }

  static async translateToEnglish(
    content: string,
    sourceLanguage: 'ar' | 'ku' | 'auto' = 'auto'
  ): Promise<string> {
    const languageNames = {
      ar: 'Arabic',
      ku: 'Kurdish Sorani',
      auto: 'the source language'
    }

    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional translator specializing in translating resume content from Arabic and Kurdish to English. Always maintain the professional tone and meaning.`
      },
      {
        role: 'user' as const,
        content: `Translate the following text from ${languageNames[sourceLanguage]} to English:

"${content}"

Requirements:
- Maintain professional resume language
- Preserve the original meaning and intent
- Use proper grammar and professional vocabulary
- Make it suitable for English-speaking employers
- If it's a job description or achievement, use professional resume language
- Keep the same structure and format

Please provide only the English translation without any additional formatting or explanations.

IMPORTANT: Do NOT use any markdown formatting like **bold**, *italic*, or other symbols. Provide plain text only.`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 400,
        temperature: 0.3, // Lower temperature for more consistent translation
      })

      return completion.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      // AI translation error
      throw new Error('Failed to translate content')
    }
  }

  static async translateAndEnhance(
    content: string,
    contentType: 'personal' | 'summary' | 'description' | 'achievement' | 'project',
    sourceLanguage: 'ar' | 'ku' | 'auto' = 'auto',
    contextInfo?: {
      jobTitle?: string
      company?: string
      projectName?: string
    }
  ): Promise<string> {
    const languageNames = {
      ar: 'Arabic',
      ku: 'Kurdish Sorani', 
      auto: 'the source language'
    }

    const typeInstructions = {
      personal: 'personal information (like professional title, location, etc.)',
      summary: 'professional summary for resume',
      description: 'job description or role responsibilities',
      achievement: 'achievement or accomplishment',
      project: 'project description'
    }

    const contextText = contextInfo ? `
Context Information:
${contextInfo.jobTitle ? `- Job Title: ${contextInfo.jobTitle}` : ''}
${contextInfo.company ? `- Company: ${contextInfo.company}` : ''}
${contextInfo.projectName ? `- Project: ${contextInfo.projectName}` : ''}
` : ''

    const wordCount = content.trim().split(/\s+/).length
    const isShortContent = wordCount <= 5
    
    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional resume writer and translator. You specialize in translating resume content from Arabic/Kurdish to English and then enhancing it to make it professional and ATS-friendly.`
      },
      {
        role: 'user' as const,
        content: `Translate and enhance the following ${typeInstructions[contentType]} from ${languageNames[sourceLanguage]} to professional English:

"${content}"
${contextText}
Requirements:
1. TRANSLATION: First translate accurately to English maintaining the original meaning
2. ENHANCEMENT: Then improve the English version to be:
   - Professional and polished for resume use
   - ATS-friendly with relevant keywords
   - Use strong action verbs where appropriate
   - Include quantifiable elements if possible
   - Proper grammar and professional vocabulary
   - Suitable for English-speaking employers

CRITICAL LENGTH REQUIREMENT:
${isShortContent ? 
`- The input has EXACTLY ${wordCount} word(s). You MUST return EXACTLY ${wordCount} word(s).
- If the input is a single word (like a nationality, country, or title), return ONLY the direct translation.
- DO NOT add articles (a, an, the), prepositions, or any extra words.
- Examples: "العراق" → "Iraq" (NOT "The Republic of Iraq"), "مهندس" → "Engineer" (NOT "Software Engineer")` :
`- Maintain approximately the same length as the original content.
- Do not significantly expand or reduce the content length.`}

${contentType === 'description' ? '- Format as bullet points using "• " if it contains multiple achievements or responsibilities' : ''}
${contentType === 'project' ? '- Focus on technical achievements and impact' : ''}

Please provide only the final enhanced English version without showing the translation steps or any additional explanations.

IMPORTANT: Do NOT use any markdown formatting like **bold**, *italic*, or other symbols. Provide plain text only.`
      }
    ]

    try {
      const completion = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash-preview-05-20',
        messages,
        max_tokens: 500,
        temperature: 0.5,
      })

      return completion.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      // AI translate & enhance error
      throw new Error('Failed to translate and enhance content')
    }
  }
}