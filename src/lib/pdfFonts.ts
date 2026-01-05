/**
 * PDF Font Registration and Utilities
 * Supports Kurdish Sorani, Arabic, and English text rendering
 */

import { Font } from "@react-pdf/renderer";
import { hasArabicKurdishChars } from "./languageDetection";
import path from "path";
import fs from "fs";

// Font registration flag to prevent multiple registrations
let fontsRegistered = false;
let fontRegistrationError: Error | null = null;

/**
 * Get font source - tries local file first, falls back to HTTP URL
 * Uses TTF format for better fontkit compatibility (WOFF2 causes crashes)
 */
function getFontSource(fontFileName: string): string {
  // Try local file path first (works in local dev and some deployment environments)
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", fontFileName);
    if (fs.existsSync(fontPath)) {
      return fontPath;
    }
  } catch {
    // File system access failed, will use HTTP URL
  }

  // Fallback to HTTP URL (for serverless/production environments)
  // Using GitHub raw URLs for TTF files - more reliable than Google Fonts CDN for WOFF2
  const fontUrlMap: Record<string, string> = {
    "noto-sans-arabic-regular-static.ttf":
      "https://github.com/google/fonts/raw/main/ofl/notosansarabic/static/NotoSansArabic-Regular.ttf",
    "noto-sans-arabic-bold-static.ttf":
      "https://github.com/google/fonts/raw/main/ofl/notosansarabic/static/NotoSansArabic-Bold.ttf",
  };

  if (fontUrlMap[fontFileName]) {
    return fontUrlMap[fontFileName];
  }

  throw new Error(`Font source not found for: ${fontFileName}`);
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
    // Uses TTF format for better fontkit compatibility
    const regularFontSrc = getFontSource("noto-sans-arabic-regular-static.ttf");
    const boldFontSrc = getFontSource("noto-sans-arabic-bold-static.ttf");

    Font.register({
      family: "NotoSansArabic",
      fonts: [
        {
          src: regularFontSrc,
          fontWeight: "normal",
        },
        {
          src: boldFontSrc,
          fontWeight: "bold",
        },
      ],
    });

    fontsRegistered = true;
    console.log("PDF fonts registered successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    fontRegistrationError =
      error instanceof Error ? error : new Error(errorMessage);
    console.error("Failed to register PDF fonts:", error);
    throw fontRegistrationError; // Re-throw to let callers handle the error
  }
}

/**
 * Get the appropriate font family based on text content
 * Returns a font that supports the detected language
 * Falls back to system default if custom fonts are not registered
 */
export function getFontFamily(text: string | null | undefined): string {
  // If fonts are not registered, use system default fonts
  // This prevents crashes when custom fonts fail to load
  if (!fontsRegistered) {
    return "Helvetica"; // System default that works reliably
  }

  if (!text) {
    return "NotoSansArabic"; // Default to Unicode-supporting font if registered
  }

  // Check if text contains Arabic/Kurdish characters
  if (hasArabicKurdishChars(text)) {
    return "NotoSansArabic";
  }

  // For English text, we can still use NotoSansArabic as it supports Latin
  // This ensures consistent Unicode support across all languages
  return "NotoSansArabic";
}

/**
 * Initialize fonts synchronously (for server-side use)
 * This is a simpler version that doesn't require async
 * Note: Font registration in @react-pdf/renderer should happen before any PDF generation
 *
 * Uses TTF format for better compatibility with fontkit (WOFF2 causes crashes).
 * Will attempt to use HTTP URLs for TTF files if local files are not available.
 */
export function initializePDFFonts(): void {
  if (fontsRegistered) {
    return;
  }

  if (fontRegistrationError) {
    console.warn(
      "Font registration previously failed, skipping registration to avoid crashes"
    );
    return; // Don't retry if it failed before - the font files are likely invalid
  }

  try {
    // Register Noto Sans Arabic - supports Kurdish Sorani, Arabic, and Latin characters
    // Using TTF format (more compatible with fontkit than WOFF2)
    // Will try local files first, fall back to GitHub raw URLs for TTF
    const regularFontSrc = getFontSource("noto-sans-arabic-regular-static.ttf");
    const boldFontSrc = getFontSource("noto-sans-arabic-bold-static.ttf");

    Font.register({
      family: "NotoSansArabic",
      fonts: [
        {
          src: regularFontSrc,
          fontWeight: "normal",
        },
        {
          src: boldFontSrc,
          fontWeight: "bold",
        },
      ],
    });

    fontsRegistered = true;
    console.log("PDF fonts initialized successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    fontRegistrationError =
      error instanceof Error ? error : new Error(errorMessage);
    console.error(
      "Failed to initialize PDF fonts (non-blocking):",
      errorMessage
    );
    console.warn(
      "PDF generation will continue using system default fonts. Kurdish/Arabic text may not render correctly."
    );
    // Don't throw - allow PDF generation to continue with default fonts
    // This prevents the entire PDF generation from failing due to font issues
  }
}

/**
 * Check if fonts are successfully registered
 */
export function areFontsRegistered(): boolean {
  return fontsRegistered;
}
