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
 * This works in both local development (file paths) and production/serverless (HTTP URLs)
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

  // Fallback to HTTP URL (works in serverless/production environments)
  // Use the original Google Fonts CDN URL as fallback
  const fontUrlMap: Record<string, string> = {
    "noto-sans-arabic-regular.woff2":
      "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfuXqA.woff2",
    "noto-sans-arabic-bold.woff2":
      "https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyGyfuXqA.woff2",
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
    // Uses local file paths when available, falls back to HTTP URLs for serverless/production
    const regularFontSrc = getFontSource("noto-sans-arabic-regular.woff2");
    const boldFontSrc = getFontSource("noto-sans-arabic-bold.woff2");

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
 * Check if we should attempt font registration
 * Fonts from HTTP URLs in serverless environments cause fontkit crashes
 * Only register fonts if we have valid local font files
 */
function shouldRegisterFonts(): boolean {
  try {
    const fontPath = path.join(process.cwd(), "public", "fonts", "noto-sans-arabic-regular.woff2");
    return fs.existsSync(fontPath);
  } catch {
    return false;
  }
}

/**
 * Initialize fonts synchronously (for server-side use)
 * This is a simpler version that doesn't require async
 * Note: Font registration in @react-pdf/renderer should happen before any PDF generation
 * 
 * IMPORTANT: Font registration is disabled in serverless/production environments
 * where HTTP URLs cause fontkit crashes. PDF generation will use system default fonts.
 */
export function initializePDFFonts(): void {
  if (fontsRegistered) {
    return;
  }

  if (fontRegistrationError) {
    console.warn("Font registration previously failed, skipping registration to avoid crashes");
    return; // Don't retry if it failed before - the font files are likely invalid
  }

  // Only register fonts if we have local font files
  // HTTP URLs cause fontkit crashes in serverless environments
  if (!shouldRegisterFonts()) {
    console.warn("Local font files not found. Skipping custom font registration to prevent fontkit crashes.");
    console.warn("PDF generation will use system default fonts (Helvetica). Kurdish/Arabic text may not render correctly.");
    return; // Don't attempt registration with HTTP URLs
  }

  try {
    // Register Noto Sans Arabic - supports Kurdish Sorani, Arabic, and Latin characters
    // Only using local file paths - HTTP URLs are disabled to prevent fontkit crashes
    const regularFontSrc = getFontSource("noto-sans-arabic-regular.woff2");
    const boldFontSrc = getFontSource("noto-sans-arabic-bold.woff2");

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
    console.error("Failed to initialize PDF fonts (non-blocking):", errorMessage);
    console.warn("PDF generation will continue using system default fonts. Kurdish/Arabic text may not render correctly.");
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
