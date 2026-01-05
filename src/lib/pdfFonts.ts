/**
 * PDF Font Registration and Utilities
 * Supports Kurdish Sorani, Arabic, and English text rendering
 */

import { Font } from '@react-pdf/renderer';
import { hasArabicKurdishChars } from './languageDetection';
import path from 'path';
import fs from 'fs';

// Font registration flag to prevent multiple registrations
let fontsRegistered = false;
let fontRegistrationError: Error | null = null;

/**
 * Get local font file path for server-side use
 * @react-pdf/renderer's Font.register() accepts file paths as strings
 */
function getLocalFontPath(fontFileName: string): string {
  // For server-side, use absolute path from project root
  const fontPath = path.join(process.cwd(), 'public', 'fonts', fontFileName);
  
  // Verify file exists
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font file not found: ${fontPath}`);
  }
  
  return fontPath;
}

/**
 * Register fonts that support Kurdish Sorani, Arabic, and English
 * This should be called before generating any PDFs
 */
export async function registerPDFFonts(): Promise<void> {
  if (fontsRegistered) {
    return;
  }

  if (fontRegistrationError) {
    throw fontRegistrationError;
  }

  try {
    // Register Noto Sans Arabic - supports Kurdish Sorani, Arabic, and Latin characters
    // Using local font file paths for reliable server-side rendering
    const regularFontPath = getLocalFontPath('noto-sans-arabic-regular.woff2');
    const boldFontPath = getLocalFontPath('noto-sans-arabic-bold.woff2');
    
    Font.register({
      family: 'NotoSansArabic',
      fonts: [
        {
          src: regularFontPath,
          fontWeight: 'normal',
        },
        {
          src: boldFontPath,
          fontWeight: 'bold',
        },
      ],
    });
    
    fontsRegistered = true;
    console.log('PDF fonts registered successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fontRegistrationError = error instanceof Error ? error : new Error(errorMessage);
    console.error('Failed to register PDF fonts:', error);
    throw fontRegistrationError; // Re-throw to let callers handle the error
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

  if (fontRegistrationError) {
    console.warn('Font registration previously failed, attempting again...');
    fontRegistrationError = null;
  }

  try {
    // Register Noto Sans Arabic - supports Kurdish Sorani, Arabic, and Latin characters
    // Using local font file paths for reliable server-side rendering
    const regularFontPath = getLocalFontPath('noto-sans-arabic-regular.woff2');
    const boldFontPath = getLocalFontPath('noto-sans-arabic-bold.woff2');
    
    Font.register({
      family: 'NotoSansArabic',
      fonts: [
        {
          src: regularFontPath,
          fontWeight: 'normal',
        },
        {
          src: boldFontPath,
          fontWeight: 'bold',
        },
      ],
    });

    fontsRegistered = true;
    console.log('PDF fonts initialized successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    fontRegistrationError = error instanceof Error ? error : new Error(errorMessage);
    console.error('Failed to initialize PDF fonts:', error);
    console.error('Font registration error details:', errorMessage);
    // Don't throw here - let the PDF generation attempt continue
    // The error will be logged and may cause rendering issues, but won't crash the process
  }
}

/**
 * Check if fonts are successfully registered
 */
export function areFontsRegistered(): boolean {
  return fontsRegistered;
}

