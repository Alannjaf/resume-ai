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
      console.error('AI generation error:', error)
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
      console.error('AI generation error:', error)
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
      console.error('AI generation error:', error)
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
      console.error('AI generation error:', error)
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

Please provide only the improved content without any additional formatting or explanations.`
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
      console.error('AI generation error:', error)
      throw new Error('Failed to improve content')
    }
  }
}