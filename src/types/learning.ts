export type LearningCategory =
  | 'FUNDAMENTALS'
  | 'EXTERIOR'
  | 'WHEELS & TYRES'
  | 'BRAKES'
  | 'SUSPENSION'
  | 'PERFORMANCE'
  | 'ENGINE'
  | 'TUNING'
  | 'INTERIOR'
  | 'MAINTENANCE'
  | 'SAFETY';

export type LearningDifficulty = 'Beginner' | 'Enthusiast' | 'Master';

export interface LearningArticle {
  id: string;
  slug: string;
  title: string;
  category: LearningCategory;
  difficulty: LearningDifficulty;
  readTime: string;
  image: string;
  summary: string;
  beginnerContent: {
    plainLanguageExplanation: string;
    analogy: string;
    whyItMatters: string[];
    thingsToWatch: string[];
  };
  enthusiastContent: {
    engineeringDynamics: string;
    geometryAndDimensions: string;
    thermalAndMechanicalStresses: string;
    supportingModifications: string[];
    tuningParameters: string[];
  };
  relatedMarketplaceCategory?: string; // e.g. 'SUSPENSION', 'WHEELS', 'BRAKES'
  buildComponentTags: string[]; // matching tags like ['coilovers', 'suspension', 'camber']
}
