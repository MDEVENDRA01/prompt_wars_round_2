/**
 * @file phases.ts
 * @description Static collection of election process phases for the timeline feature.
 */

export const phases = [
  {
    phaseIcon: '🏛',
    phaseTitle: 'Candidacy Declaration',
    shortDescription: 'Candidates formally announce intent to run and file official paperwork with the election authority.',
    detailedInformation: 'Before a person can appear on the ballot, they must formally declare their candidacy, meet eligibility requirements (age, residency, citizenship), and file the necessary paperwork with the relevant election authority. They may also need to collect a minimum number of nomination signatures from registered voters.',
    tags: ['Filing Period', 'Eligibility Check', 'Nomination'],
  },
  {
    phaseIcon: '🗳',
    phaseTitle: 'Primary / Nomination',
    shortDescription: 'Parties select their official candidate through a primary election or caucus process.',
    detailedInformation: 'In the primary phase, political parties narrow their field to a single nominee. This can take the form of a primary election (where registered voters cast ballots), a caucus (a community meeting with public alignment), or a party convention. The winner advances to the general election.',
    tags: ['Primary Election', 'Caucus', 'Convention'],
  },
  {
    phaseIcon: '📝',
    phaseTitle: 'Voter Registration',
    shortDescription: 'Eligible citizens register before the registration deadline to be eligible to vote.',
    detailedInformation: 'Most jurisdictions require voters to register ahead of election day. Registration typically involves submitting personal information (name, address, citizenship status) to election authorities. Some places allow same-day registration, while others require registration weeks in advance. Always verify your registration status.',
    tags: ['Eligibility', 'Deadline', 'ID Requirements'],
  },
  {
    phaseIcon: '📣',
    phaseTitle: 'Campaign Period',
    shortDescription: 'Candidates campaign to persuade voters through debates, ads, and outreach.',
    detailedInformation: 'During the campaign period, candidates actively seek voter support through public rallies, debates, advertising, door-to-door canvassing, and social media outreach. Campaign finance laws regulate how money can be raised and spent. Voters should seek information from multiple, verified sources to form balanced opinions.',
    tags: ['Debates', 'Campaigning', 'Finance Disclosure'],
  },
  {
    phaseIcon: '🗳',
    phaseTitle: 'Election Day',
    shortDescription: 'Registered voters cast their ballots at polling stations or by mail.',
    detailedInformation: 'On election day, polling stations open for a set period (often 12–14 hours). Voters verify their identity, receive a ballot, and cast their vote privately. Mail-in and absentee ballots submitted before election day are also collected. Bipartisan poll watchers observe the process to ensure integrity.',
    tags: ['Polls Open', 'Ballots Cast', 'Accessibility'],
  },
  {
    phaseIcon: '✅',
    phaseTitle: 'Counting & Certification',
    shortDescription: 'Officials count all ballots, audit results, and officially certify the outcome.',
    detailedInformation: 'After polls close, officials count all valid ballots — including provisional and mail-in ballots — under observation. Preliminary results are reported on election night. A formal canvass and audit process follows before results are officially certified. In close races, recounts may be triggered automatically or by petition.',
    tags: ['Canvass', 'Audit', 'Official Certification'],
  },
];

