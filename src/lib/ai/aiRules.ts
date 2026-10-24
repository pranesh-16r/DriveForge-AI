export interface ValidationResult {
  isValid: boolean;
  sanitizedText: string;
  violations: string[];
  warningsAppended: boolean;
}

export const DISALLOWED_GUARANTEE_PATTERNS = [
  /\b100%\s+safe\b/i,
  /\bguaranteed\s+(horsepower|power|gain|hp|speed|performance|fit|clearance)\b/i,
  /\bdefinitely\s+(legal|street\s+legal|road\s+legal|safe)\b/i,
  /\bcompletely\s+(legal|safe|risk-free)\b/i,
  /\bwill\s+not\s+damage\b/i,
  /\bzero\s+risk\b/i,
  /\bguaranteed\s+safety\b/i,
  /\bcertified\s+road\s+legal\b/i,
  /\bguaranteed\s+to\s+pass\b/i
];

export const SAFETY_CRITICAL_KEYWORDS = [
  'brake',
  'caliper',
  'rotor',
  'pad',
  'suspension',
  'coilover',
  'spring',
  'steering',
  'camber',
  'wheel',
  'tire',
  'tyre',
  'offset',
  'turbo',
  'supercharger',
  'ecu',
  'tune',
  'fuel',
  'chassis',
  'roll cage'
];

export const ENGINEERING_VERIFICATION_DISCLAIMER = `

> **Safety Notice**: Physical vehicle modifications must be visually inspected and confirmed for hardware clearance, torque specification, and roadworthiness by a qualified technician prior to highway or high-performance operation.`;

export const LEGAL_DISCLAIMER = `

> **Regional Compliance Note**: DriveForge estimates technical compatibility only. Emissions, noise, and roadworthiness compliance vary by jurisdiction; consult local transport regulations and certified inspection engineers.`;
