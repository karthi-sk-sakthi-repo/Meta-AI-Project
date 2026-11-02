import React from 'react';
import { Sparkles, Terminal, Code2, Download, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCustomModal: () => void;
  onOpenExportModal: () => void;
  isRunningPipeline: boolean;
  onRunPipeline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomModal,
  onOpenExportModal,
  isRunningPipeline,
  onRunPipeline,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap">
          <span className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-sm">
            λ
          </span>
          <span>LlamaModernize</span>
        </a>
        <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">
          Meta Llama 3 Enterprise Copilot
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => setActiveTab('video')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
            activeTab === 'video'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'text-amber-300/90 hover:text-amber-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Demo Video</span>
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'overview'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('assessment')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'assessment'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-slate-200'
          }`}
        >
          Assessment & Roadmap
        </button>
        <button
          onClick={() => setActiveTab('uncoupling')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'uncoupling'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-slate-200'
          }`}
        >
          Dependency Graph
        </button>
        <button
          onClick={() => setActiveTab('diff')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'diff'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-slate-200'
          }`}
        >
          SOLID Refactoring
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'schema'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-slate-200'
          }`}
        >
          Schema Migration
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'tests'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-slate-200'
          }`}
        >
          Regression Safety
        </button>
      </nav>

      {/* Zone 3: 1 primary action with secondary triggers */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenCustomModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Paste custom C# legacy code"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Paste Custom C#</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Export modernized solution"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export .NET 9</span>
        </button>

        <button
          onClick={onRunPipeline}
          disabled={isRunningPipeline}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            isRunningPipeline
              ? 'bg-cyan-700 text-white cursor-wait opacity-80'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/20 active:scale-[0.98]'
          }`}
        >
          {isRunningPipeline ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Modernizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modernize System</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
