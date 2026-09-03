# Meridian × Alchemy Capital — AI Agentic Automation (Prototype)

A working prototype for the BRD *"Alchemy Capital AI Agentic Automation" (v2, Oct-2025)*,
built by **Meridian Data & AI**.

React (Vite) frontend + FastAPI backend deployed as Vercel serverless functions.
All data is **synthetic** and the "AI agents" are **deterministic / rule-based**, so the
prototype runs fully offline with no model calls while keeping the API shape of a real
agent orchestrator.

## Modules

| BRD use case | Module | What it does |
|---|---|---|
| 1.1 Regulatory Change Monitoring | **Regulatory Change Monitoring** | Ingests SEBI / IFSCA circulars, auto-classifies (category, obligation, effective date, impacted policies, summary), one-click push of AI-suggested actionables to the calendar |
| 1.1 / 2 Compliance Calendar & Alerts | **Compliance Calendar** | Tracked deadlines + agent-generated tasks, automatic overdue flagging, status tracking, source-circular traceability |
| 1.3 KYC / AML / World-Check | **KYC Screening** | Fuzzy sanctions / PEP / adverse-media matching, risk scoring & band, one-pager risk report with EDD checklist and recommended decision |
| 1.4 Regulatory Orders & Knowledge Mgmt | **Regulatory Orders** | AI summaries of SEBI orders + conversational Q&A over the case knowledge base with citations |
| 1.8 / 1.5 Policy Actionables & Checklists | **Policy Checklists** | Decomposes a policy into a trackable compliance checklist with completion progress |
| 1.9 Exception Reports – Proprietary Trading | **Prop Trading** | Reconciles prop vs client trades; flags contra-trade timing, same-side sequencing (front-running) and conflicting same-day trades |

The **Dashboard** shows the full 24-use-case register from section 2 of the BRD with
priority / impact, and links into the live modules.

## Architecture

```
api/index.py        FastAPI app — the Vercel serverless entrypoint
api/seed.py         synthetic circulars, orders, policies, watchlist, use cases
frontend/           React + Vite SPA
frontend/src/store.js   client-side state (localStorage)
vercel.json         build config + /api/* rewrite to the Python function
```

**The API is deliberately stateless.** Vercel serverless instances are ephemeral and not
shared between requests, so the API only serves seed/reference data and pure computation
(screening, retrieval, reconciliation). Everything the user mutates — calendar tasks,
generated checklists, screening history, circular review flags — lives in
`frontend/src/store.js` and persists to `localStorage`. "Reset demo data" in the sidebar
clears it.

## Branding

Themed on the Meridian palette — `#2549E8` blue and `#9B7BFF` violet
(`--brand-blue` / `--brand-violet` in `frontend/src/styles.css`), light theme.
The official transparent lockup is at `frontend/src/assets/meridian-logo.png`
(imported by `Logo.jsx` so Vite bundles and fingerprints it) and served as the favicon
from `frontend/public/brand/meridian.png`.

## Run locally

Requires **Python 3.11 or 3.12** (3.14 has no prebuilt `pydantic-core` wheel) and Node 18+.

### 1. API — port 8123
```bash
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn api.index:app --reload --port 8123
```
`requirements.txt` holds only what Vercel needs; `requirements-dev.txt` adds uvicorn for
local serving (Vercel supplies its own ASGI server).

### 2. Frontend — port 5173
```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints. It proxies `/api` to port 8123 (see `frontend/vite.config.js`).

## Deploy to Vercel

Import the repository in Vercel and accept the defaults — `vercel.json` supplies
everything:

- **Build**: `cd frontend && npm install && npm run build`
- **Output**: `frontend/dist`
- **Rewrites**: `/api/*` → the Python function, everything else → `index.html` (SPA)

Vercel auto-detects `api/index.py` as a Python serverless function and installs
`requirements.txt`. No environment variables are needed.
