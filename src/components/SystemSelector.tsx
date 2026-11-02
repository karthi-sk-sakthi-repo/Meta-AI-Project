import React from 'react';
import { LEGACY_SAMPLES, LegacySample } from '../data/legacySamples';
import { Database, Server, Cpu, ShieldAlert, Clock, ArrowRight } from 'lucide-react';

interface SystemSelectorProps {
  selectedSampleId: string;
  onSelectSample: (sampleId: string) => void;
  isRunning: boolean;
}

export const SystemSelector: React.FC<SystemSelectorProps> = ({
  selectedSampleId,
  onSelectSample,
  isRunning,
}) => {
  return (
    <div className="border-b border-slate-800 bg-slate-900/40 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">
              Select Enterprise Legacy Target
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pre-configured enterprise monolithic codebases loaded with typical architectural anti-patterns.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Powered by Meta Llama 3</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">128k Context Window</span>
            <span aria-hidden="true">·</span>
            <span>Target: .NET 9 LTS</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {LEGACY_SAMPLES.map((sample) => {
            const isSelected = sample.id === selectedSampleId;
            return (
              <button
                key={sample.id}
                onClick={() => !isRunning && onSelectSample(sample.id)}
                disabled={isRunning}
                className={`text-left p-3.5 rounded-lg border transition-all relative ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-sm shadow-cyan-950'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                } ${isRunning ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {sample.id === 'contoso-billing' ? (
                      <Database className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : sample.id === 'healthcare-ehr' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <h3 className="text-xs font-semibold text-white truncate">
                      {sample.name}
                    </h3>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-cyan-400 font-bold shrink-0">
                      Active Target
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {sample.description}
                </p>

                {/* Clean unboxed metadata with separators */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="tabular-nums font-semibold text-slate-300">
                      {sample.technicalDebtHours}h
                    </span>
                    <span className="text-slate-500">debt</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span className="tabular-nums text-rose-400">
                      {sample.couplingIndex}%
                    </span>
                    <span className="text-slate-500">coupling</span>
                  </div>
                  <div className="text-[11px] text-cyan-400 font-sans">
                    {sample.legacyFramework.split('/')[0].trim()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
