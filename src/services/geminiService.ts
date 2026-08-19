import { DailyStudyPlan, ErrorLogEntry, SubTopic } from '../types';
import { getDaysRemainingToExam, getStoredProgress, getErrorLog } from './storageService';
import { getAllSubTopics } from '../data/icsiSyllabusData';

export interface AiTutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sourceCitations?: string[];
  suggestedAction?: {
    type: 'NAVIGATE_SUBTOPIC' | 'START_TEST' | 'VIEW_PYQ' | 'OPEN_MOCK' | 'VIEW_ERRORS';
    targetId?: string;
    label: string;
  };
}

export interface ParsedCommandResult {
  isCommand: boolean;
  commandType?: 'TEACH' | 'DAY_PLAN' | 'PYQ' | 'MOCK' | 'DIAGNOSTIC' | 'ERROR_LOG' | 'GENERAL_QUERY';
  targetSubTopicId?: string;
  dayNumber?: number;
  mockMode?: string;
  feedbackMessage?: string;
}

export const parseQuickCommand = (input: string): ParsedCommandResult => {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Pattern: "DAY 1", "Day 2", "day 45"
  const dayMatch = lower.match(/^day\s+(\d+)$/i);
  if (dayMatch) {
    return {
      isCommand: true,
      commandType: 'DAY_PLAN',
      dayNumber: parseInt(dayMatch[1], 10),
      feedbackMessage: `Generating personalized adaptive study plan for Day ${dayMatch[1]}...`,
    };
  }

  // Pattern: "Teach me [sub-topic]"
  if (lower.startsWith('teach me') || lower.startsWith('teach')) {
    const query = lower.replace(/^teach\s+me\s+/i, '').replace(/^teach\s+/i, '').trim();
    const all = getAllSubTopics();
    const match = all.find(st => 
      st.officialTitle.toLowerCase().includes(query) ||
      st.studentFriendlyTitle.toLowerCase().includes(query) ||
      st.whatItMeans.toLowerCase().includes(query) ||
      query.includes(st.studentFriendlyTitle.toLowerCase())
    );
    if (match) {
      return {
        isCommand: true,
        commandType: 'TEACH',
        targetSubTopicId: match.id,
        feedbackMessage: `Opening authoritative teaching module for: ${match.studentFriendlyTitle}`,
      };
    }
  }

  // Pattern: "PYQ" or "PYQ [topic]"
  if (lower === 'pyq' || lower.startsWith('pyq ')) {
    return {
      isCommand: true,
      commandType: 'PYQ',
      feedbackMessage: 'Opening PYQ Intelligence & Transition Analysis module...',
    };
  }

  // Pattern: "MOCK" or "MOCK [mode]"
  if (lower === 'mock' || lower.startsWith('mock ')) {
    return {
      isCommand: true,
      commandType: 'MOCK',
      feedbackMessage: 'Opening ICSI Computer-Based Mock Examination Simulator...',
    };
  }

  // Pattern: "Diagnostic"
  if (lower.includes('diagnostic')) {
    return {
      isCommand: true,
      commandType: 'DIAGNOSTIC',
      feedbackMessage: 'Configuring full-diagnostic evaluation test...',
    };
  }

  // Pattern: "Error log" or "Mistakes"
  if (lower.includes('error') || lower.includes('mistake')) {
    return {
      isCommand: true,
      commandType: 'ERROR_LOG',
      feedbackMessage: 'Opening Error Log and Retest Center...',
    };
  }

  return {
    isCommand: false,
    commandType: 'GENERAL_QUERY',
  };
};

