from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class TransportMode(str, Enum):
    MARITIME = "MARITIME"
    AIR_FREIGHT = "AIR_FREIGHT"
    RAIL = "RAIL"
    ROAD = "ROAD"

class TradeAgreement(str, Enum):
    EU_CBAM = "EU_CBAM"
    AFCFTA = "AFCFTA"
    WTO_MFN = "WTO_MFN"
    BILATERAL = "BILATERAL"

class Currency(str, Enum):
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    CNY = "CNY"
    GHS = "GHS"
    NGN = "NGN"

class ModelTier(str, Enum):
    NEMOTRON_NANO = "nvidia/nemotron-nano"
    NEMOTRON_SUPER = "nvidia/nemotron-super"
    NEMOTRON_3_ULTRA = "nvidia/nemotron-3-ultra"

class ManifestItem(BaseModel):
    item_id: str
    description: str
    declared_hs_code: str
    quantity: float
    unit: str
    unit_value: float
    total_value: float
    currency: Currency = Currency.USD
    country_of_origin: str
    gross_weight_kg: float
    carbon_intensity_factor: Optional[float] = Field(
        default=None, description="tCO2e per unit or per metric ton"
    )

class TradeManifest(BaseModel):
    manifest_id: str
    shipper: str
    consignee: str
    origin_country: str
    origin_port: str
    destination_country: str
    destination_port: str
    transport_mode: TransportMode = TransportMode.MARITIME
    departure_date: Optional[str] = None
    estimated_arrival_date: Optional[str] = None
    items: List[ManifestItem]
    trade_agreement: Optional[TradeAgreement] = None
    total_declared_value_usd: float
    metadata: Optional[Dict[str, Any]] = None

class IngestManifestRequest(BaseModel):
    raw_text: Optional[str] = None
    json_data: Optional[Dict[str, Any]] = None
    preset_id: Optional[str] = None

class IngestManifestResponse(BaseModel):
    manifest: TradeManifest
    extracted_by: ModelTier = ModelTier.NEMOTRON_NANO
    extraction_latency_ms: float
    token_usage: Dict[str, int]
    normalization_notes: List[str]

class TavilyRegulatoryQuery(BaseModel):
    ports: List[str]
    origin_country: str
    destination_country: str
    hs_codes: List[str]
    regulation_types: List[str] = ["CBAM", "AfCFTA", "Port Congestion", "Maritime Tariffs"]

class RegulatoryFeedItem(BaseModel):
    title: str
    url: str
    snippet: str
    source: str
    relevance_score: float
    category: str
    published_date: Optional[str] = None
    regulatory_impact: str

class TavilyRegulatoryResponse(BaseModel):
    feed: List[RegulatoryFeedItem]
    port_congestion_index: Dict[str, Any]
    cbam_carbon_price_benchmark_eur: float
    query_latency_ms: float

class HSClassificationComparison(BaseModel):
    item_id: str
    declared_hs_code: str
    optimized_hs_code: str
    declared_tariff_rate: float
    optimized_tariff_rate: float
    declared_tariff_usd: float
    optimized_tariff_usd: float
    tariff_savings_usd: float
    legal_justification: str
    wto_general_rule: str
    afcfta_preferential_qualifier: Optional[str] = None

class CBAMCalculation(BaseModel):
    total_direct_emissions_tco2e: float
    total_indirect_emissions_tco2e: float
    eu_ets_benchmark_price_eur: float
    pre_optimization_cbam_liability_eur: float
    optimized_cbam_liability_eur: float
    carbon_credit_offset_eur: float
    net_cbam_delta_eur: float
    compliance_roadmap: List[str]

class RouteAlternative(BaseModel):
    route_name: str
    transit_days: int
    bunker_fuel_cost_usd: float
    estimated_emissions_tco2e: float
    port_risk_score: float
    total_logistics_cost_usd: float
    is_recommended: bool
    notes: str

class TradeOptimizationResponse(BaseModel):
    manifest_id: str
    classification_comparisons: List[HSClassificationComparison]
    cbam_assessment: CBAMCalculation
    route_options: List[RouteAlternative]
    total_tariff_savings_usd: float
    total_carbon_liability_saved_eur: float
    total_landed_cost_pre_usd: float
    total_landed_cost_post_usd: float
    reasoning_summary: str
    regulatory_citations: List[str]
    nebius_model_used: ModelTier = ModelTier.NEMOTRON_3_ULTRA
    reasoning_latency_ms: float
    estimated_cost_usd: float

class HedgingLeg(BaseModel):
    pair: str
    instrument: str # Forward, Vanilla Option, Smart Contract Collateralized Escrow
    notional_amount: float
    strike_or_forward_rate: float
    tenor_days: int
    hedge_ratio_pct: float
    settlement_network: str # SEPA, Fedwire, Polygon/Base USDC, Pan-African Payment Settlement System (PAPSS)
    slippage_protection_pct: float

class FXSettlementPlan(BaseModel):
    trade_id: str
    base_currency: Currency
    settlement_currency: Currency
    current_spot_rate: float
    projected_volatility_pct: float
    hedging_strategy: str
    legs: List[HedgingLeg]
    smart_contract_escrow_address: Optional[str] = None
    settlement_milestones: List[Dict[str, Any]]
    fx_savings_estimated_usd: float
    timestamp: str

class TelemetryStatus(BaseModel):
    active_nebius_model: ModelTier
    endpoint_status: str
    average_latency_ms: float
    tavily_api_status: str
    requests_processed: int
    cost_accumulated_usd: float
