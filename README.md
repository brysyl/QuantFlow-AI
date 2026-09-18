# QuantFlow - Autonomous Cross-Border Trade & CBAM Settlement Engine

**Built for the Nebius x NVIDIA Global AI Hackathon**

QuantFlow is an autonomous cross-border trade orchestration platform engineered to solve multi-million dollar customs tariff inefficiencies, European Union Carbon Border Adjustment Mechanism (EU CBAM) compliance liabilities, and cross-currency FX volatility across emerging South-South and North-South trade corridors (specifically targeting AfCFTA and EU-Africa/Asia trade routes).

---

## Key Capabilities

1. **AI & LLM Routing Engine (Nebius Serverless Endpoints)**
   - `nvidia/nemotron-3-ultra`: Deep multi-turn legal and tax reasoning, Harmonized System (HS) code re-classification under WTO General Interpretative Rules (GIR 1, 2(a), 3(b)), Article 9 EU CBAM carbon price offset calculations, and quantitative FX hedging structuring.
   - `nvidia/nemotron-nano` / `nemotron-super`: High-throughput, sub-50ms JSON schema extraction, trade manifest data normalization to WCO Data Model v3.9, and operational telemetry routing.

2. **Search & Regulatory Ingestion (Tavily API)**
   - Real-time ingestion of maritime logistics feeds, port congestion indices (wait times, demurrage exposure), and customs tariff changes.
   - Dynamically formats search results into verified statutory context injected into Nemotron-3-Ultra prompts.

3. **Backend Architecture (FastAPI & Microservices)**
   - `/api/v1/manifest/ingest`: Ingests raw invoice/shipment JSON or free-form text with Nemotron Nano.
   - `/api/v1/trade/optimize`: Correlates trade parameters with live Tavily regulatory intelligence, delegates reasoning to Nebius Nemotron-3-Ultra, and computes dual tax compression (customs tariff delta + CBAM carbon tax savings).
   - `/api/v1/settlement/hedging`: Programmatic FX settlement with 65/35 split execution (forward contracts + synthetic collar options) and multi-sig smart-contract milestone escrow.
   - Complete fallback benchmark dataset for deterministic and offline evaluation.

4. **Ops Control Room UI (React, Tailwind CSS, Lucide, Recharts)**
   - High-density dark mode control room dashboard.
   - Live telemetry bar displaying active model, routing status, latency in ms, token usage, and cumulative inference costs.
   - Interactive Panels:
     1. Trade Manifest Ingestion (Preset selector + interactive JSON schema editor).
     2. Live Regulatory & Maritime Intelligence Feed (powered by Tavily API).
     3. HS Code & CBAM Tariff Optimization Card (Before vs. After tariff comparison, Recharts visualizations, statutory citations).
     4. Dynamic Maritime Route & Programmatic FX Settlement Matrix (Multi-sig milestone escrow with Oracle verification).

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application & API routes
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── trade.py                # Pydantic schemas (WCO, CBAM, FX)
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── nebius_service.py       # Nebius NVIDIA Nemotron client wrapper
│   │       └── tavily_service.py       # Tavily Search API client
│   └── requirements.txt                # Python dependencies
│
├── frontend/
│   ├── components/
│   │   ├── Dashboard.tsx               # Master Ops Control Room UI
│   │   ├── TelemetryBar.tsx            # Live Model Telemetry Bar
│   │   ├── ManifestIngest.tsx          # Panel 1: Manifest Ingestion
│   │   ├── RegulatoryFeed.tsx          # Panel 2: Tavily Search Feed
│   │   ├── TariffOptimizationCard.tsx  # Panel 3: HS & CBAM Optimization
│   │   └── SettlementMatrix.tsx        # Panel 4: FX & Escrow Matrix
│   ├── data/
│   │   └── sampleManifests.ts          # Pre-loaded benchmark datasets
│   └── types/
│       └── trade.ts                    # TypeScript interface definitions
│
├── src/
│   ├── App.tsx                         # Main Application Entry
│   ├── main.tsx                        # React DOM mounting
│   └── index.css                       # Global Tailwind CSS styles
│
├── .env.example                        # Documented environment variables
└── README.md
```

---

## Environment Variables

Configure your `.env` file with credentials for live inference:

```bash
# Nebius Serverless Endpoints API Token
NEBIUS_API_KEY="your_nebius_api_key_here"

# Nebius OpenAI-compatible endpoint URL (defaults to https://api.studio.nebius.ai/v1)
NEBIUS_BASE_URL="https://api.studio.nebius.ai/v1"

# Tavily Search API Key for real-time customs & port intelligence
TAVILY_API_KEY="tvly-your_tavily_api_key_here"
```

*Note: If no API keys are provided, QuantFlow automatically runs in deterministic benchmark mode using the pre-loaded real-world datasets (Cocoa shipment Ghana ➔ Rotterdam and Solar components Shenzhen ➔ Port Harcourt).*

---

## Installation & Running Locally

### 1. Running the FastAPI Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI server on port 8000
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger API documentation will be available at `http://localhost:8000/docs`.

### 2. Running the Frontend Control Room

```bash
# In the root directory:
npm install
npm run dev
```

The web dashboard will start on `http://localhost:3000`.

---

## Benchmark Datasets Included

1. **Cocoa Consignment: Ghana (Tema) ➔ Netherlands (Rotterdam)**
   - Corridor: AfCFTA / EU Economic Partnership Agreement & EU CBAM.
   - Problem: Misdeclared as raw unroasted beans (HS 1801.00) subject to 9.6% MFN duty and punitive default CBAM emissions benchmark.
   - Nemotron-3-Ultra Resolution: Re-classifies to HS 1803.10 with verified 38% local beneficiation, unlocking 0% reciprocal duty and saving **$131,486.00** in customs tariffs, plus **€6,626.38** in CBAM carbon tax deductions under Article 9.

2. **Solar Microgrid Hardware: China (Shenzhen) ➔ Nigeria (Port Harcourt)**
   - Corridor: Clean Tech Import & AfCFTA Green Corridor.
   - Problem: Erroneously listed under general electrical inverters (HS 8504.40) at 14.5% tariff.
   - Nemotron-3-Ultra Resolution: Re-classifies to HS 8541.43 under WTO GIR 2(a), reducing duty to 2.5% and unlocking **$242,200.00** in customs savings.

---

## License

Apache-2.0. Built for the Nebius x NVIDIA Global AI Hackathon.
