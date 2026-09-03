"""
Meridian × Alchemy Capital — AI Agentic Automation (prototype API)
==================================================================

Deployed on Vercel as a Python serverless function. This file is the entrypoint;
`vercel.json` rewrites every /api/* request here and FastAPI does the routing.

The service is deliberately **stateless** — serverless instances are ephemeral and
not shared, so anything the user mutates (calendar tasks, checklists, screening
history) is owned by the client (see `frontend/src/store.js`). This API only:

  * serves seed / reference data      (circulars, orders, policies, use cases)
  * performs pure computation         (screening, retrieval, reconciliation)

The "AI" is deterministic and rule-based so the prototype runs offline with no
model calls, while the API shape mirrors a real agent orchestrator.

Run locally:  uvicorn api.index:app --reload --port 8123
"""
from __future__ import annotations

import os
import re
import sys
from datetime import datetime, timedelta
from difflib import SequenceMatcher

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Vercel executes this file directly, so make sibling modules importable
# regardless of how the process was started.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import seed  # noqa: E402

app = FastAPI(title="Alchemy Capital AI Agentic Automation – Prototype API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Reference data
# ============================================================================
@app.get("/api/usecases")
def usecases():
    """The 24-use-case register from section 2 of the BRD."""
    return seed.USE_CASES


@app.get("/api/dashboard")
def dashboard():
    """Static programme counts. Live counts that depend on user actions
    (calendar, screenings) are computed client-side from the store."""
    return {
        "use_case_total": len(seed.USE_CASES),
        "use_cases_by_priority": _group_count(seed.USE_CASES, "priority"),
        "use_cases_by_function": _group_count(seed.USE_CASES, "function"),
        "live_modules": sorted({u["module"] for u in seed.USE_CASES if u["module"]}),
        "circulars_total": len(seed.CIRCULARS),
        "orders_indexed": len(seed.ORDERS),
    }


def _group_count(rows, key):
    out = {}
    for r in rows:
        out[r[key]] = out.get(r[key], 0) + 1
    return out


@app.get("/api/circulars")
def list_circulars():
    """Regulator circulars with the monitoring agent's classification and
    suggested actionables (UC 1.1)."""
    return seed.CIRCULARS


@app.get("/api/calendar/seed")
def calendar_seed():
    """Baseline statutory deadlines the client seeds its calendar with (UC 1.2)."""
    return seed.CALENDAR_TASKS


@app.get("/api/orders")
def list_orders():
    """SEBI orders knowledge base with AI summaries (UC 1.4)."""
    return seed.ORDERS


@app.get("/api/policies")
def list_policies():
    """Policies plus the checklist the agent derives from each (UC 1.8)."""
    return [
        {"id": p["id"], "name": p["name"], "version": p["version"], "checklist": p["checklist"]}
        for p in seed.POLICIES
    ]


@app.get("/api/proptrading/sample")
def sample_trades():
    """A sample blotter that trips each proprietary-trading rule (UC 1.9)."""
    base = datetime(2025, 8, 1, 9, 30)
    return [
        {"id": "P-01", "book": "Proprietary", "symbol": "INFY", "side": "BUY", "qty": 500,
         "price": 1580.0, "ts": base.isoformat()},
        {"id": "C-01", "book": "Client", "symbol": "INFY", "side": "BUY", "qty": 2000,
         "price": 1582.5, "ts": (base + timedelta(minutes=12)).isoformat()},
        {"id": "P-02", "book": "Proprietary", "symbol": "INFY", "side": "SELL", "qty": 500,
         "price": 1611.0, "ts": (base + timedelta(days=20)).isoformat()},
        {"id": "P-03", "book": "Proprietary", "symbol": "TCS", "side": "BUY", "qty": 300,
         "price": 3900.0, "ts": (base + timedelta(days=2)).isoformat()},
        {"id": "C-02", "book": "Client", "symbol": "TCS", "side": "SELL", "qty": 800,
         "price": 3895.0, "ts": (base + timedelta(days=2, minutes=5)).isoformat()},
        {"id": "P-04", "book": "Proprietary", "symbol": "HDFCBANK", "side": "BUY", "qty": 400,
         "price": 1650.0, "ts": (base + timedelta(days=5)).isoformat()},
    ]


# ============================================================================
# UC 1.3 — KYC / AML / World-Check screening  (pure)
# ============================================================================
class KycReq(BaseModel):
    name: str
    entity_type: str = "Resident Individual"
    country: str = "India"
    pan: str = ""


def _similar(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


@app.post("/api/kyc/screen")
def kyc_screen(req: KycReq):
    name = req.name.strip()
    if not name:
        raise HTTPException(400, "name is required")

    matches = []
    for w in seed.WATCHLIST:
        score = _similar(name, w["name"])
        set_a, set_b = set(name.lower().split()), set(w["name"].lower().split())
        if set_a & set_b:
            score = max(score, len(set_a & set_b) / max(len(set_a | set_b), 1) + 0.15)
        if score >= 0.55:
            matches.append({
                "list_name": w["name"],
                "category": w["type"],
                "note": w["note"],
                "match_score": round(min(score, 0.99), 2),
            })
    matches.sort(key=lambda m: -m["match_score"])

    reasons = []
    score = 10
    if any(m["category"] == "Sanctions" for m in matches):
        score += 70
        reasons.append("Potential sanctions-list match")
    if any(m["category"] == "PEP" for m in matches):
        score += 35
        reasons.append("Politically Exposed Person match")
    if any(m["category"] == "Adverse Media" for m in matches):
        score += 20
        reasons.append("Adverse media reference found")
    if req.country in seed.HIGH_RISK_COUNTRIES:
        score += 25
        reasons.append(f"High-risk / monitored jurisdiction: {req.country}")
    if req.entity_type in ("Trust", "Complex Entity", "Corporate – Foreign"):
        score += 15
        reasons.append(f"Entity type requires enhanced due diligence: {req.entity_type}")
    if not req.pan and req.entity_type == "Resident Individual":
        score += 5
        reasons.append("PAN not provided")
    if not reasons:
        reasons.append("No watchlist hits; standard due diligence sufficient")

    score = min(score, 99)
    band = "High" if score >= 60 else "Medium" if score >= 30 else "Low"
    decision = {
        "High": "Escalate to Principal Officer – EDD required before onboarding",
        "Medium": "Proceed with enhanced checks and senior sign-off",
        "Low": "Proceed with standard onboarding",
    }[band]

    return {
        "screened_at": datetime.now().isoformat(timespec="seconds"),
        "subject": {"name": name, "entity_type": req.entity_type,
                    "country": req.country, "pan": req.pan or "—"},
        "risk_score": score,
        "risk_band": band,
        "recommended_action": decision,
        "reasons": reasons,
        "matches": matches,
        "edd_checklist": [
            "Obtain certified ID & address proof",
            "Establish source of funds / source of wealth",
            "Screen all beneficial owners (>=10%)",
            "Senior management approval recorded",
            "Set ongoing-monitoring frequency",
        ] if band != "Low" else [
            "Standard ID & address proof",
            "Screen beneficial owners (>=25%)",
        ],
    }


# ============================================================================
# UC 1.4 — Conversational retrieval over the orders knowledge base  (pure)
# ============================================================================
class ChatReq(BaseModel):
    question: str


@app.post("/api/orders/chat")
def orders_chat(req: ChatReq):
    q = req.question.lower()
    q_tokens = set(re.findall(r"[a-z]+", q))
    scored = []
    for o in seed.ORDERS:
        hay = (o["title"] + " " + o["summary"] + " " + " ".join(o["keywords"]) +
               " " + o["regulation"] + " " + o["entity"]).lower()
        overlap = len(q_tokens & set(re.findall(r"[a-z]+", hay)))
        kw_hits = sum(1 for k in o["keywords"] if k in q)
        s = overlap + kw_hits * 3
        if s > 0:
            scored.append((s, o))
    scored.sort(key=lambda x: -x[0])
    top = [o for _, o in scored[:3]]

    if not top:
        answer = ("I could not find a matching SEBI order in the knowledge base. Try keywords "
                  "like 'insider trading', 'AML', 'conflict of interest', 'marketing' or 'KYC'.")
    else:
        lead = top[0]
        answer = (f"Based on {len(top)} matching order(s), the most relevant is "
                  f"**{lead['id']} – {lead['entity']}** ({lead['date']}), under {lead['regulation']}. "
                  f"{lead['summary']} Penalty: {lead['penalty']}.")
        if len(top) > 1:
            answer += " Other related orders: " + ", ".join(o["id"] for o in top[1:]) + "."

    return {"answer": answer, "citations": [
        {"id": o["id"], "title": o["title"], "date": o["date"], "penalty": o["penalty"]} for o in top
    ]}


# ============================================================================
# UC 1.9 — Proprietary trading reconciliation  (pure)
# ============================================================================
class Trade(BaseModel):
    id: str
    book: str          # "Proprietary" | "Client"
    symbol: str
    side: str          # "BUY" | "SELL"
    qty: int
    price: float
    ts: str            # ISO datetime


class ReconReq(BaseModel):
    trades: list[Trade]
    contra_window_days: int = 60


@app.post("/api/proptrading/reconcile")
def reconcile(req: ReconReq):
    trades = sorted(req.trades, key=lambda t: t.ts)
    exceptions = []
    prop = [t for t in trades if t.book.lower().startswith("prop")]
    client = [t for t in trades if t.book.lower().startswith("client")]

    def parse(ts: str) -> datetime:
        return datetime.fromisoformat(ts.replace("Z", ""))

    # Rule 1 — contra trade inside the restricted window on the proprietary book
    by_symbol: dict[str, list[Trade]] = {}
    for t in prop:
        by_symbol.setdefault(t.symbol, []).append(t)
    for sym, lst in by_symbol.items():
        for i in range(len(lst)):
            for j in range(i + 1, len(lst)):
                a, b = lst[i], lst[j]
                if a.side != b.side:
                    gap = (parse(b.ts) - parse(a.ts)).days
                    if gap <= req.contra_window_days:
                        exceptions.append({
                            "rule": "Contra trade within restricted window",
                            "severity": "High", "symbol": sym,
                            "detail": f"{a.side} {a.id} then {b.side} {b.id} on {sym} "
                                      f"only {gap} day(s) apart (limit {req.contra_window_days}).",
                            "trades": [a.id, b.id],
                        })

    # Rule 2 — proprietary order ahead of a same-side client order (front-running)
    for p in prop:
        for c in client:
            if p.symbol == c.symbol and p.side == c.side:
                dp, dc = parse(p.ts), parse(c.ts)
                if dp.date() == dc.date() and dp < dc:
                    exceptions.append({
                        "rule": "Same-side sequencing – potential front-running",
                        "severity": "High", "symbol": p.symbol,
                        "detail": f"Proprietary {p.side} {p.id} at {p.ts} precedes client "
                                  f"{c.side} {c.id} at {c.ts} on {p.symbol}.",
                        "trades": [p.id, c.id],
                    })

    # Rule 3 — opposite-side same-day prop vs client (conflicting trade)
    for p in prop:
        for c in client:
            if p.symbol == c.symbol and p.side != c.side:
                if parse(p.ts).date() == parse(c.ts).date():
                    exceptions.append({
                        "rule": "Conflicting trade – opposite side vs client same day",
                        "severity": "Medium", "symbol": p.symbol,
                        "detail": f"Proprietary {p.side} {p.id} vs client {c.side} {c.id} "
                                  f"on {p.symbol} same day.",
                        "trades": [p.id, c.id],
                    })

    return {
        "summary": {
            "total_trades": len(trades),
            "proprietary": len(prop),
            "client": len(client),
            "exceptions": len(exceptions),
            "high": sum(1 for e in exceptions if e["severity"] == "High"),
            "status": "FAIL – review required" if exceptions else "PASS – no conflicts detected",
        },
        "exceptions": exceptions,
    }


@app.get("/api/health")
def health():
    return {"ok": True, "service": "alchemy-agentic-prototype", "stateless": True}
