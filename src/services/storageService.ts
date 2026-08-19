import { 
  SubTopicProgress, 
  ErrorLogEntry, 
  MockExamResult, 
  DailyStudyPlan, 
  MasteryStatus, 
  DifficultyLevel 
} from '../types';
import { getAllSubTopics } from '../data/icsiSyllabusData';

const STORAGE_KEYS = {
  SUBTOPIC_PROGRESS: 'icsi_cseet_subtopic_progress_v1',
  ERROR_LOG: 'icsi_cseet_error_log_v1',
  MOCK_RESULTS: 'icsi_cseet_mock_results_v1',
  DAILY_PLANS: 'icsi_cseet_daily_plans_v1',
  USER_PREFERENCES: 'icsi_cseet_user_prefs_v1',
};

// Calculate dynamic days remaining from current local time to February 2027 CSEET
export const getDaysRemainingToExam = (): number => {
  const examDate = new Date('2027-02-06T09:00:00'); // Early February 2027 ICSI session
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 1);
};

export const getStoredProgress = (): Record<string, SubTopicProgress> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBTOPIC_PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load subtopic progress', e);
    return {};
  }
};

export const getProgressMap = getStoredProgress;

export const saveSubTopicProgress = (progressMap: Record<string, SubTopicProgress>) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBTOPIC_PROGRESS, JSON.stringify(progressMap));
  } catch (e) {
    console.error('Failed to save subtopic progress', e);
  }
};

export const calculateMasteryStatus = (
  attempted: number, 
  correct: number, 
  accuracy: number,
  highestDiff: DifficultyLevel
): MasteryStatus => {
  if (attempted === 0) return 'NOT STARTED';
  if (attempted < 5) return 'LEARNING';
  if (attempted < 15) {
    return accuracy >= 70 ? 'PRACTICING' : 'WEAK';
  }
  // For 15+ questions attempted:
  if (accuracy >= 95 && (highestDiff === 'Challenging' || highestDiff === 'Expert')) {
    return 'MASTERED';
  }
  if (accuracy >= 80) return 'STRONG';
  if (accuracy >= 60) return 'DEVELOPING';
  return 'WEAK';
};

export const recordQuestionAttempt = (
  subTopicId: string, 
  isCorrect: boolean, 
  difficulty: DifficultyLevel
): SubTopicProgress => {
  const currentMap = getStoredProgress();
  const existing: SubTopicProgress = currentMap[subTopicId] || {
    subTopicId,
    status: 'NOT STARTED',
    questionsAttempted: 0,
    correctAnswers: 0,
    accuracyPercentage: 0,
    highestDifficultyHandled: 'Easy',
    consecutiveSuccessCount: 0,
    repeatedMistakesCount: 0,
  };

  const newAttempted = existing.questionsAttempted + 1;
  const newCorrect = existing.correctAnswers + (isCorrect ? 1 : 0);
  const newAccuracy = Math.round((newCorrect / newAttempted) * 100);
  const consecutive = isCorrect ? existing.consecutiveSuccessCount + 1 : 0;
  const mistakes = !isCorrect ? existing.repeatedMistakesCount + 1 : existing.repeatedMistakesCount;

  // Determine highest difficulty handled successfully
  let highestDiff = existing.highestDifficultyHandled;
  const diffOrder: DifficultyLevel[] = ['Easy', 'Moderate', 'Challenging', 'Expert'];
  if (isCorrect && diffOrder.indexOf(difficulty) > diffOrder.indexOf(highestDiff)) {
    highestDiff = difficulty;
  }

  const newStatus = calculateMasteryStatus(newAttempted, newCorrect, newAccuracy, highestDiff);

  const updated: SubTopicProgress = {
    ...existing,
    questionsAttempted: newAttempted,
    correctAnswers: newCorrect,
    accuracyPercentage: newAccuracy,
    highestDifficultyHandled: highestDiff,
    status: newStatus,
    lastTestedDate: new Date().toISOString(),
    consecutiveSuccessCount: consecutive,
    repeatedMistakesCount: mistakes,
  };

  currentMap[subTopicId] = updated;
  saveSubTopicProgress(currentMap);
  return updated;
};

// Error Log Storage
export const getErrorLog = (): ErrorLogEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ERROR_LOG);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load error log', e);
    return [];
  }
};

