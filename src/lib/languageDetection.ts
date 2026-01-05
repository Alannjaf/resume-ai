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

// Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to Western numerals (0123456789)
const ARABIC_INDIC_NUMERALS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
}

// Extended Arabic-Indic numerals (used in Persian/Urdu)
const EXTENDED_ARABIC_NUMERALS: Record<string, string> = {
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
}

/**
 * Checks if text contains Arabic-Indic numerals
 */
export function hasArabicIndicNumerals(text: string): boolean {
  if (!text) return false
  // Check for both Arabic-Indic (٠-٩) and Extended Arabic-Indic (۰-۹)
  return /[\u0660-\u0669\u06F0-\u06F9]/.test(text)
}

/**
 * Converts Arabic-Indic numerals to Western numerals
 * Handles both standard Arabic-Indic (٠-٩) and Extended (۰-۹) numerals
 */
export function convertArabicIndicToWestern(text: string): string {
  if (!text) return text
  
  let result = text
  
  // Convert standard Arabic-Indic numerals
  for (const [arabic, western] of Object.entries(ARABIC_INDIC_NUMERALS)) {
    result = result.replace(new RegExp(arabic, 'g'), western)
  }
  
  // Convert extended Arabic-Indic numerals (Persian/Urdu)
  for (const [arabic, western] of Object.entries(EXTENDED_ARABIC_NUMERALS)) {
    result = result.replace(new RegExp(arabic, 'g'), western)
  }
  
  return result
}

/**
 * Normalizes a phone number by converting Arabic-Indic numerals to Western
 * and removing any non-phone characters except + and spaces
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone
  
  // First convert Arabic-Indic numerals to Western
  let normalized = convertArabicIndicToWestern(phone)
  
  // Keep only digits, +, spaces, and common phone separators
  normalized = normalized.replace(/[^\d+\s\-().]/g, '')
  
  // Clean up multiple spaces
  normalized = normalized.replace(/\s+/g, ' ').trim()
  
  return normalized
}