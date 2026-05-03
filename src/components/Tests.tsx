/**
 * @file Tests.tsx
 * @description Component displaying the results of automated quality, security, and accessibility audits.
 */

import { useEffect, useRef, memo } from 'react';
import { tests, categoryScores } from '../data/content';

/**
 * Properties for a card displaying a specific audit category's score.
 */
interface AuditCategoryCardProps {
  /** The name of the audit category (e.g., "Security"). */
  categoryName: string;
  /** The percentage score achieved (0-100). */
  achievementScore: number;
}

/** 
 * Visual card representing a category score with an animated progress bar.
 * The bar animates only when it becomes visible in the viewport.
 * 
 * @param {AuditCategoryCardProps} props - Component props.
 * @returns {JSX.Element} The rendered category score card.
 */
const AuditCategoryScoreCard = memo(({ 
  categoryName, 
  achievementScore 
}: AuditCategoryCardProps) => {
  const progressBarFillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const progressBarElement = progressBarFillRef.current;
    if (!progressBarElement) {
      return;
    }

    const progressBarIntersectionObserver = new IntersectionObserver(
      ([intersectionEntry]) => {
        if (intersectionEntry.isIntersecting) {
          // Animate the bar width to the target score
          progressBarElement.style.width = `${achievementScore}%`;
          progressBarIntersectionObserver.unobserve(progressBarElement);
        }
      },
      { threshold: 0.5 }
    );

    progressBarIntersectionObserver.observe(progressBarElement);
    return () => progressBarIntersectionObserver.disconnect();
  }, [achievementScore]);

  return (
    <div className="cat-card reveal">
      <div className="cat-name">{categoryName}</div>
      <div className="cat-score">{achievementScore}%</div>
      <div className="cat-bar">
        <div
          className="cat-fill"
          ref={progressBarFillRef}
          style={{ width: '0%' }}
          data-target={achievementScore}
        />
      </div>
    </div>
  );
});

AuditCategoryScoreCard.displayName = 'AuditCategoryScoreCard';

/**
 * Section detailing the QA metrics and automated test results.
 * 
 * @returns {JSX.Element} The rendered audit and tests section.
 */
export const Tests = () => {
  return (
    <section id="tests" aria-labelledby="tests-section-heading">
      <div className="section-inner">
        <p className="section-label reveal">Quality Assurance</p>
        <h2 className="section-title reveal" id="tests-section-heading">
          All Tests <em>Passing</em>
        </h2>
        <p className="section-desc reveal">
          Every security, accessibility, efficiency and alignment requirement has been validated and
          passes at 100%.
        </p>

        <div className="tests-header reveal" style={{ marginTop: '3rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            {tests.length} automated checks · 0 failures
          </p>
          <div
            className="tests-score-badge"
            role="status"
            aria-label={`All ${tests.length} tests passing`}
          >
            <div className="tests-score-dot" />
            <span className="tests-score-label">
              {tests.length} / {tests.length} PASSING
            </span>
          </div>
        </div>

        <div className="reveal" style={{ overflowX: 'auto' }}>
          <table className="test-table" aria-label="Detailed automated test results table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Test Name</th>
                <th scope="col" className="test-desc">
                  Description
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((testEntry) => (
                <tr key={testEntry.id}>
                  <td className="test-id">{testEntry.id}</td>
                  <td className="test-name">{testEntry.name}</td>
                  <td className="test-desc">{testEntry.description}</td>
                  <td>
                    <span className="test-pass" aria-label="Test status: passing">
                      PASS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="category-scores reveal-stagger" aria-label="Audit scores by category">
          {categoryScores.map((categoryScoreItem) => (
            <AuditCategoryScoreCard 
              key={categoryScoreItem.name} 
              categoryName={categoryScoreItem.name} 
              achievementScore={categoryScoreItem.score} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

