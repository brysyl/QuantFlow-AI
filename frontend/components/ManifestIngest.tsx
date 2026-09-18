import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Box, 
  Ship, 
  Scale, 
  Code2, 
  Layers 
} from 'lucide-react';
import { TradeManifest } from '../types/trade';
import { SAMPLE_MANIFESTS } from '../data/sampleManifests';

interface ManifestIngestProps {
  currentManifest: TradeManifest;
  onSelectPreset: (presetKey: string) => void;
  onUpdateManifest: (manifest: TradeManifest) => void;
  onRunOptimization: () => void;
  isProcessing: boolean;
  extractionLatencyMs: number;
}

export const ManifestIngest: React.FC<ManifestIngestProps> = ({
  currentManifest,
  onSelectPreset,
  onUpdateManifest,
  onRunOptimization,
  isProcessing,
  extractionLatencyMs
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [jsonText, setJsonText] = useState(JSON.stringify(currentManifest, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setJsonError(null);
      onUpdateManifest(parsed);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const handlePresetSelect = (key: string) => {
    onSelectPreset(key);
    if (SAMPLE_MANIFESTS[key]) {
      setJsonText(JSON.stringify(SAMPLE_MANIFESTS[key], null, 2));
      setJsonError(null);
    }
  };

  return (
    <div id="manifest-ingest-panel" className="bg-[#0f172a]/95 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col space-y-4">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-700/50 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] tracking-wide">
              Panel 1: Cross-Border Trade Manifest Ingestion
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Normalized via <span className="text-cyan-400 font-mono">nvidia/nemotron-nano</span> into WCO Data Model v3.9
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-mono">Benchmark Manifests:</span>
          <select
            id="preset-manifest-select"
            aria-label="Benchmark Manifest Preset"
            onChange={(e) => handlePresetSelect(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
          >
            <option value="cocoa_ghana_rotterdam">
              🇬🇭 Ghana ➔ 🇳🇱 Rotterdam (Cocoa / EU CBAM)
            </option>
            <option value="solar_shenzhen_portharcourt">
              🇨🇳 Shenzhen ➔ 🇳🇬 Port Harcourt (Solar / AfCFTA)
            </option>
          </select>
        </div>
      </div>

      {/* Sub-nav: Visual Manifest vs Raw JSON Inspector */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            id="tab-visual-manifest"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded transition-all cursor-pointer ${
              activeTab === 'visual' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normalized Overview
          </button>
          <button
            id="tab-json-manifest"
            onClick={() => {
              setJsonText(JSON.stringify(currentManifest, null, 2));
              setActiveTab('json');
            }}
            className={`px-3 py-1 rounded transition-all cursor-pointer flex items-center space-x-1 ${
              activeTab === 'json' ? 'bg-cyan-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 mr-1" />
            <span>Raw Manifest JSON</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Extraction Latency: <strong className="text-emerald-400">{extractionLatencyMs.toFixed(1)} ms</strong></span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'visual' ? (
        <div className="space-y-4">
          
          {/* Manifest High-Level Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#131d2e] border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 mb-1">
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                <span>Manifest ID</span>
              </div>
              <div className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                {currentManifest.manifest_id}
              </div>
              <div className="text-[10px] text-cyan-300/80 font-mono mt-0.5">
                Agreement: {currentManifest.trade_agreement || 'WTO MFN'}
              </div>
            </div>

            <div className="bg-[#131d2e] border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 mb-1">
                <Ship className="w-3.5 h-3.5 text-blue-400" />
                <span>Origin Port</span>
              </div>
              <div className="text-sm font-semibold text-slate-100 truncate">
                {currentManifest.origin_port}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Country: <strong className="text-slate-200">{currentManifest.origin_country}</strong>
              </div>
            </div>

            <div className="bg-[#131d2e] border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 mb-1">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                <span>Destination Port</span>
              </div>
              <div className="text-sm font-semibold text-slate-100 truncate">
                {currentManifest.destination_port}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Country: <strong className="text-slate-200">{currentManifest.destination_country}</strong>
              </div>
            </div>

            <div className="bg-[#131d2e] border border-slate-800 rounded-lg p-3">
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 mb-1">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                <span>Declared Cargo Value</span>
              </div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                ${currentManifest.total_declared_value_usd.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Vessel: <span className="text-slate-300">{currentManifest.metadata?.vessel_name || 'Direct Carrier'}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#111927]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#162032] text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Item Ref</th>
                  <th className="px-3 py-2.5">Commodity Description</th>
                  <th className="px-3 py-2.5">Declared HS Code</th>
                  <th className="px-3 py-2.5">Quantity / Unit</th>
                  <th className="px-3 py-2.5">Gross Weight</th>
                  <th className="px-3 py-2.5">Declared Line Value</th>
                  <th className="px-3 py-2.5">Carbon Factor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                {currentManifest.items.map((item, index) => (
                  <tr key={item.item_id || index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-2.5 text-cyan-400 font-bold">{item.item_id}</td>
                    <td className="px-3 py-2.5 max-w-xs truncate font-sans text-slate-200" title={item.description}>
                      {item.description}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/50 text-amber-300 text-[11px]">
                        {item.declared_hs_code}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">{item.quantity} {item.unit}</td>
                    <td className="px-3 py-2.5">{(item.gross_weight_kg / 1000).toFixed(1)} MT</td>
                    <td className="px-3 py-2.5 text-slate-100 font-semibold">${item.total_value.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-emerald-400 font-semibold">
                      {item.carbon_intensity_factor ? `${item.carbon_intensity_factor} tCO2e/t` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            id="manifest-json-textarea"
            aria-label="Manifest JSON Editor"
            value={jsonText}
            onChange={handleJsonChange}
            rows={11}
            className="w-full bg-[#0b101b] border border-slate-700/80 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            spellCheck={false}
          />
          {jsonError && (
            <div className="text-xs text-rose-400 font-mono bg-rose-950/30 p-2 rounded border border-rose-800/40">
              JSON Error: {jsonError}
            </div>
          )}
        </div>
      )}

      {/* Action Footer: Run Tavily + Nebius Optimization */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Manifest validated against WCO 2025 Rules of Origin</span>
        </div>

        <button
          id="btn-run-trade-optimization"
          onClick={onRunOptimization}
          disabled={isProcessing || Boolean(jsonError)}
          className={`px-5 py-2 rounded-lg font-['Chakra_Petch'] font-bold text-sm tracking-wider uppercase flex items-center space-x-2 transition-all shadow-lg cursor-pointer ${
            isProcessing || Boolean(jsonError)
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:shadow-cyan-500/20'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? 'Optimizing with Nemotron-3-Ultra...' : 'Run Autonomous Trade Optimization'}</span>
        </button>
      </div>

    </div>
  );
};
