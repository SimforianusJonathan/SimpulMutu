# PRODUCT.md — ITechnoCup 2026

## 1. Product Thesis

Pada sebagian IKM konveksi, quality event belum selalu berubah menjadi diagnosis yang terstruktur dan pembelajaran yang dapat digunakan kembali.

Produk membantu owner/supervisor melakukan investigasi quality issue secara terstruktur, lalu menjadikan hasil investigasi tersebut sebagai **Quality Memory** yang dapat digunakan sebagai referensi ketika masalah relevan muncul di masa depan.

### Core Loop

`Quality event → Guided Investigation → Evidence → Contributing Causes → Working Root Cause → Corrective Action → Resolved Quality Case → Quality Memory → Relevant Past Case membantu investigation berikutnya`

---

## 2. Primary User

**Primary user:** owner, supervisor produksi, atau penanggung jawab quality pada IKM konveksi skala kecil yang ikut langsung menangani quality issue.

**Situation:** quality issue ditemukan dan perlu dipahami sebelum tindakan perbaikan ditentukan.

**Pain:** quality problem dapat selesai secara operasional tanpa menghasilkan diagnosis terstruktur dan reusable learning.

**Desired outcome:** mampu melakukan investigation secara lebih sistematis dan mempertahankan hasil investigation sebagai organizational memory.

> **ASSUMPTION:** owner/supervisor adalah actor utama yang paling tepat menjalankan workflow ini. Struktur organisasi dapat berbeda antar-IKM.

---

## 3. Problem Statement

> **Pada sebagian IKM konveksi, quality event belum selalu berubah menjadi diagnosis yang terstruktur dan pembelajaran yang dapat digunakan kembali, sehingga pengalaman dari quality problem sebelumnya belum tentu membantu investigation ketika masalah relevan muncul di masa depan.**

Produk tidak mengasumsikan bahwa kondisi ini berlaku universal pada seluruh IKM konveksi.

---

## 4. Value Proposition

> **Membantu owner atau supervisor konveksi melakukan investigasi quality issue secara terstruktur, lalu mengubah hasil investigasi tersebut menjadi quality memory yang dapat digunakan sebagai referensi ketika masalah relevan muncul kembali.**

---

## 5. Jobs To Be Done

### JTBD 1 — Investigate

When a meaningful quality issue occurs, I want to examine the problem, evidence, and possible contributing causes systematically, so that I do not stop at a shallow explanation or rework alone.

### JTBD 2 — Preserve Learning

When an investigation is completed, I want the problem, evidence, diagnosis, and corrective action to remain as a structured case, so that the learning does not depend only on someone's memory.

### JTBD 3 — Reuse Learning

When I encounter a new quality issue, I want to see relevant past cases as references, so that I can start the investigation with existing organizational experience instead of always starting from zero.

> **ASSUMPTION:** historical quality cases provide meaningful value to future investigations.

---

## 6. Core User Journey

1. A quality issue occurs.
2. User creates a **Quality Case**.
3. User describes the problem and relevant context.
4. User performs **Guided Investigation**.
5. Evidence is connected to possible contributing causes.
6. User establishes a **Working Root Cause**.
7. User records a **Corrective Action**.
8. User resolves the investigation.
9. The resolved investigation becomes a structured **Quality Memory**.
10. When another Quality Case is investigated, relevant past resolved cases may be surfaced as references.
11. User evaluates whether past experience is relevant to the current case.
12. The new investigation eventually becomes another Quality Memory.

Past cases inform investigation; they do not automatically determine the root cause.

---

## 7. Core Interaction

The primary product object is a **Quality Case**.

While active, a Quality Case is an investigation workspace.

When resolved, the same Quality Case becomes reusable Quality Memory.

Resolved Quality Cases can later be surfaced as relevant references during another investigation.

The product must feel like **one continuous learning loop**, not separate RCA and knowledge-base modules.

---

## 8. Scope

### MUST — MVP

- **M1 — Create Quality Case**
  - Start an investigation from a quality event with enough context to distinguish the case.
- **M2 — Guided Investigation**
  - Structure the relationship between problem, evidence, contributing causes, working root cause, and corrective action.
- **M3 — Resolve Case into Quality Memory**
  - Preserve a completed investigation as a structured reusable quality case.
- **M4 — Relevant Past Case Retrieval**
  - During a new investigation, surface relevant resolved cases with enough context to understand their prior diagnosis and corrective action.

### SHOULD

- Relevant past cases should explain why they are considered relevant.
- Working root causes should remain explicitly framed as investigation conclusions, not automatically proven causal facts.
- Evidence should remain traceable to contributing causes.
- The investigation flow should remain lightweight enough for the primary interaction to be understandable quickly.

### COULD

No additional product capability is currently approved.

Any COULD capability remains frozen until the MUST scope works reliably end-to-end.

---

## 9. Explicit Non-Goals

The MVP will NOT include:

- generic quality dashboard;
- inventory management;
- production planning;
- order/production monitoring;
- weekly quality meeting / S6;
- computer-vision defect detection;
- chatbot;
- full CAPA suite;
- ERP features;
- complex analytics;
- automatic root-cause determination;
- automatic causal claims;
- generic company knowledge base.