export const addErrorLogEntry = (entry: Omit<ErrorLogEntry, 'id' | 'timestamp' | 'resolved' | 'retestSuccessCount'>) => {
  const current = getErrorLog();
  const newEntry: ErrorLogEntry = {
    ...entry,
    id: `err-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    resolved: false,
    retestSuccessCount: 0,
  };
  const updated = [newEntry, ...current];
  localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(updated));
  return newEntry;
};

export const markErrorResolved = (errorId: string) => {
  const current = getErrorLog();
  const updated = current.map(item => {
    if (item.id === errorId) {
      return {
        ...item,
        resolved: true,
        retestSuccessCount: item.retestSuccessCount + 1,
      };
    }
    return item;
  });
  localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(updated));
};

// Mock Results Storage
export const getMockResults = (): MockExamResult[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOCK_RESULTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mock results', e);
    return [];
  }
};

export const saveMockResult = (result: MockExamResult) => {
  const current = getMockResults();
  const updated = [result, ...current];
  localStorage.setItem(STORAGE_KEYS.MOCK_RESULTS, JSON.stringify(updated));
};

// Daily Plans Storage
export const getDailyPlans = (): Record<number, DailyStudyPlan> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_PLANS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load daily plans', e);
    return {};
  }
};

export const saveDailyPlan = (plan: DailyStudyPlan) => {
  const current = getDailyPlans();
  current[plan.dayNumber] = plan;
  localStorage.setItem(STORAGE_KEYS.DAILY_PLANS, JSON.stringify(current));
};

// Compute Overall Readiness Metrics
export interface ReadinessMetrics {
  totalSubTopics: number;
  masteredSubTopics: number;
  strongSubTopics: number;
  developingSubTopics: number;
  weakSubTopics: number;
  notStartedSubTopics: number;
  overallAccuracy: number;
  totalQuestionsAttempted: number;
  readinessPercentage: number;
  paperWiseReadiness: {
    paperId: string;
    paperTitle: string;
    totalSubTopics: number;
    masteredCount: number;
    averageAccuracy: number;
    readinessScore: number;
  }[];
  weakestSubTopics: {
    subTopicId: string;
    subTopicTitle: string;
    paperName: string;
    accuracy: number;
    mistakeCount: number;
  }[];
}

export const getReadinessMetrics = (): ReadinessMetrics => {
  const allSubTopics = getAllSubTopics();
  const progressMap = getStoredProgress();
  const errorLog = getErrorLog();

  let mastered = 0;
  let strong = 0;
  let developing = 0;
  let weak = 0;
  let notStarted = 0;
  let totalAttempted = 0;
  let totalCorrect = 0;

  allSubTopics.forEach(st => {
    const p = progressMap[st.id];
    if (!p || p.status === 'NOT STARTED') {
      notStarted++;
    } else if (p.status === 'MASTERED') {
      mastered++;
      totalAttempted += p.questionsAttempted;
      totalCorrect += p.correctAnswers;
    } else if (p.status === 'STRONG') {
      strong++;
      totalAttempted += p.questionsAttempted;
      totalCorrect += p.correctAnswers;
    } else if (p.status === 'DEVELOPING') {
      developing++;
      totalAttempted += p.questionsAttempted;
      totalCorrect += p.correctAnswers;
    } else {
      weak++;
      totalAttempted += p.questionsAttempted;
      totalCorrect += p.correctAnswers;
    }
  });

  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  
  // Weighted Readiness Score
  const totalSubTopics = allSubTopics.length || 1;
  const weightedScore = Math.min(
    100,
    Math.round(
      ((mastered * 1.0 + strong * 0.75 + developing * 0.45 + weak * 0.15) / totalSubTopics) * 100
    )
  );

  const paperWiseReadiness = ['paper-1', 'paper-2', 'paper-3', 'paper-4'].map(pId => {
    const paperSubTopics = allSubTopics.filter(st => st.paperId === pId);
    let pMastered = 0;
    let pAttempted = 0;
    let pCorrect = 0;

    paperSubTopics.forEach(st => {
      const p = progressMap[st.id];
      if (p) {
        if (p.status === 'MASTERED') pMastered++;
        pAttempted += p.questionsAttempted;
        pCorrect += p.correctAnswers;
      }
    });

    const pAccuracy = pAttempted > 0 ? Math.round((pCorrect / pAttempted) * 100) : 0;
    const pScore = paperSubTopics.length > 0 
      ? Math.round((pMastered / paperSubTopics.length) * 50 + (pAccuracy * 0.5))
      : 0;

    const paperNames: Record<string, string> = {
      'paper-1': 'Paper 1: Business Communication',
      'paper-2': 'Paper 2: Fundamentals of Accounting',
      'paper-3': 'Paper 3: Economic & Business Env.',
      'paper-4': 'Paper 4: Business Laws & Management',
    };

    return {
      paperId: pId,
      paperTitle: paperNames[pId] || pId,
      totalSubTopics: paperSubTopics.length,
      masteredCount: pMastered,
      averageAccuracy: pAccuracy,
      readinessScore: Math.min(100, pScore),
    };
  });

  // Identify Weak Sub-topics (from Progress + Unresolved Errors)
  const weakList: {
    subTopicId: string;
    subTopicTitle: string;
    paperName: string;
    accuracy: number;
    mistakeCount: number;
  }[] = [];

  allSubTopics.forEach(st => {
    const p = progressMap[st.id];
    const subTopicErrors = errorLog.filter(e => e.subTopicId === st.id && !e.resolved);
    if ((p && (p.status === 'WEAK' || p.accuracyPercentage < 65)) || subTopicErrors.length > 0) {
      weakList.push({
        subTopicId: st.id,
        subTopicTitle: st.studentFriendlyTitle,
        paperName: st.learningPosition.split('->')[0].trim(),
        accuracy: p ? p.accuracyPercentage : 0,
        mistakeCount: subTopicErrors.length,
      });
    }
  });

  return {
    totalSubTopics,
    masteredSubTopics: mastered,
    strongSubTopics: strong,
    developingSubTopics: developing,
    weakSubTopics: weak,
    notStartedSubTopics: notStarted,
    overallAccuracy,
    totalQuestionsAttempted: totalAttempted,
    readinessPercentage: weightedScore,
    paperWiseReadiness,
    weakestSubTopics: weakList.sort((a, b) => b.mistakeCount - a.mistakeCount),
  };
};
