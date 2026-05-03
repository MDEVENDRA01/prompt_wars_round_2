/**
 * @file sanitize.ts
 * @description Utility functions for sanitizing user inputs and HTML content to prevent XSS and other injection attacks.
 */

import DOMPurify from 'dompurify';

/**
 * List of HTML tags allowed in sanitized content to preserve basic formatting.
 */
const ALLOWED_HTML_TAGS = ['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'li', 'ol'];

/**
 * Maximum character length allowed for sanitized names.
 */
const MAX_NAME_LENGTH = 64;

/**
 * Sanitizes a raw HTML string using DOMPurify.
 * Always use this before rendering any HTML via dangerouslySetInnerHTML.
 * 
 * @param {string} untrustedHtmlContent - The untrusted HTML string to sanitize.
 * @returns {string} Safe HTML string containing only allowed tags.
 */
export const sanitizeHtml = (untrustedHtmlContent: string): string => {
  if (typeof untrustedHtmlContent !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(untrustedHtmlContent, { 
    ALLOWED_TAGS: ALLOWED_HTML_TAGS 
  });
};

/**
 * Strips ALL HTML tags from a string, returning only plain text.
 * 
 * @param {string} untrustedString - The untrusted string to sanitize.
 * @returns {string} Safe plain text string with no HTML tags.
 */
export const sanitizeText = (untrustedString: string): string => {
  if (typeof untrustedString !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(untrustedString, { 
    ALLOWED_TAGS: [] 
  });
};

/**
 * Validates and sanitizes a URL, ensuring it uses the HTTPS protocol.
 * 
 * @param {string} untrustedUrl - The URL string to validate.
 * @returns {string | null} The safe URL or null if invalid or non-HTTPS.
 */
export const sanitizeUrl = (untrustedUrl: string): string | null => {
  if (typeof untrustedUrl !== 'string') {
    return null;
  }
  
  try {
    const parsedUrl = new URL(untrustedUrl);
    
    // Only allow HTTPS to ensure secure connections
    if (parsedUrl.protocol !== 'https:') {
      return null;
    }
    
    return parsedUrl.href;
  } catch (urlParsingError) {
    // If URL parsing fails, the input is not a valid URL
    console.debug('URL sanitization failed:', urlParsingError);
    return null;
  }
};

/**
 * Sanitizes a name string used in form inputs.
 * Allows letters, spaces, hyphens and apostrophes only.
 * 
 * @param {string} userSuppliedName - The user-supplied name string.
 * @returns {string} Sanitized name string, trimmed and limited in length.
 */
export const sanitizeName = (userSuppliedName: string): string => {
  if (typeof userSuppliedName !== 'string') {
    return '';
  }
  
  // Regex allows standard letters, accented characters, spaces, hyphens, and apostrophes
  const sanitizedNameResult = userSuppliedName.replace(/[^a-zA-Z\u00C0-\u024F\s'-]/g, '');
  
  return sanitizedNameResult.trim().slice(0, MAX_NAME_LENGTH);
};

