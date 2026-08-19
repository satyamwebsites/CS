import React, { useState } from 'react';
import { 
  Brain, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Layers, 
  ArrowRight, 
  HelpCircle,
  TrendingUp,
  Search
} from 'lucide-react';
import { 
  TRANSITION_WARNING_BANNER, 
  PYQ_SECTION_A, 
  PYQ_SECTION_B, 
  PYQ_SECTION_C, 
  PYQ_SECTION_D, 
  PYQ_HEATMAP_DATA
} from '../data/pyqIntelligenceData';
import { getAllSubTopics } from '../data/icsiSyllabusData';
import { PYQQuestion } from '../types';

interface PyqIntelligenceViewProps {
  onNavigateSubTopic: (subTopicId: string) => void;
}

export const PyqIntelligenceView: React.FC<PyqIntelligenceViewProps> = ({
  onNavigateSubTopic,
}) => {
  const [selectedPaperFilter, setSelectedPaperFilter] = useState<string>('ALL');
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allSubTopics = getAllSubTopics();
  
  // Aggregate all verified PYQs from subtopics
  const allVerifiedPYQs: (PYQQuestion & { subTopicTitle: string })[] = [];
  allSubTopics.forEach(st => {
    st.pyqHistory.forEach(pyq => {
      allVerifiedPYQs.push({
        ...pyq,
        subTopicTitle: st.studentFriendlyTitle,
      });
    });
  });

  const filteredPYQs = allVerifiedPYQs.filter(pyq => {
    const matchesPaper = selectedPaperFilter === 'ALL' || pyq.paperId === selectedPaperFilter;
    const matchesScheme = selectedSchemeFilter === 'ALL' || pyq.syllabusVersion === selectedSchemeFilter;
    const matchesSearch = searchQuery === '' ||
      pyq.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pyq.conceptTested.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pyq.subTopicTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPaper && matchesScheme && matchesSearch;
  });

  const filteredHeatmap = PYQ_HEATMAP_DATA.filter(item => {
    return selectedPaperFilter === 'ALL' || item.paperId === selectedPaperFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Transition Warning Banner in Editorial Format */}
      <div className="bg-[#EAE7E2] border-l-3 border-[#1A1A1A] p-8 border border-[#1A1A1A]/10 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#1A1A1A]" />
          <span className="text-[10px] font-bold font-sans uppercase tracking-[0.3em] text-[#1A1A1A]">
            {TRANSITION_WARNING_BANNER.headline}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#1A1A1A]/85 leading-relaxed font-sans max-w-4xl">
          {TRANSITION_WARNING_BANNER.message}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {TRANSITION_WARNING_BANNER.rules.map((rule, i) => (
            <div key={i} className="bg-[#FFFFFF] p-3.5 border border-[#1A1A1A]/10 text-xs font-sans text-[#1A1A1A]/85 leading-relaxed">
              • {rule}
            </div>
          ))}
        </div>
      </div>

      {/* 4-Section Authoritative Transition Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section A: Current Restructured Syllabus */}
        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F5F2EE]">
              {PYQ_SECTION_A.badge}
            </span>
            <span className="text-[10px] text-[#1A1A1A]/50 font-mono">June 2026+ Sessions</span>
          </div>
          <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
            {PYQ_SECTION_A.title}
          </h3>
          <p className="text-xs text-[#1A1A1A]/75 font-sans leading-relaxed">
            {PYQ_SECTION_A.summary}
          </p>
          <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/85 pt-2 border-t border-[#1A1A1A]/10">
            {PYQ_SECTION_A.keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section B: Historical Old Syllabus */}
        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-[0.2em] bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/20">
              {PYQ_SECTION_B.badge}
            </span>
            <span className="text-[10px] text-[#1A1A1A]/50 font-mono">2021 - May 2026</span>
          </div>
          <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
            {PYQ_SECTION_B.title}
          </h3>
          <p className="text-xs text-[#1A1A1A]/75 font-sans leading-relaxed">
            {PYQ_SECTION_B.summary}
          </p>
          <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/85 pt-2 border-t border-[#1A1A1A]/10">
            {PYQ_SECTION_B.keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#8C3A27] shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
          {PYQ_SECTION_B.caveatNote && (
            <div className="text-[11px] text-[#1A1A1A]/70 bg-[#F5F2EE] p-3 border border-[#1A1A1A]/10 font-mono">
              {PYQ_SECTION_B.caveatNote}
            </div>
          )}
        </div>

        {/* Section C: Conceptual Overlap */}
        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-[0.2em] bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/20">
              {PYQ_SECTION_C.badge}
            </span>
            <span className="text-[10px] text-[#1A1A1A]/50 font-mono">Curriculum Matrix</span>
          </div>
          <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
            {PYQ_SECTION_C.title}
          </h3>
          <p className="text-xs text-[#1A1A1A]/75 font-sans leading-relaxed">
            {PYQ_SECTION_C.summary}
          </p>
          <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/85 pt-2 border-t border-[#1A1A1A]/10">
            {PYQ_SECTION_C.keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section D: What Can & Cannot Be Inferred */}
        <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-[0.2em] bg-[#1A1A1A] text-[#F5F2EE]">
              {PYQ_SECTION_D.badge}
            </span>
            <span className="text-[10px] text-[#1A1A1A]/50 font-mono">February 2027 Guardrails</span>
          </div>
          <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
            {PYQ_SECTION_D.title}
          </h3>
          <p className="text-xs text-[#1A1A1A]/75 font-sans leading-relaxed">
            {PYQ_SECTION_D.summary}
          </p>
          <ul className="space-y-2 text-xs font-sans text-[#1A1A1A]/85 pt-2 border-t border-[#1A1A1A]/10">
            {PYQ_SECTION_D.keyInsights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Interactive Topic & Paper Heatmap */}
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
              FREQUENCY RECONNAISSANCE
            </span>
            <h3 className="text-2xl font-bold font-editorial-serif text-[#1A1A1A]">
              Verified Sub-Topic Heatmap Matrix
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-sans opacity-60">Filter Paper:</span>
            <select
              value={selectedPaperFilter}
              onChange={(e) => setSelectedPaperFilter(e.target.value)}
              className="bg-[#F5F2EE] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] px-3 py-1.5 focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="ALL">All 4 Papers</option>
              <option value="paper-1">Paper 1: Business Communication</option>
              <option value="paper-2">Paper 2: Fundamentals of Accounting</option>
              <option value="paper-3">Paper 3: Economics & Business Env.</option>
              <option value="paper-4">Paper 4: Business Laws & Management</option>
            </select>
          </div>
        </div>

        {/* Heatmap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHeatmap.map((item) => (
            <div 
              key={item.id}
              className="bg-[#F5F2EE] p-6 border border-[#1A1A1A]/10 flex flex-col justify-between space-y-4 hover:border-[#1A1A1A]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[9px] font-mono opacity-50 mb-1.5">
                  <span>{item.paperName}</span>
                  <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A]/10 font-bold uppercase text-[#1A1A1A]">
                    {item.strategicPriority}
                  </span>
                </div>
                <h4 className="text-base font-bold font-editorial-serif text-[#1A1A1A]">
                  {item.subTopicTitle}
                </h4>

                <div className="grid grid-cols-3 gap-2 bg-[#FFFFFF] p-3 border border-[#1A1A1A]/10 my-3 text-center text-xs font-sans">
                  <div>
                    <div className="text-[9px] tracking-wider uppercase opacity-45">Total PYQs</div>
                    <div className="font-bold text-[#1A1A1A] font-mono text-sm">{item.verifiedPYQCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] tracking-wider uppercase opacity-45">Restructured</div>
                    <div className="font-bold text-[#1A1A1A] font-mono text-sm">{item.restructuredCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] tracking-wider uppercase opacity-45">Historical</div>
                    <div className="font-bold text-[#1A1A1A]/60 font-mono text-sm">{item.historicalCount}</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-sans">
                  <div className="text-[#1A1A1A]/85">
                    <strong className="text-[#1A1A1A]">Examiner Focus:</strong> {item.examinerFocus}
                  </div>
                  <div className="text-[#8C3A27] bg-[#8C3A27]/5 p-2.5 border-l-2 border-[#8C3A27]">
                    <strong>Common Trap:</strong> {item.commonTrapWarning}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between text-xs font-sans">
                <span className="text-[#1A1A1A]/50 font-mono text-[10px]">
                  Sessions: {item.testedSessions.slice(0, 3).join(', ')}
                </span>
                <button
                  onClick={() => onNavigateSubTopic(item.subTopicId)}
                  className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[9px] tracking-[0.2em] font-sans font-bold uppercase transition-colors flex items-center gap-1 shadow-xs"
                >
                  <span>STUDY SUB-TOPIC</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filterable Question Bank */}
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
              ARCHIVE VAULT
            </span>
            <h3 className="text-2xl font-bold font-editorial-serif text-[#1A1A1A]">
              Verified Past Examination Questions ({filteredPYQs.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSchemeFilter}
              onChange={(e) => setSelectedSchemeFilter(e.target.value)}
              className="bg-[#F5F2EE] border border-[#1A1A1A]/20 text-xs font-sans text-[#1A1A1A] px-3 py-1.5 focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="ALL">All Syllabus Versions</option>
              <option value="RESTRUCTURED SYLLABUS">Restructured Syllabus Only</option>
              <option value="OLD SYLLABUS">Old Syllabus (Concept Overlap)</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search within past questions, case names, or tested concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F2EE] border border-[#1A1A1A]/20 py-2.5 pl-9 pr-3 text-xs font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
          />
          <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-3 pointer-events-none" />
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredPYQs.map((pyq) => (
            <div key={pyq.id} className="bg-[#F5F2EE] p-6 border border-[#1A1A1A]/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1A1A1A]/10">
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="font-bold uppercase text-[#1A1A1A]">
                    SESSION: {pyq.session} ({pyq.year})
                  </span>
                  <span>•</span>
                  <span className="opacity-60">{pyq.paperName}</span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider ${
                  pyq.syllabusVersion === 'RESTRUCTURED SYLLABUS'
                    ? 'bg-[#1A1A1A] text-[#F5F2EE]'
                    : 'bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/20'
                }`}>
                  {pyq.syllabusVersion}
                </span>
              </div>

              <p className="text-sm font-semibold text-[#1A1A1A] leading-relaxed font-sans">
                {pyq.questionText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                {pyq.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-3 border flex items-start gap-2 ${
                      opt.isCorrect
                        ? 'bg-[#EAE7E2] border-[#1A1A1A] text-[#1A1A1A] font-bold'
                        : 'bg-[#FFFFFF] border-[#1A1A1A]/10 text-[#1A1A1A]/75'
                    }`}
                  >
                    <span className="font-mono font-bold shrink-0">{opt.id.toUpperCase()})</span>
                    <span>{opt.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#FFFFFF] p-4 border border-[#1A1A1A]/10 space-y-1.5 text-xs font-sans">
                <div className="font-bold text-[#1A1A1A]">
                  ICSI Guideline Answer Analysis:
                </div>
                <p className="text-[#1A1A1A]/85 leading-relaxed">
                  {pyq.guidelineAnswerAnalysis}
                </p>
                <div className="flex justify-between items-center text-[10px] opacity-50 pt-2 border-t border-[#1A1A1A]/10 font-mono">
                  <span>Concept: {pyq.conceptTested}</span>
                  <span>Source: {pyq.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
