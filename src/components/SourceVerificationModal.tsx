import React from 'react';
import { X, ShieldCheck, ExternalLink, BookOpen, CheckCircle2 } from 'lucide-react';
import { SubTopic } from '../types';
import { RESTRUCTURED_PAPERS } from '../data/icsiSyllabusData';

interface SourceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subTopic?: SubTopic;
}

export const SourceVerificationModal: React.FC<SourceVerificationModalProps> = ({
  isOpen,
  onClose,
  subTopic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#1A1A1A]/50 backdrop-blur-xs transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#1A1A1A]/15 p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] text-[#F5F2EE] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[9px] tracking-[0.3em] font-sans font-bold uppercase opacity-45 block">
                  REGULATORY PROVENANCE
                </span>
                <h3 className="text-xl font-bold font-editorial-serif text-[#1A1A1A]">
                  Official ICSI Source Attribution
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F2EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SubTopic Specific or General Overview */}
          {subTopic ? (
            <div className="space-y-4">
              <div className="bg-[#F5F2EE] p-5 border border-[#1A1A1A]/10 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono opacity-60">
                  <span>{subTopic.learningPosition}</span>
                  <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#1A1A1A]/10 font-bold uppercase text-[#1A1A1A]">
                    {subTopic.classification}
                  </span>
                </div>

                <h4 className="text-base font-bold font-editorial-serif text-[#1A1A1A]">
                  {subTopic.studentFriendlyTitle}
                </h4>
                <div className="text-xs text-[#1A1A1A]/70 font-mono">
                  Official Title: {subTopic.officialTitle}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-[#F5F2EE] p-4 border border-[#1A1A1A]/10 space-y-1">
                  <span className="opacity-50 text-[10px] tracking-wider uppercase font-bold block">Prescribed Study Document</span>
                  <p className="text-[#1A1A1A] font-semibold">{subTopic.officialSource.documentName}</p>
                  <span className="opacity-50 text-[10px] tracking-wider uppercase font-bold block mt-2">Module / Chapter</span>
                  <p className="text-[#1A1A1A]/80 font-mono text-[11px]">{subTopic.officialSource.sectionOrPage}</p>
                </div>

                <div className="bg-[#F5F2EE] p-4 border border-[#1A1A1A]/10 space-y-1">
                  <span className="opacity-50 text-[10px] tracking-wider uppercase font-bold block">Source Classification</span>
                  <p className="text-[#1A1A1A] font-semibold">{subTopic.officialSource.sourceType}</p>
                  <span className="opacity-50 text-[10px] tracking-wider uppercase font-bold block mt-2">Verification Status</span>
                  <p className="text-[#1A1A1A]">{subTopic.officialSource.currentStatusConfirmation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#F5F2EE] p-5 border border-[#1A1A1A]/10 space-y-3">
                <h4 className="text-[10px] font-bold font-sans tracking-[0.25em] text-[#1A1A1A] uppercase">
                  The 4 Prescribed Restructured Modules:
                </h4>
                <div className="space-y-2 text-xs font-sans">
                  {RESTRUCTURED_PAPERS.map(p => (
                    <div key={p.id} className="p-3 bg-[#FFFFFF] border border-[#1A1A1A]/10 flex justify-between items-center">
                      <div>
                        <span className="font-mono opacity-50 font-bold">Paper {p.paperNumber}:</span>{' '}
                        <strong className="text-[#1A1A1A] font-editorial-serif text-sm">{p.title}</strong>
                        <div className="text-[10px] opacity-60 font-mono mt-0.5">{p.officialSource.documentName}</div>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#EAE7E2] text-[#1A1A1A] font-mono shrink-0">
                        Active Feb &apos;27
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Statutory and Verification Notice */}
          <div className="bg-[#EAE7E2] p-5 border border-[#1A1A1A]/10 text-xs font-sans text-[#1A1A1A]/85 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px]">
              <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
              <span>Strict Regulatory Adherence Guarantee</span>
            </div>
            <p className="leading-relaxed text-[#1A1A1A]/75 text-[11px]">
              All curricula, calculation models, and legal doctrines are strictly synchronized with the Institute of Company Secretaries of India (ICSI) syllabus and guidelines.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#F5F2EE] text-[10px] tracking-[0.25em] font-sans font-bold uppercase transition-all shadow-xs"
            >
              CLOSE VERIFICATION
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
