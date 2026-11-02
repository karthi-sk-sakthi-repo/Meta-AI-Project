import React, { useState } from 'react';
import { ModernizationResult } from '../data/modernizationEngine';
import { LEGACY_SAMPLES } from '../data/legacySamples';
import { Code2, Copy, Check, Download, Split, Eye, FileCode, CheckCircle2 } from 'lucide-react';

interface SolidDiffViewerProps {
  result: ModernizationResult;
}

export const SolidDiffViewer: React.FC<SolidDiffViewerProps> = ({ result }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [diffMode, setDiffMode] = useState<'split' | 'modern_only'>('split');
  const [copied, setCopied] = useState(false);

  const activeModernFile = result.refactoredFiles[selectedFileIdx] || result.refactoredFiles[0];
  const sample = LEGACY_SAMPLES.find(s => s.id === result.systemId) || LEGACY_SAMPLES[0];
  const legacyFile = sample.files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeModernFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeModernFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeModernFile.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar with File Tabs & View Toggles */}
      <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Modernized Files:
          </span>
          {result.refactoredFiles.map((file, idx) => {
            const isActive = idx === selectedFileIdx;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIdx(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-850'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>{file.filename}</span>
                <span className="text-[10px] text-slate-500 font-mono">[{file.layer}]</span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setDiffMode('split')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                diffMode === 'split' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side Diff</span>
            </button>
            <button
              onClick={() => setDiffMode('modern_only')}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                diffMode === 'modern_only' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Modernized .NET 9</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.cs</span>
          </button>
        </div>
      </div>

      {/* File Description Header */}
      <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cyan-400 font-semibold">{activeModernFile.path}</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-300">{activeModernFile.description}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Target: C# 13 / .NET 9 LTS
        </div>
      </div>

      {/* Code Viewer Viewport */}
      {diffMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Legacy Monolithic C# Box */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 flex flex-col">
            <div className="bg-rose-950/40 border-b border-rose-900/60 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>BEFORE: Legacy Monolith ({sample.legacyFramework})</span>
              </div>
              <span className="text-[11px] font-mono text-rose-400">
                {sample.files[0]?.name}
              </span>
            </div>

            <div className="p-4 overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/90">
              <pre className="text-rose-200/90 whitespace-pre">
                {legacyFile ? legacyFile.code : '// Legacy source code'}
              </pre>
            </div>
          </div>

          {/* Modern Clean Architecture .NET 9 Box */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950 flex flex-col">
            <div className="bg-cyan-950/40 border-b border-cyan-900/60 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>AFTER: Modern .NET 9 Clean Architecture ({activeModernFile.layer} Layer)</span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">
                {activeModernFile.filename}
              </span>
            </div>

            <div className="p-4 overflow-x-auto max-h-[620px] font-mono text-xs leading-relaxed text-slate-200 bg-slate-950/90">
              <pre className="text-cyan-100 whitespace-pre">
                {activeModernFile.code}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* Full Modernized Code Viewport */
        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">
              {activeModernFile.path}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              SOLID Compliant · Zero Direct DB Coupling
            </span>
          </div>
          <div className="p-4 overflow-x-auto max-h-[700px] font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
            <pre className="text-cyan-100 whitespace-pre">
              {activeModernFile.code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
