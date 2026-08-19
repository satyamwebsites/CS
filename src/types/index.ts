export type SyllabusClassification = 
  | 'OFFICIAL SYLLABUS SUB-TOPIC'
  | 'SUPPORTING CONCEPT'
  | 'EXTENSION/EXTRA KNOWLEDGE';

export type SyllabusVersion = 'RESTRUCTURED SYLLABUS' | 'OLD SYLLABUS';

export type QuestionStatus = 
  | 'OFFICIAL PYQ'
  | 'OFFICIAL SAMPLE QUESTION'
  | 'OFFICIAL MOCK QUESTION'
  | 'GENERATED PRACTICE QUESTION'
  | 'GENERATED PYQ-STYLE QUESTION';

export type QuestionType =
  | 'Basic recall'
  | 'Concept understanding'
  | 'Identification'
  | 'Application'
  | 'Distinction'
  | 'Comparison'
  | 'Scenario'
  | 'Calculation'
  | 'Interpretation'
  | 'Statement-based reasoning'
  | 'Exam-style question'
  | 'Common-trap question'
  | 'Moderate difficulty'
  | 'Higher difficulty'
  | 'Multi-concept application'
  | 'Error identification'
  | 'Practical/business context'
  | 'PYQ-style question'
  | 'Challenging question'
  | 'Mastery question';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging' | 'Expert';

export type MasteryStatus = 
  | 'NOT STARTED'
  | 'LEARNING'
  | 'PRACTICING'
  | 'WEAK'
  | 'DEVELOPING'
  | 'STRONG'
  | 'MASTERED';

export type StrategicPriority = 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOWER PRIORITY';

export interface SourceReference {
  documentName: string;
  modulePart?: string;
  chapterNumber?: number | string;
  sectionOrPage?: string;
  sourceType: 'Official ICSI' | 'Government of India' | 'Primary Regulatory Source' | 'Authoritative Law';
  verificationDate: string;
  currentStatusConfirmation: string;
  officialUrl?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  subTopicId: string;
  topicId: string;
  chapterId: string;
  paperId: string;
  paperName: string;
  chapterName: string;
  subTopicName: string;
  questionNumberInSet?: number;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  skillTested: string;
  status: QuestionStatus;
  syllabusVersion: SyllabusVersion;
  marks: number;
  questionText: string;
  contextScenario?: string;
  options: QuestionOption[];
  correctOptionId: string;
  generalExplanation: string;
  conceptTested: string;
  accountingWorking?: {
    formula: string;
    steps: string[];
    commonCalculationTrap: string;
    correctMethod: string;
  };
  legalPrincipleOrCaseLaw?: {
    statute: string;
    sectionOrRule?: string;
    legalMaxim?: string;
    applicationRule: string;
  };
  examTrapNote?: string;
  sourceReference: SourceReference;
}

export interface PYQRecord {
  id: string;
  session: string; // e.g. "June 2026", "November 2025", "January 2025"
  year: number;
  paperId: string;
  paperName: string;
  questionNumberVerifiable?: string;
  topicId: string;
  subTopicId: string;
  subTopicName: string;
  questionType: string;
  marks: number;
  syllabusVersion: SyllabusVersion;
  isMultiTopic?: boolean;
  relatedSubTopicIds?: string[];
  questionText: string;
  options?: QuestionOption[];
  correctOptionId?: string;
  guidelineAnswerAnalysis: string;
  conceptTested: string;
  cognitiveDepthRequired: string;
  source: string;
}

export interface DetailedTeachingContent {
  definitionAndConcept: string;
  statutoryOrRegulatoryBasis?: string;
  purposeAndObjective: string;
  corePrinciples: string[];
  componentsOrElements: { title: string; description: string }[];
  realWorldExamples: { scenario: string; analysis: string; outcome: string }[];
  distinctionsAndComparisons?: {
    basis: string;
    itemA: { name: string; detail: string };
    itemB: { name: string; detail: string };
  }[];
  applicationsAndScenarios: string[];
  importantExceptions?: string[];
  examTrapsAndPitfalls: string[];
  relationshipWithOtherTopics: string[];
  accountingWorkingsExample?: {
    problemStatement: string;
    journalEntriesOrCalculations: string[];
    ledgerOrFinalImpact: string;
  };
}

