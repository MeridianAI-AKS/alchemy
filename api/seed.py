"""Seed data for the Alchemy Capital AI Agentic Automation prototype.

All data is illustrative / synthetic and lives in memory only.
"""

# --------------------------------------------------------------------------
# 1. Use-case catalogue (Section 2 of the BRD)
# --------------------------------------------------------------------------
USE_CASES = [
    {"sl": 1, "function": "Compliance", "name": "Regulatory Change Monitoring",
     "benefit": "Tracks updates from SEBI / IFSCA; ensures timely compliance.",
     "frequency": "Event based", "priority": "High", "impact": "High", "module": "regulatory-monitoring"},
    {"sl": 2, "function": "Compliance", "name": "Compliance Calendar & Alerts",
     "benefit": "Tracks deadlines, builds monthly task calendar, sends alerts.",
     "frequency": "Monthly / on demand", "priority": "High", "impact": "High", "module": "calendar"},
    {"sl": 3, "function": "Compliance", "name": "Personal Trading Review",
     "benefit": "Monitors employee trades against depository statements.",
     "frequency": "Quarterly / on demand", "priority": "Low", "impact": "Medium", "module": None},
    {"sl": 4, "function": "Compliance", "name": "KYC / AML World-Check Screening",
     "benefit": "Automates World-Check screening and ongoing monitoring.",
     "frequency": "Event based", "priority": "High", "impact": "High", "module": "kyc"},
    {"sl": 5, "function": "Compliance", "name": "Review Regulatory Orders (SEBI)",
     "benefit": "Extracts, analyses and summarises SEBI orders relevant to Alchemy.",
     "frequency": "Event based", "priority": "Medium", "impact": "High", "module": "orders"},
    {"sl": 6, "function": "Compliance", "name": "Review Policies vs Regulatory Changes",
     "benefit": "Identifies impacted policies and suggests updates.",
     "frequency": "Annual / event based", "priority": "Medium", "impact": "High", "module": "checklists"},
    {"sl": 7, "function": "Compliance", "name": "SOPs & Process Creation",
     "benefit": "Scans folders and prepares facts / process for exceptions.",
     "frequency": "Annual / event based", "priority": "Medium", "impact": "High", "module": None},
    {"sl": 8, "function": "Compliance", "name": "Induction & Refresher Training",
     "benefit": "Automates training materials and quizzes aligned with policies.",
     "frequency": "Annual / event based", "priority": "Low", "impact": "Medium", "module": None},
    {"sl": 9, "function": "Compliance", "name": "Commercial Terms Summary",
     "benefit": "Quick reference for fund commercial terms.",
     "frequency": "One time", "priority": "Medium", "impact": "High", "module": None},
    {"sl": 10, "function": "Compliance", "name": "Track Actionables from Policies",
     "benefit": "Improves governance, reduces non-compliance risk.",
     "frequency": "Annual / event based", "priority": "High", "impact": "High", "module": "checklists"},
    {"sl": 11, "function": "Compliance", "name": "Exception Reports – Proprietary Trading",
     "benefit": "Detects potential violations early, supports regulatory reporting.",
     "frequency": "Quarterly", "priority": "Medium", "impact": "High", "module": "prop-trading"},
    {"sl": 12, "function": "Compliance", "name": "Prepare & File CTR / Periodic Reports",
     "benefit": "Meets regulatory reporting requirements.",
     "frequency": "Quarterly", "priority": "High", "impact": "High", "module": None},
    {"sl": 13, "function": "Legal", "name": "Contract Review",
     "benefit": "Reviews contracts against pre-set templates.",
     "frequency": "Event based", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 14, "function": "Legal", "name": "Drafting Standard Legal Documents",
     "benefit": "Speeds up drafting and ensures legal consistency.",
     "frequency": "Event based", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 15, "function": "Legal", "name": "Proofreading of Offer Documents",
     "benefit": "AI-based vetting of Word and printer versions.",
     "frequency": "Annual / event based", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 16, "function": "Legal", "name": "Prepare & Compile PPM",
     "benefit": "Improves document quality, ensures legal compliance.",
     "frequency": "Event based", "priority": "Medium", "impact": "High", "module": None},
    {"sl": 17, "function": "Secretarial", "name": "Board & AGM Meeting Management",
     "benefit": "Auto-generates meeting packs, minutes and approval tracking.",
     "frequency": "Quarterly", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 18, "function": "Secretarial", "name": "Regulatory Filing Preparation",
     "benefit": "Fact checks and ensures accuracy / consistency.",
     "frequency": "Event based", "priority": "High", "impact": "High", "module": None},
    {"sl": 19, "function": "Secretarial", "name": "Preparation of Statutory Registers",
     "benefit": "Digitally maintains registers like shareholding, resolutions.",
     "frequency": "Event based", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 20, "function": "Marketing", "name": "Review Marketing Docs vs SEBI Code",
     "benefit": "Ensures compliance with SEBI Code, speeds up approvals.",
     "frequency": "Monthly / on demand", "priority": "High", "impact": "High", "module": None},
    {"sl": 21, "function": "Marketing", "name": "Benchmark Peer Websites & Socials",
     "benefit": "Benchmarks brand positioning, tone and disclosures.",
     "frequency": "Annual / event based", "priority": "Low", "impact": "Medium", "module": None},
    {"sl": 22, "function": "Products", "name": "Create Master DDQs",
     "benefit": "Automates DDQ drafts from past data; standardises responses.",
     "frequency": "Annual / event based", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 23, "function": "Portal", "name": "E-Dealing Portal Testing & Migration",
     "benefit": "Assists in creating scenarios for error identification.",
     "frequency": "One time", "priority": "Medium", "impact": "Medium", "module": None},
    {"sl": 24, "function": "Portal", "name": "Assess Defaulters (Penal Action Matrix)",
     "benefit": "Standardises disciplinary actions, ensures fair treatment.",
     "frequency": "Event based", "priority": "Medium", "impact": "Medium", "module": None},
]

