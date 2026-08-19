import React, { useState } from 'react';
import { 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Calendar, 
  HelpCircle, 
  Search, 
  Sparkles, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { getDaysRemainingToExam } from '../services/storageService';

export type ActiveTab = 
  | 'dashboard'
  | 'syllabus'
  | 'pyq'
  | 'mock'
  | 'daily-plan'
  | 'error-log';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAiTutor: () => void;
  onOpenSourceModal: () => void;
  onExecuteCommand: (command: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiTutor,
  onOpenSourceModal,
  onExecuteCommand,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const daysLeft = getDaysRemainingToExam();

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim()) {
      onExecuteCommand(commandInput);
      setCommandInput('');
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'MASTERY BOARD', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'syllabus', label: 'SYLLABUS', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'pyq', label: 'PYQ INTELLIGENCE', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'mock', label: 'CBT MOCK EXAM', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'daily-plan', label: 'DAILY PLAN', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'error-log', label: 'ERROR VAULT', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F5F2EE]/95 backdrop-blur-md border-b border-[#1A1A1A]/10 text-[#1A1A1A] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Zone 1: Brand Wordmark in Artistic Flair display face */}
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="text-left group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] p-0.5"
            >
              <div className="w-8 h-8 bg-[#1A1A1A] text-[#F5F2EE] flex items-center justify-center font-serif font-bold text-sm tracking-tighter shadow-xs">
                IC
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] tracking-[0.35em] uppercase font-sans font-bold opacity-45 leading-none">
                  ICSI CSEET SYSTEM
                </span>
                <span className="font-editorial-serif font-bold text-lg text-[#1A1A1A] tracking-tight whitespace-nowrap mt-0.5">
                  FEBRUARY 2027
                </span>
              </div>
            </button>

            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] tracking-[0.2em] uppercase font-sans font-bold bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/10 whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-[#1A1A1A]" />
              RESTRUCTURED LOCK
            </span>
          </div>

          {/* Zone 2: Navigation Links (single-line uppercase tracked labels) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 text-[10px] tracking-[0.22em] font-sans font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1A1A1A] ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#F5F2EE] shadow-xs'
                      : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#EAE7E2]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Command, Countdown, AI Tutor) */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Command Prompt Form */}
            <form onSubmit={handleCommandSubmit} className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder='COMMAND (e.g. "DAY 1", "Teach me Torts")'
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-52 xl:w-64 bg-[#EAE7E2]/70 border border-[#1A1A1A]/15 py-1.5 pl-8 pr-3 text-[11px] font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A] focus:bg-[#FFFFFF] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#1A1A1A]/50 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Countdown Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#EAE7E2] border border-[#1A1A1A]/10 text-[10px] font-mono tracking-wider text-[#1A1A1A] whitespace-nowrap">
              <span className="font-bold">{daysLeft}</span>
              <span className="opacity-60">DAYS TO FEB &apos;27</span>
            </div>

            {/* Source Inspector */}
            <button
              onClick={onOpenSourceModal}
              title="Official ICSI Source Verification"
              className="p-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#EAE7E2] border border-transparent hover:border-[#1A1A1A]/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* AI Tutor Toggle */}
            <button
              onClick={onOpenAiTutor}
              className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] uppercase font-sans font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EAE7E2]" />
              <span>AI TUTOR</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1A1A1A] hover:bg-[#EAE7E2] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#EAE7E2] border-t border-[#1A1A1A]/10 px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleCommandSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder='Type "DAY 1", "Teach me ...", "PYQ", "MOCK"'
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 py-2 pl-8 pr-3 text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40"
              />
              <Search className="w-4 h-4 text-[#1A1A1A]/50 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 text-left text-[10px] tracking-[0.18em] font-sans font-bold flex items-center gap-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#1A1A1A] text-[#F5F2EE]'
                    : 'text-[#1A1A1A] bg-[#FFFFFF] hover:bg-[#F5F2EE] border border-[#1A1A1A]/10'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-between items-center text-[10px] font-mono tracking-wider opacity-60">
            <span>TARGET: CSEET FEB 2027</span>
            <span>{daysLeft} DAYS REMAINING</span>
          </div>
        </div>
      )}
    </header>
  );
};