**Scope rule:** if a proposed feature does not directly improve either **structured investigation** or **reuse of previous investigation learning**, it is outside the MVP.

---

## 10. Smallest Viable MVP

The MVP is viable when one complete loop can be demonstrated:

1. Create one new Quality Case.
2. Complete a guided investigation containing evidence, contributing causes, working root cause, and corrective action.
3. Resolve the case into Quality Memory.
4. During another investigation, retrieve at least one relevant resolved Quality Case as a reference.

No additional module is required to prove the product thesis.

> **ASSUMPTION:** a small number of realistic resolved cases is sufficient to demonstrate retrieval value during the hackathon demo.

---

## 11. Golden Demo Path — 3–5 Minutes

### Setup

Several realistic historical Quality Cases already exist.

### Step 1 — New Quality Issue

A supervisor creates a case for a new garment quality problem.

### Step 2 — Guided Investigation

The user describes the problem, adds evidence, evaluates contributing causes, and develops a working root cause.

### Step 3 — Reuse Past Learning

A relevant historical Quality Case is surfaced.

The user reviews:

- historical context;
- evidence;
- previous diagnosis;
- corrective action.

The product does not claim the historical root cause automatically applies to the current case.

### Step 4 — Continue Investigation

The user uses the historical case as one source of context for the current reasoning.

### Step 5 — Resolve

The new investigation is resolved and becomes another Quality Memory.

### Demo Message

> **Every quality problem investigated well today can become useful experience for the next quality problem.**

---

## 12. Definition of Product Success — Hackathon

The product succeeds if judges can clearly see that:

1. It does more than record defects.
2. Guided Investigation produces structured reasoning rather than a root-cause textbox.
3. A resolved investigation becomes reusable Quality Memory.
4. Relevant past learning visibly re-enters a future investigation.
5. Historical cases are treated as references, not automatic answers.
6. The four MVP capabilities work reliably end-to-end.
7. The product's differentiation from spreadsheets and generic QMS can be explained without relying on feature count or AI branding.
8. No feature outside the approved core loop is required to make the demo compelling.

---

## 13. Biggest Assumptions

### A1 — Guided investigation adds value

> **ASSUMPTION:** structured guidance materially helps non-specialist owner/supervisors perform more useful quality investigations.

### A2 — Past cases are reusable

> **ASSUMPTION:** quality cases recur with enough contextual similarity that past investigations can provide useful references.

### A3 — Users will invest investigation effort

> **ASSUMPTION:** users will spend additional effort investigating meaningful quality issues instead of only performing rework and continuing production.

### A4 — Sufficient context can be captured

> **ASSUMPTION:** users know and can provide enough quality-event context and evidence for structured investigation and relevant case retrieval.

### A5 — Similarity can be used safely

> **ASSUMPTION:** relevant past cases can assist current investigation without causing users to incorrectly assume that similar symptoms imply identical root causes.

---

## 14. Biggest Product Risks

### R1 — Investigation friction

Guided Investigation becomes too long or administrative.

### R2 — Poor investigation creates poor memory

Incorrect or shallow conclusions become reusable historical knowledge.

### R3 — Irrelevant retrieval

Past cases surfaced by the product are not actually useful to the current investigation.

### R4 — Cold start

Quality Memory provides little value before enough resolved cases exist.

### R5 — Scope creep

The product expands into dashboards, ERP, planning, analytics, meetings, or unrelated QMS modules.

### R6 — Generic-QMS perception

Judges perceive the product as an RCA form plus a searchable archive.

### R7 — False causal confidence

Working root cause or case similarity is presented more confidently than the available evidence supports.

---

## 15. Product Differentiation Guardrails

The product is **not a generic QMS**.

Its differentiation must remain centered on two connected mechanisms:

### 1. Structured Learning Creation

A Quality Case guides the user from quality event toward evidence-based structured investigation.

### 2. Structured Learning Reuse

A resolved Quality Case becomes reusable memory that can re-enter a later investigation when contextually relevant.

### Guardrail Test

For every proposed product requirement, ask:

> **Does this directly help structure the current investigation or reuse learning from a previous investigation?**

If the answer is no, reject it from the MVP.

### Positioning Constraint

Do not position the product as:

- an all-in-one quality platform;
- an ERP replacement;
- an AI root-cause engine;
- a defect dashboard;
- a generic knowledge-management system.

The product's core idea is:

> **Investigation creates learning. Learning returns to help the next investigation.**

---

## 16. Current Decision Status

**Human Gate #1:** Conditionally Approved  
**Human Gate #2:** Approved

**Selected direction:** S1+S2 Hybrid

- **Core mechanism:** S1 — Guided Root-Cause Investigation
- **Learning mechanism:** S2 — Case-Based Quality Memory

### Locked MVP Capabilities

1. Create Quality Case
2. Guided Investigation
3. Resolve Case into structured Quality Memory
4. Relevant Past Case Retrieval during a new investigation

### Not Defined in PRODUCT.md

The following are intentionally not defined in this document and are governed by later locked source-of-truth documents:

- technology stack;
- database;
- AI/ML usage;
- retrieval implementation;
- technical architecture;
- authentication;
- deployment;
- implementation milestones;
- detailed screen design;
- detailed acceptance criteria.