# --------------------------------------------------------------------------
# 2. Regulatory circulars  (Use case 1.1)
# --------------------------------------------------------------------------
CIRCULARS = [
    {
        "id": "CIR-2025-014",
        "regulator": "SEBI",
        "title": "Master Circular for Portfolio Managers – amendments to fee disclosure and "
                 "periodic reporting timelines",
        "published": "2025-08-28",
        "source_url": "https://www.sebi.gov.in/legal/circulars/aug-2025/pms-master-circular",
        "raw_excerpt": "Portfolio Managers shall disclose fees in the prescribed format and file "
                       "the monthly APMI report within 7 working days of month-end. Client-level "
                       "performance reporting must be provided on a half-yearly basis.",
        # Fields below are produced by the "AI classification agent"
        "ai": {
            "category": "Portfolio Management Services",
            "obligation_type": "Periodic Reporting",
            "impact": "High",
            "effective_date": "2025-10-01",
            "affected_policies": ["PMS Operations Policy", "Client Reporting SOP"],
            "summary": "Monthly APMI report deadline tightened to 7 working days; half-yearly "
                       "client performance reporting becomes mandatory; fee disclosure format revised.",
            "suggested_actionables": [
                {"title": "Update APMI monthly report workflow to T+7 working days", "owner": "Compliance Ops", "days": 21},
                {"title": "Build half-yearly client performance reporting template", "owner": "Client Reporting", "days": 30},
                {"title": "Revise fee disclosure format in onboarding pack", "owner": "Legal", "days": 25},
            ],
        },
    },
    {
        "id": "CIR-2025-021",
        "regulator": "SEBI",
        "title": "Cyber Security and Cyber Resilience Framework for AIFs and Portfolio Managers",
        "published": "2025-09-01",
        "source_url": "https://www.sebi.gov.in/legal/circulars/sep-2025/cscrf-pms-aif",
        "raw_excerpt": "Regulated entities must conduct VAPT twice a year, appoint a designated "
                       "officer for cyber incidents, and report cyber incidents to SEBI within 6 hours "
                       "of detection. Board-approved cyber policy to be reviewed annually.",
        "ai": {
            "category": "Information Technology / Cyber",
            "obligation_type": "Policy + Incident Reporting",
            "impact": "High",
            "effective_date": "2025-12-01",
            "affected_policies": ["IT & Cyber Security Policy", "Business Continuity Plan", "Incident Response SOP"],
            "summary": "Half-yearly VAPT, 6-hour cyber incident reporting to SEBI, designated cyber "
                       "officer, and annual board review of the cyber policy are now mandatory.",
            "suggested_actionables": [
                {"title": "Schedule half-yearly VAPT with empanelled vendor", "owner": "IT", "days": 45},
                {"title": "Define 6-hour cyber incident escalation & SEBI reporting runbook", "owner": "IT / Compliance", "days": 20},
                {"title": "Board approval for updated IT & Cyber Security Policy", "owner": "Company Secretary", "days": 60},
            ],
        },
    },
    {
        "id": "CIR-2025-027",
        "regulator": "IFSCA",
        "title": "Circular on KYC norms and beneficial ownership identification for Fund "
                 "Management Entities in GIFT IFSC",
        "published": "2025-09-02",
        "source_url": "https://www.ifsca.gov.in/circular/kyc-bo-fme-2025",
        "raw_excerpt": "FMEs must identify beneficial owners holding 10% or more, screen all "
                       "onboarded investors against UN and domestic sanctions lists, and refresh "
                       "high-risk client KYC every year.",
        "ai": {
            "category": "KYC / AML",
            "obligation_type": "Onboarding Control",
            "impact": "Medium",
            "effective_date": "2025-11-01",
            "affected_policies": ["AML / CFT Policy", "Client Onboarding SOP", "Risk Categorisation Matrix"],
            "summary": "Beneficial-owner threshold set at 10%, mandatory sanctions screening for all "
                       "investors, and annual KYC refresh for high-risk clients.",
            "suggested_actionables": [
                {"title": "Lower beneficial ownership capture threshold to 10% in onboarding form", "owner": "Compliance Ops", "days": 15},
                {"title": "Enable annual KYC refresh reminders for high-risk clients", "owner": "Compliance Ops", "days": 30},
            ],
        },
    },
    {
        "id": "CIR-2025-030",
        "regulator": "SEBI",
        "title": "Ease of doing business – standardised timelines for investor grievance "
                 "redressal via SCORES 2.0",
        "published": "2025-09-03",
        "source_url": "https://www.sebi.gov.in/legal/circulars/sep-2025/scores-2-timelines",
        "raw_excerpt": "Entities must resolve investor complaints within 21 calendar days and "
                       "provide an ATR on SCORES. Unresolved complaints escalate to the designated "
                       "authority automatically.",
        "ai": {
            "category": "Investor Grievance",
            "obligation_type": "Process / Turnaround Time",
            "impact": "Low",
            "effective_date": "2025-10-15",
            "affected_policies": ["Investor Grievance Redressal Policy"],
            "summary": "Complaint resolution SLA fixed at 21 calendar days with mandatory ATR filing "
                       "on SCORES 2.0 and auto-escalation of breaches.",
            "suggested_actionables": [
                {"title": "Reconfigure grievance tracker SLA to 21 calendar days", "owner": "Compliance Ops", "days": 10},
            ],
        },
    },
]

