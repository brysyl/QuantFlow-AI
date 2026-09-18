import React from 'react';
import { 
  Globe, 
  Anchor, 
  ExternalLink, 
  ShieldAlert, 
  Flame, 
  Clock, 
  TrendingUp, 
  Radio, 
  RefreshCw 
} from 'lucide-react';
import { TavilyRegulatoryData } from '../types/trade';

interface RegulatoryFeedProps {
  regulatoryData: TavilyRegulatoryData;
  onRefresh: () => void;
  isLoading: boolean;
}

export const RegulatoryFeed: React.FC<RegulatoryFeedProps> = ({
  regulatoryData,
  onRefresh,
  isLoading
}) => {
  return (
    <div id="regulatory-feed-panel" className="bg-[#0f172a]/95 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col space-y-4">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] tracking-wide flex items-center gap-2">
              Panel 2: Live Regulatory & Maritime Intelligence Feed
              {regulatoryData.is_live_tavily ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono">
                  LIVE TAVILY API
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-950/60 border border-blue-500/40 text-blue-300 font-mono">
                  FALLBACK BENCHMARK FEED
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Real-time Tavily Search API injection directly feeding Nemotron-3-Ultra prompts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>EU ETS Benchmark: <strong className="text-amber-300">€{regulatoryData.cbam_carbon_price_benchmark_eur.toFixed(2)} / tCO2e</strong></span>
          </div>

          <button
            id="btn-refresh-tavily"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            title="Refresh live Tavily regulatory stream"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Port Congestion Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(regulatoryData.port_congestion_index).map(([portName, portInfo]) => (
          <div key={portName} className="bg-[#121c2e] border border-slate-800/90 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Anchor className={`w-4 h-4 ${portInfo.index > 0.5 ? 'text-amber-400' : 'text-cyan-400'}`} />
              <div>
                <div className="text-xs font-semibold text-slate-200 font-mono truncate max-w-[200px]" title={portName}>
                  {portName}
                </div>
                <div className="text-[11px] text-slate-400">
                  Status: <span className={portInfo.index > 0.5 ? 'text-amber-300' : 'text-emerald-300 font-medium'}>{portInfo.status}</span>
                </div>
              </div>
            </div>

            <div className="text-right font-mono">
              <div className="text-xs font-bold text-slate-100 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{portInfo.wait_hours}h Avg Wait</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Congestion Index: <strong className="text-cyan-400">{(portInfo.index * 100).toFixed(0)}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Structured Regulatory Feed List */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Targeted Ingested Directives (AfCFTA & EU CBAM):</span>
          <span>Latency: {regulatoryData.query_latency_ms.toFixed(1)}ms</span>
        </div>

        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {regulatoryData.feed.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#111827] border border-slate-800/80 hover:border-cyan-800/50 rounded-lg p-3 transition-colors space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{item.source}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Match: {(item.relevance_score * 100).toFixed(0)}%
                </span>
              </div>

              <a 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-slate-100 hover:text-cyan-300 transition-colors flex items-center gap-1.5 group"
              >
                <span>{item.title}</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-cyan-400" />
              </a>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {item.snippet}
              </p>

              <div className="pt-1 text-[11px] font-mono text-amber-300/90 flex items-center gap-1 border-t border-slate-800/60">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span>{item.regulatory_impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
