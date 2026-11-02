import React from 'react';
import { ModernizationResult } from '../data/modernizationEngine';
import { ShieldAlert, AlertTriangle, TrendingDown, ArrowUpRight, CheckCircle2, Layers, Milestone, Clock } from 'lucide-react';

interface ArchitectureAssessmentViewProps {
  result: ModernizationResult;
  onJumpToDiff: () => void;
}

export const ArchitectureAssessmentView: React.FC<ArchitectureAssessmentViewProps> = ({
  result,
  onJumpToDiff,
}) => {
  const { metrics, assessment } = result;

  return (
    <div className="space-y-6">
      {/* KPI Metric Strip - 4 clean columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Technical Debt Hours Saved</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {metrics.technicalDebtHoursSaved}h
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              ~${(metrics.estimatedCostSavedUsd / 1000).toFixed(0)}k Saved
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Based on 3.5 engineer months manual refactoring baseline
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Coupling Index Reduction</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-400 line-through mr-1">
              {metrics.legacyCouplingIndex}%
            </span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {metrics.modernCouplingIndex}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            -{(metrics.legacyCouplingIndex - metrics.modernCouplingIndex)}% reduction via Clean Architecture DI
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Maintainability Index</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {metrics.maintainabilityIndexAfter}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
            <span className="text-xs text-emerald-400 font-mono">
              (+{(metrics.maintainabilityIndexAfter - metrics.maintainabilityIndexBefore)} pts)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Transformed from unmaintainable red zone to enterprise grade
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg">
          <div className="text-xs text-slate-400 font-medium">Blast Radius Risk Level</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              {assessment.blastRadiusLevel}
            </span>
            <span className="text-xs font-mono text-slate-400">
              ({assessment.blastRadiusScore}/100)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            God Class directly mutates 4 core enterprise data boundaries
          </div>
        </div>
      </div>

      {/* Modernization Architectural Blueprint & Summary */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Enterprise Decomposition Architecture & Strangler Fig Model
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeted transition from monolithic coupled layers to isolated bounded contexts.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>Model: {result.llamaModel}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-800">
          <div className="lg:col-span-7 bg-slate-950 p-4 flex flex-col justify-center">
            <div className="relative rounded border border-slate-800 overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
              <img
                src="/src/assets/images/arch_modernization_schematic_1793431219135.jpg"
                alt="Enterprise Architecture Modernization Schematic"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-4 pointer-events-none">
                <span className="text-xs font-mono text-slate-300">
                  Strangler Fig: Monolith Decomposition → Event-Driven Clean Microservices
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono mb-1">
                Executive Synthesis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {assessment.summary}
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="text-xs font-medium text-slate-300">Identified God Entities & Singletons:</div>
              <div className="space-y-1">
                {assessment.godClasses.map((gc, i) => (
                  <div key={i} className="text-xs font-mono text-rose-300 flex items-center gap-1.5">
                    <span className="text-rose-500">⚠</span>
                    <span>{gc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <button
                onClick={onJumpToDiff}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors"
              >
                <span>View Full Refactored .NET 9 Code</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOLID Violations Audit Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              SOLID Principle Violations & Static Analysis Audit
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detected anti-patterns with severity rating and automated remediation rules.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {assessment.solidViolations.length} Violations Remediated
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Principle</th>
                <th className="py-2.5 px-4 font-semibold">Violation Pattern</th>
                <th className="py-2.5 px-4 font-semibold">Location</th>
                <th className="py-2.5 px-4 font-semibold">Severity</th>
                <th className="py-2.5 px-4 font-semibold">Automated Modernization Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {assessment.solidViolations.map((v, i) => (
                <tr key={i} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {v.principle}
                  </td>
                  <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                    {v.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {v.location}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`font-mono text-[11px] font-semibold ${
                        v.severity === 'Critical'
                          ? 'text-rose-400'
                          : v.severity === 'High'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {v.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 leading-relaxed">
                    {v.modernRemedy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strangler Fig Roadmap */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Enterprise Strangler Fig Migration Roadmap
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Phased migration schedule designed to prevent system downtime and regressions.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Estimated Rollout: 9 Weeks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assessment.stranglerFigRoadmap.map((p) => (
            <div key={p.phase} className="border border-slate-800 bg-slate-950/60 p-4 rounded-lg flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-1">
                  <span>Phase 0{p.phase}</span>
                  <span className="text-slate-500">{p.duration}</span>
                </div>
                <h4 className="text-xs font-semibold text-white mb-1.5">
                  {p.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {p.objective}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                  Tactics
                </div>
                {p.tactics.map((t, idx) => (
                  <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                    <span className="text-cyan-500 shrink-0">·</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300 font-medium">
                Deliverable: {p.deliverable}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