# --------------------------------------------------------------------------
# 3. Compliance calendar – pre-seeded recurring tasks (Use case 1.1 / 2)
# --------------------------------------------------------------------------
CALENDAR_TASKS = [
    {"id": "TSK-1001", "title": "Monthly APMI activity report filing", "owner": "Compliance Ops",
     "due": "2025-09-07", "status": "Open", "priority": "High", "source": "PMS Regulations", "recurring": "Monthly"},
    {"id": "TSK-1002", "title": "Quarterly proprietary trading exception report to Board", "owner": "Compliance",
     "due": "2025-10-10", "status": "Open", "priority": "High", "source": "Prop Trading Policy", "recurring": "Quarterly"},
    {"id": "TSK-1003", "title": "Half-yearly client performance statements dispatch", "owner": "Client Reporting",
     "due": "2025-10-15", "status": "Open", "priority": "Medium", "source": "PMS Regulations", "recurring": "Half-yearly"},
    {"id": "TSK-1004", "title": "Annual board review of IT & Cyber Security Policy", "owner": "Company Secretary",
     "due": "2025-09-01", "status": "Overdue", "priority": "High", "source": "SEBI CSCRF", "recurring": "Annual"},
    {"id": "TSK-1005", "title": "Submit CTR to FIU-IND", "owner": "Principal Officer",
     "due": "2025-09-15", "status": "Open", "priority": "High", "source": "PMLA", "recurring": "Monthly"},
]

