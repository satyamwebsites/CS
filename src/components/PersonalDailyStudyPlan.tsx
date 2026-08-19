import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  RotateCcw,
  Target
} from 'lucide-react';
import { DailyStudyPlan } from '../types';
import { generateAdaptiveDailyPlan, parseQuickCommand } from '../services/geminiService';
import { getDailyPlans, saveDailyPlan, getDaysRemainingToExam } from '../services/storageService';

interface PersonalDailyStudyPlanProps {
  initialDay?: number;
  onNavigateSubTopic: (subTopicId: string) => void;
}

export const PersonalDailyStudyPlan: React.FC<PersonalDailyStudyPlanProps> = ({
  initialDay = 1,
  onNavigateSubTopic,
}) => {
  const [dayNumber, setDayNumber] = useState<number>(initialDay);
  const [plan, setPlan] = useState<DailyStudyPlan | null>(null);
  const [commandInput, setCommandInput] = useState<string>('');

  const daysLeft = getDaysRemainingToExam();

  useEffect(() => {
    loadOrGeneratePlan(dayNumber);
  }, [dayNumber]);

  const loadOrGeneratePlan = (targetDay: number) => {
    const existingPlans = getDailyPlans();
    if (existingPlans[targetDay]) {
      setPlan(existingPlans[targetDay]);
    } else {
      const newPlan = generateAdaptiveDailyPlan(targetDay);
      saveDailyPlan(newPlan);
      setPlan(newPlan);
    }
  };

  const handleToggleTask = (focusIdx: number, actionIdx: number) => {
    if (!plan) return;
    const updated = { ...plan };
    const focus = updated.focusAreas[focusIdx];
    focus.isCompleted = !focus.isCompleted;

    setPlan(updated);
    saveDailyPlan(updated);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseQuickCommand(commandInput);
    if (parsed.isCommand && parsed.commandType === 'DAY_PLAN' && parsed.dayNumber) {
      setDayNumber(parsed.dayNumber);
      setCommandInput('');
    } else {
      const match = commandInput.match(/\d+/);
      if (match) {
        setDayNumber(parseInt(match[0], 10));
        setCommandInput('');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Day Selector */}
      <div className="bg-[#FFFFFF] p-8 border border-[#1A1A1A]/10 shadow-xs flex flex-col md:flex-row md:items-baseline justify-between gap-6">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-bold opacity-45 block mb-1">
            ADAPTIVE MASTERY SCHEDULE
          </span>
          <h1 className="text-3xl font-bold font-editorial-serif text-[#1A1A1A]">
            Personalized Daily Study Plan: Day {dayNumber}
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans">
            Dynamically adapted to your weakest sub-topics and ICSI syllabus progression.
          </p>
        </div>

        {/* Quick Day Selector Prompt */}
        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type 'DAY 2', 'DAY 15'..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="w-36 bg-[#F5F2EE] border border-[#1A1A1A]/20 py-2 px-3 text-xs font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.2em] font-sans font-bold uppercase transition-colors shadow-xs"
          >
            GO
          </button>
        </form>
      </div>

      {/* Quick Day Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60].map((d) => (
          <button
            key={d}
            onClick={() => setDayNumber(d)}
            className={`px-4 py-2 text-[10px] font-mono tracking-wider uppercase font-bold transition-all whitespace-nowrap ${
              dayNumber === d
                ? 'bg-[#1A1A1A] text-[#F5F2EE] shadow-xs'
                : 'bg-[#FFFFFF] text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#EAE7E2] border border-[#1A1A1A]/10'
            }`}
          >
            DAY {d}
          </button>
        ))}
      </div>

      {/* Main Day Plan Display */}
      {plan && (
        <div className="space-y-6">
          
          {/* Day Theme Overview */}
          <div className="bg-[#EAE7E2] p-6 border border-[#1A1A1A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold opacity-50 block mb-1">
                DAY OBJECTIVE & STRATEGIC FOCUS
              </span>
              <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
                {plan.theme}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#1A1A1A]">
              <div className="bg-[#FFFFFF] px-3.5 py-1.5 border border-[#1A1A1A]/10">
                Target: <strong>{plan.dailyTargetQuestions} Qs</strong>
              </div>
              <div className="bg-[#FFFFFF] px-3.5 py-1.5 border border-[#1A1A1A]/10">
                Est. Time: <strong>145 Mins</strong>
              </div>
            </div>
          </div>

          {/* Focus Areas List */}
          <div className="space-y-4">
            {plan.focusAreas.map((area, focusIdx) => (
              <div
                key={area.subTopicId}
                className="bg-[#FFFFFF] p-6 border border-[#1A1A1A]/10 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1A1A1A]/10">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
                      <span className="font-bold uppercase text-[#1A1A1A]">{area.reasonForInclusion}</span>
                      <span>•</span>
                      <span>{area.paperName}</span>
                    </div>
                    <h4 className="text-lg font-bold font-editorial-serif text-[#1A1A1A] mt-1">
                      {area.subTopicTitle}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-60 bg-[#F5F2EE] px-2.5 py-1 border border-[#1A1A1A]/10">
                      {area.recommendedTimeMinutes} Mins
                    </span>
                    <button
                      onClick={() => onNavigateSubTopic(area.subTopicId)}
                      className="px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[9px] tracking-[0.2em] font-sans font-bold uppercase transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>OPEN MODULE</span>
                    </button>
                  </div>
                </div>

                {/* Action Items List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold font-sans tracking-[0.2em] opacity-45 uppercase block">
                    Action Plan & Milestones:
                  </span>
                  <div className="space-y-2">
                    {area.actionItems.map((item, actionIdx) => (
                      <div
                        key={actionIdx}
                        onClick={() => handleToggleTask(focusIdx, actionIdx)}
                        className={`p-3.5 border text-xs font-sans cursor-pointer transition-colors flex items-start gap-3 ${
                          area.isCompleted
                            ? 'bg-[#EAE7E2] border-[#1A1A1A]/20 text-[#1A1A1A]/50 line-through'
                            : 'bg-[#F5F2EE] border-[#1A1A1A]/10 hover:border-[#1A1A1A]/30 text-[#1A1A1A]'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                          area.isCompleted ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/30'
                        }`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
