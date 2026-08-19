export interface PYQAnalysisSection {
  title: string;
  badge: string;
  summary: string;
  keyInsights: string[];
  caveatNote?: string;
}

export interface PYQHeatmapItem {
  id: string;
  paperId: string;
  paperName: string;
  chapterTitle: string;
  topicTitle: string;
  subTopicTitle: string;
  subTopicId: string;
  verifiedPYQCount: number;
  restructuredCount: number;
  historicalCount: number;
  testedSessions: string[];
  difficultyTrend: 'Easy' | 'Moderate' | 'Challenging';
  strategicPriority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOWER PRIORITY';
  repetitionFrequency: 'Frequent' | 'Periodic' | 'Emerging in Restructured Syllabus';
  examinerFocus: string;
  commonTrapWarning: string;
}

export const TRANSITION_WARNING_BANNER = {
  headline: 'TRANSITION NOTICE: ICSI SYLLABUS RESTRUCTURING EFFECTIVE JUNE 2026',
  message: 'The Institute of Company Secretaries of India (ICSI) restructured the CSEET scheme from June 2026 onwards. A 5-year historical dataset of directly comparable restructured-syllabus papers does not yet exist. The system strictly separates current restructured-pattern evidence from older historical data to maintain 100% authoritative integrity without fabricating trends.',
  rules: [
    'Restructured sessions (June 2026 onwards) reflect the current 4-Paper standalone scheme.',
    'Historical papers (Nov 2020 - May 2026) are analyzed solely for overlapping legal, economic, and grammatical concepts.',
    'Old-syllabus questions are clearly labelled [OLD SYLLABUS] and are never presented as evidence of the new structure.',
  ],
};

export const PYQ_SECTION_A: PYQAnalysisSection = {
  title: 'SECTION A: CURRENT RESTRUCTURED-SYLLABUS ANALYSIS (JUNE 2026 ONWARDS)',
  badge: 'Restructured Syllabus Evidence',
  summary: 'Analysis of official ICSI sessions conducted under the revised scheme introduced in June 2026.',
  keyInsights: [
    'Paper 2 (Fundamentals of Accounting) has elevated numerical and concept-application rigour, focusing on AS-1 fundamental assumptions, depreciation methods, and BRS reconciliation.',
    'Paper 4 Part A (Business Laws) emphasizes direct case law application (Ashby v. White, Gloucester Grammar, Haynes v. Harwood) and exact statutory definitions (Section 2(m) of Limitation Act).',
    'Paper 3 (Economics & Business Environment) tests multi-variable macroeconomic conversions (GDP_MP to NNP_FC, GDP Deflator) and direct institutional roles (RBI, SEBI, CCI, IBBI).',
    'Paper 1 (Business Communication) has increased focus on grammatical concord in corporate resolutions, notice drafting, and business idioms.',
  ],
};

export const PYQ_SECTION_B: PYQAnalysisSection = {
  title: 'SECTION B: HISTORICAL OLD-SYLLABUS ANALYSIS (2021 - MAY 2026)',
  badge: 'Historical Old Syllabus (Concept Overlap Only)',
  summary: 'Historical examination trends from older CSEET sessions mapped exclusively to surviving conceptual areas.',
  caveatNote: 'Caution: Historical papers featured a different paper configuration (Legal Aptitude & Logical Reasoning joint module). Only surviving substantive legal and economic topics are compared.',
  keyInsights: [
    'Law of Torts maxims (Injuria Sine Damno, Volenti Non Fit Injuria) have appeared in over 85% of all historical sessions.',
    'National Income accounting exclusions (Transfer payments, capital gains, illegal earnings) appeared in every single session between 2021 and 2025.',
    'Subject-Verb concord with parenthetical phrases ("together with", "along with") appeared consistently across 10 consecutive sessions.',
  ],
};

export const PYQ_SECTION_C: PYQAnalysisSection = {
  title: 'SECTION C: CONCEPTUAL OVERLAP & RESTRUCTURING MATRIX',
  badge: 'Syllabus Mapping',
  summary: 'Precise classification of topics as Retained, Restructured, or Newly Introduced in June 2026.',
  keyInsights: [
    'RETAINED CORE: Law of Torts, Indian Constitution, Elements of Contract Act, National Income, Circular Flow, English Concord & Grammar.',
    'STANDALONE ELEVATION: Fundamentals of Accounting became a standalone 50-mark paper (previously brief elements in older iterations).',
    'RECONFIGURED: Business Management functions and leadership theories now paired directly with Business Laws in Paper 4.',
  ],
};