# --------------------------------------------------------------------------
# 4. KYC / World-Check watchlist  (Use case 1.3)
# --------------------------------------------------------------------------
WATCHLIST = [
    {"name": "Rajesh Kumar Malhotra", "type": "PEP",
     "note": "Former state minister; politically exposed person. Source: World-Check PEP list."},
    {"name": "Anil Verma", "type": "Adverse Media",
     "note": "Named in 2021 market manipulation news reports; no conviction on record."},
    {"name": "Sunrise Global Trading FZE", "type": "Sanctions",
     "note": "Entity on OFAC SDN list (trade-based money laundering)."},
    {"name": "Mohammed Farouk Al-Din", "type": "Sanctions",
     "note": "UN Security Council consolidated sanctions list match."},
    {"name": "Priya Nair", "type": "Adverse Media",
     "note": "Subject of an ED enquiry reported in 2019; matter closed."},
    {"name": "Vikram Shetty", "type": "PEP",
     "note": "Immediate family member of a sitting Member of Parliament."},
]

HIGH_RISK_COUNTRIES = {"North Korea", "Iran", "Syria", "Myanmar", "Russia", "Afghanistan"}

# --------------------------------------------------------------------------
# 5. SEBI orders knowledge base  (Use case 1.4)
# --------------------------------------------------------------------------
ORDERS = [
    {
        "id": "WTM/2025/PMS/118",
        "title": "Adjudication order – non-disclosure of conflict of interest by a Portfolio Manager",
        "date": "2025-06-18",
        "entity": "ABC Portfolio Managers Pvt Ltd",
        "regulation": "PMS Regulations 2020 – Reg. 23 (Code of Conduct)",
        "penalty": "Rs. 15,00,000",
        "keywords": ["conflict of interest", "disclosure", "portfolio manager", "code of conduct", "related party"],
        "summary": "The Portfolio Manager routed client trades through an associate broker without "
                   "disclosing the relationship to clients. SEBI held this violated the duty to act "
                   "in the best interest of clients and imposed a monetary penalty. Key takeaway: "
                   "all associate / related-party dealings must be disclosed in the disclosure "
                   "document and client agreement.",
    },
    {
        "id": "WTM/2025/AML/074",
        "title": "Order on deficiencies in AML / KYC controls at an intermediary",
        "date": "2025-04-02",
        "entity": "XYZ Capital Services Ltd",
        "regulation": "SEBI (KYC) Regulations & PMLA Rules",
        "penalty": "Rs. 25,00,000",
        "keywords": ["aml", "kyc", "beneficial owner", "screening", "pmla", "onboarding", "risk categorisation"],
        "summary": "The intermediary failed to identify beneficial owners for corporate clients and "
                   "did not carry out sanctions screening at onboarding. SEBI directed a remediation "
                   "of all existing client files within 90 days. Key takeaway: beneficial ownership "
                   "and screening evidence must be retained for every client, refreshed on a "
                   "risk-based cadence.",
    },
    {
        "id": "WTM/2025/PIT/203",
        "title": "Order for inadequate monitoring of employee / connected-person trading",
        "date": "2025-07-29",
        "entity": "PQR Asset Management",
        "regulation": "SEBI (Prohibition of Insider Trading) Regulations 2015 – Reg. 9",
        "penalty": "Rs. 10,00,000 + disgorgement",
        "keywords": ["insider trading", "personal trading", "pre-clearance", "window closure", "connected person", "code of conduct"],
        "summary": "Employees traded in securities on the restricted list during a closed trading "
                   "window without pre-clearance. The compliance officer had not reconciled trades "
                   "against depository statements. Key takeaway: enforce pre-clearance, trading-window "
                   "closures and periodic reconciliation of employee trades.",
    },
    {
        "id": "WTM/2025/ADV/155",
        "title": "Order on misleading performance claims in marketing material",
        "date": "2025-05-14",
        "entity": "LMN Investment Advisers",
        "regulation": "SEBI Advertisement Code / IA Regulations",
        "penalty": "Rs. 7,00,000",
        "keywords": ["marketing", "advertisement", "performance", "misleading", "sebi code", "disclaimer"],
        "summary": "Marketing collateral showed cherry-picked model-portfolio returns without "
                   "standard disclaimers or a benchmark comparison. SEBI held the material misleading. "
                   "Key takeaway: performance data must be net of fees, benchmarked, and carry "
                   "prescribed disclaimers; all collateral needs compliance sign-off.",
    },
]

