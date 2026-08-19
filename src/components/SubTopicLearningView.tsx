import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Sparkles,
  Zap,
  TrendingUp,
  Brain
} from 'lucide-react';
import { SubTopic } from '../types';
import { getProgressMap } from '../services/storageService';
import { QuestionDepthTest } from './QuestionDepthTest';

interface SubTopicLearningViewProps {
  subTopic: SubTopic;
  onBackToSyllabus: () => void;
  onOpenSourceModal: (subTopic: SubTopic) => void;
  onAskAiTutorAboutTopic: (subTopic: SubTopic) => void;
}

export const SubTopicLearningView: React.FC<SubTopicLearningViewProps> = ({
  subTopic,
  onBackToSyllabus,
  onOpenSourceModal,
  onAskAiTutorAboutTopic,
}) => {
  const [activeSection, setActiveSection] = useState<'TEACHING' | 'TEST' | 'PYQ'>('TEACHING');
  const progressMap = getProgressMap();
  const currentProgress = progressMap[subTopic.id];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb and Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
        <button
          onClick={onBackToSyllabus}
          className="flex items-center gap-2 text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:opacity-60 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO SYLLABUS MATRIX</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenSourceModal(subTopic)}
            className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#EAE7E2] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase border border-[#1A1A1A]/20 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SOURCE CITATION</span>
          </button>

          <button
            onClick={() => onAskAiTutorAboutTopic(subTopic)}
            className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EAE7E2]" />
            <span>ASK AI TUTOR</span>
          </button>
        </div>
      </div>

      {/* Module Title Header Card */}
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4 relative">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono opacity-50">
          <span>{subTopic.learningPosition}</span>
          <span className="px-2.5 py-1 bg-[#EAE7E2] text-[#1A1A1A] uppercase tracking-wider font-bold">
            {subTopic.classification}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-editorial-serif text-[#1A1A1A] tracking-tight">
          {subTopic.studentFriendlyTitle}
        </h1>

        <p className="text-sm text-[#1A1A1A]/80 max-w-3xl leading-relaxed font-sans">
          {subTopic.whatItMeans}
        </p>

        <div className="pt-4 border-t border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-4 text-[11px] opacity-75">
            <span><strong>Status:</strong> {currentProgress?.status || 'NOT STARTED'}</span>
            <span>•</span>
            <span><strong>Accuracy:</strong> {currentProgress?.accuracyPercentage || 0}%</span>
            <span>•</span>
            <span><strong>Priority:</strong> {subTopic.examRelevance.strategicPriority}</span>
          </div>

          <div className="flex items-center gap-1 bg-[#EAE7E2] p-1 border border-[#1A1A1A]/10">
            <button
              onClick={() => setActiveSection('TEACHING')}
              className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-all ${
                activeSection === 'TEACHING'
                  ? 'bg-[#1A1A1A] text-[#F5F2EE] shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              13-STEP TEACHING
            </button>
            <button
              onClick={() => setActiveSection('TEST')}
              className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-all ${
                activeSection === 'TEST'
                  ? 'bg-[#1A1A1A] text-[#F5F2EE] shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              20-Q DEPTH TEST ({subTopic.depthTestQuestions.length})
            </button>
            <button
              onClick={() => setActiveSection('PYQ')}
              className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-all ${
                activeSection === 'PYQ'
                  ? 'bg-[#1A1A1A] text-[#F5F2EE] shadow-xs'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              PAST PYQs ({subTopic.pyqHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: 13-STEP COMPLETE EDITORIAL TEACHING VIEW */}
      {activeSection === 'TEACHING' && (
        <div className="space-y-8">
          
          {/* 1. What Must Be Learned Checklist */}
          <div className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 shadow-xs space-y-3">
            <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
              01 / Core Learning Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {subTopic.whatMustBeLearned.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-sans text-[#1A1A1A]/85 bg-[#F5F2EE] p-3 border border-[#1A1A1A]/5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Definition and Conceptual Postulates */}
          <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
              02 / Conceptual Foundation & Statutory Postulate
            </h3>
            <p className="text-base text-[#1A1A1A] leading-relaxed font-sans">
              {subTopic.teachingContent.definitionAndConcept}
            </p>
            {subTopic.teachingContent.statutoryOrRegulatoryBasis && (
              <div className="bg-[#EAE7E2] p-4 border-l-2 border-[#1A1A1A] text-xs font-sans text-[#1A1A1A]">
                <strong>Statutory Reference:</strong> {subTopic.teachingContent.statutoryOrRegulatoryBasis}
              </div>
            )}
          </div>

          {/* 3. Core Principles */}
          <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
              03 / Essential Doctrines & Principles
            </h3>
            <div className="space-y-2.5">
              {subTopic.teachingContent.corePrinciples.map((cp, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs font-sans text-[#1A1A1A] bg-[#F5F2EE] p-3.5 border border-[#1A1A1A]/5">
                  <span className="w-5 h-5 bg-[#1A1A1A] text-[#F5F2EE] font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{cp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Structural Components */}
          <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4">
            <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
              04 / Structural Elements & Components
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subTopic.teachingContent.componentsOrElements.map((comp, idx) => (
                <div key={idx} className="bg-[#F5F2EE] p-4 border border-[#1A1A1A]/10 space-y-1.5">
                  <h4 className="font-editorial-serif font-bold text-sm text-[#1A1A1A]">{comp.title}</h4>
                  <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-sans">{comp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Worked Examples / Numerical Calculations */}
          {subTopic.teachingContent.accountingWorkingsExample && (
            <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4">
              <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
                05 / Practical Working & Mathematical Resolution
              </h3>
              <div className="bg-[#EAE7E2] p-5 border border-[#1A1A1A]/10 space-y-3 text-xs font-sans">
                <div className="font-bold text-[#1A1A1A]">Problem Scenario:</div>
                <p className="text-[#1A1A1A]/85 leading-relaxed">{subTopic.teachingContent.accountingWorkingsExample.problemStatement}</p>

                <div className="font-bold text-[#1A1A1A] pt-2">Step-by-Step Resolution:</div>
                <div className="space-y-1 font-mono text-[11px] bg-[#FFFFFF] p-3 border border-[#1A1A1A]/10">
                  {subTopic.teachingContent.accountingWorkingsExample.journalEntriesOrCalculations.map((step, sidx) => (
                    <div key={sidx} className="text-[#1A1A1A]">
                      {step}
                    </div>
                  ))}
                </div>

                <div className="font-bold text-[#1A1A1A] pt-1">
                  Final Accounting / Economic Impact:{' '}
                  <span className="font-normal text-[#1A1A1A]/80">{subTopic.teachingContent.accountingWorkingsExample.ledgerOrFinalImpact}</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. Distinctions and Comparisons */}
          {subTopic.teachingContent.distinctionsAndComparisons && subTopic.teachingContent.distinctionsAndComparisons.length > 0 && (
            <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4">
              <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
                06 / Authoritative Comparative Distinctions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-sans text-left border border-[#1A1A1A]/10">
                  <thead className="bg-[#EAE7E2] text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]">
                    <tr>
                      <th className="p-3 border-b border-[#1A1A1A]/10">Basis of Comparison</th>
                      <th className="p-3 border-b border-[#1A1A1A]/10">Dimension A</th>
                      <th className="p-3 border-b border-[#1A1A1A]/10">Dimension B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/10">
                    {subTopic.teachingContent.distinctionsAndComparisons.map((dist, didx) => (
                      <tr key={didx} className="hover:bg-[#F5F2EE]">
                        <td className="p-3 font-semibold text-[#1A1A1A]">{dist.basis}</td>
                        <td className="p-3 text-[#1A1A1A]/80">
                          <strong>{dist.itemA.name}:</strong> {dist.itemA.detail}
                        </td>
                        <td className="p-3 text-[#1A1A1A]/80">
                          <strong>{dist.itemB.name}:</strong> {dist.itemB.detail}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Common Traps & High-Frequency Pitfalls */}
          <div className="bg-[#FFFFFF] p-8 border border-[#8C3A27]/20 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8C3A27]" />
              <h3 className="text-xs font-bold font-sans tracking-[0.25em] text-[#8C3A27] uppercase">
                07 / High-Frequency Examination Traps & Distractors
              </h3>
            </div>
            <div className="space-y-2">
              {subTopic.teachingContent.examTrapsAndPitfalls.map((trap, tidx) => (
                <div key={tidx} className="bg-[#F5F2EE] p-3.5 border-l-2 border-[#8C3A27] text-xs font-sans text-[#1A1A1A] leading-relaxed">
                  {trap}
                </div>
              ))}
            </div>
          </div>

          {/* 8. Launch 20-Q Depth Test Call to Action */}
          <div className="bg-[#EAE7E2] p-8 border border-[#1A1A1A]/10 text-center space-y-4">
            <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
              Evaluate Your Conceptual Mastery
            </h3>
            <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto font-sans leading-relaxed">
              Take the 20-Question Cognitive Depth Test for this sub-topic covering recall, scenario reasoning, accounting calculations, and examiner traps.
            </p>
            <button
              onClick={() => setActiveSection('TEST')}
              className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.25em] font-sans font-bold uppercase transition-all shadow-xs"
            >
              LAUNCH 20-QUESTION DEPTH TEST
            </button>
          </div>

        </div>
      )}

      {/* SECTION 2: 20-QUESTION DEPTH TEST */}
      {activeSection === 'TEST' && (
        <QuestionDepthTest
          subTopic={subTopic}
          onBackToStudy={() => setActiveSection('TEACHING')}
        />
      )}

      {/* SECTION 3: PAST EXAMINATION QUESTIONS (PYQs) */}
      {activeSection === 'PYQ' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
            <h3 className="text-lg font-bold font-editorial-serif text-[#1A1A1A]">
              Past ICSI Questions on {subTopic.studentFriendlyTitle}
            </h3>
            <span className="text-xs font-mono opacity-60">
              {subTopic.pyqHistory.length} Recorded Questions
            </span>
          </div>

          {subTopic.pyqHistory.length === 0 ? (
            <div className="bg-[#FFFFFF] p-10 border border-[#1A1A1A]/10 text-center space-y-2">
              <p className="text-sm font-editorial-serif text-[#1A1A1A]">
                Newly Introduced in Restructured Syllabus (June 2026+)
              </p>
              <p className="text-xs text-[#1A1A1A]/60 font-sans">
                Practice with the 20 generated mastery questions tailored strictly to ICSI guidelines.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {subTopic.pyqHistory.map((pyq) => (
                <div key={pyq.id} className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono pb-2 border-b border-[#1A1A1A]/10">
                    <span className="font-bold uppercase tracking-wider">
                      SESSION: {pyq.session} ({pyq.year})
                    </span>
                    <span className="px-2 py-0.5 bg-[#EAE7E2] uppercase font-bold text-[#1A1A1A]">
                      {pyq.syllabusVersion}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#1A1A1A] leading-relaxed font-sans">
                    {pyq.questionText}
                  </p>

                  <div className="bg-[#EAE7E2] p-4 border border-[#1A1A1A]/10 space-y-1.5 text-xs font-sans">
                    <div className="font-bold text-[#1A1A1A]">ICSI Guideline Answer Analysis:</div>
                    <p className="text-[#1A1A1A]/85 leading-relaxed">{pyq.guidelineAnswerAnalysis}</p>
                    <div className="pt-2 text-[10px] font-mono opacity-50 flex justify-between">
                      <span>Concept Tested: {pyq.conceptTested}</span>
                      <span>Source: {pyq.source}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
