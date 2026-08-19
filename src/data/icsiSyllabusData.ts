import { Paper, SourceReference } from '../types';
import { paper1Data } from './papers/paper1';
import { paper2Data } from './papers/paper2';
import { paper3Data } from './papers/paper3';
import { paper4Data } from './papers/paper4';

export const ICSI_EXAM_META = {
  examName: 'Company Secretary Executive Entrance Test (CSEET)',
  targetSession: 'February 2027',
  applicableSyllabus: 'Restructured CSEET Syllabus (Applicable from June 2026 onwards)',
  conductingBody: 'The Institute of Company Secretaries of India (ICSI)',
  totalMarks: 200,
  durationMinutes: 120,
  passingCriteria: {
    minimumPerPaper: 40, // 40% in each paper (20/50 marks)
    aggregateMinimum: 50, // 50% in aggregate (100/200 marks)
    negativeMarking: false,
  },
  officialSourcePrimary: {
    documentName: 'ICSI Restructured CSEET Scheme & Study Materials (June 2026+)',
    sourceType: 'Official ICSI' as const,
    verificationDate: 'June 2026 / Verified August 2026',
    currentStatusConfirmation: 'Authoritative syllabus lock for CSEET February 2027 session',
    officialUrl: 'https://www.icsi.edu/cseet/',
  },
};

export const RESTRUCTURED_PAPERS: Paper[] = [
  paper1Data,
  paper2Data,
  paper3Data,
  paper4Data,
];

export const getAllSubTopics = () => {
  const subTopics = [];
  for (const paper of RESTRUCTURED_PAPERS) {
    for (const chapter of paper.chapters) {
      for (const topic of chapter.topics) {
        for (const subTopic of topic.subTopics) {
          subTopics.push(subTopic);
        }
      }
    }
  }
  return subTopics;
};

export const getSubTopicById = (id: string) => {
  return getAllSubTopics().find((st) => st.id === id);
};

export const getQuestionsForSubTopic = (subTopicId: string) => {
  const st = getSubTopicById(subTopicId);
  return st ? st.depthTestQuestions : [];
};

export const getAllQuestions = () => {
  const questions = [];
  for (const st of getAllSubTopics()) {
    questions.push(...st.depthTestQuestions);
  }
  return questions;
};

export const getAllPYQs = () => {
  const pyqs = [];
  for (const st of getAllSubTopics()) {
    pyqs.push(...st.pyqHistory);
  }
  return pyqs;
};
