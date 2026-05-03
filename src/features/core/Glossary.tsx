/**
 * @file Glossary.tsx
 * @description Searchable glossary component defining key election terms and concepts.
 */

import { useState, useCallback, useMemo, ChangeEvent, memo } from 'react';
import { glossaryTerms } from '@/data/content';
import { useDebounce } from '@/hooks/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '@/constants';
import { sanitizeText } from '@/utils/sanitize';

/**
 * Represents a single term and its definition in the election glossary.
 */
interface ElectionGlossaryItem {
  /** The technical term or phrase. */
  term: string;
  /** The plain-language definition of the term. */
  definition: string;
}

/** 
 * Individual glossary term card displaying the term and its definition.
 * Optimized with React.memo to prevent unnecessary re-renders during search input.
 * 
 * @param {Object} props - Component props.
 * @param {ElectionGlossaryItem} props.glossaryItem - The glossary entry to display.
 */
const GlossaryTermCard = memo(({ glossaryItem }: { glossaryItem: ElectionGlossaryItem }) => (
  <article className="glossary-card reveal" role="listitem">
    <div className="glossary-term">{glossaryItem.term}</div>
    <div className="glossary-def">{glossaryItem.definition}</div>
  </article>
));

GlossaryTermCard.displayName = 'GlossaryTermCard';

/**
 * Interactive election glossary with debounced search functionality.
 * Allows users to filter through technical election terminology.
 * 
 * @returns {JSX.Element} The rendered glossary section.
 */
export const Glossary = () => {
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(activeSearchQuery, SEARCH_DEBOUNCE_MS);

  /**
   * Updates the search query state with sanitized input.
   */
  const handleSearchInputChange = useCallback((inputEvent: ChangeEvent<HTMLInputElement>) => {
    setActiveSearchQuery(sanitizeText(inputEvent.target.value));
  }, []);

  /**
   * Filters the glossary terms based on the debounced search query.
   * Matches against both the term and the definition.
   */
  const filteredGlossaryTerms = useMemo(() => {
    const normalizedQuery = debouncedSearchQuery.toLowerCase().trim();
    const allGlossaryEntries = glossaryTerms as unknown as ElectionGlossaryItem[];
    
    if (!normalizedQuery) {
      return allGlossaryEntries;
    }
    
    return allGlossaryEntries.filter(
      (entry) =>
        entry.term.toLowerCase().includes(normalizedQuery) ||
        entry.definition.toLowerCase().includes(normalizedQuery)
    );
  }, [debouncedSearchQuery]);

  return (
    <section id="glossary" aria-labelledby="glossary-heading">
      <div className="section-inner">
        <p className="section-label reveal">Key Terms</p>
        <h2 className="section-title reveal" id="glossary-heading">
          Election <em>Glossary</em>
        </h2>
        <p className="section-desc reveal">
          Understand the language of democracy. These essential terms will help you follow election
          news with confidence.
        </p>

        {/* Debounced search input field */}
        <div className="glossary-search reveal">
          <input
            id="glossary-search-input"
            type="search"
            className="glossary-search-input"
            placeholder="Search terms…"
            value={activeSearchQuery}
            onChange={handleSearchInputChange}
            aria-label="Search glossary terms"
            aria-controls="glossary-results-grid"
            autoComplete="off"
          />
        </div>

        <div
          id="glossary-results-grid"
          className="glossary-grid reveal-stagger"
          role="list"
          aria-live="polite"
          aria-label={`${filteredGlossaryTerms.length} term${filteredGlossaryTerms.length !== 1 ? 's' : ''} found`}
        >
          {filteredGlossaryTerms.length > 0 ? (
            filteredGlossaryTerms.map((glossaryEntry) => (
              <GlossaryTermCard 
                key={glossaryEntry.term} 
                glossaryItem={glossaryEntry} 
              />
            ))
          ) : (
            <p className="glossary-empty">No terms match your search.</p>
          )}
        </div>
      </div>
    </section>
  );
};

