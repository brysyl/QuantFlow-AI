import React, { useState } from 'react';
import { 
  DollarSign, 
  ShieldCheck, 
  GitFork, 
  Ship, 
  Clock, 
  Coins, 
  ExternalLink, 
  Lock, 
  ArrowRightLeft, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { FXSettlementPlan, RouteAlternative } from '../types/trade';

interface SettlementMatrixProps {
  settlementPlan: FXSettlementPlan | null;
  routes: RouteAlternative[];
  onTriggerEscrowRelease?: (milestoneIndex: number) => void;
}

export const SettlementMatrix: React.FC<SettlementMatrixProps> = ({
  settlementPlan,
  routes,
  onTriggerEscrowRelease
}) => {
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([0]);

  const handleMilestoneToggle = (idx: number) => {
    if (completedMilestones.includes(idx)) {
      setCompletedMilestones(completedMilestones.filter(i => i !== idx));
    } else {
      setCompletedMilestones([...completedMilestones, idx]);
    }
    onTriggerEscrowRelease?.(idx);
  };

  return (
    <div id="settlement-matrix-panel" className="bg-[#0f172a]/95 rounded-xl border border-slate-800 p-5 shadow-xl flex flex-col space-y-5">
      
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-700/50 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 font-['Chakra_Petch'] tracking-wide">
              Panel 4: Dynamic Route & Programmatic FX Settlement Matrix
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Algorithmic currency hedging, PAPSS / SEPA rail routing & multi-sig smart contract escrow
            </p>
          </div>
        </div>

        {settlementPlan && (
          <div className="flex items-center space-x-2 font-mono text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Spot Rate:</span>
            <span className="text-cyan-300 font-bold">
              1 {settlementPlan.base_currency} = {settlementPlan.current_spot_rate} {settlementPlan.settlement_currency}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">
              Proj. FX Savings: ${settlementPlan.fx_savings_estimated_usd.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Route Comparison Matrix */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Autonomous Maritime Route Optimization:</span>
          <span className="text-cyan-400 text-[11px]">Carbon & Bunker Fuel Optimized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routes.map((route, rIdx) => (
            <div 
              key={rIdx}
              className={`p-4 rounded-lg border transition-all ${
                route.is_recommended 
                  ? 'bg-gradient-to-br from-[#102422] to-[#0c191a] border-emerald-500/60 shadow-lg' 
                  : 'bg-[#111927] border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Ship className={`w-4 h-4 ${route.is_recommended ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-100 font-sans">
                    {route.route_name}
                  </span>
                </div>
                {route.is_recommended && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    RECOMMENDED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono mb-2">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Transit Time</span>
                  <span className="text-slate-100 font-bold">{route.transit_days} Days</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Bunker Fuel Cost</span>
                  <span className="text-slate-100 font-bold">${route.bunker_fuel_cost_usd.toLocaleString()}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Emissions</span>
                  <span className="text-emerald-400 font-bold">{route.estimated_emissions_tco2e} tCO2e</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {route.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FX Hedging Tranches */}
      {settlementPlan && (
        <div className="space-y-3 pt-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Algorithmic FX Hedging Strategy (65/35 Split Execution):</span>
            <span className="text-amber-300 text-[11px] font-mono">Volatility: {settlementPlan.projected_volatility_pct}%</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#111927]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#162032] text-slate-300 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-3 py-2.5">Tranche Pair</th>
                  <th className="px-3 py-2.5">Hedging Instrument</th>
                  <th className="px-3 py-2.5">Notional Protected</th>
                  <th className="px-3 py-2.5">Hedge Ratio</th>
                  <th className="px-3 py-2.5">Settlement Rail</th>
                  <th className="px-3 py-2.5">Slippage Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                {settlementPlan.legs.map((leg, lIdx) => (
                  <tr key={lIdx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-3 py-3 text-cyan-400 font-bold">{leg.pair}</td>
                    <td className="px-3 py-3 font-sans text-slate-200">{leg.instrument}</td>
                    <td className="px-3 py-3 text-slate-100 font-semibold">${leg.notional_amount.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-bold">
                        {leg.hedge_ratio_pct}%
                      </span>
                    </td>
                    <td className="px-3 py-3 font-sans text-slate-300">{leg.settlement_network}</td>
                    <td className="px-3 py-3 text-emerald-400">±{leg.slippage_protection_pct}% max</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Programmatic Smart Contract Milestone Triggers */}
      {settlementPlan && (
        <div className="bg-[#111927] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Multi-Sig Escrow Contract: {settlementPlan.smart_contract_escrow_address}
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Autonomous Oracle Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {settlementPlan.settlement_milestones.map((milestone, mIdx) => {
              const isReleased = completedMilestones.includes(mIdx);
              return (
                <div 
                  key={mIdx}
                  onClick={() => handleMilestoneToggle(mIdx)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                    isReleased 
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-md' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-semibold uppercase">
                      Tranche #{mIdx + 1} ({milestone.payout_pct}%)
                    </span>
                    <CheckCircle2 className={`w-4 h-4 ${isReleased ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-xs font-semibold text-slate-100 font-sans mb-1">
                    {milestone.milestone}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-300/80">
                    Oracle: {milestone.trigger}
                  </div>
                  <div className="mt-2 text-[10px] font-mono flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                    <span>Status:</span>
                    <span className={`font-bold ${isReleased ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isReleased ? 'RELEASED & EXECUTED' : 'AWAITING ORACLE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
