/**
 * @file Footer.tsx
 * @description Application footer component containing branding and non-partisan educational disclaimers.
 */

import { APP_NAME } from '../constants';

/**
 * Renders the application footer with mission statement and privacy notes.
 * 
 * @returns {JSX.Element} The rendered Footer component.
 */
export const Footer = () => {
  return (
    <footer>
      <div className="footer-branding-display">
        {APP_NAME}
      </div>
      <div className="footer-content-summary">
        <p>Election Process Education · Civic Participation · Informed Voting</p>
        <p style={{ marginTop: '0.3rem', fontSize: '0.75rem' }}>
          Non-partisan educational resource · No tracking · No ads · No data collection
        </p>
      </div>
    </footer>
  );
};


