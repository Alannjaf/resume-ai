/**
 * Language Detection Utility
 * Detects if text content is in Kurdish/Arabic or English
 */

// Arabic and Kurdish Unicode ranges
const ARABIC_KURDISH_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

// Common English words for detection
const COMMON_ENGLISH_WORDS = [
  'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those'
]

/**
 * Checks if text contains Arabic or Kurdish characters
 */
export function hasArabicKurdishChars(text: string): boolean {
  return ARABIC_KURDISH_REGEX.test(text)
}

/**
 * Calculates the ratio of English words in the text
 */
export function getEnglishWordsRatio(text: string): number {
  if (!text || text.trim().length === 0) return 1 // Empty text is considered English

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0)

  if (words.length === 0) return 1

  const englishWords = words.filter(word => 
    COMMON_ENGLISH_WORDS.includes(word) || 
    /^[a-z]+$/.test(word) // Only contains English letters
  )

  return englishWords.length / words.length
}

/**
 * Determines if text is likely in Kurdish or Arabic (non-English)
 */
export function isNonEnglishContent(text: string): boolean {
  if (!text || text.trim().length === 0) return false
  
  // Check for Arabic/Kurdish characters
  if (hasArabicKurdishChars(text)) return true
  
  // Check English words ratio (if less than 40% English words, consider non-English)
  const englishRatio = getEnglishWordsRatio(text)
  return englishRatio < 0.4
}

/**
 * Detects the primary language of the text
 */
export function detectLanguage(text: string): 'en' | 'ar' | 'ku' | 'unknown' {
  if (!text || text.trim().length === 0) return 'en'
  
  // Check for Arabic/Kurdish script
  if (hasArabicKurdishChars(text)) {
    // Simple heuristic: if contains common Kurdish words, likely Kurdish
    const kurdishIndicators = /(?:^|\s)(من|تۆ|ئەو|ئێمە|ئێوە|ئەوان|کە|لە|بۆ|لەگەڵ)(?:\s|$)/i
    return kurdishIndicators.test(text) ? 'ku' : 'ar'
  }
  
  // Check English ratio
  const englishRatio = getEnglishWordsRatio(text)
  if (englishRatio > 0.6) return 'en'
  
  return 'unknown'
}

/**
 * Checks if content should show the translate & enhance button
 */
export function shouldShowTranslateButton(text: string): boolean {
  if (!text || text.trim().length < 2) return false // Must have at least 2 characters
  return isNonEnglishContent(text)
}