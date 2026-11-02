import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, SkipForward, SkipBack, Download, FileText, Sparkles, CheckCircle2, ArrowRight, Video, MonitorPlay } from 'lucide-react';
import { ModernizationResult } from '../data/modernizationEngine';

interface VideoChapter {
  id: string;
  title: string;
  timestamp: string;
  startSeconds: number;
  durationSeconds: number;
  headline: string;
  subheadline: string;
  narrationText: string;
  visualType: 'poster' | 'monolith' | 'assessment' | 'uncoupling' | 'diff' | 'schema' | 'tests' | 'production';
  highlights: string[];
}

const CHAPTERS: VideoChapter[] = [
  {
    id: 'intro',
    title: '1. Welcome to LlamaModernize',
    timestamp: '00:00',
    startSeconds: 0,
    durationSeconds: 12,
    headline: 'Agentic Modernization Copilot Powered by Meta Llama 3',
    subheadline: 'Eliminating months of technical debt in mission-critical legacy .NET codebases.',
    narrationText: "Welcome to LlamaModernize, an agentic enterprise modernization copilot powered by Meta Llama 3. Enterprise teams spend months manually refactoring legacy .NET codebases. LlamaModernize automates this transformation end-to-end.",
    visualType: 'poster',
    highlights: ['Meta Llama 3 Engine', 'Zero Behavioral Drift', 'Enterprise .NET Focus', 'Automated AST Pipeline']
  },
  {
    id: 'monolith',
    title: '2. The Legacy Monolith Crisis',
    timestamp: '00:12',
    startSeconds: 12,
    durationSeconds: 11.5,
    headline: 'Contoso Billing: 1,280 LOC God Controller (.NET 4.8)',
    subheadline: 'Direct SQL Server coupling, raw SMTP, and zero automated tests.',
    narrationText: "Here is Contoso Billing, a 1,280 line monolithic God controller running on legacy .NET Framework 4.8. It suffers from direct SQL Server coupling, synchronous SMTP calls, and zero automated tests.",
    visualType: 'monolith',
    highlights: ['1,280 LOC God Class', 'Thread Pool Starvation', 'SQL Injection Vulnerability', 'Zero Test Coverage']
  },
  {
    id: 'assessment',
    title: '3. Architecture Assessment',
    timestamp: '00:23',
    startSeconds: 23.5,
    durationSeconds: 11,
    headline: 'AST Parsing, Blast Radius Quarantine & Strangler Fig',
    subheadline: 'Coupling slashed from 94% to 12%; 340 technical debt hours saved.',
    narrationText: "In Phase One, Meta Llama 3 performs deep AST analysis to evaluate blast radius and pinpoint architectural anti-patterns, slashing coupling from 94 percent to 12 percent.",
    visualType: 'assessment',
    highlights: ['Coupling: 94% down to 12%', 'Blast Radius Quarantined', '+57 Maintainability Gain', 'Strangler Fig Roadmap']
  },
  {
    id: 'uncoupling',
    title: '4. Dependency Uncoupling & IoC',
    timestamp: '00:34',
    startSeconds: 34.5,
    durationSeconds: 12,
    headline: 'Inverting Concrete Dependencies into Segregated Contracts',
    subheadline: 'Eliminated direct new() instantiations; injected Polly resilience policies.',
    narrationText: "In Phase Two, concrete dependencies are inverted into segregated interfaces registered in Microsoft Extensions Dependency Injection with resilient Polly retry policies.",
    visualType: 'uncoupling',
    highlights: ['7 Concrete Dependencies Inverted', 'Interface Segregation Applied', 'Polly Circuit Breakers', 'IServiceCollection Clean Setup']
  },
  {
    id: 'solid',
    title: '5. SOLID Refactoring to .NET 9',
    timestamp: '00:46',
    startSeconds: 46.5,
    durationSeconds: 11.5,
    headline: 'Clean Architecture with CQRS MediatR Handlers',
    subheadline: 'God Controller shrunk to 15 lines; domain invariants isolated.',
    narrationText: "In Phase Three, Meta Llama 3 refactors the codebase into .NET 9 Clean Architecture. The monolithic controller shrinks to a clean 15-line endpoint backed by CQRS MediatR handlers.",
    visualType: 'diff',
    highlights: ['15-Line Ultra-Thin Controller', 'CQRS MediatR Handlers', 'Encapsulated Aggregate Roots', 'C# 13 & .NET 9 LTS Standards']
  },
  {
    id: 'schema',
    title: '6. Schema Migration: EF Core 9',
    timestamp: '00:58',
    startSeconds: 58,
    durationSeconds: 11.5,
    headline: 'Type-Safe DbContext, Indexes & Concurrency Tokens',
    subheadline: 'Raw ADO.NET replaced with Fluent API and RowVersion optimistic locking.',
    narrationText: "In Phase Four, fragile ADO.NET queries are replaced with type-safe EF Core 9 configurations, including RowVersion concurrency tokens and nonclustered indexes.",
    visualType: 'schema',
    highlights: ['Zero SQL Injection Risk', 'RowVersion Optimistic Locking', 'Composite Nonclustered Indexes', 'Idempotent DDL Migration']
  },
  {
    id: 'tests',
    title: '7. Automated Regression Safety',
    timestamp: '01:09',
    startSeconds: 69.5,
    durationSeconds: 12,
    headline: 'xUnit 2.9 + Moq Regression Suite (100% Pass)',
    subheadline: '97.4% test coverage guarantees zero behavioral drift.',
    narrationText: "Finally, in Phase Five, LlamaModernize generates a complete xUnit and Moq regression test suite, achieving 100 percent pass rates and 97.4 percent code coverage.",
    visualType: 'tests',
    highlights: ['100% Assertion Pass Guarantee', '97.4% High Code Coverage', 'Moq Isolation from Networks', 'Zero Behavioral Drift']
  },
  {
    id: 'production',
    title: '8. Enterprise Production Ready',
    timestamp: '01:21',
    startSeconds: 81.5,
    durationSeconds: 12.8,
    headline: 'Modernization Completed in 4.2 Seconds',
    subheadline: 'Months of manual refactoring transformed into rapid, safe deployment.',
    narrationText: "Enterprise legacy modernization completed in just 4.2 seconds. Accelerate your enterprise transformation with LlamaModernize powered by Meta Llama 3.",
    visualType: 'production',
    highlights: ['4.2s Full Execution Time', 'Zero Production Risk', 'Enterprise-Grade Modernization', 'Exportable .NET 9 Solution']
  }
];

