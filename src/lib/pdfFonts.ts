/**
 * PDF Font Registration and Utilities
 * Supports Kurdish Sorani, Arabic, and English text rendering
 */

import { Font } from '@react-pdf/renderer';
import { hasArabicKurdishChars } from './languageDetection';

// Font registration flag to prevent multiple registrations
let fontsRegistered = false;

/**
 * Register fonts that support Kurdish Sorani, Arabic, and English
 * This should be called before generating any PDFs
 */
export async function registerPDFFonts(): Promise<void> {
  if (fontsRegistered) {
    return;
  }

  try {
    // Register Noto Sans Arabic - supports Kurdish Sorani, Arabic, and Latin characters
    // Using Google Fonts CDN - the font supports all required scripts
    Font.register({
      family: 'NotoSansArabic',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfuXqA.woff2',
          fontWeight: 'normal',
        },
        {
          src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfuXqA.woff2',
          fontWeight: 'bold',
        },
      ],
    });
    
    fontsRegistered = true;
  } catch (error) {
    console.error('Failed to register PDF fonts:', error);
    // Continue with default fonts if registration fails
  }
}

/**
 * Get the appropriate font family based on text content
 * Returns a font that supports the detected language
 */
export function getFontFamily(text: string | null | undefined): string {
  if (!text) {
    return 'NotoSansArabic'; // Default to Unicode-supporting font
  }

  // Check if text contains Arabic/Kurdish characters
  if (hasArabicKurdishChars(text)) {
    return 'NotoSansArabic';
  }

  // For English text, we can still use NotoSansArabic as it supports Latin
  // This ensures consistent Unicode support across all languages
  return 'NotoSansArabic';
}

/**
 * Initialize fonts synchronously (for server-side use)
 * This is a simpler version that doesn't require async
 * Note: Font registration in @react-pdf/renderer should happen before any PDF generation
 */
export function initializePDFFonts(): void {
  if (fontsRegistered) {
    return;
  }

  try {
    // Register Noto Sans Arabic - supports Kurdish Sorani, Arabic, and Latin characters
    // Note: If the CDN URL doesn't work, you may need to download the font file
    // and serve it locally or use a different CDN
    Font.register({
      family: 'NotoSansArabic',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfuXqA.woff2',
          fontWeight: 'normal',
        },
        {
          src: 'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfuXqA.woff2',
          fontWeight: 'bold',
        },
      ],
    });

    fontsRegistered = true;
  } catch (error) {
    console.error('Failed to initialize PDF fonts:', error);
    // If font registration fails, we'll fall back to default fonts
    // The styles will use 'NotoSansArabic' but it may fall back to system fonts
  }
}