export const generateAdaptiveDailyPlan = (dayNumber: number): DailyStudyPlan => {
  const daysRemaining = getDaysRemainingToExam();
  const allSubTopics = getAllSubTopics();
  const progressMap = getStoredProgress();
  const errorLog = getErrorLog();

  const weakSubTopics = allSubTopics.filter(st => {
    const p = progressMap[st.id];
    const errors = errorLog.filter(e => e.subTopicId === st.id && !e.resolved);
    return (p && (p.status === 'WEAK' || p.accuracyPercentage < 65)) || errors.length > 0;
  });

  const unstudiedSubTopics = allSubTopics.filter(st => {
    const p = progressMap[st.id];
    return !p || p.status === 'NOT STARTED';
  });

  const focusAreas: DailyStudyPlan['focusAreas'] = [];

  // Slot 1: Priority Weak Area Revision if available
  if (weakSubTopics.length > 0) {
    const weakTopic = weakSubTopics[0];
    focusAreas.push({
      subTopicId: weakTopic.id,
      subTopicTitle: weakTopic.studentFriendlyTitle,
      paperName: weakTopic.learningPosition.split('->')[0].trim(),
      reasonForInclusion: 'Weak Area Revision',
      recommendedTimeMinutes: 45,
      actionItems: [
        'Review core teaching principles and common exam traps.',
        'Retake incorrect questions from Error Log.',
        'Complete 10 focused mastery questions.',
      ],
      isCompleted: false,
    });
  }

  // Slot 2: Main Curriculum Progression
  const nextSubTopic = unstudiedSubTopics.length > 0 ? unstudiedSubTopics[0] : allSubTopics[0];
  focusAreas.push({
    subTopicId: nextSubTopic.id,
    subTopicTitle: nextSubTopic.studentFriendlyTitle,
    paperName: nextSubTopic.learningPosition.split('->')[0].trim(),
    reasonForInclusion: 'Scheduled Curriculum Progression',
    recommendedTimeMinutes: 60,
    actionItems: [
      `Study comprehensive sub-topic explanation and legal/accounting foundations.`,
      `Review key terminology and practical worked scenarios.`,
      `Attempt the complete 20-Question Depth Test.`,
    ],
    isCompleted: false,
  });

  // Slot 3: High Priority PYQ Consolidation
  const pyqTopic = allSubTopics.find(st => st.examRelevance.strategicPriority === 'HIGH PRIORITY' && st.id !== nextSubTopic.id) || allSubTopics[1] || allSubTopics[0];
  focusAreas.push({
    subTopicId: pyqTopic.id,
    subTopicTitle: pyqTopic.studentFriendlyTitle,
    paperName: pyqTopic.learningPosition.split('->')[0].trim(),
    reasonForInclusion: 'High-Priority PYQ Consolidation',
    recommendedTimeMinutes: 40,
    actionItems: [
      `Solve all verified Restructured and Historical PYQs.`,
      `Examine the ICSI guideline answer analysis and trap warnings.`,
    ],
    isCompleted: false,
  });

  const plan: DailyStudyPlan = {
    dayNumber,
    targetDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    daysRemainingToExam: daysRemaining,
    theme: `Day ${dayNumber} Focus: ${nextSubTopic.studentFriendlyTitle} & Targeted Consolidation`,
    focusAreas,
    dailyTargetQuestions: 30,
    dailyRevisionItemIds: focusAreas.map(f => f.subTopicId),
    status: 'IN_PROGRESS',
  };

  return plan;
};

