export type TransportMode = 'MARITIME' | 'AIR_FREIGHT' | 'RAIL' | 'ROAD';
export type TradeAgreement = 'EU_CBAM' | 'AFCFTA' | 'WTO_MFN' | 'BILATERAL';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CNY' | 'GHS' | 'NGN';
export type ModelTier = 'nvidia/nemotron-nano' | 'nvidia/nemotron-super' | 'nvidia/nemotron-3-ultra';

export interface ManifestItem {
  item_id: string;
  description: string;
  declared_hs_code: string;
  quantity: number;
  unit: string;
  unit_value: number;
  total_value: number;
  currency: Currency;
  country_of_origin: string;
  gross_weight_kg: number;
  carbon_intensity_factor?: number;
}

export interface TradeManifest {
  manifest_id: string;
  shipper: string;
  consignee: string;
  origin_country: string;
  origin_port: string;
  destination_country: string;
  destination_port: string;
  transport_mode: TransportMode;
  departure_date?: string;
  estimated_arrival_date?: string;
  items: ManifestItem[];
  trade_agreement?: TradeAgreement;
  total_declared_value_usd: number;
  metadata?: Record<string, any>;
}

export interface RegulatoryFeedItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevance_score: number;
  category: string;
  published_date?: string;
  regulatory_impact: string;
}

export interface PortCongestion {
  wait_hours: number;
  status: string;
  index: number;
}

export interface TavilyRegulatoryData {
  feed: RegulatoryFeedItem[];
  port_congestion_index: Record<string, PortCongestion>;
  cbam_carbon_price_benchmark_eur: number;
  query_latency_ms: number;
  is_live_tavily?: boolean;
}

export interface HSClassificationComparison {
  item_id: string;
  declared_hs_code: string;
  optimized_hs_code: string;
  declared_tariff_rate: number;
  optimized_tariff_rate: number;
  declared_tariff_usd: number;
  optimized_tariff_usd: number;
  tariff_savings_usd: number;
  legal_justification: string;
  wto_general_rule: string;
  afcfta_preferential_qualifier?: string;
}

export interface CBAMCalculation {
  total_direct_emissions_tco2e: number;
  total_indirect_emissions_tco2e: number;
  eu_ets_benchmark_price_eur: number;
  pre_optimization_cbam_liability_eur: number;
  optimized_cbam_liability_eur: number;
  carbon_credit_offset_eur: number;
  net_cbam_delta_eur: number;
  compliance_roadmap: string[];
}

export interface RouteAlternative {
  route_name: string;
  transit_days: number;
  bunker_fuel_cost_usd: number;
  estimated_emissions_tco2e: number;
  port_risk_score: number;
  total_logistics_cost_usd: number;
  is_recommended: boolean;
  notes: string;
}

export interface TradeOptimizationResult {
  manifest_id: string;
  classification_comparisons: HSClassificationComparison[];
  cbam_assessment: CBAMCalculation;
  route_options: RouteAlternative[];
  total_tariff_savings_usd: number;
  total_carbon_liability_saved_eur: number;
  total_landed_cost_pre_usd: number;
  total_landed_cost_post_usd: number;
  reasoning_summary: string;
  regulatory_citations: string[];
  nebius_model_used: ModelTier;
  reasoning_latency_ms: number;
  estimated_cost_usd: number;
}

export interface HedgingLeg {
  pair: string;
  instrument: string;
  notional_amount: number;
  strike_or_forward_rate: number;
  tenor_days: number;
  hedge_ratio_pct: number;
  settlement_network: string;
  slippage_protection_pct: number;
}

export interface SettlementMilestone {
  milestone: string;
  payout_pct: number;
  trigger: string;
}

export interface FXSettlementPlan {
  trade_id: string;
  base_currency: Currency;
  settlement_currency: Currency;
  current_spot_rate: number;
  projected_volatility_pct: number;
  hedging_strategy: string;
  legs: HedgingLeg[];
  smart_contract_escrow_address?: string;
  settlement_milestones: SettlementMilestone[];
  fx_savings_estimated_usd: number;
  timestamp: string;
}

export interface TelemetryMetrics {
  active_nebius_model: ModelTier;
  endpoint_status: string;
  average_latency_ms: number;
  tavily_api_status: string;
  requests_processed: number;
  cost_accumulated_usd: number;
  tokens_per_second?: number;
}
