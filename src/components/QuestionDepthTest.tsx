import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { SubTopic, Question } from '../types';
import { recordQuestionAttempt, addErrorLogEntry } from '../services/storageService';

interface QuestionDepthTestProps {
  subTopic: SubTopic;
  onBackToStudy: () => void;
}

export const QuestionDepthTest: React.FC<QuestionDepthTestProps> = ({
  subTopic,
  onBackToStudy,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [answersState, setAnswersState] = useState<Record<number, { selectedId: string; isCorrect: boolean }>>({});
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);

  const questions = subTopic.depthTestQuestions;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;

    const isCorrect = selectedOptionId === currentQ.correctOptionId;
    setIsAnswerSubmitted(true);

    // Save to answers map
    setAnswersState(prev => ({
      ...prev,
      [currentIdx]: { selectedId: selectedOptionId, isCorrect },
    }));

    // Record in global storage
    recordQuestionAttempt(subTopic.id, isCorrect, currentQ.difficulty);

    // If incorrect, add diagnostic entry to Error Log automatically
    if (!isCorrect) {
      const selectedOpt = currentQ.options.find(o => o.id === selectedOptionId);
      const correctOpt = currentQ.options.find(o => o.id === currentQ.correctOptionId);

      addErrorLogEntry({
        questionId: currentQ.id,
        subTopicId: subTopic.id,
        subTopicName: subTopic.studentFriendlyTitle,
        paperId: subTopic.paperId,
        paperName: currentQ.paperName,
        questionText: currentQ.questionText,
        studentAnswerId: selectedOptionId,
        studentAnswerText: selectedOpt?.text || '',
        correctAnswerId: currentQ.correctOptionId,
        correctAnswerText: correctOpt?.text || '',
        errorCategory: currentQ.accountingWorking ? 'Calculation Error' : 'Conceptual Trap',
        whyStudentMadeMistake: selectedOpt?.explanation || 'Misinterpreted primary legal/accounting doctrine.',
        correctConcept: currentQ.conceptTested,
        correctMethodOrRule: currentQ.accountingWorking?.correctMethod || currentQ.legalPrincipleOrCaseLaw?.applicationRule || currentQ.generalExplanation,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (answersState[nextIdx]) {
        setSelectedOptionId(answersState[nextIdx].selectedId);
        setIsAnswerSubmitted(true);
      } else {
        setSelectedOptionId(null);
        setIsAnswerSubmitted(false);
      }
    } else {
      setIsTestCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      if (answersState[prevIdx]) {
        setSelectedOptionId(answersState[prevIdx].selectedId);
        setIsAnswerSubmitted(true);
      } else {
        setSelectedOptionId(null);
        setIsAnswerSubmitted(false);
      }
    }
  };

  const handleJumpTo = (idx: number) => {
    setCurrentIdx(idx);
    if (answersState[idx]) {
      setSelectedOptionId(answersState[idx].selectedId);
      setIsAnswerSubmitted(true);
    } else {
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    }
  };

  // Score summary
  const totalAttempted = Object.keys(answersState).length;
  const totalCorrect = Object.values(answersState).filter((a: { selectedId: string; isCorrect: boolean }) => a.isCorrect).length;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  if (isTestCompleted) {
    return (
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs max-w-3xl mx-auto space-y-6 text-center">
        <div className="w-16 h-16 bg-[#1A1A1A] text-[#F5F2EE] flex items-center justify-center mx-auto shadow-xs">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-50 block mb-1">
            TEST SUMMARY
          </span>
          <h2 className="text-3xl font-bold font-editorial-serif text-[#1A1A1A]">
            Cognitive Depth Evaluation Complete
          </h2>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
            Evaluated for: {subTopic.studentFriendlyTitle}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-[#F5F2EE] p-6 border border-[#1A1A1A]/10">
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-50">Score</div>
            <div className="text-3xl font-bold font-editorial-serif text-[#1A1A1A] mt-1">
              {totalCorrect} / {questions.length}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-50">Accuracy</div>
            <div className="text-3xl font-bold font-editorial-serif text-[#1A1A1A] mt-1">
              {accuracy}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-wider opacity-50">ICSI Benchmark</div>
            <div className="text-xs font-mono font-bold text-[#1A1A1A] mt-3">
              {accuracy >= 75 ? 'PASSED (STRONG)' : accuracy >= 40 ? 'DEVELOPING' : 'NEEDS REMEDIATION'}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => {
              setAnswersState({});
              setSelectedOptionId(null);
              setIsAnswerSubmitted(false);
              setCurrentIdx(0);
              setIsTestCompleted(false);
            }}
            className="px-4 py-2.5 bg-[#EAE7E2] hover:bg-[#FFFFFF] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase border border-[#1A1A1A]/20 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RETAKE 20-Q TEST</span>
          </button>

          <button
            onClick={onBackToStudy}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors shadow-xs"
          >
            RETURN TO MODULE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Test Progress Top Bar */}
      <div className="bg-[#FFFFFF] p-5 border border-[#1A1A1A]/10 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span>•</span>
            <span>{currentQ.questionType}</span>
            <span>•</span>
            <span className="font-bold uppercase text-[#1A1A1A]">{currentQ.difficulty}</span>
          </div>
          <h3 className="text-base font-bold font-editorial-serif text-[#1A1A1A] mt-0.5">
            {subTopic.studentFriendlyTitle}
          </h3>
        </div>

        {/* Question Palette Strip */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {questions.map((_, qIndex) => {
            const ans = answersState[qIndex];
            const isCurrent = qIndex === currentIdx;

            let bgClass = 'bg-[#EAE7E2] text-[#1A1A1A]/60 border border-[#1A1A1A]/10';
            if (ans) {
              bgClass = ans.isCorrect
                ? 'bg-[#1A1A1A] text-[#F5F2EE] border-[#1A1A1A]'
                : 'bg-[#8C3A27] text-[#F5F2EE] border-[#8C3A27]';
            }

            return (
              <button
                key={qIndex}
                onClick={() => handleJumpTo(qIndex)}
                className={`w-7 h-7 font-mono text-[10px] font-bold flex items-center justify-center transition-all ${bgClass} ${
                  isCurrent ? 'ring-2 ring-[#1A1A1A] ring-offset-2 ring-offset-[#F5F2EE] scale-110' : ''
                }`}
              >
                {qIndex + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-6">
        
        {/* Context or question scenario */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-45 block">
            SKILL TESTED: {currentQ.skillTested}
          </span>
          <p className="text-base sm:text-lg font-bold font-editorial-serif text-[#1A1A1A] leading-relaxed whitespace-pre-line">
            {currentQ.questionText}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = 'bg-[#F5F2EE] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/40 text-[#1A1A1A]';

            if (isAnswerSubmitted) {
              if (opt.id === currentQ.correctOptionId) {
                optStyle = 'bg-[#EAE7E2] border-[#1A1A1A] text-[#1A1A1A] font-bold ring-1 ring-[#1A1A1A]';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-[#8C3A27]/10 border-[#8C3A27] text-[#8C3A27] ring-1 ring-[#8C3A27]';
              } else {
                optStyle = 'bg-[#F5F2EE] border-[#1A1A1A]/10 opacity-40 text-[#1A1A1A]';
              }
            } else if (isSelected) {
              optStyle = 'bg-[#1A1A1A] text-[#F5F2EE] border-[#1A1A1A] shadow-xs';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 border transition-all cursor-pointer flex items-start gap-3.5 text-xs sm:text-sm font-sans ${optStyle}`}
              >
                <span className={`w-5 h-5 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                  isSelected && !isAnswerSubmitted 
                    ? 'border-[#F5F2EE] text-[#F5F2EE]' 
                    : 'border-[#1A1A1A]/30 text-[#1A1A1A]'
                }`}>
                  {opt.id.toUpperCase()}
                </span>
                <span className="leading-relaxed flex-1">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Feedback and Explanation Box after submission */}
        {isAnswerSubmitted && (
          <div className="bg-[#EAE7E2] p-6 border border-[#1A1A1A]/10 space-y-4 text-xs font-sans">
            <div className="flex items-center gap-2">
              {selectedOptionId === currentQ.correctOptionId ? (
                <div className="flex items-center gap-2 font-bold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>CORRECT ANSWER (+{currentQ.marks} MARK)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-bold text-[#8C3A27] uppercase tracking-wider text-[11px]">
                  <XCircle className="w-4 h-4 text-[#8C3A27]" />
                  <span>INCORRECT (RECORDED IN ERROR VAULT)</span>
                </div>
              )}
            </div>

            <div className="text-[#1A1A1A]/90 space-y-2 leading-relaxed">
              <p><strong>Official Analysis:</strong> {currentQ.generalExplanation}</p>
              
              {currentQ.accountingWorking && (
                <div className="bg-[#FFFFFF] p-3 border border-[#1A1A1A]/10 space-y-1 font-mono text-[11px]">
                  <div className="font-bold text-[#1A1A1A]">Working Formula: {currentQ.accountingWorking.formula}</div>
                  <div className="text-[#1A1A1A]/80">Correct Method: {currentQ.accountingWorking.correctMethod}</div>
                  <div className="text-[#8C3A27]">Common Trap: {currentQ.accountingWorking.commonCalculationTrap}</div>
                </div>
              )}

              {currentQ.legalPrincipleOrCaseLaw && (
                <div className="bg-[#FFFFFF] p-3 border border-[#1A1A1A]/10 text-[11px]">
                  <strong>Statutory Basis:</strong> {currentQ.legalPrincipleOrCaseLaw.statute} ({currentQ.legalPrincipleOrCaseLaw.sectionOrRule})
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Bottom Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1A1A1A]/10">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIdx === 0}
            className="px-4 py-2 bg-[#EAE7E2] hover:bg-[#FFFFFF] disabled:opacity-30 disabled:cursor-not-allowed text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors border border-[#1A1A1A]/15 flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>PREVIOUS</span>
          </button>

          <div className="flex items-center gap-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-[#F5F2EE] text-[10px] tracking-[0.25em] font-sans font-bold uppercase transition-all shadow-xs"
              >
                SUBMIT ANSWER
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.25em] font-sans font-bold uppercase transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>{currentIdx < questions.length - 1 ? 'NEXT QUESTION' : 'VIEW SCORE SUMMARY'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
