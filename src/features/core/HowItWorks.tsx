/**
 * @file HowItWorks.tsx
 * @description Educational section outlining the essential steps for every voter.
 */

import { memo } from 'react';
import { steps } from '@/data/content';

/**
 * Properties for a card representing a single step in the voting process.
 */
interface VoterStepCardProps {
  /** The sequence number of the step (e.g., "01"). */
  stepSequenceNumber: string;
  /** Emoji icon representing the action. */
  stepIcon: string;
  /** Descriptive title of the step. */
  stepTitle: string;
  /** Detailed description of what the voter needs to do. */
  stepDescriptionText: string;
}

/** 
 * Component for a single voter action step card.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @param {VoterStepCardProps} props - Component props.
 * @returns {JSX.Element} The rendered step card.
 */
const VoterActionStepCard = memo(({ 
  stepSequenceNumber, 
  stepIcon, 
  stepTitle, 
  stepDescriptionText 
}: VoterStepCardProps) => {
  return (
    <article className="step-card reveal" role="listitem">
      <div className="step-num" aria-hidden="true">
        {stepSequenceNumber}
      </div>
      <div className="step-icon" aria-hidden="true">
        {stepIcon}
      </div>
      <h3>{stepTitle}</h3>
      <p>{stepDescriptionText}</p>
    </article>
  );
});

VoterActionStepCard.displayName = 'VoterActionStepCard';

/** 
 * Section detailing the essential steps every voter should follow.
 * 
 * @returns {JSX.Element} The rendered "How It Works" section.
 */
export const HowItWorks = () => {
  return (
    <section id="how" aria-labelledby="how-it-works-heading">
      <div className="section-inner">
        <p className="section-label reveal">How It Works</p>
        <h2 className="section-title reveal" id="how-it-works-heading">
          Steps Every <em>Voter</em> Should Know
        </h2>
        <p className="section-desc reveal">
          Participating in an election is straightforward when you know the steps. Here's your
          complete guide.
        </p>

        <div className="steps-grid reveal-stagger" role="list">
          {steps.map((stepData) => (
            <VoterActionStepCard 
              key={stepData.num} 
              stepSequenceNumber={stepData.num} 
              stepIcon={stepData.icon} 
              stepTitle={stepData.title} 
              stepDescriptionText={stepData.desc} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

