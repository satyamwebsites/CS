import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Layers, 
  ChevronRight, 
  HelpCircle,
  Award
} from 'lucide-react';
import { RESTRUCTURED_PAPERS, getAllSubTopics } from '../data/icsiSyllabusData';
import { getProgressMap } from '../services/storageService';
import { SubTopic, Paper } from '../types';

interface SyllabusBrowserProps {
  onSelectSubTopic: (subTopicId: string) => void;
  onOpenSourceModal: (subTopic?: SubTopic) => void;
}

export const SyllabusBrowser: React.FC<SyllabusBrowserProps> = ({
  onSelectSubTopic,
  onOpenSourceModal,
}) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string>('paper-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const progressMap = getProgressMap();

  const activePaper = RESTRUCTURED_PAPERS.find(p => p.id === selectedPaperId) || RESTRUCTURED_PAPERS[0];
  const allSubTopics = getAllSubTopics();

  // Search filter across all subtopics or paper
  const filteredSubTopics = searchQuery.trim() === ''
    ? []
    : allSubTopics.filter(st => 
        st.studentFriendlyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.officialTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.learningPosition.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1A1A1A]/10">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
            ICSI REGULATORY REPOSITORY
          </span>
          <h1 className="text-3xl font-bold font-editorial-serif text-[#1A1A1A] tracking-tight">
            Restructured Syllabus Competency Tree
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 max-w-2xl font-sans">
            Every module strictly verified against official ICSI study materials for June 2026 onwards.
          </p>
        </div>

        {/* Search within Syllabus */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search topics, laws, standards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 py-2.5 pl-9 pr-4 text-xs font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
          />
          <Search className="w-4 h-4 text-[#1A1A1A]/40 absolute left-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Global Search Results If Query Active */}
      {searchQuery.trim() !== '' ? (
        <div className="space-y-4">
          <div className="text-xs font-sans font-bold tracking-[0.2em] uppercase opacity-60">
            Search Results ({filteredSubTopics.length} Sub-Topics Found)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSubTopics.map(st => {
              const prog = progressMap[st.id];
              return (
                <div
                  key={st.id}
                  onClick={() => onSelectSubTopic(st.id)}
                  className="bg-[#FFFFFF] p-5 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all cursor-pointer flex flex-col justify-between space-y-3 group shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono opacity-50 mb-1">
                      <span>{st.learningPosition}</span>
                      <span className="uppercase">{prog?.status || 'NOT STARTED'}</span>
                    </div>
                    <h4 className="text-base font-bold font-editorial-serif text-[#1A1A1A] group-hover:opacity-75 transition-opacity">
                      {st.studentFriendlyTitle}
                    </h4>
                    <p className="text-xs text-[#1A1A1A]/70 mt-1 line-clamp-2 font-sans">
                      {st.whatItMeans}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]/10 text-xs font-sans">
                    <span className="font-mono text-[10px] opacity-60">
                      {st.depthTestQuestions.length} Questions • {st.pyqHistory.length} PYQs
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#1A1A1A] flex items-center gap-1">
                      OPEN MODULE <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Regular Tabbed Paper Syllabus View */
        <div className="space-y-8">
          
          {/* Paper Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RESTRUCTURED_PAPERS.map((p) => {
              const isSelected = p.id === selectedPaperId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPaperId(p.id)}
                  className={`p-4 text-left border transition-all ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-[#F5F2EE] border-[#1A1A1A] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#1A1A1A] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30'
                  }`}
                >
                  <div className={`text-[9px] font-mono tracking-widest uppercase mb-1 ${isSelected ? 'opacity-60' : 'opacity-40'}`}>
                    PAPER {p.paperNumber} • {p.totalMarks} MARKS
                  </div>
                  <div className="font-editorial-serif font-bold text-base leading-snug">
                    {p.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Paper Overview Card */}
          <div className="bg-[#EAE7E2] p-6 border border-[#1A1A1A]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1">
              <span className="text-[9px] tracking-[0.3em] font-sans font-bold uppercase opacity-50 block">
                ACTIVE PAPER BLUEPRINT
              </span>
              <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
                Paper {activePaper.paperNumber}: {activePaper.officialTitle}
              </h3>
              <p className="text-xs text-[#1A1A1A]/75 max-w-3xl leading-relaxed font-sans">
                {activePaper.structureDescription}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenSourceModal(activePaper.chapters[0]?.topics[0]?.subTopics[0])}
                className="px-3.5 py-2 bg-[#FFFFFF] hover:bg-[#F5F2EE] text-[#1A1A1A] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors border border-[#1A1A1A]/20 flex items-center gap-1.5 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>VERIFY ICSI SOURCE</span>
              </button>
            </div>
          </div>

          {/* Chapters & Topics List */}
          <div className="space-y-6">
            {activePaper.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-[#FFFFFF] border border-[#1A1A1A]/10 overflow-hidden shadow-xs"
              >
                {/* Chapter Title Bar */}
                <div className="bg-[#EAE7E2] px-6 py-4 border-b border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[10px] font-mono tracking-wider font-bold opacity-50 uppercase">
                      CHAPTER {chapter.chapterNumber}
                    </span>
                    <h4 className="text-base font-bold font-editorial-serif text-[#1A1A1A]">
                      {chapter.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono opacity-50 self-start sm:self-auto">
                    Weightage: ~{chapter.weightageEstimatedMarks} Marks
                  </span>
                </div>

                {/* Topics & SubTopics inside this chapter */}
                <div className="divide-y divide-[#1A1A1A]/10">
                  {chapter.topics.map((topic) => (
                    <div key={topic.id} className="p-6 space-y-4">
                      <div>
                        <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-bold opacity-40 block mb-0.5">
                          TOPIC UNIT
                        </span>
                        <h5 className="text-sm font-bold font-editorial-serif text-[#1A1A1A]">
                          {topic.title}
                        </h5>
                      </div>

                      {/* Sub-Topics Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {topic.subTopics.map((st) => {
                          const prog = progressMap[st.id];
                          const isMastered = prog?.status === 'MASTERED';

                          return (
                            <div
                              key={st.id}
                              onClick={() => onSelectSubTopic(st.id)}
                              className="bg-[#F5F2EE] p-5 border border-[#1A1A1A]/10 hover:border-[#1A1A1A] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                            >
                              <div>
                                <div className="flex items-center justify-between text-[9px] font-mono opacity-50 mb-1.5">
                                  <span className="truncate max-w-[200px]">{st.learningPosition}</span>
                                  <span className={`px-2 py-0.5 font-bold uppercase tracking-wider ${
                                    isMastered 
                                      ? 'bg-[#1A1A1A] text-[#F5F2EE]' 
                                      : 'bg-[#EAE7E2] text-[#1A1A1A]'
                                  }`}>
                                    {prog?.status || 'NOT STARTED'}
                                  </span>
                                </div>

                                <h6 className="text-sm font-bold font-editorial-serif text-[#1A1A1A] leading-snug group-hover:opacity-75 transition-opacity">
                                  {st.studentFriendlyTitle}
                                </h6>

                                <p className="text-xs text-[#1A1A1A]/70 mt-2 line-clamp-2 leading-relaxed font-sans">
                                  {st.whatItMeans}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]/10 text-xs font-sans">
                                <div className="flex items-center gap-3 text-[10px] font-mono opacity-60">
                                  <span>20 Qs Depth Test</span>
                                  <span>•</span>
                                  <span>{st.pyqHistory.length} PYQs</span>
                                </div>

                                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#1A1A1A] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                  <span>STUDY</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
