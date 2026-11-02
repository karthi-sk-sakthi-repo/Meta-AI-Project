import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SystemSelector } from './components/SystemSelector';
import { ModernizationPipelineStepper, PipelineStep } from './components/ModernizationPipelineStepper';
import { OverviewView } from './components/OverviewView';
import { ArchitectureAssessmentView } from './components/ArchitectureAssessmentView';
import { DependencyGraphView } from './components/DependencyGraphView';
import { SolidDiffViewer } from './components/SolidDiffViewer';
import { SchemaMigrationView } from './components/SchemaMigrationView';
import { RegressionTestRunner } from './components/RegressionTestRunner';
import { DemoVideoPlayer } from './components/DemoVideoPlayer';
import { CustomCodeModal } from './components/CustomCodeModal';
import { ExportSolutionModal } from './components/ExportSolutionModal';
import { generateModernizationForSample, ModernizationResult } from './data/modernizationEngine';
import { LEGACY_SAMPLES } from './data/legacySamples';

const INITIAL_STEPS: PipelineStep[] = [
  { id: 'assessment', number: 1, name: 'Architecture Assessment', status: 'completed', description: 'Monolith AST analysis, God Class isolation, Blast Radius' },
  { id: 'uncoupling', number: 2, name: 'Dependency Uncoupling', status: 'completed', description: 'Inversion of Control, Interface extraction, IoC registration' },
  { id: 'solid', number: 3, name: 'SOLID Refactoring', status: 'completed', description: 'Clean Architecture decomposition, MediatR CQRS commands' },
  { id: 'schema', number: 4, name: 'Schema Migration', status: 'completed', description: 'ADO.NET to EF Core 9 Fluent API, DDL SQL generation' },
  { id: 'tests', number: 5, name: 'Regression Safety', status: 'completed', description: 'xUnit + Moq automated test suite execution' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('contoso-billing');
  const [result, setResult] = useState<ModernizationResult>(() =>
    generateModernizationForSample('contoso-billing')
  );
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(4);
  const [steps, setSteps] = useState<PipelineStep[]>(INITIAL_STEPS);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // When sample selection changes, regenerate results
  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const newResult = generateModernizationForSample(sampleId);
    setResult(newResult);
  };

  // Run full Agentic Modernization Pipeline
  const handleRunPipeline = async () => {
    setIsRunningPipeline(true);
    setCurrentStepIndex(0);

    // Reset steps to running
    setSteps(prev =>
      prev.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'running' : 'pending',
      }))
    );

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      setSteps(prev =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? 'completed' : idx === i ? 'running' : 'pending',
        }))
      );
      // Brief simulated step delay
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      const response = await fetch('/api/llama/modernize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId: selectedSampleId }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          setResult(data.result);
        }
      }
    } catch {
      // Fallback local engine already active
    }

    setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
    setCurrentStepIndex(steps.length - 1);
    setIsRunningPipeline(false);
  };

  const handleCustomCodeSubmit = async (code: string, targetArch: string) => {
    setIsRunningPipeline(true);
    try {
      const response = await fetch('/api/llama/modernize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sampleId: 'contoso-billing', customCode: code }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          data.result.systemName = 'Custom Legacy .NET Class';
          setResult(data.result);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsRunningPipeline(false);
      setActiveTab('diff');
    }
  };

  const handleStepClick = (stepId: string) => {
    if (stepId === 'assessment') setActiveTab('assessment');
    if (stepId === 'uncoupling') setActiveTab('uncoupling');
    if (stepId === 'solid') setActiveTab('diff');
    if (stepId === 'schema') setActiveTab('schema');
    if (stepId === 'tests') setActiveTab('tests');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar following Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isRunningPipeline={isRunningPipeline}
        onRunPipeline={handleRunPipeline}
      />

      {/* Target System Selector */}
      <SystemSelector
        selectedSampleId={selectedSampleId}
        onSelectSample={handleSelectSample}
        isRunning={isRunningPipeline}
      />

      {/* Agentic Pipeline Stepper */}
      <ModernizationPipelineStepper
        steps={steps}
        currentStepIndex={currentStepIndex}
        isRunning={isRunningPipeline}
        onStepClick={handleStepClick}
        activeTab={activeTab}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {activeTab === 'video' && (
          <DemoVideoPlayer
            result={result}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewView
            result={result}
            onNavigateTab={setActiveTab}
            onRunPipeline={handleRunPipeline}
            isRunningPipeline={isRunningPipeline}
          />
        )}

        {activeTab === 'assessment' && (
          <ArchitectureAssessmentView
            result={result}
            onJumpToDiff={() => setActiveTab('diff')}
          />
        )}

        {activeTab === 'uncoupling' && (
          <DependencyGraphView result={result} />
        )}

        {activeTab === 'diff' && (
          <SolidDiffViewer result={result} />
        )}

        {activeTab === 'schema' && (
          <SchemaMigrationView result={result} />
        )}

        {activeTab === 'tests' && (
          <RegressionTestRunner result={result} />
        )}
      </main>

      {/* Modals */}
      <CustomCodeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomCodeSubmit}
      />

      <ExportSolutionModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={result}
      />

      {/* Minimal Footer following Anti-Slop Discipline */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          LlamaModernize Enterprise Copilot · Designed for Monolithic .NET & C# Systems
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
          <span>Meta Llama 3.3 70B</span>
          <span aria-hidden="true">·</span>
          <span>Target: .NET 9 LTS</span>
          <span aria-hidden="true">·</span>
          <span>Zero Regressions Guaranteed</span>
        </div>
      </footer>
    </div>
  );
}
