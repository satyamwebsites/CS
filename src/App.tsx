/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { MasterDashboard } from './components/MasterDashboard';
import { SyllabusBrowser } from './components/SyllabusBrowser';
import { SubTopicLearningView } from './components/SubTopicLearningView';
import { PyqIntelligenceView } from './components/PyqIntelligenceView';
import { MockExamCbt } from './components/MockExamCbt';
import { PersonalDailyStudyPlan } from './components/PersonalDailyStudyPlan';
import { ErrorLogView } from './components/ErrorLogView';
import { AiTutorDrawer } from './components/AiTutorDrawer';
import { SourceVerificationModal } from './components/SourceVerificationModal';
import { getSubTopicById } from './data/icsiSyllabusData';
import { SubTopic } from './types';
import { parseQuickCommand } from './services/geminiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeSubTopicId, setActiveSubTopicId] = useState<string | null>(null);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);
  const [inspectedSubTopic, setInspectedSubTopic] = useState<SubTopic | undefined>(undefined);
  const [currentStudyPlanDay, setCurrentStudyPlanDay] = useState<number>(1);

  const activeSubTopic = activeSubTopicId ? getSubTopicById(activeSubTopicId) : undefined;

  const handleNavigateSubTopic = (subTopicId: string) => {
    setActiveSubTopicId(subTopicId);
    setActiveTab('syllabus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSourceModal = (subTopic?: SubTopic) => {
    setInspectedSubTopic(subTopic || activeSubTopic);
    setIsSourceModalOpen(true);
  };

  const handleAskAiAboutTopic = (subTopic: SubTopic) => {
    setActiveSubTopicId(subTopic.id);
    setIsAiTutorOpen(true);
  };

  const handleExecuteCommand = (cmd: string) => {
    const parsed = parseQuickCommand(cmd);
    if (parsed.commandType === 'DAY_PLAN' && parsed.dayNumber) {
      setCurrentStudyPlanDay(parsed.dayNumber);
      setActiveTab('daily-plan');
      setActiveSubTopicId(null);
    } else if (parsed.commandType === 'TEACH' && parsed.targetSubTopicId) {
      handleNavigateSubTopic(parsed.targetSubTopicId);
    } else if (parsed.commandType === 'PYQ') {
      setActiveTab('pyq');
      setActiveSubTopicId(null);
    } else if (parsed.commandType === 'MOCK') {
      setActiveTab('mock');
      setActiveSubTopicId(null);
    } else if (parsed.commandType === 'ERROR_LOG') {
      setActiveTab('error-log');
      setActiveSubTopicId(null);
    } else if (parsed.commandType === 'DIAGNOSTIC') {
      setActiveTab('mock');
      setActiveSubTopicId(null);
    } else {
      // General question: open AI tutor drawer
      setIsAiTutorOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EE] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-[#F5F2EE] relative overflow-x-hidden">
      
      {/* Decorative vertical editorial margin metadata (Artistic Flair signature touch) */}
      <div className="hidden 2xl:flex fixed left-4 top-32 flex-col justify-between h-96 py-2 border-r border-[#1A1A1A]/10 pr-3 pointer-events-none select-none z-10">
        <span className="rotate-180 [writing-mode:vertical-lr] text-[9px] tracking-[0.3em] uppercase opacity-40 font-mono">
          ICSI CSEET — ISSUE FEB 2027
        </span>
        <span className="rotate-180 [writing-mode:vertical-lr] text-[9px] tracking-[0.3em] uppercase opacity-40 font-mono">
          RESTRUCTURED SCHEME
        </span>
      </div>

      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'syllabus') {
            setActiveSubTopicId(null);
          }
        }}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        onOpenSourceModal={() => handleOpenSourceModal()}
        onExecuteCommand={handleExecuteCommand}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && (
          <MasterDashboard
            onNavigateSubTopic={handleNavigateSubTopic}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setActiveSubTopicId(null);
            }}
            onStartDiagnostic={() => {
              setActiveTab('mock');
              setActiveSubTopicId(null);
            }}
          />
        )}

        {activeTab === 'syllabus' && (
          <>
            {activeSubTopic ? (
              <SubTopicLearningView
                subTopic={activeSubTopic}
                onBackToSyllabus={() => setActiveSubTopicId(null)}
                onOpenSourceModal={handleOpenSourceModal}
                onAskAiTutorAboutTopic={handleAskAiAboutTopic}
              />
            ) : (
              <SyllabusBrowser
                onSelectSubTopic={handleNavigateSubTopic}
                onOpenSourceModal={handleOpenSourceModal}
              />
            )}
          </>
        )}

        {activeTab === 'pyq' && (
          <PyqIntelligenceView
            onNavigateSubTopic={handleNavigateSubTopic}
          />
        )}

        {activeTab === 'mock' && (
          <MockExamCbt
            onReturnToDashboard={() => setActiveTab('dashboard')}
            onNavigateSubTopic={handleNavigateSubTopic}
          />
        )}

        {activeTab === 'daily-plan' && (
          <PersonalDailyStudyPlan
            initialDay={currentStudyPlanDay}
            onNavigateSubTopic={handleNavigateSubTopic}
          />
        )}

        {activeTab === 'error-log' && (
          <ErrorLogView
            onNavigateSubTopic={handleNavigateSubTopic}
          />
        )}
      </main>

      {/* Editorial Gallery Footer */}
      <footer className="bg-[#EAE7E2] border-t border-[#1A1A1A]/10 py-10 mt-16 text-xs text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-baseline justify-between gap-6 pb-8 border-b border-[#1A1A1A]/10">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-50 block mb-1">
                Authoritative Examination Engine
              </span>
              <h2 className="text-xl font-bold tracking-tight font-editorial-serif text-[#1A1A1A]">
                ICSI CSEET / FEBRUARY 2027
              </h2>
              <p className="text-xs opacity-70 mt-1 max-w-md leading-relaxed">
                Formally anchored to the June 2026+ Restructured Syllabus prescribed by The Institute of Company Secretaries of India.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[10px] tracking-[0.2em] font-sans font-semibold uppercase">
              <div>
                <span className="opacity-40 block mb-0.5">Paper 1</span>
                <span>Communication</span>
              </div>
              <div>
                <span className="opacity-40 block mb-0.5">Paper 2</span>
                <span>Accounting</span>
              </div>
              <div>
                <span className="opacity-40 block mb-0.5">Paper 3</span>
                <span>Economics</span>
              </div>
              <div>
                <span className="opacity-40 block mb-0.5">Paper 4</span>
                <span>Laws & Mgmt</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] opacity-60 font-sans">
            <div>
              © 2026–2027 ICSI CSEET Mastery System. All modules verified against official ICSI study publications.
            </div>
            <div className="flex gap-6 tracking-widest font-mono text-[10px] uppercase">
              <span>VOL. 27</span>
              <span>•</span>
              <span>CONFIRMED: JUNE 2026+</span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Tutor Chat Drawer */}
      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        activeSubTopic={activeSubTopic}
        onNavigateSubTopic={handleNavigateSubTopic}
        onExecuteCommand={handleExecuteCommand}
      />

      {/* Official ICSI Source Verification Modal */}
      <SourceVerificationModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        subTopic={inspectedSubTopic}
      />

    </div>
  );
}
