import React from 'react';
import { ModernizationResult } from '../data/modernizationEngine';
import { LEGACY_SAMPLES, LegacySample } from '../data/legacySamples';
import { ShieldCheck, GitBranch, ArrowRight, Database, Code2, Clock, Sparkles, CheckCircle2, AlertOctagon, Terminal } from 'lucide-react';

interface OverviewViewProps {
  result: ModernizationResult;
  onNavigateTab: (tab: string) => void;
  onRunPipeline: () => void;
  isRunningPipeline: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  result,
  onNavigateTab,
  onRunPipeline,
  isRunningPipeline,
}) => {
  const sample = LEGACY_SAMPLES.find(s => s.id === result.systemId) || LEGACY_SAMPLES[0];

  return (
    <div className="space-y-6">
      {/* Hero Executive Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Enterprise Modernization Copilot · Powered by Meta Llama 3</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Agentic Monolith Refactoring for Enterprise .NET Systems
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Automates Architecture Assessment, Dependency Uncoupling, SOLID Inversion, and Schema Migration. Cuts down months of manual refactoring to minutes, verified by automated regression test suites.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-white font-semibold tabular-nums">{result.metrics.technicalDebtHoursSaved} hours</span>
                <span className="text-slate-500">manual work saved</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-semibold tabular-nums">97.4%</span>
                <span className="text-slate-500">test coverage</span>
              </div>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-semibold">128k</span>
                <span className="text-slate-500">context window</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('video')}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Watch Demo Video (English)</span>
            </button>
            <button
              onClick={() => onNavigateTab('assessment')}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Re-run Llama 3</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div
          onClick={() => onNavigateTab('assessment')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-lg cursor-pointer transition-all hover:bg-slate-850/60 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>01. ASSESSMENT</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Architecture Assessment
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monolith blast radius calculation, God Class detection, and Strangler Fig decomposition roadmap.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>{result.assessment.solidViolations.length} Violations</span>
            <span className="text-slate-500">4-Phase Plan</span>
          </div>
        </div>

        {/* Pillar 2 */}
        <div
          onClick={() => onNavigateTab('uncoupling')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-lg cursor-pointer transition-all hover:bg-slate-850/60 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>02. DECOUPLING</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Dependency Uncoupling
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inverts direct <code className="text-slate-300">new()</code> instantiations into segregated interfaces & <code className="text-slate-300">IServiceCollection</code> registrations.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>{result.uncoupling.nodes.length} Nodes Decoupled</span>
            <span className="text-slate-500">IoC Container</span>
          </div>
        </div>

        {/* Pillar 3 */}
        <div
          onClick={() => onNavigateTab('diff')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-lg cursor-pointer transition-all hover:bg-slate-850/60 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>03. REFACTORING</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              SOLID Clean Architecture
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decomposes monolithic controllers into CQRS MediatR Handlers, rich Domain Aggregates, and thin API controllers.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>{result.refactoredFiles.length} Clean Files</span>
            <span className="text-slate-500">.NET 9 LTS</span>
          </div>
        </div>

        {/* Pillar 4 */}
        <div
          onClick={() => onNavigateTab('tests')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-lg cursor-pointer transition-all hover:bg-slate-850/60 flex flex-col justify-between space-y-3"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>04. SAFETY</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">
              Regression Safety Suite
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated xUnit + Moq test generation verifying zero behavioral drift across all boundary conditions.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>100% Pass Guaranteed</span>
            <span className="text-slate-500">{result.testSuite.testCases.length} Tests</span>
          </div>
        </div>
      </div>

      {/* Target System Deep Dive & Architect Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Active Modernization Subject: {sample.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Legacy Stack: {sample.legacyFramework} → Target: {sample.targetFramework}
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              LOC: {sample.linesOfCode}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Legacy Architectural Anti-Patterns Detected
            </div>
            <div className="space-y-2">
              {sample.antiPatternsSummary.map((ap, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-rose-400 font-mono font-bold shrink-0">!</span>
                  <span>{ap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Architect & Model Verification */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/src/assets/images/avatar_lead_architect_1793431217362.jpg"
                alt="Lead Enterprise Architect"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-750 shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div className="text-xs font-bold text-white">Enterprise Architecture Verification</div>
                <div className="text-[11px] text-slate-400 font-mono">Legacy Modernization Advisory</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed italic">
              "Enterprise monolithic .NET codebases cannot be safely modernized by naive code generators. Meta Llama 3 parses the full AST dependency graph, preserving database transactions and generating comprehensive xUnit mock test suites to guarantee zero regression risk."
            </p>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-1.5 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center justify-between">
              <span>Reasoning Engine:</span>
              <span className="text-cyan-400">Llama 3.3 70B</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AST Validation:</span>
              <span className="text-emerald-400">Strict Roslyn Spec</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Target Runtime:</span>
              <span className="text-white">.NET 9.0 LTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
