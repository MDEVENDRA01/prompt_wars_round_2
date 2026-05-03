/**
 * @file Hero.tsx
 * @description The landing hero section of the application, featuring animated background elements and primary calls to action.
 */

import { useRef, memo } from 'react';

/**
 * Properties for a single animated background particle.
 */
interface BackgroundParticleProps {
  /** Diameter of the particle in pixels. */
  particleDiameterInPixels: number;
  /** Horizontal position as a percentage of the container width. */
  horizontalPositionPercentage: number;
  /** Duration of the upward floating animation in seconds. */
  animationDurationInSeconds: number;
  /** Delay before the animation starts in seconds (can be negative for immediate start at offset). */
  animationDelayInSeconds: number;
}

/** 
 * A single animated particle element in the hero background.
 * Optimized with React.memo to prevent re-renders as they are static decorative elements.
 * 
 * @param {BackgroundParticleProps} props - Component props.
 * @returns {JSX.Element} The rendered particle.
 */
const BackgroundAmbientParticle = memo(({ 
  particleDiameterInPixels, 
  horizontalPositionPercentage, 
  animationDurationInSeconds, 
  animationDelayInSeconds 
}: BackgroundParticleProps) => {
  return (
    <div
      className="particle"
      style={{
        width: `${particleDiameterInPixels}px`,
        height: `${particleDiameterInPixels}px`,
        left: `${horizontalPositionPercentage}%`,
        animationDuration: `${animationDurationInSeconds}s`,
        animationDelay: `${animationDelayInSeconds}s`,
      }}
    />
  );
});

BackgroundAmbientParticle.displayName = 'BackgroundAmbientParticle';

/**
 * Full-bleed hero section with animated particles, high-impact typography, and primary navigation links.
 * 
 * @returns {JSX.Element} The rendered hero section.
 */
export const Hero = () => {
  /**
   * Generates and stores a stable configuration for background particles.
   * Using a ref ensures these values persist across re-renders without changing, 
   * avoiding distracting "jumps" in animation state.
   */
  const backgroundParticlesConfigRef = useRef(
    Array.from({ length: 14 }, (_, sequencedParticleIndex) => ({
      uniqueParticleId: sequencedParticleIndex,
      diameter: Math.random() * 4 + 2,
      offset: Math.random() * 100,
      duration: Math.random() * 18 + 12,
      delay: Math.random() * -20,
    }))
  );

  return (
    <section id="hero" aria-labelledby="hero-heading" className="hero-landing-section">
      {/* Decorative background layers */}
      <div className="hero-background-gradient-overlay" aria-hidden="true" />
      <div className="hero-background-grid-pattern" aria-hidden="true" />
      
      {/* Animated particle layer */}
      <div className="hero-animated-particles-layer" id="particles-container" aria-hidden="true">
        {backgroundParticlesConfigRef.current.map((particleConfig) => (
          <BackgroundAmbientParticle
            key={particleConfig.uniqueParticleId}
            particleDiameterInPixels={particleConfig.diameter}
            horizontalPositionPercentage={particleConfig.offset}
            animationDurationInSeconds={particleConfig.duration}
            animationDelayInSeconds={particleConfig.delay}
          />
        ))}
      </div>

      <div className="hero-primary-content-wrapper">
        <div 
          className="hero-status-badge" 
          role="note" 
          aria-label="Non-partisan civic education resource"
        >
          Non-Partisan Civic Education
        </div>
        
        <h1 id="hero-heading">
          Understand the Power of Your <em>Vote</em>
        </h1>
        
        <p className="hero-sub-description">
          A comprehensive, accessible guide to how elections work — from candidacy declaration
          to official certification. Learn the process, test your knowledge, and participate
          with confidence.
        </p>
        
        <div className="hero-call-to-action-links">
          <a href="#timeline" className="btn-primary">
            Explore the Process →
          </a>
          <a href="#quiz" className="btn-outline">
            Take the Quiz
          </a>
        </div>
      </div>

      {/* Decorative scroll indicator */}
      <div className="hero-scroll-indicator-visual" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-progress-line-element" />
      </div>
    </section>
  );
};