// Fallback & client-side tutor responses with strict ICSI authority
export const queryAiTutorOfflineFallback = (query: string, activeSubTopic?: SubTopic): string => {
  const q = query.toLowerCase();

  if (q.includes('going concern') || q.includes('as-1') || q.includes('fundamental assumption')) {
    return `### ICSI Accounting Postulate: AS-1 Fundamental Accounting Assumptions
1. **The 3 Assumptions (AS-1):** Going Concern, Consistency, and Accrual.
2. **Crucial Disclosure Rule:** If these 3 assumptions are **followed**, NO specific disclosure is required in financial statements. If ANY of them is **departed from / not followed**, that fact and its financial effect must be specifically and prominently disclosed.
3. **Going Concern Meaning:** The business will continue in operational existence for the foreseeable future, justifying valuation of fixed assets at historical cost less depreciation (not liquidation value).
*Source: ICSI Restructured CSEET Study Material - Fundamentals of Accounting, Chapter 1.*`;
  }

  if (q.includes('tort') || q.includes('injuria') || q.includes('damnum') || q.includes('ashby')) {
    return `### ICSI Law of Torts: Fundamental Principles & Maxims
1. **Definition of Tort (Section 2(m), Limitation Act 1963):** A civil wrong which is not exclusively a breach of contract or breach of trust.
2. **Injuria Sine Damno (Actionable per se):** Violation of an absolute legal right without actual financial loss. *Landmark Authority: Ashby v. White (1703), Bhim Singh v. State of J&K (1986).*
3. **Damnum Sine Injuria (Not Actionable):** Actual damage/financial loss suffered without infringement of a legal right. *Landmark Authority: Gloucester Grammar School Case (1410).*
4. **Remedy:** Common law action for **Unliquidated Damages** (assessed post-facto by court).
*Source: ICSI CSEET Study Material - Business Laws and Management, Part A, Chapter 1.*`;
  }

  if (q.includes('national income') || q.includes('gdp') || q.includes('nnp')) {
    return `### ICSI Economics: National Income Aggregates
1. **Statutory Definition:** National Income is strictly **NNP at Factor Cost (NNP_FC)**.
2. **Master Conversion Formulas:**
   - $\\text{Net} = \\text{Gross} - \\text{Depreciation}$
   - $\\text{National} = \\text{Domestic} + \\text{NFIA}$
   - $\\text{Factor Cost} = \\text{Market Price} - \\text{Net Indirect Taxes (NIT)}$
   - $\\text{NIT} = \\text{Indirect Taxes} - \\text{Subsidies}$
3. **Exclusions:** Transfer payments (pensions, scholarships), windfall gains (lottery), capital gains on second-hand sales.
*Source: ICSI CSEET Study Material - Economic and Business Environment, Part A, Chapter 1.*`;
  }

  if (q.includes('subject verb') || q.includes('concord') || q.includes('neither nor')) {
    return `### ICSI Business Communication: Subject-Verb Agreement Rules
1. **Parenthetical Phrases:** Phrases introduced by *"along with", "together with", "as well as", "in addition to"* do NOT change the singular number of the head subject. (e.g., *"The Director, along with three managers, has arrived."*)
2. **Rule of Proximity:** With *"either...or"* and *"neither...nor"*, the verb agrees strictly with the nearer subject.
3. **Quantifiers:** *"A number of"* takes a PLURAL verb; *"The number of"* takes a SINGULAR verb.
*Source: ICSI CSEET Study Material - Business Communication, Chapter 1.*`;
  }

  if (activeSubTopic) {
    return `### Official Guidance on ${activeSubTopic.studentFriendlyTitle}
**ICSI Syllabus Position:** ${activeSubTopic.learningPosition}
**Official Source:** ${activeSubTopic.officialSource.documentName} (${activeSubTopic.officialSource.sectionOrPage || 'Prescribed Module'})

**Core Summary:**
${activeSubTopic.whatItMeans}

**Key Exam Trap to Avoid:**
${activeSubTopic.teachingContent.examTrapsAndPitfalls[0] || 'Ensure precise application of statutory definitions.'}

*To take the 20-question mastery test, select "Start 20-Q Depth Test" below.*`;
  }

  return `### ICSI CSEET February 2027 Learning Assistant
I am strictly locked to the **Restructured CSEET Syllabus (Applicable from June 2026 onwards)** conducted by **ICSI**.

**How I can assist you:**
- Type \`Teach me [topic]\` to open any sub-topic learning module.
- Type \`DAY [number]\` (e.g. \`DAY 1\`, \`DAY 5\`) to generate your daily adaptive study schedule.
- Type \`PYQ\` to inspect the Restructured vs Historical transition intelligence.
- Type \`MOCK\` to launch the 200-mark Computer-Based Exam simulation.
- Ask any doubt regarding Accounting Journal Entries/BRS/Depreciation, Law of Torts/Contract/Company Law, Macroeconomics, or Business English Concord.`;
};

// Calls the backend server API proxy or falls back gracefully
export const askAiTutor = async (
  query: string,
  chatHistory: AiTutorMessage[],
  activeSubTopic?: SubTopic
): Promise<{ text: string; sourceCitations: string[] }> => {
  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        history: chatHistory.slice(-6),
        activeSubTopicId: activeSubTopic?.id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.reply,
        sourceCitations: data.sources || ['Official ICSI CSEET Restructured Scheme (June 2026+)'],
      };
    }
  } catch (e) {
    console.warn('Backend API request failed, utilizing high-precision ICSI fallback engine.', e);
  }

  // Graceful authoritative fallback
  const fallbackText = queryAiTutorOfflineFallback(query, activeSubTopic);
  return {
    text: fallbackText,
    sourceCitations: [
      activeSubTopic?.officialSource.documentName || 'ICSI Restructured CSEET Study Material (June 2026+)',
      'ICSI Examination Scheme for February 2027',
    ],
  };
};
