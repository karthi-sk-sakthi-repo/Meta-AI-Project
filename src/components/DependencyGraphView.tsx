import React, { useState } from 'react';
import { ModernizationResult } from '../data/modernizationEngine';
import { GitBranch, Layers, ArrowRight, CheckCircle2, Shield, Info, Copy, Check } from 'lucide-react';

interface DependencyGraphViewProps {
  result: ModernizationResult;
}

export const DependencyGraphView: React.FC<DependencyGraphViewProps> = ({ result }) => {
  const { uncoupling } = result;
  const [selectedNodeId, setSelectedNodeId] = useState<string>('med_cmd');
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState<'clean' | 'legacy_comparison'>('clean');

  const selectedNode = uncoupling.nodes.find(n => n.id === selectedNodeId) || uncoupling.nodes[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(uncoupling.serviceRegistrationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Node layer coordinates for SVG visualization
  const layerYCoordinates: Record<string, number> = {
    Presentation: 50,
    Application: 130,
    Domain: 210,
    Infrastructure: 290,
    Legacy: 370,
  };

  return (
    <div className="space-y-6">
      {/* Overview bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>Dependency Inversion & Coupling Topology</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {uncoupling.summary}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setViewMode('clean')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              viewMode === 'clean'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Clean Architecture Decoupled
          </button>
          <button
            onClick={() => setViewMode('legacy_comparison')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              viewMode === 'legacy_comparison'
                ? 'bg-rose-950 text-rose-300 border border-rose-800 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Legacy Tightly Coupled Topology
          </button>
        </div>
      </div>

      {/* Interactive Visual Graph Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
            <span>Dependency Directed Acyclic Graph (DAG)</span>
            <span className="text-[11px] text-slate-500">Click any node to inspect interfaces</span>
          </div>

          <div className="relative w-full h-[400px] border border-slate-900 rounded bg-slate-950 overflow-hidden flex items-center justify-center">
            {/* SVG Interactive Architecture Graph */}
            <svg className="w-full h-full" viewBox="0 0 760 400">
              <defs>
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
                <marker
                  id="arrow-rose"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
                <marker
                  id="arrow-emerald"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Layer background lanes */}
              {viewMode === 'clean' ? (
                <>
                  <rect x="10" y="20" width="740" height="70" rx="4" fill="#0f172a" fillOpacity="0.5" stroke="#1e293b" />
                  <text x="25" y="40" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">PRESENTATION / API LAYER</text>

                  <rect x="10" y="105" width="740" height="85" rx="4" fill="#0f172a" fillOpacity="0.5" stroke="#1e293b" />
                  <text x="25" y="125" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">APPLICATION LAYER (INTERFACES & COMMANDS)</text>

                  <rect x="10" y="205" width="740" height="75" rx="4" fill="#0f172a" fillOpacity="0.5" stroke="#1e293b" />
                  <text x="25" y="225" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">DOMAIN LAYER (AGGREGATE ROOTS)</text>

                  <rect x="10" y="295" width="740" height="85" rx="4" fill="#0f172a" fillOpacity="0.5" stroke="#1e293b" />
                  <text x="25" y="315" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">INFRASTRUCTURE LAYER (EF CORE 9 / ADAPTERS)</text>

                  {/* Clean Edges */}
                  {/* API to Command */}
                  <line x1="380" y1="80" x2="380" y2="135" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />

                  {/* Command to Interfaces */}
                  <path d="M 380 165 L 180 165" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />
                  <path d="M 380 165 L 580 165" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />
                  <line x1="380" y1="165" x2="380" y2="230" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow-cyan)" />

                  {/* Repositories implementing interfaces */}
                  <line x1="180" y1="320" x2="180" y2="185" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow-emerald)" />
                  <line x1="580" y1="320" x2="580" y2="185" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrow-emerald)" />

                  {/* Node Boxes */}
                  {/* OrdersController */}
                  <g onClick={() => setSelectedNodeId('api_ctrl')} className="cursor-pointer">
                    <rect x="290" y="45" width="180" height="36" rx="6" fill={selectedNodeId === 'api_ctrl' ? '#083344' : '#1e293b'} stroke="#06b6d4" strokeWidth="1.5" />
                    <text x="380" y="68" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">OrdersController</text>
                  </g>

                  {/* ProcessOrderCommand */}
                  <g onClick={() => setSelectedNodeId('med_cmd')} className="cursor-pointer">
                    <rect x="280" y="135" width="200" height="36" rx="6" fill={selectedNodeId === 'med_cmd' ? '#083344' : '#1e293b'} stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="380" y="158" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">ProcessOrderCommand</text>
                  </g>

                  {/* IOrderRepository */}
                  <g onClick={() => setSelectedNodeId('i_order_repo')} className="cursor-pointer">
                    <rect x="80" y="140" width="160" height="34" rx="6" fill={selectedNodeId === 'i_order_repo' ? '#083344' : '#1e293b'} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="160" y="162" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono">IOrderRepository</text>
                  </g>

                  {/* IPaymentGateway */}
                  <g onClick={() => setSelectedNodeId('i_payment')} className="cursor-pointer">
                    <rect x="520" y="140" width="160" height="34" rx="6" fill={selectedNodeId === 'i_payment' ? '#083344' : '#1e293b'} stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="600" y="162" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="600" fontFamily="JetBrains Mono">IPaymentGateway</text>
                  </g>

                  {/* Domain: Order Aggregate */}
                  <g className="cursor-pointer">
                    <rect x="300" y="230" width="160" height="34" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="380" y="252" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">Order AggregateRoot</text>
                  </g>

                  {/* EF Core Repo Implementation */}
                  <g onClick={() => setSelectedNodeId('ef_repo')} className="cursor-pointer">
                    <rect x="60" y="325" width="200" height="36" rx="6" fill={selectedNodeId === 'ef_repo' ? '#083344' : '#1e293b'} stroke="#10b981" strokeWidth="1.5" />
                    <text x="160" y="348" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">OrderRepository (EF Core 9)</text>
                  </g>

                  {/* Payment Adapter Implementation */}
                  <g onClick={() => setSelectedNodeId('cs_gateway')} className="cursor-pointer">
                    <rect x="500" y="325" width="200" height="36" rx="6" fill={selectedNodeId === 'cs_gateway' ? '#083344' : '#1e293b'} stroke="#10b981" strokeWidth="1.5" />
                    <text x="600" y="348" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="Plus Jakarta Sans">CyberSourceAdapter</text>
                  </g>
                </>
              ) : (
                /* Legacy Monolith Coupled Graph */
                <>
                  <rect x="10" y="20" width="740" height="360" rx="4" fill="#1e1b20" fillOpacity="0.4" stroke="#4c1d24" />
                  <text x="25" y="45" fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono">LEGACY MONOLITH (TIGHTLY COUPLED)</text>

                  {/* Central God Controller */}
                  <g onClick={() => setSelectedNodeId('legacy_god')} className="cursor-pointer">
                    <rect x="250" y="150" width="260" height="60" rx="8" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                    <text x="380" y="178" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold" fontFamily="Plus Jakarta Sans">OrderProcessingController (God Class)</text>
                    <text x="380" y="196" textAnchor="middle" fill="#fca5a5" fontSize="10" fontFamily="JetBrains Mono">1,280 LOC · Raw ADO.NET · SmtpClient</text>
                  </g>

                  {/* Concrete Hardcoded Nodes */}
                  <rect x="80" y="70" width="180" height="40" rx="6" fill="#261b1e" stroke="#f43f5e" strokeWidth="1" />
                  <text x="170" y="95" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="JetBrains Mono">SqlConnection (Raw)</text>

                  <rect x="500" y="70" width="180" height="40" rx="6" fill="#261b1e" stroke="#f43f5e" strokeWidth="1" />
                  <text x="590" y="95" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="JetBrains Mono">new CyberSourceGateway()</text>

                  <rect x="80" y="280" width="180" height="40" rx="6" fill="#261b1e" stroke="#f43f5e" strokeWidth="1" />
                  <text x="170" y="305" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="JetBrains Mono">new SmtpClient()</text>

                  <rect x="500" y="280" width="180" height="40" rx="6" fill="#261b1e" stroke="#f43f5e" strokeWidth="1" />
                  <text x="590" y="305" textAnchor="middle" fill="#fecdd3" fontSize="11" fontFamily="JetBrains Mono">ConfigurationManager (Static)</text>

                  {/* Red Tightly Coupled Lines with circular arrows */}
                  <line x1="320" y1="150" x2="220" y2="110" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-rose)" />
                  <line x1="440" y1="150" x2="540" y2="110" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-rose)" />
                  <line x1="320" y1="210" x2="220" y2="280" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-rose)" />
                  <line x1="440" y1="210" x2="540" y2="280" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow-rose)" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Selected Node Inspector */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              Component Inspector
            </div>
            <h4 className="text-sm font-bold text-white break-words">
              {selectedNode.label}
            </h4>
            <div className="mt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Architecture Layer:</span>
                <span className="font-mono text-slate-200 font-semibold">{selectedNode.layer}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Type:</span>
                <span className="font-mono text-slate-200 uppercase">{selectedNode.type}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Coupling Status:</span>
                <span className={`font-mono font-semibold ${
                  selectedNode.status === 'legacy_coupled'
                    ? 'text-rose-400'
                    : selectedNode.status === 'decoupled_interface'
                    ? 'text-cyan-400'
                    : 'text-emerald-400'
                }`}>
                  {selectedNode.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <div className="text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architectural Role</span>
            </div>
            {selectedNode.status === 'legacy_coupled' ? (
              <p>Direct instantiation without inversion. Violates Dependency Inversion Principle (DIP) and blocks mock injection during test execution.</p>
            ) : selectedNode.type === 'interface' ? (
              <p>Segregated contract placed inside Application layer. Infrastructure implements this contract, fully inverting high-to-low level module dependency.</p>
            ) : (
              <p>Decoupled implementation injected via Microsoft.Extensions.DependencyInjection with configurable lifetimes and resilience policies.</p>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3">
            <div className="text-[11px] text-slate-500 font-mono">
              Coupling Blast Radius: {selectedNode.status === 'legacy_coupled' ? 'High Risk' : 'Zero Bleed'}
            </div>
          </div>
        </div>
      </div>

      {/* Inversion of Control & DependencyInjection.cs Code */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Generated Dependency Injection Container (<code className="text-xs text-cyan-400 font-mono">DependencyInjection.cs</code>)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configures <code className="font-mono text-slate-300">IServiceCollection</code> with scoped database contexts and Polly circuit-breaker HTTP clients.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded transition-colors"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy C#'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[380px]">
          <pre>{uncoupling.serviceRegistrationCode}</pre>
        </div>

        {/* IoC Lifecycle Matrix */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="text-xs font-semibold text-slate-200 mb-2 font-mono">
            IoC Lifecycle Resolution Matrix
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {uncoupling.iocRegistrations.map((ioc, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
                  <span>{ioc.interfaceName}</span>
                  <span className="text-slate-400">[{ioc.lifetime}]</span>
                </div>
                <div className="text-slate-300 font-medium text-xs mb-1">
                  → {ioc.implementationName}
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {ioc.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