const TOTAL_VIDEO_SECONDS = 94; // 1m 34s rendered video

interface DemoVideoPlayerProps {
  result: ModernizationResult;
  onNavigateTab: (tab: string) => void;
}

export const DemoVideoPlayer: React.FC<DemoVideoPlayerProps> = ({
  result,
  onNavigateTab,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [viewTab, setViewTab] = useState<'mp4_video' | 'interactive' | 'script'>('mp4_video');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeChapter = CHAPTERS[activeChapterIndex] || CHAPTERS[0];

  // Speech synthesis voiceover
  const speakNarration = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const stopNarration = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Video playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSeconds(prev => {
          if (prev >= TOTAL_VIDEO_SECONDS) {
            setIsPlaying(false);
            stopNarration();
            return 0;
          }
          const nextSec = prev + 1;
          // Determine matching chapter
          const matchedIdx = CHAPTERS.findIndex(
            (c, i) => nextSec >= c.startSeconds && (i === CHAPTERS.length - 1 || nextSec < CHAPTERS[i + 1].startSeconds)
          );
          if (matchedIdx !== -1 && matchedIdx !== activeChapterIndex) {
            setActiveChapterIndex(matchedIdx);
            speakNarration(CHAPTERS[matchedIdx].narrationText);
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      stopNarration();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeChapterIndex, voiceEnabled]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      speakNarration(activeChapter.narrationText);
    } else {
      setIsPlaying(false);
      stopNarration();
    }
  };

  const handleJumpToChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    const targetSec = CHAPTERS[idx].startSeconds;
    setCurrentSeconds(targetSec);
    if (isPlaying) {
      speakNarration(CHAPTERS[idx].narrationText);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    stopNarration();
    setCurrentSeconds(0);
    setActiveChapterIndex(0);
  };

  const handleSeekVideoToChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    const targetSec = CHAPTERS[idx].startSeconds;
    setCurrentSeconds(targetSec);
    if (videoRef.current) {
      videoRef.current.currentTime = targetSec;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentSeconds(Math.floor(current));
    const matchedIdx = CHAPTERS.findIndex(
      (c, i) => current >= c.startSeconds && (i === CHAPTERS.length - 1 || current < CHAPTERS[i + 1].startSeconds)
    );
    if (matchedIdx !== -1 && matchedIdx !== activeChapterIndex) {
      setActiveChapterIndex(matchedIdx);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownloadScript = () => {
    let scriptMarkdown = `# LlamaModernize Enterprise Copilot - Official Demo Video Script
**Subject:** Modernizing Monolithic .NET/C# Enterprise Codebases with Meta Llama 3
**Target Architecture:** .NET 9 LTS / Clean Architecture / CQRS MediatR / EF Core 9
**Duration:** 01:34 Minutes | Language: English (US)
**Video File:** /videos/llama_modernize_demo_walkthrough.mp4

---

`;

    CHAPTERS.forEach((ch) => {
      scriptMarkdown += `## [${ch.timestamp}] ${ch.title}
**Visual Scene:** ${ch.headline} (${ch.subheadline})
**On-Screen Highlights:** ${ch.highlights.join(', ')}

### English Voiceover Narration:
"${ch.narrationText}"

---

`;
    });

    const blob = new Blob([scriptMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LlamaModernize_Demo_Video_Script.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Enterprise Walkthrough Video & English Audio Presentation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 720p HD MP4 walkthrough video with clear spoken English voiceover narration, animated slides, and C# modernization diffs.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => {
                setViewTab('mp4_video');
                stopNarration();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                viewTab === 'mp4_video'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>HD Video (.mp4)</span>
            </button>
            <button
              onClick={() => {
                setViewTab('interactive');
                if (videoRef.current) videoRef.current.pause();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                viewTab === 'interactive'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span>Interactive Slides</span>
            </button>
            <button
              onClick={() => {
                setViewTab('script');
                stopNarration();
                if (videoRef.current) videoRef.current.pause();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                viewTab === 'script'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>English Script</span>
            </button>
          </div>

          <a
            href="/videos/llama_modernize_demo_walkthrough.mp4"
            download="LlamaModernize_Demo_Walkthrough.mp4"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 font-bold rounded-lg transition-colors shadow-sm"
            title="Download rendered MP4 video (4.1 MB)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download MP4</span>
          </a>
        </div>
      </div>

      {viewTab === 'mp4_video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 16:9 MP4 Video Player Frame */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-video bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                src="/videos/llama_modernize_demo_walkthrough.mp4"
                controls
                playsInline
                preload="metadata"
                poster="/src/assets/images/demo_video_poster_1793433139796.jpg"
                className="w-full h-full object-contain"
                onTimeUpdate={handleVideoTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Currently Playing Chapter Detail Banner */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {activeChapter.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {formatTime(currentSeconds)} / {formatTime(TOTAL_VIDEO_SECONDS)}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {activeChapter.headline}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeChapter.narrationText}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800/80">
                {activeChapter.highlights.map((h, i) => (
                  <span key={i} className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action to Navigate to Real Code View */}
            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Want to inspect and edit the active modernization code directly?
              </span>
              <button
                onClick={() => {
                  if (activeChapter.visualType === 'assessment') onNavigateTab('assessment');
                  else if (activeChapter.visualType === 'uncoupling') onNavigateTab('uncoupling');
                  else if (activeChapter.visualType === 'diff') onNavigateTab('diff');
                  else if (activeChapter.visualType === 'schema') onNavigateTab('schema');
                  else if (activeChapter.visualType === 'tests') onNavigateTab('tests');
                  else onNavigateTab('diff');
                }}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-800/80 rounded transition-colors"
              >
                <span>Jump into Workspace View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chapter Playlist Sidebar */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Video Chapters (Click to Jump)
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  {CHAPTERS.length} Chapters · 01:34
                </span>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = idx === activeChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSeekVideoToChapter(idx)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-slate-950 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-semibold ${isActive ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>
                          {ch.title}
                        </span>
                        <span className={`text-[11px] font-mono ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                          {ch.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {ch.headline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video File Specs Badge */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="text-cyan-400 font-semibold uppercase">Video Specifications</div>
              <div className="text-slate-400 flex justify-between">
                <span>Format:</span>
                <span className="text-slate-200">H.264 / AAC MP4</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Resolution:</span>
                <span className="text-slate-200">1280 × 720 HD</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Narration:</span>
                <span className="text-emerald-400">English Voiceover</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Interactive Slide Visualizer */}
          <div className="lg:col-span-8 space-y-3">
            <div className="relative aspect-video bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between group">
              {/* Visuals */}
              <div className="absolute inset-0 z-0">
                {activeChapter.visualType === 'poster' && (
                  <img
                    src="/src/assets/images/demo_video_poster_1793433139796.jpg"
                    alt="Demo Video Poster"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                )}

                {activeChapter.visualType === 'monolith' && (
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-center items-center">
                    <div className="border border-rose-900/80 bg-rose-950/40 rounded-lg p-5 max-w-lg w-full shadow-2xl space-y-3 font-mono text-xs">
                      <div className="text-rose-400 font-bold uppercase tracking-wider">Contoso Billing Monolith (.NET 4.8)</div>
                      <pre className="text-rose-200/90 text-[11px] leading-snug bg-slate-950/80 p-3 rounded border border-rose-900/60">
{`public class OrderProcessingController : ApiController {
  // 1,280 LOC God Class with direct SQL Server ADO.NET
  var conn = new SqlConnection(ConfigurationManager.ConnectionStrings["LegacyDB"].ConnectionString);
  conn.Open();
  var cmd = new SqlCommand("SELECT * FROM Orders WHERE Id = '" + orderId + "'", conn);
  // Synchronous SMTP blocking thread pool
  var smtp = new SmtpClient("mail.internal.contoso.com");
  smtp.Send(mail);
}`}
                      </pre>
                      <div className="text-rose-300 text-[11px]">340 Hours Debt · High SQL Injection Risk · Zero Unit Tests</div>
                    </div>
                  </div>
                )}

                {activeChapter.visualType === 'assessment' && (
                  <div className="w-full h-full relative">
                    <img
                      src="/src/assets/images/arch_modernization_schematic_1793431219135.jpg"
                      alt="Architecture Assessment"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-slate-950/70 p-6 flex flex-col justify-center">
                      <div className="max-w-md bg-slate-900/90 border border-slate-700/80 p-4 rounded-lg shadow-xl backdrop-blur">
                        <div className="text-xs font-mono text-cyan-400 mb-1">AST PARSING COMPLETE</div>
                        <div className="text-base font-bold text-white mb-2">Coupling Reduced from 94% → 12%</div>
                        <div className="text-xs text-slate-300 leading-relaxed">
                          Blast radius quarantined across 4 core business domains. 340 technical debt hours eliminated.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeChapter.visualType === 'uncoupling' && (
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-center">
                    <div className="border border-cyan-800/60 bg-slate-900/90 rounded-lg p-5 max-w-lg mx-auto shadow-2xl space-y-3">
                      <div className="text-xs font-mono text-cyan-400">INVERSION OF CONTROL APPLIED</div>
                      <div className="text-sm font-semibold text-white">Concrete new() Instantiations Decoupled</div>
                      <div className="font-mono text-xs text-emerald-300 bg-slate-950 p-3 rounded border border-slate-800">
                        services.AddScoped&lt;IOrderRepository, OrderRepository&gt;();<br />
                        services.AddScoped&lt;IPaymentGateway, CyberSourceAdapter&gt;();<br />
                        services.AddScoped&lt;INotificationService, SmtpNotificationService&gt;();
                      </div>
                    </div>
                  </div>
                )}

                {activeChapter.visualType === 'diff' && (
                  <div className="w-full h-full bg-slate-950 p-6 grid grid-cols-2 gap-4">
                    <div className="border border-rose-900/80 bg-rose-950/30 rounded-lg p-4 font-mono text-[11px] text-rose-300 overflow-hidden">
                      <div className="text-xs font-bold text-rose-400 mb-2">BEFORE (.NET 4.8 Monolith)</div>
                      <pre className="text-rose-200/80 leading-snug">
{`public class OrderProcessingController {
  // God Class with raw SQL
  var conn = new SqlConnection(connStr);
  conn.Open();
  var cmd = new SqlCommand("SELECT...");
  var smtp = new SmtpClient();
}`}
                      </pre>
                    </div>
                    <div className="border border-cyan-800/80 bg-cyan-950/30 rounded-lg p-4 font-mono text-[11px] text-cyan-300 overflow-hidden">
                      <div className="text-xs font-bold text-cyan-400 mb-2">AFTER (.NET 9 Clean Architecture)</div>
                      <pre className="text-cyan-200/90 leading-snug">
{`[ApiController]
public class OrdersController(ISender mediator) {
  // Ultra-thin 15 lines
  [HttpPost]
  public async Task<IActionResult> Process(
    ProcessOrderCommand cmd, CancellationToken ct)
    => await mediator.Send(cmd, ct);
}`}
                      </pre>
                    </div>
                  </div>
                )}

                {activeChapter.visualType === 'schema' && (
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-center items-center">
                    <div className="border border-amber-800/60 bg-slate-900/95 rounded-lg p-5 max-w-lg w-full shadow-2xl space-y-2 font-mono text-xs">
                      <div className="text-amber-400 text-xs font-bold">SCHEMA MIGRATION: ADO.NET → EF CORE 9</div>
                      <div className="text-slate-300 font-sans text-xs">Generated Idempotent SQL Server DDL with Concurrency Protection:</div>
                      <div className="bg-slate-950 p-3 rounded text-slate-300 text-[11px] leading-relaxed border border-slate-800">
                        ALTER TABLE [billing].[Orders] ADD [RowVersion] ROWVERSION NOT NULL;<br />
                        CREATE NONCLUSTERED INDEX [IX_Orders_CustomerId] ON [billing].[Orders]([CustomerId]);
                      </div>
                    </div>
                  </div>
                )}

                {activeChapter.visualType === 'tests' && (
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-center items-center">
                    <div className="border border-emerald-800/60 bg-slate-900/95 rounded-lg p-5 max-w-md w-full shadow-2xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                        <span>XUNIT REGRESSION SAFETY</span>
                        <span>100% PASSED</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Handle_ValidCommand_PersistsOrder</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Handle_ExceededCredit_Rejects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Handle_PaymentDeclined_Aborts</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-cyan-400 font-mono border-t border-slate-800 pt-2">
                        Code Coverage: 97.4% · Zero Behavioral Drift
                      </div>
                    </div>
                  </div>
                )}

                {activeChapter.visualType === 'production' && (
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-center items-center">
                    <div className="border border-cyan-800/60 bg-slate-900/95 rounded-lg p-6 max-w-md w-full shadow-2xl space-y-3 text-center">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div className="text-base font-bold text-white">Modernization Complete</div>
                      <div className="text-xs text-slate-300">
                        4.2 Seconds Execution Time · Full .NET 9 LTS Clean Architecture Ready for Production
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Overlay */}
              <div className="relative z-10 p-4 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {activeChapter.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  {formatTime(currentSeconds)} / {formatTime(TOTAL_VIDEO_SECONDS)}
                </span>
              </div>

              {/* Subtitles & Controls */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-3">
                <div className="bg-slate-900/90 border border-slate-800/90 p-3 rounded-lg backdrop-blur">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ENGLISH VOICE SYNTHESIS</span>
                    </div>
                    {isPlaying && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-2.5 bg-cyan-400 animate-pulse" />
                        <span className="w-1 h-3.5 bg-cyan-400 animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-cyan-400 animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
                    "{activeChapter.narrationText}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-1 hover:text-white transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-1 hover:text-white transition-colors"
                      title="Restart"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const nextIdx = (activeChapterIndex + 1) % CHAPTERS.length;
                        handleJumpToChapter(nextIdx);
                      }}
                      className="p-1 hover:text-white transition-colors"
                      title="Next chapter"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setVoiceEnabled(!voiceEnabled);
                        if (voiceEnabled) stopNarration();
                        else if (isPlaying) speakNarration(activeChapter.narrationText);
                      }}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:text-white transition-colors font-mono text-[11px]"
                    >
                      {voiceEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Voice: ON</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                          <span>Voice: OFF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chapter List */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                  Interactive Chapters
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  {CHAPTERS.length} Scenes
                </span>
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {CHAPTERS.map((ch, idx) => {
                  const isActive = idx === activeChapterIndex;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleJumpToChapter(idx)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-slate-950 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-semibold ${isActive ? 'text-cyan-300 font-bold' : 'text-slate-300'}`}>
                          {ch.title}
                        </span>
                        <span className={`text-[11px] font-mono ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                          {ch.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {ch.headline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full English Narration Script & Storyboard View */}
      {viewTab === 'script' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Official English Demo Video Script & Storyboard
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full timecoded voiceover transcript and visual cues for recording or presenting to stakeholders.
              </p>
            </div>
            <button
              onClick={handleDownloadScript}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Script (.md)</span>
            </button>
          </div>

          <div className="space-y-6">
            {CHAPTERS.map((ch, idx) => (
              <div key={ch.id} className="border border-slate-800 rounded-lg bg-slate-950 p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">[{ch.timestamp}]</span>
                    <h4 className="text-sm font-bold text-white">{ch.title}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Duration: ~{ch.durationSeconds}s</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 bg-slate-900/70 p-3 rounded border border-slate-800 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Visual Direction:
                    </div>
                    <div className="text-xs text-slate-200 font-semibold">{ch.headline}</div>
                    <div className="text-[11px] text-slate-400">{ch.subheadline}</div>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Highlights:</div>
                      <div className="text-[11px] text-cyan-300 font-mono mt-1">
                        {ch.highlights.join(' · ')}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 bg-slate-900/40 p-3.5 rounded border border-slate-800/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 uppercase">
                      <Volume2 className="w-3 h-3" />
                      <span>Spoken English Voiceover:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed italic">
                      "{ch.narrationText}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
