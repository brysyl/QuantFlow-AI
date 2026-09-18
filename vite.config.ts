import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function quantFlowApiPlugin(): Plugin {
  return {
    name: 'quantflow-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/v1/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        if (req.method === 'GET' && url === '/api/v1/telemetry') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({
            active_nebius_model: 'nvidia/nemotron-3-ultra',
            endpoint_status: 'ONLINE (Nebius Serverless Europe-West / US)',
            average_latency_ms: 318.2,
            tavily_api_status: 'ONLINE (Advanced Search v3)',
            requests_processed: 154,
            cost_accumulated_usd: 0.5084
          }));
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            let parsed: any = {};
            try {
              if (body) parsed = JSON.parse(body);
            } catch {
              // ignore
            }

            res.setHeader('Content-Type', 'application/json');

            if (url === '/api/v1/manifest/ingest') {
              return res.end(JSON.stringify({
                manifest: parsed.json_data || parsed,
                extracted_by: 'nvidia/nemotron-nano',
                extraction_latency_ms: 36.8,
                token_usage: { prompt: 240, completion: 410, total: 650 },
                normalization_notes: [
                  'Validated against WCO Data Model v3.9.',
                  'Normalized gross weight to metric tonnes.',
                  'Mapped HS codes against 2025 WCO Nomenclature.'
                ]
              }));
            }

            if (url === '/api/v1/trade/optimize') {
              const isSolar = parsed.items && parsed.items.some((i: any) => 
                (i.description || '').toLowerCase().includes('solar') || 
                (i.declared_hs_code || '').startsWith('8504')
              );

              if (isSolar) {
                return res.end(JSON.stringify({
                  manifest_id: parsed.manifest_id || 'MNF-CN-NGA-2025-4192',
                  classification_comparisons: [
                    {
                      item_id: 'LINE-001',
                      declared_hs_code: '8504.40.95',
                      optimized_hs_code: '8541.43.00',
                      declared_tariff_rate: 14.5,
                      optimized_tariff_rate: 2.5,
                      declared_tariff_usd: 255200.0,
                      optimized_tariff_usd: 44000.0,
                      tariff_savings_usd: 211200.0,
                      legal_justification: 'WTO GIR 2(a): Unassembled photovoltaic modules incorporating bypass diodes qualify specifically under heading 8541.43 rather than general static converters, qualifying for preferential renewable energy zero-rating.',
                      wto_general_rule: 'GIR 2(a) (Incomplete Articles) & GIR 6',
                      afcfta_preferential_qualifier: 'Green Corridor Exemption for Solar & Storage Infrastructure.'
                    },
                    {
                      item_id: 'LINE-002',
                      declared_hs_code: '8507.60.00',
                      optimized_hs_code: '8507.60.10',
                      declared_tariff_rate: 10.0,
                      optimized_tariff_rate: 5.0,
                      declared_tariff_usd: 62000.0,
                      optimized_tariff_usd: 31000.0,
                      tariff_savings_usd: 31000.0,
                      legal_justification: 'Energy storage subsystem zero-rating under national rural electrification incentive.',
                      wto_general_rule: 'GIR 1 & GIR 6',
                      afcfta_preferential_qualifier: 'Clean Energy Incentive Protocol'
                    }
                  ],
                  cbam_assessment: {
                    total_direct_emissions_tco2e: 124.8,
                    total_indirect_emissions_tco2e: 38.4,
                    eu_ets_benchmark_price_eur: 86.40,
                    pre_optimization_cbam_liability_eur: 22896.0,
                    optimized_cbam_liability_eur: 11448.0,
                    carbon_credit_offset_eur: 11448.0,
                    net_cbam_delta_eur: 11448.0,
                    compliance_roadmap: [
                      'Submit certified manufacturer Tier-1 embodied carbon footprint report.',
                      'Obtain AfCFTA Green Customs clearance certificate.',
                      'Apply clean tech exemption at Onne Port terminal.'
                    ]
                  },
                  route_options: [
                    {
                      route_name: 'Shenzhen -> Port Harcourt Direct Maritime Corridor',
                      transit_days: 28,
                      bunker_fuel_cost_usd: 46200.0,
                      estimated_emissions_tco2e: 168.0,
                      port_risk_score: 0.40,
                      total_logistics_cost_usd: 68500.0,
                      is_recommended: true,
                      notes: 'Green corridor bypassing Lagos congestion directly into Onne Port terminal.'
                    }
                  ],
                  total_tariff_savings_usd: 242200.0,
                  total_carbon_liability_saved_eur: 11448.0,
                  total_landed_cost_pre_usd: 2719600.0,
                  total_landed_cost_post_usd: 2465952.0,
                  reasoning_summary: 'Nemotron-3-Ultra re-classified solar photovoltaic assemblies under HS 8541.43, unlocking $242,200.00 in customs duty savings and activating green corridor expedited clearance.',
                  regulatory_citations: [
                    'WCO GIR 2(a) Unassembled Articles',
                    'ECOWAS Common External Tariff (CET) Renewable Energy Framework',
                    'AfCFTA Protocol on Trade in Goods'
                  ],
                  nebius_model_used: 'nvidia/nemotron-3-ultra',
                  reasoning_latency_ms: 388.4,
                  estimated_cost_usd: 0.0041
                }));
              }

              // Default to Cocoa shipment
              return res.end(JSON.stringify({
                manifest_id: parsed.manifest_id || 'MNF-GH-NLD-2025-0849',
                classification_comparisons: [
                  {
                    item_id: 'LINE-001',
                    declared_hs_code: '1801.00.00',
                    optimized_hs_code: '1803.10.00',
                    declared_tariff_rate: 9.6,
                    optimized_tariff_rate: 0.0,
                    declared_tariff_usd: 100224.0,
                    optimized_tariff_usd: 0.0,
                    tariff_savings_usd: 100224.0,
                    legal_justification: 'WTO GIR 1 Note 1(c) to Chapter 18: Re-classified as partially defatted cocoa liquor/paste with certified 38% local beneficiation, unlocking 0% reciprocal duty under bilateral EPA & AfCFTA Guided Trade Protocol.',
                    wto_general_rule: 'GIR 1 & GIR 3(a) (Specific Description)',
                    afcfta_preferential_qualifier: 'Criterion: Substantial Transformation with >= 35% domestic value added.'
                  },
                  {
                    item_id: 'LINE-002',
                    declared_hs_code: '1804.00.00',
                    optimized_hs_code: '1804.00.10',
                    declared_tariff_rate: 7.7,
                    optimized_tariff_rate: 0.0,
                    declared_tariff_usd: 31262.0,
                    optimized_tariff_usd: 0.0,
                    tariff_savings_usd: 31262.0,
                    legal_justification: 'Preferential zero-duty clearance under Economic Partnership Agreement for refined cocoa butter originating from certified processing plant.',
                    wto_general_rule: 'GIR 1 & GIR 6',
                    afcfta_preferential_qualifier: 'Origin Rule: Wholly Obtained / Exclusively Processed.'
                  }
                ],
                cbam_assessment: {
                  total_direct_emissions_tco2e: 96.6,
                  total_indirect_emissions_tco2e: 34.5,
                  eu_ets_benchmark_price_eur: 86.40,
                  pre_optimization_cbam_liability_eur: 14725.30,
                  optimized_cbam_liability_eur: 8098.92,
                  carbon_credit_offset_eur: 6626.38,
                  net_cbam_delta_eur: 6626.38,
                  compliance_roadmap: [
                    'Lodge verified ISO 14064-1 accredited emissions statement with EU Declarant Portal.',
                    'Apply Article 9 deduction for domestic carbon surcharges paid at source in Ghana.',
                    'Execute quarterly CBAM certificate surrender schedule at €86.40/tCO2e.'
                  ]
                },
                route_options: [
                  {
                    route_name: 'Primary Maritime Green Corridor: Tema -> Rotterdam (Direct)',
                    transit_days: 18,
                    bunker_fuel_cost_usd: 28400.0,
                    estimated_emissions_tco2e: 111.4,
                    port_risk_score: 0.35,
                    total_logistics_cost_usd: 42500.0,
                    is_recommended: true,
                    notes: 'Direct line service with off-peak Rotterdam berth allocation; saves 48h demurrage exposure.'
                  },
                  {
                    route_name: 'Transshipment Corridor via Algeciras Feeder',
                    transit_days: 25,
                    bunker_fuel_cost_usd: 34200.0,
                    estimated_emissions_tco2e: 152.8,
                    port_risk_score: 0.72,
                    total_logistics_cost_usd: 51800.0,
                    is_recommended: false,
                    notes: 'Severe feeder vessel delays reported in Tavily stream for Gibraltar Strait.'
                  }
                ],
                total_tariff_savings_usd: 131486.0,
                total_carbon_liability_saved_eur: 6626.38,
                total_landed_cost_pre_usd: 1640107.0,
                total_landed_cost_post_usd: 1501464.0,
                reasoning_summary: 'Nemotron-3-Ultra re-classified 2 manifest line items, unlocking $131,486.00 in customs duty savings. Activated EU CBAM Article 9 carbon offsets, reducing carbon tax liability by €6,626.38.',
                regulatory_citations: [
                  'WCO Harmonized System Convention 2022 / GIR 1, 2(a), 3(b)',
                  'EU Regulation (EU) 2023/956 on Carbon Border Adjustment Mechanism (CBAM) Articles 6, 7 & 9',
                  'AfCFTA Agreement Annex 2 on Rules of Origin'
                ],
                nebius_model_used: 'nvidia/nemotron-3-ultra',
                reasoning_latency_ms: 384.2,
                estimated_cost_usd: 0.0034
              }));
            }

            if (url === '/api/v1/settlement/hedging') {
              return res.end(JSON.stringify({
                trade_id: parsed.trade_id || 'TRD-GH-NLD-2025-0849',
                base_currency: parsed.base_currency || 'USD',
                settlement_currency: parsed.settlement_currency || 'EUR',
                current_spot_rate: 0.924,
                projected_volatility_pct: 4.8,
                hedging_strategy: 'Dynamic 65/35 Split Execution: 65% locked via 30D Forward contract, 35% programmatic smart contract tranche with automated slippage guard against EUR volatility.',
                legs: [
                  {
                    pair: 'USD/EUR',
                    instrument: 'Cross-Currency Forward (30D)',
                    notional_amount: 942500.0,
                    strike_or_forward_rate: 0.9314,
                    tenor_days: 30,
                    hedge_ratio_pct: 65.0,
                    settlement_network: 'SEPA Instant / SWIFT GPI',
                    slippage_protection_pct: 0.25
                  },
                  {
                    pair: 'USD/EUR',
                    instrument: 'Synthetic Collar Option (Downside Put / Upside Cap)',
                    notional_amount: 507500.0,
                    strike_or_forward_rate: 0.9194,
                    tenor_days: 45,
                    hedge_ratio_pct: 35.0,
                    settlement_network: 'Smart Contract Escrow (Base/Polygon Multi-Sig)',
                    slippage_protection_pct: 0.15
                  }
                ],
                smart_contract_escrow_address: '0x89C4eA6...93F2 (QuantFlow Multi-Sig Escrow v2)',
                settlement_milestones: [
                  { milestone: 'Customs Export Clearance (Port of Tema)', payout_pct: 20, trigger: 'Verified Digital Bill of Lading (DID/W3C)' },
                  { milestone: 'Vessel Mid-Transit / Maritime AIS Telemetry', payout_pct: 30, trigger: 'Automated GPS Berth Proximity Ping' },
                  { milestone: 'Import Customs Release & CBAM Declaration Acceptance', payout_pct: 50, trigger: 'EU Single Window Customs / Green Lane Signature' }
                ],
                fx_savings_estimated_usd: 34800.0,
                timestamp: '2025-03-01T12:00:00Z'
              }));
            }

            return next();
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), quantFlowApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
