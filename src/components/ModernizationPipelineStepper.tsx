import React from 'react';
import { CheckCircle2, Circle, Clock, ArrowRight, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export interface PipelineStep {
  id: string;
  number: number;
  name: string;
  status: 'pending' | 'running' | 'completed';
  durationMs?: number;
  description: string;
}

interface ModernizationPipelineStepperProps {
  steps: PipelineStep[];
  currentStepIndex: number;
  isRunning: boolean;
  onStepClick: (stepId: string) => void;
  activeTab: string;
}

export const ModernizationPipelineStepper: React.FC<ModernizationPipelineStepperProps> = ({
  steps,
  currentStepIndex,
  isRunning,
  onStepClick,
  activeTab,
}) => {
  return (
    <div className="border-b border-slate-800 bg-slate-950 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Agentic Pipeline
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400">
            {isRunning ? 'Meta Llama 3 Agent executing refactoring steps...' : 'Modernization Completed'}
          </span>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'running' || (idx === currentStepIndex && isRunning);
            const isMappedTab = 
              (step.id === 'assessment' && activeTab === 'assessment') ||
              (step.id === 'uncoupling' && activeTab === 'uncoupling') ||
              (step.id === 'solid' && activeTab === 'diff') ||
              (step.id === 'schema' && activeTab === 'schema') ||
              (step.id === 'tests' && activeTab === 'tests');

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onStepClick(step.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                    isMappedTab
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 font-medium'
                      : isCompleted
                      ? 'text-slate-300 hover:bg-slate-900 border border-transparent'
                      : isCurrent
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium'
                      : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                  <span className="font-mono text-[11px] text-slate-400">0{step.number}</span>
                  <span className="font-sans text-[12px]">{step.name}</span>
                </button>
                {idx < steps.length - 1 && (
                  <span className="text-slate-700 text-xs select-none">›</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