export interface SubTopic {
  id: string;
  paperId: string;
  partId?: string;
  chapterId: string;
  topicId: string;
  officialTitle: string;
  studentFriendlyTitle: string;
  classification: SyllabusClassification;
  officialSource: SourceReference;
  learningPosition: string; // e.g. "Paper 2: Fundamentals of Accounting -> Chapter 2 -> Topic 2.1"
  whatItMeans: string;
  whatMustBeLearned: string[];
  teachingContent: DetailedTeachingContent;
  importantTerminology: { term: string; definition: string; examContext: string }[];
  pyqHistory: PYQRecord[];
  depthTestQuestions: Question[]; // 20 questions
  examRelevance: {
    historicalFrequency: 'High' | 'Medium' | 'Low' | 'New in Restructured Syllabus';
    strategicPriority: StrategicPriority;
    recencyTrend: string;
    typicalQuestionStyle: string;
    preparationAdvice: string;
  };
}

export interface Topic {
  id: string;
  paperId: string;
  chapterId: string;
  title: string;
  officialTitle: string;
  description: string;
  subTopics: SubTopic[];
}

export interface Chapter {
  id: string;
  paperId: string;
  partId?: string;
  partName?: string;
  chapterNumber: number;
  title: string;
  officialTitle: string;
  weightageEstimatedMarks: number;
  officialSource: SourceReference;
  topics: Topic[];
}

export interface Paper {
  id: string;
  paperNumber: number;
  title: string;
  officialTitle: string;
  totalMarks: number;
  durationMinutes: number;
  structureDescription: string;
  officialSource: SourceReference;
  parts?: {
    id: string;
    name: string;
    marks: number;
    description: string;
  }[];
  chapters: Chapter[];
}

export interface SubTopicProgress {
  subTopicId: string;
  status: MasteryStatus;
  questionsAttempted: number;
  correctAnswers: number;
  accuracyPercentage: number;
  highestDifficultyHandled: DifficultyLevel;
  lastStudiedDate?: string;
  lastTestedDate?: string;
  revisionDueDate?: string;
  consecutiveSuccessCount: number;
  repeatedMistakesCount: number;
  notes?: string;
}

export interface ErrorLogEntry {
  id: string;
  questionId: string;
  subTopicId: string;
  subTopicName: string;
  paperId: string;
  paperName: string;
  questionText: string;
  studentAnswerId: string;
  studentAnswerText: string;
  correctAnswerId: string;
  correctAnswerText: string;
  errorCategory: 'Calculation Error' | 'Conceptual Trap' | 'Overlooked Exception' | 'Misread Question' | 'Terminology Confusion';
  whyStudentMadeMistake: string;
  correctConcept: string;
  correctMethodOrRule: string;
  timestamp: string;
  resolved: boolean;
  retestSuccessCount: number;
}

export interface DailyStudyPlan {
  dayNumber: number;
  targetDate: string;
  daysRemainingToExam: number;
  theme: string;
  focusAreas: {
    subTopicId: string;
    subTopicTitle: string;
    paperName: string;
    reasonForInclusion: 'Weak Area Revision' | 'Scheduled Curriculum Progression' | 'High-Priority PYQ Consolidation' | 'Spaced Repetition';
    recommendedTimeMinutes: number;
    actionItems: string[];
    isCompleted: boolean;
  }[];
  dailyTargetQuestions: number;
  dailyRevisionItemIds: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface MockExamConfig {
  id: string;
  title: string;
  mode: 'FULL_EXAM' | 'PAPER_WISE' | 'CHAPTER_WISE' | 'TOPIC_WISE' | 'WEAK_AREA' | 'PYQ_BASED';
  paperId?: string;
  chapterId?: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  isOfficialSample: boolean;
  syllabusVersion: SyllabusVersion;
}

export type PYQQuestion = PYQRecord;

export interface MockExamPaperScore {
  paperId: string;
  paperName: string;
  marksObtained: number;
  maxMarks: number;
  isQualified: boolean;
}

export interface MockExamResult {
  id: string;
  configId?: string;
  examTitle?: string;
  mode: string;
  examDate: string;
  dateAttempted?: string;
  timeSpentSeconds?: number;
  timeTakenSeconds: number;
  totalQuestions?: number;
  totalQuestionsAttempted: number;
  attemptedQuestions?: number;
  correctQuestionsCount: number;
  correctQuestions?: number;
  totalMarksObtained: number;
  totalScore?: number;
  maximumMarks: number;
  maxScore?: number;
  percentageScore: number;
  percentage?: number;
  paperScores: MockExamPaperScore[];
  paperWiseScores?: {
    paperId: string;
    paperName: string;
    score: number;
    maxScore: number;
    percentage: number;
    passedSectional: boolean;
  }[];
  isOverallQualified: boolean;
  passedOverall?: boolean;
  weakestSubTopics?: { subTopicId: string; subTopicName: string; accuracy: number }[];
  questionResponses?: {
    questionId: string;
    selectedOptionId: string | null;
    isCorrect: boolean;
    timeSpentSeconds: number;
    markedForReview: boolean;
  }[];
}
