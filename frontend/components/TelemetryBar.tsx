import React from 'react';
import { 
  Activity, 
  Cpu, 
  Search, 
  Zap, 
  Layers, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Globe2 
} from 'lucide-react';
import { TelemetryMetrics, ModelTier } from '../types/trade';

interface TelemetryBarProps {
  telemetry: TelemetryMetrics;
  activeModel: ModelTier;
  isProcessing: boolean;
  onModelChange?: (model: ModelTier) => void;
  apiMode: 'live' | 'deterministic';
  onToggleApiMode: () => void;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  telemetry,
  activeModel,
  isProcessing,
  onModelChange,
  apiMode,
  onToggleApiMode,
}) => {
  return (
    <header id="ops-telemetry-bar" className="w-full bg-[#0d131f]/90 border-b border-cyan-900/40 backdrop-blur-md sticky top-0 z-50 px-4 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Left: Branding & Hackathon context */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isProcessing ? 'bg-amber-400 opacity-75' : 'bg-cyan-400 opacity-50'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
            </div>
            <span className="text-sm font-bold tracking-wider text-slate-100 uppercase font-['Chakra_Petch']">
              QuantFlow <span className="text-cyan-400 text-xs font-normal">v1.4</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-[11px]">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Nebius x NVIDIA Hackathon</span>
          </div>
        </div>

        {/* Center: Live LLM Routing & Tavily Telemetry Metrics */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          
          {/* Active Model Routing Chip */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131d2f] border border-slate-700/60 shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Router:</span>
            <select
              aria-label="Active LLM Model"
              value={activeModel}
              onChange={(e) => onModelChange?.(e.target.value as ModelTier)}
              className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              <option value="nvidia/nemotron-3-ultra" className="bg-slate-900 text-cyan-300">
                nvidia/nemotron-3-ultra (Legal & Hedging)
              </option>
              <option value="nvidia/nemotron-nano" className="bg-slate-900 text-slate-300">
                nvidia/nemotron-nano (Fast Ingest)
              </option>
              <option value="nvidia/nemotron-super" className="bg-slate-900 text-slate-300">
                nvidia/nemotron-super (Telemetry Normalizer)
              </option>
            </select>
          </div>

          {/* Latency metric */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131d2f] border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Latency:</span>
            <span className={`font-bold ${isProcessing ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {isProcessing ? 'Calculating...' : `${telemetry.average_latency_ms.toFixed(1)} ms`}
            </span>
          </div>

          {/* Cost accumulator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131d2f] border border-slate-700/60">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Inference:</span>
            <span className="text-slate-200 font-medium">
              ${telemetry.cost_accumulated_usd.toFixed(4)}
            </span>
          </div>

          {/* Tavily Regulatory Search Status */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#131d2f] border border-slate-700/60">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">Tavily Search:</span>
            <span className="text-indigo-300 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Maritime & Customs Ready
            </span>
          </div>

        </div>

        {/* Right: Mode Switcher & Node Status */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-toggle-engine-mode"
            onClick={onToggleApiMode}
            title="Toggle between Live Nebius/Tavily APIs and Offline Fallback Dataset"
            className={`px-2.5 py-1 rounded border transition-colors flex items-center space-x-1.5 cursor-pointer ${
              apiMode === 'live' 
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/40' 
                : 'bg-blue-950/40 border-blue-500/50 text-blue-300 hover:bg-blue-900/40'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="font-semibold uppercase text-[10px]">
              {apiMode === 'live' ? 'Live Nebius Endpoint' : 'Deterministic Mode'}
            </span>
          </button>

          <div className="hidden xl:flex items-center space-x-1 text-slate-400 text-[11px] px-2 py-0.5 rounded bg-slate-800/40 border border-slate-700/40">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>WTO / CBAM Certified</span>
          </div>
        </div>

      </div>
    </header>
  );
};
