import { LearningArticle, LearningCategory, LearningDifficulty } from '../../types/learning';
import { LEARNING_ARTICLES } from './learningData';
import { BuildComponent } from '../../types/build';

export interface LearningFilterOptions {
  query?: string;
  category?: LearningCategory | 'ALL';
  difficulty?: LearningDifficulty | 'ALL';
}

export class LearningService {
  public static getAllArticles(): LearningArticle[] {
    return LEARNING_ARTICLES;
  }

  public static getArticleById(id: string): LearningArticle | undefined {
    return LEARNING_ARTICLES.find(a => a.id === id || a.slug === id);
  }

  public static filterArticles(options: LearningFilterOptions): LearningArticle[] {
    const { query = '', category = 'ALL', difficulty = 'ALL' } = options;
    const cleanQuery = query.toLowerCase().trim();

    return LEARNING_ARTICLES.filter(article => {
      // Category filter
      if (category !== 'ALL' && article.category !== category) {
        return false;
      }

      // Difficulty filter
      if (difficulty !== 'ALL' && article.difficulty !== difficulty) {
        return false;
      }

      // Search query
      if (cleanQuery) {
        const matchTitle = article.title.toLowerCase().includes(cleanQuery);
        const matchSummary = article.summary.toLowerCase().includes(cleanQuery);
        const matchCategory = article.category.toLowerCase().includes(cleanQuery);
        const matchTags = article.buildComponentTags.some(t => t.toLowerCase().includes(cleanQuery));
        if (!matchTitle && !matchSummary && !matchCategory && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Recommends articles specifically based on components in the user's active build!
   * E.g. if the user added Öhlins Coilovers -> recommend "Dual-Flow Coilovers" and "Corner Balancing"
   */
  public static getRecommendedArticlesForBuild(buildComponents: BuildComponent[]): LearningArticle[] {
    if (!buildComponents || buildComponents.length === 0) {
      // Return 2 popular introductory articles
      return LEARNING_ARTICLES.slice(0, 2);
    }

    const matchedArticles = new Set<LearningArticle>();

    buildComponents.forEach(bc => {
      const compName = (bc.name || '').toLowerCase();
      const compCat = (bc.category || '').toLowerCase();

      LEARNING_ARTICLES.forEach(art => {
        const matchesTag = art.buildComponentTags.some(tag => {
          const t = tag.toLowerCase();
          return compName.includes(t) || compCat.includes(t);
        });

        if (matchesTag) {
          matchedArticles.add(art);
        }
      });
    });

    // If none matched, return default top 3
    if (matchedArticles.size === 0) {
      return LEARNING_ARTICLES.slice(0, 3);
    }

    return Array.from(matchedArticles).slice(0, 4);
  }
}
