import React from 'react';
import { 
  TrendingDown, 
  Leaf, 
  Scale, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend 
} from 'recharts';
import { TradeOptimizationResult } from '../types/trade';

interface TariffOptimizationCardProps {
  optimization: TradeOptimizationResult | null;
  isProcessing: boolean;
}

export const TariffOptimizationCard: React.FC<TariffOptimizationCardProps> = ({
  optimization,
  isProcessing
}) => {
  if (!optimization) {
    return (
      <div id="tariff-optimization-panel-placeholder" className="bg-[#0f172a]/95 rounded-xl border border-slate-800 p-8 text-center shadow-xl flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <Scale className="w-10 h-10 text-cyan-500/50 animate-bounce" />
        <h3 className="text-base font-bold text-slate-200 font-['Chakra_Petch']">
          Awaiting Autonomous Optimization Execution
        </h3>
        <p className="text-xs text-slate-400 max-w-md font-sans">
          Click &quot;Run Autonomous Trade Optimization&quot; in Panel 1 to trigger multi-turn legal reasoning via Nebius NVIDIA Nemotron-3-Ultra.
        </p>
      </div>
    );
  }

  // Chart data preparation
  const costComparisonData = [
    {
      category: 'Customs Duty',
      Standard: optimization.classification_comparisons.reduce((acc, c) => acc + c.declared_tariff_usd, 0),
      Optimized: optimization.classification_comparisons.reduce((acc, c) => acc + c.optimized_tariff_usd, 0),
    },
    {
      category: 'CBAM Carbon Tax',
      Standard: optimization.cbam_assessment.pre_optimization_cbam_liability_eur * 1.08, // approx USD
      Optimized: optimization.cbam_assessment.optimized_cbam_liability_eur * 1.08,
    }
  ];

  return (
    <div id="tariff-optimization-panel" className="bg-[#0f172a]/95 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col space-y-5">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] tracking-wide">
              Panel 3: HS Code & CBAM Carbon Tariff Optimization
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Autonomous WTO GIR jurisprudence & Article 9 CBAM deductions by <span className="text-cyan-400 font-mono">nvidia/nemotron-3-ultra</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-400">Reasoning Time:</span>
          <span className="text-emerald-400 font-bold bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            {optimization.reasoning_latency_ms.toFixed(1)} ms
          </span>
        </div>
      </div>

      {/* Hero Savings Counter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        
        {/* Tariff Duty Savings */}
        <div className="bg-gradient-to-br from-[#12232e] to-[#0d1624] border border-cyan-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-mono mb-1">
            <span>Customs Duty Savings</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
            ${optimization.total_tariff_savings_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            WTO GIR Reclassification Savings
          </div>
        </div>

        {/* CBAM Carbon Tax Delta */}
        <div className="bg-gradient-to-br from-[#132724] to-[#0d181b] border border-emerald-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-mono mb-1">
            <span>CBAM Carbon Liability Saved</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
            €{optimization.total_carbon_liability_saved_eur.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Via Verified Origin & Art. 9 Credits
          </div>
        </div>

        {/* Total Landed Cost Reduction */}
        <div className="bg-gradient-to-br from-[#1a1f33] to-[#0d1222] border border-indigo-800/50 rounded-lg p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-1">
            <span>Net Landed Cost Delta</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono tracking-tight">
            - ${(optimization.total_landed_cost_pre_usd - optimization.total_landed_cost_post_usd).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ${optimization.total_landed_cost_pre_usd.toLocaleString()} ➔ ${optimization.total_landed_cost_post_usd.toLocaleString()}
          </div>
        </div>

      </div>

      {/* HS Code Re-Classification Comparison Table */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>HS Code Re-Classification & Legal Grounding:</span>
          <span className="text-cyan-400 text-[11px]">WTO Convention Jurisprudence</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#111927]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#162032] text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-3 py-2.5">Item</th>
                <th className="px-3 py-2.5">Declared HS (Rate)</th>
                <th className="px-3 py-2.5">Optimized HS (Rate)</th>
                <th className="px-3 py-2.5">Pre-Optimization Tax</th>
                <th className="px-3 py-2.5">Post-Optimization Tax</th>
                <th className="px-3 py-2.5">Tariff Delta</th>
                <th className="px-3 py-2.5">GIR Justification & Treaty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
              {optimization.classification_comparisons.map((c, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-3 text-cyan-400 font-bold">{c.item_id}</td>
                  <td className="px-3 py-3">
                    <span className="text-rose-300 line-through mr-1.5">{c.declared_hs_code}</span>
                    <span className="text-rose-400 text-[11px]">({c.declared_tariff_rate}%)</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-emerald-400 font-bold mr-1.5">{c.optimized_hs_code}</span>
                    <span className="text-emerald-400 text-[11px]">({c.optimized_tariff_rate}%)</span>
                  </td>
                  <td className="px-3 py-3 text-slate-400">${c.declared_tariff_usd.toLocaleString()}</td>
                  <td className="px-3 py-3 text-slate-100 font-semibold">${c.optimized_tariff_usd.toLocaleString()}</td>
                  <td className="px-3 py-3 text-emerald-400 font-bold">
                    +${c.tariff_savings_usd.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 font-sans text-[11px] text-slate-300 max-w-md">
                    <p className="font-medium text-slate-200">{c.wto_general_rule}</p>
                    <p className="text-slate-400 mt-0.5 line-clamp-2">{c.legal_justification}</p>
                    {c.afcfta_preferential_qualifier && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-700/40 text-amber-300 text-[10px] font-mono">
                        {c.afcfta_preferential_qualifier}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart & CBAM Carbon Tax Liability Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        
        {/* Recharts Before vs After Visualization */}
        <div className="bg-[#111927] border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Before vs. After Optimization (USD)</span>
            <span className="text-emerald-400 font-semibold">Dual Tax Compression</span>
          </div>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} 
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="Standard" fill="#f43f5e" name="Standard (Unoptimized)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Optimized" fill="#10b981" name="QuantFlow Optimized" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CBAM Liability & Compliance Roadmap Card */}
        <div className="bg-[#111927] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Leaf className="w-4 h-4" />
              EU CBAM Article 9 Assessment
            </span>
            <span className="text-slate-300">ETS: €{optimization.cbam_assessment.eu_ets_benchmark_price_eur}/tCO2e</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#162032] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Direct Emissions</span>
              <span className="text-slate-100 font-bold">{optimization.cbam_assessment.total_direct_emissions_tco2e} tCO2e</span>
            </div>
            <div className="bg-[#162032] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Indirect Emissions</span>
              <span className="text-slate-100 font-bold">{optimization.cbam_assessment.total_indirect_emissions_tco2e} tCO2e</span>
            </div>
            <div className="bg-[#162032] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Pre-Optimization (Punitive Benchmark)</span>
              <span className="text-rose-400 font-bold">€{optimization.cbam_assessment.pre_optimization_cbam_liability_eur.toLocaleString()}</span>
            </div>
            <div className="bg-[#162032] p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Optimized (Actual Verified Scope 1+2)</span>
              <span className="text-emerald-400 font-bold">€{optimization.cbam_assessment.optimized_cbam_liability_eur.toLocaleString()}</span>
            </div>
          </div>

          {/* Compliance Roadmap Steps */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide">Surrender & Filing Roadmap:</span>
            {optimization.cbam_assessment.compliance_roadmap.map((step, sIdx) => (
              <div key={sIdx} className="text-xs text-slate-300 flex items-start space-x-2 font-sans">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