# --------------------------------------------------------------------------
# 6. Policies for checklist generation  (Use cases 1.8 / 1.5)
# --------------------------------------------------------------------------
POLICIES = [
    {
        "id": "POL-AML",
        "name": "AML / CFT Policy",
        "version": "v4.2 (Jul-2025)",
        "checklist": [
            "Risk categorisation completed for every client at onboarding",
            "Beneficial owners (>=10%) identified and documented",
            "Sanctions / PEP / adverse-media screening evidence on file",
            "Enhanced due diligence performed for high-risk clients",
            "Annual KYC refresh completed for high-risk clients",
            "STR / CTR filed with FIU-IND within statutory timelines",
            "Designated Principal Officer and Designated Director on record",
        ],
    },
    {
        "id": "POL-PROP",
        "name": "Proprietary Trading Policy",
        "version": "v2.1 (Mar-2025)",
        "checklist": [
            "Proprietary trades tagged and segregated from client trades",
            "No contra trade within 60 days of an opposite position",
            "Proprietary order does not front-run a pending client order (same-side sequencing)",
            "Daily reconciliation of prop book vs fund accounting system",
            "Quarterly exception report placed before the Board",
            "Restricted / watch list respected for all proprietary orders",
        ],
    },
    {
        "id": "POL-PMS",
        "name": "PMS Operations Policy",
        "version": "v3.0 (Sep-2025)",
        "checklist": [
            "Monthly APMI activity report filed within 7 working days",
            "Half-yearly client performance statements dispatched",
            "Fee disclosure in prescribed format included in onboarding pack",
            "Disclosure document reviewed and updated annually",
            "Investor complaints resolved within 21 calendar days on SCORES 2.0",
        ],
    },
    {
        "id": "POL-CYBER",
        "name": "IT & Cyber Security Policy",
        "version": "v1.4 (Sep-2025)",
        "checklist": [
            "Board-approved cyber policy reviewed in the last 12 months",
            "VAPT conducted at least twice in the financial year",
            "Designated officer for cyber incidents appointed",
            "6-hour cyber incident reporting runbook tested",
            "Access reviews and MFA enforced for critical systems",
        ],
    },
]
