import { TradeManifest } from '../types/trade';

export const SAMPLE_MANIFESTS: Record<string, TradeManifest> = {
  cocoa_ghana_rotterdam: {
    manifest_id: "MNF-GH-NLD-2025-0849",
    shipper: "Volta Cocoa Processors Ltd (Tema, Ghana)",
    consignee: "ChocoArtisans BV (Rotterdam, Netherlands)",
    origin_country: "Ghana",
    origin_port: "Port of Tema (GH-TEM)",
    destination_country: "Netherlands",
    destination_port: "Port of Rotterdam (NL-RTM)",
    transport_mode: "MARITIME",
    departure_date: "2025-03-20",
    estimated_arrival_date: "2025-04-07",
    trade_agreement: "EU_CBAM",
    total_declared_value_usd: 1450000.0,
    items: [
      {
        item_id: "LINE-001",
        description: "Organic Single-Origin Cocoa Paste / Liquor (Semi-Processed, 38% Domestic Value Add)",
        declared_hs_code: "1801.00.00", // Erroneously declared as unroasted raw cocoa beans
        quantity: 180.0,
        unit: "Metric Tonnes",
        unit_value: 5800.0,
        total_value: 1044000.0,
        currency: "USD",
        country_of_origin: "Ghana",
        gross_weight_kg: 180000.0,
        carbon_intensity_factor: 0.38
      },
      {
        item_id: "LINE-002",
        description: "Deodorized Cocoa Butter in Food-Grade Corrugated Bulk Containers",
        declared_hs_code: "1804.00.00",
        quantity: 50.0,
        unit: "Metric Tonnes",
        unit_value: 8120.0,
        total_value: 406000.0,
        currency: "USD",
        country_of_origin: "Ghana",
        gross_weight_kg: 50000.0,
        carbon_intensity_factor: 0.45
      }
    ],
    metadata: {
      bill_of_lading: "HLCUGHA2509124",
      vessel_name: "MSC AMALIA V.049W",
      container_count: 12
    }
  },
  solar_shenzhen_portharcourt: {
    manifest_id: "MNF-CN-NGA-2025-4192",
    shipper: "Shenzhen SunWatt Photovoltaics Co., Ltd. (Shenzhen, China)",
    consignee: "Niger Delta Renewable Microgrids Ltd (Port Harcourt, Nigeria)",
    origin_country: "China",
    origin_port: "Port of Shenzhen (CN-SZX)",
    destination_country: "Nigeria",
    destination_port: "Port of Port Harcourt / Onne (NG-PHC)",
    transport_mode: "MARITIME",
    departure_date: "2025-03-25",
    estimated_arrival_date: "2025-04-22",
    trade_agreement: "AFCFTA",
    total_declared_value_usd: 2380000.0,
    items: [
      {
        item_id: "LINE-001",
        description: "High-Efficiency Monocrystalline Photovoltaic Silicon Modules (N-Type TOPCon)",
        declared_hs_code: "8504.40.95", // Erroneously listed under general electrical inverters
        quantity: 6400.0,
        unit: "Panels",
        unit_value: 275.0,
        total_value: 1760000.0,
        currency: "USD",
        country_of_origin: "China",
        gross_weight_kg: 160000.0,
        carbon_intensity_factor: 0.78
      },
      {
        item_id: "LINE-002",
        description: "Modular Lithium Iron Phosphate (LiFePO4) Battery Energy Storage Cabinets (100kWh)",
        declared_hs_code: "8507.60.00",
        quantity: 20.0,
        unit: "Units",
        unit_value: 31000.0,
        total_value: 620000.0,
        currency: "USD",
        country_of_origin: "China",
        gross_weight_kg: 32000.0,
        carbon_intensity_factor: 1.20
      }
    ],
    metadata: {
      bill_of_lading: "COSUSHZ2508819",
      vessel_name: "COSCO SHIPPING LEO",
      container_count: 18
    }
  }
};
