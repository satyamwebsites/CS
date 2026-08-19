import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight, 
  Trash2,
  Filter,
  Search,
  BookOpen
} from 'lucide-react';
import { ErrorLogEntry } from '../types';
import { getErrorLog, markErrorResolved } from '../services/storageService';

interface ErrorLogViewProps {
  onNavigateSubTopic: (subTopicId: string) => void;
}

export const ErrorLogView: React.FC<ErrorLogViewProps> = ({
  onNavigateSubTopic,
}) => {
  const [errorList, setErrorList] = useState<ErrorLogEntry[]>(getErrorLog());
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED'>('UNRESOLVED');

  const refreshErrors = () => {
    setErrorList(getErrorLog());
  };

  const filteredErrors = errorList.filter(e => {
    const matchesCategory = categoryFilter === 'ALL' || e.errorCategory === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'UNRESOLVED' && !e.resolved) ||
      (statusFilter === 'RESOLVED' && e.resolved);

    return matchesCategory && matchesStatus;
  });

  const handleResolve = (errId: string) => {
    markErrorResolved(errId);
    refreshErrors();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs flex flex-col sm:flex-row sm:items-baseline justify-between gap-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
            TARGETED REMEDIATION VAULT
          </span>
          <h1 className="text-3xl font-bold font-editorial-serif text-[#1A1A1A]">
            Error Vault & Mistake Diagnostics
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
            Diagnoses why errors occur, details the correct ICSI method, and provides direct re-evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#F5F2EE] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] px-3 py-2 focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="UNRESOLVED">Unresolved Mistakes Only</option>
            <option value="RESOLVED">Resolved Vault History</option>
            <option value="ALL">All Recorded Errors</option>
          </select>
        </div>
      </div>

      {/* Filter and stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EAE7E2] p-5 border border-[#1A1A1A]/10 text-center font-sans">
        <div>
          <div className="text-[9px] tracking-wider uppercase font-bold opacity-50">Total Mistakes</div>
          <div className="text-2xl font-bold font-editorial-serif text-[#1A1A1A] mt-0.5">{errorList.length}</div>
        </div>
        <div>
          <div className="text-[9px] tracking-wider uppercase font-bold opacity-50">Calculation Errors</div>
          <div className="text-2xl font-bold font-editorial-serif text-[#8C3A27] mt-0.5">
            {errorList.filter(e => e.errorCategory === 'Calculation Error').length}
          </div>
        </div>
        <div>
          <div className="text-[9px] tracking-wider uppercase font-bold opacity-50">Conceptual Traps</div>
          <div className="text-2xl font-bold font-editorial-serif text-[#8C3A27] mt-0.5">
            {errorList.filter(e => e.errorCategory === 'Conceptual Trap').length}
          </div>
        </div>
        <div>
          <div className="text-[9px] tracking-wider uppercase font-bold opacity-50">Resolved / Mastered</div>
          <div className="text-2xl font-bold font-editorial-serif text-[#1A1A1A] mt-0.5">
            {errorList.filter(e => e.resolved).length}
          </div>
        </div>
      </div>

      {/* Errors list */}
      {filteredErrors.length === 0 ? (
        <div className="bg-[#FFFFFF] p-16 border border-[#1A1A1A]/10 text-center space-y-3 shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-[#1A1A1A] mx-auto" />
          <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
            No Errors in Current View
          </h3>
          <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto font-sans">
            {statusFilter === 'UNRESOLVED'
              ? 'Great work! All recorded mistakes have been resolved or no errors have been logged yet.'
              : 'No recorded errors match your current filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map((err) => (
            <div
              key={err.id}
              className={`bg-[#FFFFFF] p-6 border transition-colors space-y-4 shadow-xs ${
                err.resolved
                  ? 'border-[#1A1A1A]/10 opacity-60'
                  : 'border-[#8C3A27]/30'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1A1A1A]/10">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 bg-[#8C3A27]/10 text-[#8C3A27] font-bold uppercase tracking-wider">
                    {err.errorCategory}
                  </span>
                  <span>•</span>
                  <span className="opacity-60">{err.paperName}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
                  <span>Logged: {new Date(err.timestamp).toLocaleDateString()}</span>
                  {err.resolved && (
                    <span className="px-2 py-0.5 bg-[#1A1A1A] text-[#F5F2EE] font-bold">
                      RESOLVED
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div>
                <span className="text-[10px] font-mono opacity-50 block mb-1">
                  Topic: {err.subTopicName}
                </span>
                <p className="text-base font-bold font-editorial-serif text-[#1A1A1A] leading-relaxed whitespace-pre-line">
                  {err.questionText}
                </p>
              </div>

              {/* Answers Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-[#8C3A27]/5 p-4 border border-[#8C3A27]/20 space-y-1">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-[#8C3A27]">
                    Your Selected Choice:
                  </div>
                  <p className="text-[#1A1A1A]">{err.studentAnswerText}</p>
                </div>

                <div className="bg-[#EAE7E2] p-4 border border-[#1A1A1A]/15 space-y-1">
                  <div className="text-[10px] tracking-wider uppercase font-bold text-[#1A1A1A]">
                    Correct ICSI Statutory / Method Answer:
                  </div>
                  <p className="text-[#1A1A1A] font-semibold">{err.correctAnswerText}</p>
                </div>
              </div>

              {/* Diagnostic Analysis & Method */}
              <div className="bg-[#F5F2EE] p-4 border border-[#1A1A1A]/10 space-y-2 text-xs font-sans">
                <div>
                  <strong className="text-[#8C3A27]">Why The Mistake Happened:</strong>{' '}
                  <span className="text-[#1A1A1A]/85">{err.whyStudentMadeMistake}</span>
                </div>
                <div>
                  <strong className="text-[#1A1A1A]">Correct Rule / Calculation Method:</strong>{' '}
                  <span className="text-[#1A1A1A]/85">{err.correctMethodOrRule}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1A1A1A]/10">
                <button
                  onClick={() => onNavigateSubTopic(err.subTopicId)}
                  className="text-xs font-sans font-bold tracking-wider uppercase text-[#1A1A1A] hover:opacity-60 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>REVIEW SUB-TOPIC SYLLABUS</span>
                </button>

                <div className="flex items-center gap-2">
                  {!err.resolved && (
                    <button
                      onClick={() => handleResolve(err.id)}
                      className="px-3.5 py-1.5 bg-[#EAE7E2] hover:bg-[#FFFFFF] text-[#1A1A1A] text-[10px] tracking-[0.15em] font-sans font-bold uppercase border border-[#1A1A1A]/15 transition-colors"
                    >
                      MARK AS RESOLVED
                    </button>
                  )}
                  <button
                    onClick={() => onNavigateSubTopic(err.subTopicId)}
                    className="px-4 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>RETEST IN 20-Q EXAM</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
