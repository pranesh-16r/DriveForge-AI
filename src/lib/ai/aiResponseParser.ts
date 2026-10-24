import {
  DISALLOWED_GUARANTEE_PATTERNS,
  SAFETY_CRITICAL_KEYWORDS,
  ENGINEERING_VERIFICATION_DISCLAIMER,
  LEGAL_DISCLAIMER,
  ValidationResult
} from './aiRules';
import { DriveForgeAIContext } from './aiContext';

export interface StructuredAIResponse {
  rawText: string;
  directAnswer?: string;
  why?: string;
  currentData?: string;
  recommendation?: string;
  verificationRequired?: string;
  hasStructuredSections: boolean;
  violations: string[];
}

/**
 * Validates an AI generated string against safety and guarantee rules
 */
export function validateAIResponse(
  rawText: string,
  context: DriveForgeAIContext
): ValidationResult {
  let sanitizedText = rawText;
  const violations: string[] = [];

  // Check for disallowed absolute guarantee claims
  for (const pattern of DISALLOWED_GUARANTEE_PATTERNS) {
    if (pattern.test(sanitizedText)) {
      violations.push(`Detected guarantee phrase matching ${pattern}`);
      // Sanitize out absolute guarantee words with engineering probability terms
      sanitizedText = sanitizedText.replace(pattern, 'operationally verified under standard parameters');
    }
  }

  // Check if safety critical keywords are discussed without any safety notice
  const lower = sanitizedText.toLowerCase();
  const touchesSafety = SAFETY_CRITICAL_KEYWORDS.some(k => lower.includes(k));
  let warningsAppended = false;

  if (touchesSafety && !lower.includes('verify') && !lower.includes('caution') && !lower.includes('inspection') && !lower.includes('disclaimer')) {
    sanitizedText += ENGINEERING_VERIFICATION_DISCLAIMER;
    warningsAppended = true;
  }

  // Check if legal/street legality was discussed without legal note
  if ((lower.includes('legal') || lower.includes('homologation') || lower.includes('emissions')) && !lower.includes('regulation') && !lower.includes('jurisdiction')) {
    sanitizedText += LEGAL_DISCLAIMER;
    warningsAppended = true;
  }

  return {
    isValid: violations.length === 0,
    sanitizedText,
    violations,
    warningsAppended
  };
}

/**
 * Extracts structured sections (DIRECT ANSWER, WHY, CURRENT DATA, RECOMMENDATION, VERIFICATION REQUIRED)
 * from the response text if present.
 */
export function parseStructuredSections(rawText: string): StructuredAIResponse {
  const result: StructuredAIResponse = {
    rawText,
    hasStructuredSections: false,
    violations: []
  };

  const sections: Record<string, string> = {};
  const sectionHeaders = [
    'DIRECT ANSWER',
    'WHY',
    'CURRENT DATA',
    'DATA',
    'RECOMMENDATION',
    'VERIFICATION REQUIRED',
    'WARNING'
  ];

  // Regex pattern matching headers like **DIRECT ANSWER** or DIRECT ANSWER:
  const headerRegex = /(?:\*\*|###?\s*)?(DIRECT ANSWER|WHY|CURRENT DATA|DATA|RECOMMENDATION|VERIFICATION REQUIRED|WARNING)(?:\*\*|:)?\s*\n?([\s\S]*?)(?=(?:\*\*|###?\s*)?(?:DIRECT ANSWER|WHY|CURRENT DATA|DATA|RECOMMENDATION|VERIFICATION REQUIRED|WARNING)(?:\*\*|:)?|$)/gi;

  let match;
  let matchesCount = 0;

  while ((match = headerRegex.exec(rawText)) !== null) {
    const header = match[1].toUpperCase().trim();
    const content = match[2].trim();
    if (content) {
      sections[header] = content;
      matchesCount++;
    }
  }

  if (matchesCount >= 2) {
    result.hasStructuredSections = true;
    result.directAnswer = sections['DIRECT ANSWER'];
    result.why = sections['WHY'];
    result.currentData = sections['CURRENT DATA'] || sections['DATA'];
    result.recommendation = sections['RECOMMENDATION'];
    result.verificationRequired = sections['VERIFICATION REQUIRED'] || sections['WARNING'];
  }

  return result;
}
