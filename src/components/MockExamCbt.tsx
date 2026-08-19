import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  Sparkles
} from 'lucide-react';
import { RESTRUCTURED_PAPERS, getAllSubTopics } from '../data/icsiSyllabusData';
import { Question, MockExamResult } from '../types';
import { saveMockResult, addErrorLogEntry } from '../services/storageService';

type QuestionStatus = 'NOT_VISITED' | 'NOT_ANSWERED' | 'ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED';

interface MockExamCbtProps {
  onReturnToDashboard: () => void;
  onNavigateSubTopic: (subTopicId: string) => void;
}

export const MockExamCbt: React.FC<MockExamCbtProps> = ({
  onReturnToDashboard,
  onNavigateSubTopic,
}) => {
  const [examMode, setExamMode] = useState<'FULL_200M' | 'PAPER_50M'>('FULL_200M');
  const [selectedPaperId, setSelectedPaperId] = useState<string>('paper-1');
  const [isExamRunning, setIsExamRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60); // 120 mins
  
  // Test Questions State
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionStatus>>({});
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);

  const handleStartExam = () => {
    let assembledQuestions: Question[] = [];
    const allSubTopics = getAllSubTopics();

    if (examMode === 'FULL_200M') {
      ['paper-1', 'paper-2', 'paper-3', 'paper-4'].forEach(pId => {
        const pSubTopics = allSubTopics.filter(st => st.paperId === pId);
        pSubTopics.forEach(st => {
          assembledQuestions.push(...st.depthTestQuestions.slice(0, 10));
        });
      });
      setSecondsRemaining(120 * 60);
    } else {
      const pSubTopics = allSubTopics.filter(st => st.paperId === selectedPaperId);
      pSubTopics.forEach(st => {
        assembledQuestions.push(...st.depthTestQuestions);
      });
      setSecondsRemaining(30 * 60);
    }

    const initialStatuses: Record<string, QuestionStatus> = {};
    assembledQuestions.forEach((q, idx) => {
      initialStatuses[q.id] = idx === 0 ? 'NOT_ANSWERED' : 'NOT_VISITED';
    });

    setMockQuestions(assembledQuestions);
    setQuestionStatuses(initialStatuses);
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setIsExamRunning(true);
    setIsSubmitted(false);
  };

  useEffect(() => {
    let timer: any = null;
    if (isExamRunning && !isSubmitted && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamRunning, isSubmitted, secondsRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = mockQuestions[currentQuestionIdx];

  const handleSelectOption = (optionId: string) => {
    if (!currentQ) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleSaveAndNext = () => {
    if (!currentQ) return;
    const isAnswered = !!userAnswers[currentQ.id];
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: isAnswered ? 'ANSWERED' : 'NOT_ANSWERED',
    }));

    if (currentQuestionIdx < mockQuestions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      const nextQ = mockQuestions[nextIdx];
      if (questionStatuses[nextQ.id] === 'NOT_VISITED') {
        setQuestionStatuses(prev => ({ ...prev, [nextQ.id]: 'NOT_ANSWERED' }));
      }
      setCurrentQuestionIdx(nextIdx);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQ) return;
    const isAnswered = !!userAnswers[currentQ.id];
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: isAnswered ? 'ANSWERED_AND_MARKED' : 'MARKED_FOR_REVIEW',
    }));

    if (currentQuestionIdx < mockQuestions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      const nextQ = mockQuestions[nextIdx];
      if (questionStatuses[nextQ.id] === 'NOT_VISITED') {
        setQuestionStatuses(prev => ({ ...prev, [nextQ.id]: 'NOT_ANSWERED' }));
      }
      setCurrentQuestionIdx(nextIdx);
    }
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: 'NOT_ANSWERED',
    }));
  };

  const handleJumpToQuestion = (idx: number) => {
    const targetQ = mockQuestions[idx];
    if (questionStatuses[targetQ.id] === 'NOT_VISITED') {
      setQuestionStatuses(prev => ({ ...prev, [targetQ.id]: 'NOT_ANSWERED' }));
    }
    setCurrentQuestionIdx(idx);
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setIsExamRunning(false);

    let totalMarks = 0;
    const paperScores: MockExamResult['paperScores'] = [];

    const paperIds = examMode === 'FULL_200M' 
      ? ['paper-1', 'paper-2', 'paper-3', 'paper-4'] 
      : [selectedPaperId];

    let allPapersPassed = true;

    paperIds.forEach(pId => {
      const pQuestions = mockQuestions.filter(q => q.paperId === pId);
      let pMarks = 0;
      const maxMarks = 50;

      pQuestions.forEach(q => {
        const selectedOptId = userAnswers[q.id];
        const isCorrect = selectedOptId === q.correctOptionId;
        if (isCorrect) {
          pMarks += q.marks;
          totalMarks += q.marks;
        } else {
          const selectedOpt = q.options.find(o => o.id === selectedOptId);
          const correctOpt = q.options.find(o => o.id === q.correctOptionId);

          addErrorLogEntry({
            questionId: q.id,
            subTopicId: q.subTopicId,
            subTopicName: q.subTopicName,
            paperId: q.paperId,
            paperName: q.paperName,
            questionText: q.questionText,
            studentAnswerId: selectedOptId || 'UNANSWERED',
            studentAnswerText: selectedOpt?.text || 'Left Unanswered',
            correctAnswerId: q.correctOptionId,
            correctAnswerText: correctOpt?.text || '',
            errorCategory: q.accountingWorking ? 'Calculation Error' : 'Conceptual Trap',
            whyStudentMadeMistake: selectedOpt?.explanation || 'Incorrect answer during mock examination.',
            correctConcept: q.conceptTested,
            correctMethodOrRule: q.accountingWorking?.correctMethod || q.legalPrincipleOrCaseLaw?.applicationRule || q.generalExplanation,
          });
        }
      });

      const percentage = pQuestions.length > 0 ? (pMarks / maxMarks) * 100 : 0;
      const isPassed = percentage >= 40;

      if (!isPassed) {
        allPapersPassed = false;
      }

      const paperNames: Record<string, string> = {
        'paper-1': 'Paper 1: Business Communication',
        'paper-2': 'Paper 2: Fundamentals of Accounting',
        'paper-3': 'Paper 3: Economic & Business Env.',
        'paper-4': 'Paper 4: Business Laws & Management',
      };

      paperScores.push({
        paperId: pId,
        paperName: paperNames[pId] || pId,
        marksObtained: pMarks,
        maxMarks,
        isQualified: isPassed,
      });
    });

    const maxTotal = examMode === 'FULL_200M' ? 200 : 50;
    const aggregatePercentage = (totalMarks / maxTotal) * 100;
    const isOverallPassed = allPapersPassed && (examMode === 'FULL_200M' ? aggregatePercentage >= 50 : aggregatePercentage >= 40);

    const result: MockExamResult = {
      id: `mock-${Date.now()}`,
      examDate: new Date().toISOString(),
      mode: examMode,
      totalMarksObtained: totalMarks,
      maximumMarks: maxTotal,
      percentageScore: Math.round(aggregatePercentage),
      paperScores,
      isOverallQualified: isOverallPassed,
      totalQuestionsAttempted: Object.keys(userAnswers).length,
      correctQuestionsCount: mockQuestions.filter(q => userAnswers[q.id] === q.correctOptionId).length,
      timeTakenSeconds: (examMode === 'FULL_200M' ? 120 * 60 : 30 * 60) - secondsRemaining,
    };

    setExamResult(result);
    saveMockResult(result);
  };

  const getPaletteCount = (status: QuestionStatus) => {
    return Object.values(questionStatuses).filter(s => s === status).length;
  };

  // START SCREEN
  if (!isExamRunning && !isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#1A1A1A]/10 shadow-xs space-y-8">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
              PROCTORED CBT LABORATORY
            </span>
            <h1 className="text-3xl font-bold font-editorial-serif text-[#1A1A1A]">
              ICSI CSEET February 2027 Mock Examination Simulator
            </h1>
            <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
              Strictly enforces official ICSI qualifying standards: 40% sectional minimum + 50% aggregate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setExamMode('FULL_200M')}
              className={`p-6 border cursor-pointer transition-all ${
                examMode === 'FULL_200M'
                  ? 'bg-[#EAE7E2] border-[#1A1A1A] shadow-xs'
                  : 'bg-[#F5F2EE] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono opacity-50 uppercase mb-2">
                <span>FULL 4-PAPER SIMULATION</span>
                <span>120 Mins</span>
              </div>
              <h3 className="font-bold font-editorial-serif text-xl text-[#1A1A1A]">
                200-Mark Comprehensive Exam
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 mt-2 leading-relaxed font-sans">
                Simulates all 4 restructured papers (50 marks each). Enforces ICSI qualifying criterion: Min 40% in each individual paper and Min 50% in aggregate.
              </p>
            </div>

            <div 
              onClick={() => setExamMode('PAPER_50M')}
              className={`p-6 border cursor-pointer transition-all ${
                examMode === 'PAPER_50M'
                  ? 'bg-[#EAE7E2] border-[#1A1A1A] shadow-xs'
                  : 'bg-[#F5F2EE] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono opacity-50 uppercase mb-2">
                <span>SINGLE-PAPER FOCUS</span>
                <span>30 Mins</span>
              </div>
              <h3 className="font-bold font-editorial-serif text-xl text-[#1A1A1A]">
                50-Mark Standalone Paper Sprint
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 mt-2 leading-relaxed font-sans">
                Focused sprint on a single subject module to evaluate specialized speed and accuracy.
              </p>
              {examMode === 'PAPER_50M' && (
                <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10">
                  <select
                    value={selectedPaperId}
                    onChange={(e) => setSelectedPaperId(e.target.value)}
                    className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] py-2 px-3 focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="paper-1">Paper 1: Business Communication</option>
                    <option value="paper-2">Paper 2: Fundamentals of Accounting</option>
                    <option value="paper-3">Paper 3: Economic & Business Env.</option>
                    <option value="paper-4">Paper 4: Business Laws & Management</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#F5F2EE] p-6 border border-[#1A1A1A]/10 space-y-2 text-xs font-sans text-[#1A1A1A]/85">
            <h4 className="font-bold uppercase tracking-wider text-[10px] text-[#1A1A1A]">
              Official ICSI Examination Protocol:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>There is <strong>NO negative marking</strong> for incorrect responses.</li>
              <li>Passing criteria: At least <strong>40% in each paper</strong> and <strong>50% in aggregate</strong>.</li>
              <li>Questions can be revisited and changed freely using the Question Palette.</li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.25em] font-sans font-bold uppercase transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#EAE7E2]" />
            <span>ENTER COMPUTER-BASED EXAMINATION</span>
          </button>
        </div>
      </div>
    );
  }

  // RESULT SCORECARD SCREEN
  if (isSubmitted && examResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#1A1A1A]/10 shadow-xs space-y-8">
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[#1A1A1A] text-[#F5F2EE] flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-50 block">
              OFFICIAL SCORE REPORT
            </span>

            <h1 className="text-3xl font-bold font-editorial-serif text-[#1A1A1A]">
              {examResult.isOverallQualified ? 'QUALIFIED / PASSED' : 'NOT QUALIFIED'}
            </h1>
            <p className="text-xs text-[#1A1A1A]/60 font-mono">
              ICSI CSEET Simulation • {examResult.mode} • Time: {Math.floor(examResult.timeTakenSeconds / 60)}m {examResult.timeTakenSeconds % 60}s
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F5F2EE] p-6 border border-[#1A1A1A]/10 text-center">
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-50">Total Marks</div>
              <div className="text-3xl font-bold font-editorial-serif text-[#1A1A1A] mt-1">
                {examResult.totalMarksObtained} <span className="text-sm font-sans opacity-40">/ {examResult.maximumMarks}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-50">Aggregate</div>
              <div className="text-3xl font-bold font-editorial-serif text-[#1A1A1A] mt-1">
                {examResult.percentageScore}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-50">Requirement</div>
              <div className="text-xs font-mono font-bold text-[#1A1A1A] mt-3">
                Min 40%/Paper & 50% Agg.
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold font-sans tracking-[0.2em] text-[#1A1A1A] uppercase">
              Paper-Wise Breakdown & Sectional Qualification
            </h3>

            <div className="space-y-2">
              {examResult.paperScores.map((ps) => (
                <div 
                  key={ps.paperId}
                  className="bg-[#F5F2EE] p-4 border border-[#1A1A1A]/10 flex items-center justify-between gap-4 font-sans text-xs"
                >
                  <div>
                    <h4 className="font-bold font-editorial-serif text-sm text-[#1A1A1A]">{ps.paperName}</h4>
                    <div className="text-[10px] font-mono opacity-50 mt-0.5">
                      Min Required: 40% (20/50)
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono font-bold text-sm text-[#1A1A1A]">
                        {ps.marksObtained} / {ps.maxMarks}
                      </div>
                      <div className="text-[10px] font-mono opacity-60">
                        {Math.round((ps.marksObtained / ps.maxMarks) * 100)}%
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-[9px] font-sans font-bold uppercase tracking-wider ${
                      ps.isQualified 
                        ? 'bg-[#1A1A1A] text-[#F5F2EE]'
                        : 'bg-[#8C3A27] text-[#F5F2EE]'
                    }`}>
                      {ps.isQualified ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-[#1A1A1A]/10">
            <button
              onClick={() => {
                setIsExamRunning(false);
                setIsSubmitted(false);
              }}
              className="px-4 py-2.5 bg-[#EAE7E2] hover:bg-[#FFFFFF] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase border border-[#1A1A1A]/20 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETAKE MOCK EXAM</span>
            </button>

            <button
              onClick={onReturnToDashboard}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors shadow-xs"
            >
              RETURN TO DASHBOARD
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ACTIVE CBT EXAM SCREEN
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Bar */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
            <span className="font-bold uppercase text-[#1A1A1A]">ICSI CBT SIMULATION</span>
            <span>•</span>
            <span>{examMode}</span>
          </div>
          <h2 className="text-base font-bold font-editorial-serif text-[#1A1A1A] mt-0.5">
            ICSI Company Secretary Executive Entrance Test
          </h2>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-2 bg-[#EAE7E2] border border-[#1A1A1A]/15 px-4 py-2 font-mono">
          <Clock className="w-4 h-4 text-[#1A1A1A]" />
          <span className="text-xs opacity-60">TIME LEFT:</span>
          <span className={`text-base font-bold ${secondsRemaining < 300 ? 'text-[#8C3A27] animate-pulse' : 'text-[#1A1A1A]'}`}>
            {formatTimer(secondsRemaining)}
          </span>
        </div>

        <button
          onClick={handleSubmitExam}
          className="px-4 py-2 bg-[#8C3A27] hover:bg-[#6e2b1b] text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>SUBMIT EXAM</span>
        </button>
      </div>

      {/* Main CBT 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Question Box & Action Buttons */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A1A1A]/10 text-xs font-sans">
              <span className="font-mono text-[#1A1A1A] font-bold">
                QUESTION {currentQuestionIdx + 1} OF {mockQuestions.length}
              </span>
              <span className="opacity-50 font-mono text-[11px]">
                {currentQ?.paperName} (+{currentQ?.marks}M)
              </span>
            </div>

            {currentQ && (
              <div className="space-y-4">
                <p className="text-base sm:text-lg font-bold font-editorial-serif text-[#1A1A1A] leading-relaxed whitespace-pre-line">
                  {currentQ.questionText}
                </p>

                <div className="space-y-3 pt-2">
                  {currentQ.options.map(opt => {
                    const isSelected = userAnswers[currentQ.id] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`p-4 border text-xs sm:text-sm font-sans cursor-pointer transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-[#F5F2EE] border-[#1A1A1A] shadow-xs'
                            : 'bg-[#F5F2EE] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40 text-[#1A1A1A]'
                        }`}
                      >
                        <span className={`w-5 h-5 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                          isSelected ? 'border-[#F5F2EE] text-[#F5F2EE]' : 'border-[#1A1A1A]/30 text-[#1A1A1A]'
                        }`}>
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="leading-relaxed flex-1">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1A1A1A]/10">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                className="px-3.5 py-2 bg-[#EAE7E2] hover:bg-[#FFFFFF] text-[#1A1A1A] text-[10px] tracking-[0.15em] font-sans font-bold uppercase border border-[#1A1A1A]/15 transition-colors"
              >
                CLEAR RESPONSE
              </button>
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-3.5 py-2 bg-[#F5F2EE] hover:bg-[#EAE7E2] text-[#1A1A1A] text-[10px] tracking-[0.15em] font-sans font-bold uppercase border border-[#1A1A1A]/20 transition-colors flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>MARK FOR REVIEW</span>
              </button>
            </div>

            <button
              onClick={handleSaveAndNext}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.25em] font-sans font-bold uppercase transition-all shadow-xs flex items-center gap-1"
            >
              <span>SAVE & NEXT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 shadow-xs space-y-4">
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-50 block">
            QUESTION PALETTE
          </span>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-[#1A1A1A]/80">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#1A1A1A] text-[#F5F2EE] font-mono text-[9px] flex items-center justify-center font-bold">
                {getPaletteCount('ANSWERED')}
              </span>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#8C3A27] text-[#F5F2EE] font-mono text-[9px] flex items-center justify-center font-bold">
                {getPaletteCount('NOT_ANSWERED')}
              </span>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#5A5650] text-[#F5F2EE] font-mono text-[9px] flex items-center justify-center font-bold">
                {getPaletteCount('MARKED_FOR_REVIEW')}
              </span>
              <span>Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/20 font-mono text-[9px] flex items-center justify-center font-bold">
                {getPaletteCount('NOT_VISITED')}
              </span>
              <span>Not Visited</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1A1A1A]/10">
            <div className="grid grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-1">
              {mockQuestions.map((q, idx) => {
                const status = questionStatuses[q.id] || 'NOT_VISITED';
                const isCurrent = idx === currentQuestionIdx;

                let colorClasses = 'bg-[#F5F2EE] text-[#1A1A1A]/60 border border-[#1A1A1A]/10';
                if (status === 'ANSWERED') colorClasses = 'bg-[#1A1A1A] text-[#F5F2EE] border-[#1A1A1A]';
                if (status === 'NOT_ANSWERED') colorClasses = 'bg-[#8C3A27] text-[#F5F2EE] border-[#8C3A27]';
                if (status === 'MARKED_FOR_REVIEW') colorClasses = 'bg-[#5A5650] text-[#F5F2EE] border-[#5A5650]';
                if (status === 'ANSWERED_AND_MARKED') colorClasses = 'bg-[#1A1A1A] text-[#F5F2EE] ring-1 ring-[#8C3A27]';

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-8 font-mono text-[10px] font-bold flex items-center justify-center transition-all ${colorClasses} ${
                      isCurrent ? 'ring-2 ring-[#1A1A1A] ring-offset-2 ring-offset-[#FFFFFF] scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
