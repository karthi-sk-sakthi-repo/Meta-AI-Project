import React, { useState } from 'react';
import { ModernizationResult } from '../data/modernizationEngine';
import { Database, ShieldCheck, ArrowRight, Copy, Check, Download, Layers } from 'lucide-react';

interface SchemaMigrationViewProps {
  result: ModernizationResult;
}

export const SchemaMigrationView: React.FC<SchemaMigrationViewProps> = ({ result }) => {
  const { schemaMigration } = result;
  const [activeTab, setActiveTab] = useState<'efcore' | 'sql_script' | 'comparison'>('efcore');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Automated Data Layer & Schema Migration</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Migrates raw, unmanaged ADO.NET SQL calls and stored procedure dependencies to typed EF Core 9 DbContexts with idempotent DDL migrations.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('efcore')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'efcore'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EF Core 9 Fluent API
          </button>
          <button
            onClick={() => setActiveTab('sql_script')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'sql_script'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Generated SQL Migration Script
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'comparison'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Legacy vs Modern DDL
          </button>
        </div>
      </div>

      {/* Migration Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
          <div className="text-xs font-mono text-cyan-400 mb-1">Concurrency Protection</div>
          <div className="text-xs text-slate-200 font-semibold mb-1">Optimistic Locking via RowVersion</div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Eliminated database race conditions by adding byte[] RowVersion concurrency tokens with automatic rollback.
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
          <div className="text-xs font-mono text-emerald-400 mb-1">Index Optimization</div>
          <div className="text-xs text-slate-200 font-semibold mb-1">Composite & Unique Indexes</div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Added nonclustered indexes on foreign keys (CustomerId) and unique index on TransactionReference to prevent duplicate billing.
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
          <div className="text-xs font-mono text-amber-400 mb-1">Connection Resiliency</div>
          <div className="text-xs text-slate-200 font-semibold mb-1">Automatic Transient Fault Retries</div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
            Configured EF Core EnableRetryOnFailure to transparently handle Azure SQL / SQL Server network timeouts.
          </div>
        </div>
      </div>

      {/* Code Display Area */}
      {activeTab === 'efcore' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">
              src/Infrastructure/Data/Configurations/OrderConfiguration.cs
            </span>
            <button
              onClick={() => handleCopy(schemaMigration.modernDbContextCode)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy C#'}</span>
            </button>
          </div>
          <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs leading-relaxed text-slate-200">
            <pre className="text-cyan-100">{schemaMigration.modernDbContextCode}</pre>
          </div>
        </div>
      )}

      {activeTab === 'sql_script' && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-300">
              migrations/20261031_DecomposeOrdersTable.sql
            </span>
            <button
              onClick={() => handleCopy(schemaMigration.sqlMigrationScript)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs leading-relaxed text-slate-200">
            <pre className="text-amber-100">{schemaMigration.sqlMigrationScript}</pre>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
            <div className="p-3 bg-rose-950/40 border-b border-rose-900/60 text-xs font-mono text-rose-300 flex items-center justify-between">
              <span>LEGACY ADO.NET SQL (Fragile & Unmanaged)</span>
            </div>
            <div className="p-4 font-mono text-xs text-rose-200/90 leading-relaxed overflow-x-auto">
              <pre>{schemaMigration.legacySqlSnippet}</pre>
            </div>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
            <div className="p-3 bg-cyan-950/40 border-b border-cyan-900/60 text-xs font-mono text-cyan-300 flex items-center justify-between">
              <span>MODERN EF CORE 9 IDEMPOTENT DDL MIGRATION</span>
            </div>
            <div className="p-4 font-mono text-xs text-cyan-100 leading-relaxed overflow-x-auto">
              <pre>{schemaMigration.sqlMigrationScript}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
