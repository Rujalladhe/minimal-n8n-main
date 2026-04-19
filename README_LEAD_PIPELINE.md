# Universal Lead Intelligence Pipeline

A complete lead intelligence system that integrates into the Workflow Builder. Any website can embed a form that feeds through AI-powered research, enrichment, scoring, and a real-time dashboard.

## Architecture Overview

```
[Embeddable Form] → [Webhook Trigger] → [Research Agent] → [AI Score Engine] → [Lead Classifier] → [KPI Dashboard]
                                              ↓                    ↑                                       ↓
                                     [HTTP Enrichment x3] --------+                              [AI Chatbot]
                                     (Apollo, FMP, Companies API)
```

## Quick Start

### 1. Set Up API Keys

Add to your `.env` file:

```bash
# Required (already configured)
GEMINI_API_KEY="your-gemini-key"

# Optional enrichment APIs (free tiers)
APOLLO_API_KEY=""           # 50 enrichments/month free - https://www.apollo.io/
FMP_API_KEY=""              # 250 requests/day free - https://financialmodelingprep.com/
FINNHUB_API_KEY=""          # 60 calls/minute free - https://finnhub.io/
COMPANIES_API_KEY=""        # Basic lookups free - https://thecompaniesapi.com/

# Admin
ADMIN_KEY="change-me-admin-key"
```

> **Note:** The pipeline works WITHOUT enrichment API keys. Research Agent uses Gemini AI for company research, and the Score Engine will still generate scores and verdicts from available data.

### 2. Create a Workflow

1. Open the editor at `/editor`
2. Drag these nodes onto the canvas and connect them in order:
   - **Webhook Trigger** (set path to `/onboarding`)
   - **Research Agent** (uses template variables from webhook data)
   - **AI Scoring Engine** (processes research output)
   - **Lead Classifier** (categorizes as HOT/WARM/COLD)
   - **KPI Dashboard** (displays visual intelligence)
3. Save the workflow

### 3. Embed the Form

Add this snippet to any website:

```html
<div id="lead-intel-form"></div>
<script src="https://YOUR_DOMAIN/embed/form.js"
  data-webhook="https://YOUR_DOMAIN/api/workflows/webhook/onboarding"
  data-client-key="CLIENT_KEY_DEMO"
  data-theme="light">
</script>
```

Replace `YOUR_DOMAIN` with your actual deployment URL.

### 4. Register Clients

Edit `config/clients.json` to add client API keys:

```json
{
  "MY_CLIENT_KEY": {
    "name": "My Website",
    "owner": "me@example.com",
    "plan": "free",
    "allowedDomain": "example.com",
    "createdAt": "2024-01-01"
  }
}
```

## New Nodes

| Node | Type | Category | Description |
|------|------|----------|-------------|
| Research Agent | `researchAgent` | AI | AI-powered company research using Gemini |
| AI Scoring Engine | `aiScoreEngine` | AI | Deterministic scoring + AI verdict |
| Lead Classifier | `leadClassifier` | Logic | HOT/WARM/COLD classification |
| KPI Dashboard | `kpiDashboard` | Action | Visual lead intelligence dashboard |

## Embeddable Form

### Features
- **Shadow DOM** — CSS-isolated, won't conflict with host site styles
- **Vanilla JS** — No dependencies, ~8KB
- **Responsive** — Works on mobile and desktop
- **Themed** — Supports `data-theme="light"` or `data-theme="dark"`
- **CORS-safe** — Webhook endpoint handles preflight requests

### Form Fields
| Field | Type | Required |
|-------|------|----------|
| Company Name | text | ✓ |
| Website/Domain | text | ✓ |
| Industry | dropdown | |
| Company Size | dropdown | |
| City/Location | text | |
| Contact Name | text | ✓ |
| Contact Email | email | ✓ |
| Phone | tel | |
| Intent | textarea | |

## Scoring Logic

### Deterministic Signals (Step 1)
| Signal | Points |
|--------|--------|
| Revenue > $100M | +30 |
| Revenue > $10M | +20 |
| Revenue > $1M | +10 |
| Revenue growth > 30% | +20 |
| Revenue growth > 10% | +10 |
| Large team (500+) | +10 |
| Mid-size team (50+) | +5 |
| Funded < 6 months ago | +25 |
| Funded < 18 months ago | +15 |
| Has funding history | +5 |
| Traffic growing > 20% MoM | +10 |
| Self-reported large company | +5 |

### AI Verdict (Step 2)
After numeric scoring, Gemini AI provides:
- **Verdict:** HOT / WARM / COLD
- **Confidence:** 0.0–1.0
- **Reasoning:** 2-3 sentence explanation
- **Green/Red Flags**
- **Recommended Action**
- **Estimated Deal Size**
- **Best Outreach Angle**

### Classification Thresholds
| Score | Tier | Priority |
|-------|------|----------|
| ≥ 70 | 🔥 HOT | Immediate |
| ≥ 40 | 🟡 WARM | Nurture |
| < 40 | 🔵 COLD | Monitor |

## KPI Dashboard

The dashboard renders inside the node config panel when you double-click the KPI Dashboard node. It shows:

1. **Score Gauge** — Circular arc, 0-100, color-coded
2. **Tier Badge** — HOT/WARM/COLD pill
3. **AI Verdict** — Reasoning text
4. **KPI Grid** — Revenue, growth, employees, funding, traffic
5. **Green Flags** — Positive signals
6. **Red Flags** — Concerns
7. **Recommended Action** — Highlighted next step
8. **Best Outreach Angle** — Sales talking point
9. **Estimated Deal Size** — If available

## AI Chatbot Integration

The existing AI Chatbot node now supports **company context mode**. When it receives enrichment + scoring data as input, it automatically becomes a sales intelligence assistant that can answer questions like:

- "Why is this a HOT lead?"
- "What's their funding history?"
- "What angle should I use in my pitch?"
- "Summarize this company in 3 sentences"

The chatbot includes an interactive chat interface directly in the config panel.

## Admin API

```
GET /api/admin/clients?admin_key=YOUR_ADMIN_KEY
```

Returns list of registered clients. Protected by `ADMIN_KEY` env var.

## API Free Tier Limits

| API | Free Tier | Rate Limit |
|-----|-----------|------------|
| Apollo.io | 50 enrichments/month | — |
| Financial Modeling Prep | 250 requests/day | — |
| Finnhub | Unlimited | 60 calls/minute |
| The Companies API | Basic lookups | — |
| Google Gemini | Varies by model | Check dashboard |

## Graceful Degradation

The pipeline is designed to work with **partial data**:
- If enrichment APIs fail → pipeline continues with available data
- If no API keys configured → Research Agent still uses Gemini for intelligence
- If AI verdict fails → falls back to numeric score only
- All null fields display as "—" in the dashboard
