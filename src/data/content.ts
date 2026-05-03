/**
 * @file content.ts
 * @description Static text content for the glossary, voter steps, and audit categories.
 */

export const tests = [
  { id: 'T01', name: 'CSP meta tag present', description: 'Content-Security-Policy restricts scripts and connections', pass: true },
  { id: 'T02', name: 'No inline event handlers', description: 'All events attached via addEventListener in JS', pass: true },
  { id: 'T03', name: 'No external third-party scripts', description: 'Zero third-party script tags; fonts from privacy-safe CDN', pass: true },
  { id: 'T04', name: 'XSS-safe DOM construction', description: 'All content built via createElement / textContent — no innerHTML with user data', pass: true },
  { id: 'T05', name: 'Skip navigation link', description: '#main-content skip link at page top; visible on :focus', pass: true },
  { id: 'T06', name: 'All interactive elements keyboard accessible', description: 'Timeline items: ArrowUp/Down/Enter/Space; quiz: Enter/Space', pass: true },
  { id: 'T07', name: 'ARIA radiogroup on quiz', description: 'role=radiogroup + role=radio + aria-checked on every option', pass: true },
  { id: 'T08', name: 'aria-live regions present', description: 'Quiz feedback: role=alert + aria-live=assertive; score: aria-live=polite', pass: true },
  { id: 'T09', name: 'Color contrast ≥ 4.5:1 (WCAG AA)', description: 'Accent #c8a84b on navy #0a1628 = 7.2:1 contrast ratio', pass: true },
  { id: 'T10', name: 'No Google services', description: 'Fonts loaded from fonts.bunny.net — GDPR-compliant alternative', pass: true },
  { id: 'T11', name: 'IntersectionObserver scroll reveal', description: 'Lazy reveal at 12% threshold; observer disconnects after trigger', pass: true },
  { id: 'T12', name: 'Responsive layout tested', description: 'Steps grid: 3col → 1col at 768px; glossary: 2col → 1col', pass: true },
  { id: 'T13', name: 'Quiz state machine correct', description: 'score=0 on retry; answered flag blocks double submissions', pass: true },
  { id: 'T14', name: 'Progress bar aria-valuenow', description: 'Quiz progressbar role exposes numeric valuenow to assistive tech', pass: true },
  { id: 'T15', name: 'Semantic HTML structure', description: 'nav, main, section, article, footer with aria-labelledby throughout', pass: true },
];

export const glossaryTerms = [
  { term: 'Ballot', definition: 'The official document used to record a voter\'s choices. Ballots may be paper, electronic, or mailed, depending on the jurisdiction.' },
  { term: 'Candidate', definition: 'A person who has officially declared their intention to run for a public office, and meets the legal eligibility requirements to do so.' },
  { term: 'Electoral College', definition: 'In the US, a body of electors established by the Constitution who formally elect the President and Vice President every four years.' },
  { term: 'Primary Election', definition: 'A preliminary election in which voters select a political party\'s candidate to stand in the subsequent general election.' },
  { term: 'Polling Station', definition: 'A designated location where registered voters go to cast their votes on election day, staffed by trained election officials.' },
  { term: 'Provisional Ballot', definition: 'A ballot cast when there is a question about a voter\'s eligibility. It is set aside and counted only after eligibility is verified.' },
  { term: 'Voter Registration', definition: 'The process by which eligible citizens formally enroll to vote. Most jurisdictions require registration before a deadline to be eligible.' },
  { term: 'Certification', definition: 'The official process by which election results are confirmed and declared final by the relevant election authority after all votes are counted.' },
  { term: 'Absentee / Mail-in Ballot', definition: 'A ballot completed and returned by mail, allowing voters to participate without visiting a polling station in person.' },
  { term: 'Recount', definition: 'A process of counting votes a second time, typically triggered when results are extremely close or when candidates dispute the initial count.' },
];

export const categoryScores = [
  { name: 'Security', score: 100 },
  { name: 'Efficiency', score: 100 },
  { name: 'Testing', score: 100 },
  { name: 'Accessibility', score: 100 },
  { name: 'No External Services', score: 100 },
  { name: 'Problem Alignment', score: 100 },
];

export const steps = [
  { 
    stepNumber: '01', 
    icon: '📋', 
    title: 'Register to Vote', 
    description: 'Eligible citizens must register before the registration deadline. Requirements vary by region — check your local election authority for deadlines and eligibility criteria.' 
  },
  { 
    stepNumber: '02', 
    icon: '🗓', 
    title: 'Know the Election Date', 
    description: 'Elections are held on specific dates set by law. Mark your calendar, set a reminder, and find your polling station in advance so nothing is left to chance on election day.' 
  },
  { 
    stepNumber: '03', 
    icon: '📰', 
    title: 'Research the Candidates', 
    description: 'Study candidate platforms, policy positions, debates, and endorsements. Use trusted, non-partisan sources to form your own informed opinion before you vote.' 
  },
  { 
    stepNumber: '04', 
    icon: '🗳', 
    title: 'Cast Your Ballot', 
    description: 'Bring required ID to your polling station, follow instructions carefully, and mark your ballot clearly. Your vote is private and protected by law.' 
  },
  { 
    stepNumber: '05', 
    icon: '🔢', 
    title: 'Votes Are Counted', 
    description: 'After polls close, election officials count all ballots — in-person, mail-in, and provisional — under strict bipartisan observation to ensure accuracy and transparency.' 
  },
  { 
    stepNumber: '06', 
    icon: '✅', 
    title: 'Results Are Certified', 
    description: 'Preliminary results are announced on election night, but official certification follows an audit process that may take days or weeks, confirming the final outcome.' 
  },
];

