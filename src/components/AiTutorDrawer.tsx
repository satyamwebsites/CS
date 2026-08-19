import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { SubTopic } from '../types';
import { AiTutorMessage, askAiTutor, parseQuickCommand } from '../services/geminiService';

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubTopic?: SubTopic;
  onNavigateSubTopic: (subTopicId: string) => void;
  onExecuteCommand: (cmd: string) => void;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  activeSubTopic,
  onNavigateSubTopic,
  onExecuteCommand,
}) => {
  const [messages, setMessages] = useState<AiTutorMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### ICSI CSEET February 2027 Learning Assistant
Welcome! I am strictly aligned with the **Restructured CSEET Syllabus (June 2026 onwards)** prescribed by ICSI.

**How can I assist your preparation today?**
- Clarify difficult accounting concepts (AS-1, Depreciation methods, BRS).
- Explain landmark case precedents (Ashby v. White, Gloucester Grammar, Haynes v. Harwood).
- Break down macroeconomic aggregate conversions (GDP_MP to NNP_FC).
- Solve grammatical concord questions (neither/nor, parenthetical phrases).
- Type \`Teach me [topic]\`, \`DAY [number]\`, \`PYQ\`, or \`MOCK\` for instant navigation.`,
      timestamp: new Date().toISOString(),
      sourceCitations: ['ICSI Restructured CSEET Study Material (June 2026+)'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    // Check for special commands
    const parsed = parseQuickCommand(textToSend);
    if (parsed.isCommand) {
      onExecuteCommand(textToSend);
      if (parsed.feedbackMessage) {
        setMessages(prev => [
          ...prev,
          {
            id: `usr-${Date.now()}`,
            role: 'user',
            content: textToSend,
            timestamp: new Date().toISOString(),
          },
          {
            id: `cmd-${Date.now()}`,
            role: 'assistant',
            content: `**Command Executed:** ${parsed.feedbackMessage}`,
            timestamp: new Date().toISOString(),
          },
        ]);
        setInputText('');
        return;
      }
    }

    const userMsg: AiTutorMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const response = await askAiTutor(textToSend, messages, activeSubTopic);
      const assistantMsg: AiTutorMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
        sourceCitations: response.sourceCitations,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg: AiTutorMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error connecting to the official reasoning engine. Please consult the prescribed ICSI module or try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Explain AS-1 Going Concern departure disclosure rule',
    'What is the difference between Injuria Sine Damno and Damnum Sine Injuria?',
    'Show the formula to convert GDP at Market Price to NNP at Factor Cost',
    'Explain the Subject-Verb Concord rule for "along with" and "together with"',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md xl:max-w-lg bg-[#F5F2EE] border-l border-[#1A1A1A]/15 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-[#EAE7E2]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1A1A1A] text-[#F5F2EE] flex items-center justify-center font-bold text-xs shadow-xs">
                AI
              </div>
              <div>
                <h3 className="text-sm font-bold font-editorial-serif text-[#1A1A1A] flex items-center gap-2">
                  <span>ICSI CSEET AI Tutor</span>
                  <span className="px-2 py-0.5 text-[8px] font-sans font-bold bg-[#1A1A1A] text-[#F5F2EE] uppercase tracking-wider">
                    FEB &apos;27 LOCKED
                  </span>
                </h3>
                <p className="text-[10px] text-[#1A1A1A]/60 font-mono">
                  {activeSubTopic ? `Active: ${activeSubTopic.studentFriendlyTitle}` : 'Full Syllabus Mode'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#FFFFFF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 bg-[#1A1A1A] text-[#F5F2EE] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    IC
                  </div>
                )}

                <div
                  className={`p-4 max-w-[85%] space-y-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#1A1A1A] text-[#F5F2EE]'
                      : 'bg-[#FFFFFF] border border-[#1A1A1A]/10 text-[#1A1A1A] shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {m.content}
                  </div>

                  {m.sourceCitations && m.sourceCitations.length > 0 && (
                    <div className="pt-2 border-t border-[#1A1A1A]/10 text-[10px] text-[#1A1A1A]/60 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#1A1A1A] shrink-0" />
                      <span className="truncate">Source: {m.sourceCitations[0]}</span>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 bg-[#EAE7E2] text-[#1A1A1A] border border-[#1A1A1A]/20 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-[10px]">
                    U
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 text-xs justify-start">
                <div className="w-6 h-6 bg-[#1A1A1A] text-[#F5F2EE] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 animate-pulse">
                  IC
                </div>
                <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 p-3.5 text-[#1A1A1A]/60 flex items-center gap-2 font-mono text-[11px]">
                  <div className="w-1.5 h-1.5 bg-[#1A1A1A] animate-ping" />
                  <span>Consulting official ICSI study material...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-6 py-2.5 bg-[#EAE7E2] border-t border-[#1A1A1A]/10 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1 bg-[#FFFFFF] hover:bg-[#F5F2EE] border border-[#1A1A1A]/15 text-[10px] font-sans text-[#1A1A1A] transition-colors shrink-0 flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3 text-[#1A1A1A]" />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Bottom Input Form */}
          <div className="p-4 border-t border-[#1A1A1A]/10 bg-[#EAE7E2]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask any doubt or type command (e.g. DAY 1, Teach me ...)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#FFFFFF] border border-[#1A1A1A]/20 px-3.5 py-2 text-xs font-sans text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-none focus:border-[#1A1A1A]"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-4 py-2 bg-[#1A1A1A] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-[#F5F2EE] text-xs font-bold font-sans uppercase transition-colors flex items-center gap-1 shadow-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