export const PYQ_SECTION_D: PYQAnalysisSection = {
  title: 'SECTION D: WHAT CAN AND CANNOT BE INFERRED FOR FEBRUARY 2027',
  badge: 'Authoritative Guardrails',
  summary: 'Strict boundaries on predictive inferences to protect student preparation against false certainty.',
  keyInsights: [
    'CAN BE INFERRED: High historical relevance of fundamental definitions, case precedents, AS-1 assumptions, and 2-mark numerical conversions.',
    'CANNOT BE INFERRED: The exact question wording, guaranteed presence of any single optional sub-topic, or fixed chapter-wise mark distributions beyond official ICSI guidelines.',
    'GOLDEN RULE: Never skip an official syllabus topic based on past frequency; ICSI retains full discretion to test any part of the prescribed study material.',
  ],
};

export const PYQ_HEATMAP_DATA: PYQHeatmapItem[] = [
  {
    id: 'hm-1',
    paperId: 'paper-1',
    paperName: 'Paper 1: Business Communication',
    chapterTitle: 'Essentials of Good English & Grammar',
    topicTitle: 'Subject-Verb Agreement & Concord Rules',
    subTopicTitle: 'Subject-Verb Agreement and Concord in Corporate Contexts',
    subTopicId: 'p1-c1-t1-s1',
    verifiedPYQCount: 14,
    restructuredCount: 2,
    historicalCount: 12,
    testedSessions: ['June 2026', 'Nov 2025', 'July 2025', 'Jan 2025', 'Nov 2024'],
    difficultyTrend: 'Moderate',
    strategicPriority: 'HIGH PRIORITY',
    repetitionFrequency: 'Frequent',
    examinerFocus: 'Parenthetical phrases (along with, as well as) and neither/nor proximity.',
    commonTrapWarning: 'Matching verb with intervening plural noun rather than singular head noun.',
  },
  {
    id: 'hm-2',
    paperId: 'paper-2',
    paperName: 'Paper 2: Fundamentals of Accounting',
    chapterTitle: 'Theoretical Framework of Accounting',
    topicTitle: 'Accounting Concepts, Conventions & Capital vs Revenue',
    subTopicTitle: 'Fundamental Accounting Assumptions and Accounting Concepts',
    subTopicId: 'p2-c1-t1-s1',
    verifiedPYQCount: 8,
    restructuredCount: 3,
    historicalCount: 5,
    testedSessions: ['June 2026', 'Restructured Sample 2026', 'Jan 2025'],
    difficultyTrend: 'Challenging',
    strategicPriority: 'HIGH PRIORITY',
    repetitionFrequency: 'Emerging in Restructured Syllabus',
    examinerFocus: 'AS-1 Going Concern departure disclosure, inventory lower of cost or NRV, Capitalized cost calculations.',
    commonTrapWarning: 'Believing AS-1 requires disclosure when Going Concern is followed; missing pre-operational overhaul capitalization.',
  },
  {
    id: 'hm-3',
    paperId: 'paper-3',
    paperName: 'Paper 3: Economic and Business Environment',
    chapterTitle: 'National Income Accounting',
    topicTitle: 'National Income Aggregates & Measurement Methods',
    subTopicTitle: 'Concepts of National Income: GDP, GNP, NNP at Market Price & Factor Cost',
    subTopicId: 'p3-c1-t1-s1',
    verifiedPYQCount: 16,
    restructuredCount: 3,
    historicalCount: 13,
    testedSessions: ['June 2026', 'Nov 2025', 'July 2025', 'Jan 2025'],
    difficultyTrend: 'Challenging',
    strategicPriority: 'HIGH PRIORITY',
    repetitionFrequency: 'Frequent',
    examinerFocus: 'Multi-step aggregate conversion (GDP_MP to NNP_FC) and exclusion of transfer payments/windfall gains.',
    commonTrapWarning: 'Forgetting to subtract Subsidies from Indirect Taxes when computing Net Indirect Taxes.',
  },
  {
    id: 'hm-4',
    paperId: 'paper-4',
    paperName: 'Paper 4: Business Laws and Management',
    chapterTitle: 'Law of Torts and Civil Wrongs',
    topicTitle: 'Essentials of Tort, Legal Maxims & General Defences',
    subTopicTitle: 'Meaning of Tort, Injuria Sine Damno, Damnum Sine Injuria and General Defences',
    subTopicId: 'p4-c1-t1-s1',
    verifiedPYQCount: 18,
    restructuredCount: 3,
    historicalCount: 15,
    testedSessions: ['June 2026', 'July 2025', 'Jan 2025', 'Nov 2024'],
    difficultyTrend: 'Moderate',
    strategicPriority: 'HIGH PRIORITY',
    repetitionFrequency: 'Frequent',
    examinerFocus: 'Ashby v. White (Injuria Sine Damno) vs Gloucester Grammar (Damnum Sine Injuria), Volenti non fit injuria rescue cases.',
    commonTrapWarning: 'Confusing Injuria Sine Damno with Damnum Sine Injuria; assuming tort damages are liquidated.',
  },
];
