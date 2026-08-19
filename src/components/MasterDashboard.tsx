import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ArrowRight, 
  Target, 
  Sparkles,
  Zap,
  Clock,
  RotateCcw,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { getReadinessMetrics, getDaysRemainingToExam } from '../services/storageService';
import { RESTRUCTURED_PAPERS } from '../data/icsiSyllabusData';
import { TRANSITION_WARNING_BANNER } from '../data/pyqIntelligenceData';

interface MasterDashboardProps {
  onNavigateSubTopic: (subTopicId: string) => void;
  onNavigateTab: (tab: any) => void;
  onStartDiagnostic: () => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  onNavigateSubTopic,
  onNavigateTab,
  onStartDiagnostic,
}) => {
  const metrics = getReadinessMetrics();
  const daysLeft = getDaysRemainingToExam();

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Official Syllabus Restructuring Notice (Editorial Style) */}
      <div className="bg-[#EAE7E2] border-l-3 border-[#1A1A1A] p-6 shadow-xs border border-[#1A1A1A]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-[0.3em] bg-[#1A1A1A] text-[#F5F2EE]">
              OFFICIAL ICSI NOTICE
            </span>
            <span className="text-[10px] text-[#1A1A1A]/60 font-mono tracking-wider">
              SESSION: FEB 2027
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-editorial-serif text-[#1A1A1A] tracking-tight">
            {TRANSITION_WARNING_BANNER.headline}
          </h2>
          <p className="text-xs text-[#1A1A1A]/80 max-w-3xl leading-relaxed font-sans">
            {TRANSITION_WARNING_BANNER.message}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 z-10">
          <button
            onClick={() => onNavigateTab('pyq')}
            className="px-4 py-2.5 bg-[#F5F2EE] hover:bg-[#FFFFFF] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase border border-[#1A1A1A]/20 transition-all whitespace-nowrap shadow-xs"
          >
            VIEW TRANSITION MATRIX
          </button>
        </div>
      </div>

      {/* Hero Readiness Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Readiness Gauge Card */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-sm flex flex-col justify-between relative">
          
          {/* Subtle architectural numeral watermark in background */}
          <div className="absolute top-2 right-6 text-[140px] font-black text-[#1A1A1A]/3 leading-none pointer-events-none select-none font-editorial-serif">
            27
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold font-sans tracking-[0.25em] text-[#1A1A1A]/50 uppercase">
                EXAMINATION READINESS INDEX
              </span>
              <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/10">
                PASS: 40% PAPER • 50% AGGREGATE
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-8 mb-8">
              <div>
                <div className="text-6xl sm:text-7xl font-bold font-editorial-serif text-[#1A1A1A] tracking-tighter leading-none">
                  {metrics.readinessPercentage}<span className="text-3xl font-sans font-light opacity-50">%</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/60 mt-2 font-sans">
                  Evaluated across {metrics.totalSubTopics} restructured sub-topics
                </p>
              </div>

              <div className="flex-1 grid grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-[#1A1A1A]/10 pt-4 sm:pt-0 sm:pl-8">
                <div>
                  <div className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase opacity-45">Mastered</div>
                  <div className="text-2xl font-bold text-[#1A1A1A] font-editorial-serif mt-0.5">
                    {metrics.masteredSubTopics}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase opacity-45">Practicing</div>
                  <div className="text-2xl font-bold text-[#1A1A1A] font-editorial-serif mt-0.5">
                    {metrics.strongSubTopics + metrics.developingSubTopics}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase opacity-45">Needs Focus</div>
                  <div className="text-2xl font-bold text-[#8C3A27] font-editorial-serif mt-0.5">
                    {metrics.weakSubTopics}
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Segmented Progress Bar */}
            <div className="w-full bg-[#EAE7E2] h-2 flex overflow-hidden border border-[#1A1A1A]/10">
              <div 
                className="bg-[#1A1A1A] transition-all duration-500" 
                style={{ width: `${(metrics.masteredSubTopics / metrics.totalSubTopics) * 100}%` }}
                title={`Mastered: ${metrics.masteredSubTopics}`}
              />
              <div 
                className="bg-[#5A5650] transition-all duration-500" 
                style={{ width: `${(metrics.strongSubTopics / metrics.totalSubTopics) * 100}%` }}
                title={`Strong: ${metrics.strongSubTopics}`}
              />
              <div 
                className="bg-[#9C9589] transition-all duration-500" 
                style={{ width: `${(metrics.developingSubTopics / metrics.totalSubTopics) * 100}%` }}
                title={`Developing: ${metrics.developingSubTopics}`}
              />
              <div 
                className="bg-[#8C3A27] transition-all duration-500" 
                style={{ width: `${(metrics.weakSubTopics / metrics.totalSubTopics) * 100}%` }}
                title={`Needs Work: ${metrics.weakSubTopics}`}
              />
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#1A1A1A]/70 font-sans">
              <strong className="text-[#1A1A1A] font-semibold">{metrics.totalQuestionsAttempted}</strong> questions tested with an accuracy of{' '}
              <strong className="text-[#1A1A1A] font-semibold">{metrics.overallAccuracy}%</strong>.
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={onStartDiagnostic}
                className="px-4 py-2 bg-[#F5F2EE] hover:bg-[#EAE7E2] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors border border-[#1A1A1A]/20"
              >
                DIAGNOSTIC TEST
              </button>
              <button
                onClick={() => onNavigateTab('mock')}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                LAUNCH 200M CBT
              </button>
            </div>
          </div>
        </div>

        {/* Countdown & Action Card */}
        <div className="bg-[#EAE7E2] p-8 border border-[#1A1A1A]/10 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-[#1A1A1A]/60 text-[10px] font-bold font-sans tracking-[0.3em] uppercase mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>TIMELINE COUNTDOWN</span>
            </div>
            <div className="text-5xl sm:text-6xl font-bold font-editorial-serif text-[#1A1A1A] leading-none">
              {daysLeft} <span className="text-lg font-sans font-light opacity-60">Days Left</span>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 mt-3 leading-relaxed font-sans">
              Synchronized for the <strong>ICSI CSEET February 2027</strong> nationwide computer-based test administration.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#1A1A1A]/10">
            <button
              onClick={() => onNavigateTab('daily-plan')}
              className="w-full py-3 px-4 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>TODAY&apos;S ADAPTIVE PLAN</span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab('error-log')}
              className="w-full py-3 px-4 bg-[#F5F2EE] hover:bg-[#FFFFFF] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors border border-[#1A1A1A]/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#8C3A27]" />
                <span>ERROR VAULT</span>
              </div>
              <span className="font-mono text-[10px] opacity-60">
                {metrics.weakestSubTopics.reduce((acc, curr) => acc + curr.mistakeCount, 0)} LOGS
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Restructured Papers Grid */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
              CURRICULUM MATRIX
            </span>
            <h3 className="text-2xl font-bold font-editorial-serif text-[#1A1A1A] tracking-tight">
              The 4 Prescribed Modules
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('syllabus')}
            className="text-[10px] tracking-[0.2em] font-sans font-bold uppercase text-[#1A1A1A] hover:opacity-60 flex items-center gap-1.5 transition-opacity"
          >
            EXPLORE SYLLABUS <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {RESTRUCTURED_PAPERS.map((paper) => {
            const paperMetric = metrics.paperWiseReadiness.find(p => p.paperId === paper.id);
            const readiness = paperMetric ? paperMetric.readinessScore : 0;
            const accuracy = paperMetric ? paperMetric.averageAccuracy : 0;
            const masteredCount = paperMetric ? paperMetric.masteredCount : 0;
            const totalSubCount = paper.chapters.reduce((acc, c) => acc + c.topics.reduce((ta, t) => ta + t.subTopics.length, 0), 0);

            const firstSubTopic = paper.chapters[0]?.topics[0]?.subTopics[0];

            return (
              <div 
                key={paper.id}
                className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 shadow-xs flex flex-col justify-between space-y-6 group hover:border-[#1A1A1A]/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-wider opacity-60 mb-2">
                    <span className="font-bold uppercase">PAPER {paper.paperNumber}</span>
                    <span>{paper.totalMarks} MARKS</span>
                  </div>
                  <h4 className="font-editorial-serif font-bold text-lg text-[#1A1A1A] leading-snug">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/65 mt-2 line-clamp-2 leading-relaxed font-sans">
                    {paper.structureDescription}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#1A1A1A]/10">
                  <div>
                    <div className="flex justify-between text-[10px] font-sans font-semibold tracking-wider uppercase opacity-60 mb-1">
                      <span>Readiness</span>
                      <span className="font-mono">{readiness}%</span>
                    </div>
                    <div className="w-full bg-[#EAE7E2] h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#1A1A1A] h-1.5 transition-all duration-300"
                        style={{ width: `${readiness}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-sans text-[#1A1A1A]/70">
                    <span className="text-[11px]">Mastered:</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">
                      {masteredCount} / {totalSubCount}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-sans text-[#1A1A1A]/70">
                    <span className="text-[11px]">Avg Accuracy:</span>
                    <span className="font-mono text-[#1A1A1A]">{accuracy}%</span>
                  </div>

                  {firstSubTopic && (
                    <button
                      onClick={() => onNavigateSubTopic(firstSubTopic.id)}
                      className="w-full mt-2 py-2 px-3 bg-[#EAE7E2] hover:bg-[#1A1A1A] hover:text-[#F5F2EE] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-all flex items-center justify-center gap-1.5 border border-[#1A1A1A]/10"
                    >
                      <span>STUDY MODULE</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Areas & Remediation */}
      {metrics.weakestSubTopics.length > 0 && (
        <div className="bg-[#FFFFFF] p-8 border border-[#8C3A27]/20 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#8C3A27]" />
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold text-[#8C3A27] block">
                  PRIORITY ATTENTION
                </span>
                <h3 className="text-lg font-bold font-editorial-serif text-[#1A1A1A]">
                  Identified Weak Sub-Topics Requiring Remediation
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/10">
              {metrics.weakestSubTopics.length} TARGETS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.weakestSubTopics.slice(0, 3).map((item) => (
              <div 
                key={item.subTopicId}
                className="bg-[#F5F2EE] p-5 border border-[#1A1A1A]/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-[10px] tracking-[0.2em] font-mono uppercase opacity-50 block mb-1">
                    {item.paperName}
                  </span>
                  <h5 className="text-sm font-bold font-editorial-serif text-[#1A1A1A] leading-snug">
                    {item.subTopicTitle}
                  </h5>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#1A1A1A]/10">
                  <span className="font-mono text-[#8C3A27] font-semibold">Accuracy: {item.accuracy}%</span>
                  <button
                    onClick={() => onNavigateSubTopic(item.subTopicId)}
                    className="px-3 py-1 bg-[#8C3A27] hover:bg-[#6e2b1b] text-[#F5F2EE] text-[9px] tracking-[0.2em] font-sans font-bold uppercase transition-colors"
                  >
                    TEACH & RETEST
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Editorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => onNavigateTab('pyq')}
          className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all cursor-pointer group shadow-xs"
        >
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-40 block mb-1">01 / ARCHIVE</span>
          <h4 className="text-xl font-bold font-editorial-serif text-[#1A1A1A] group-hover:opacity-70 transition-opacity">
            PYQ Intelligence Engine
          </h4>
          <p className="text-xs text-[#1A1A1A]/70 mt-2 leading-relaxed font-sans">
            Rigorous comparative analysis separating Restructured (June 2026+) and Historical papers.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('mock')}
          className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all cursor-pointer group shadow-xs"
        >
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-40 block mb-1">02 / SIMULATION</span>
          <h4 className="text-xl font-bold font-editorial-serif text-[#1A1A1A] group-hover:opacity-70 transition-opacity">
            ICSI CBT Mock Simulator
          </h4>
          <p className="text-xs text-[#1A1A1A]/70 mt-2 leading-relaxed font-sans">
            Timed 120-minute 200-mark full simulation enforcing official sectional and aggregate passing bounds.
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('daily-plan')}
          className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all cursor-pointer group shadow-xs"
        >
          <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-40 block mb-1">03 / TRACK</span>
          <h4 className="text-xl font-bold font-editorial-serif text-[#1A1A1A] group-hover:opacity-70 transition-opacity">
            Personal Daily Study Track
          </h4>
          <p className="text-xs text-[#1A1A1A]/70 mt-2 leading-relaxed font-sans">
            Type &quot;DAY X&quot; anytime to generate personalized schedule adapted to your specific performance weaknesses.
          </p>
        </div>
      </div>

    </div>
  );
};
