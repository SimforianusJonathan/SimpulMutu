# ARCHITECTURE.md — ITechnoCup 2026

## 0. Document Status

**Status:** Architecture Selection Locked for MVP  
**Purpose:** High-level technical source of truth derived from approved `PRODUCT.md`, approved `PRD.md`, locked OD-1–OD-8 decisions, and locked Architecture Selection.

This document defines architecture behavior and boundaries only. It does **not** select the technology stack or provide an implementation plan.

### Architecture Labels

- **`ARCHITECTURE LOCKED`** — architecture direction already approved and must not be changed silently.
- **`TECHNOLOGY DECISION NEEDED`** — a concrete technology choice still requires explicit selection.
- **`IMPLEMENTATION DETAIL`** — engineering detail that may be chosen during implementation as long as it preserves the locked architecture and PRD behavior.

---

# 1. Locked Architecture Direction

`ARCHITECTURE LOCKED`

## D1 — Application Boundary

**Compact Modular Monolith**

The MVP is one application boundary containing clearly separated internal modules. It is not decomposed into microservices or independently deployed business services.

## D2 — M4 Retrieval Philosophy

**Deterministic / rule-based structured retrieval**

Relevant Past Case Retrieval uses structured Quality Case information and explainable shared signals. Semantic/vector retrieval is not part of the MVP.

## D3 — Persistence

**One canonical persistence for Quality Cases**

There is no dedicated search index, vector database, derived retrieval persistence, or second source of truth.

Resolved Quality Cases remain in the same canonical persistence and are directly available to the internal Retrieval module.

---

# 2. Architecture Goals

`ARCHITECTURE LOCKED`

The architecture must optimize for:

1. reliable execution of M1–M4;
2. S1 Guided Investigation remaining the primary product mechanism;
3. S2/M4 proving the reusable-learning loop without dominating system complexity;
4. fast development for hackathon constraints;
5. high live-demo reliability;
6. easy testing of product invariants;
7. explainable deterministic relevance behavior;
8. future replacement of the Retrieval implementation without changing PRODUCT/PRD behavior.

The architecture must **not** optimize for distributed scale or infrastructure sophistication that is not required by the MVP.

---

# 3. System Boundary

`ARCHITECTURE LOCKED`

The MVP system boundary contains:

```text
┌───────────────────────────────────────────────┐
│                 Web Application               │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ Presentation / Interaction Layer        │  │
│  └──────────────────┬──────────────────────┘  │
│                     │                         │
│  ┌──────────────────▼──────────────────────┐  │
│  │ Application / Domain Modules            │  │
│  │                                         │  │
│  │  • Quality Case                         │  │
│  │  • Guided Investigation                 │  │
│  │  • Resolution / Quality Memory          │  │
│  │  • Relevant Past Case Retrieval         │  │
│  │  • Persistence Access                   │  │
│  └──────────────────┬──────────────────────┘  │
└─────────────────────┼─────────────────────────┘
                      │
             ┌────────▼─────────┐
             │ Canonical        │
             │ Persistence      │
             │ Quality Cases    │
             └──────────────────┘
```

The boundary is intentionally small.

The Retrieval responsibility is **internally modular** but not an external service.

---

# 4. Major Internal Modules

## 4.1 Presentation / Interaction Module

`ARCHITECTURE LOCKED`

### Responsibility

- expose the M1–M4 product interactions;
- present the semi-guided investigation stages;
- show lifecycle state;
- display validation and resolution blockers;
- present Relevant Past Cases and explainable relevance signals;
- preserve the distinction between current investigation and historical references.

### Must Not

- determine the final Working Root Cause automatically;
- implement business invariants only on the client side;
- treat historical cases as automatic recommendations;
- bypass lifecycle validation.

---

## 4.2 Quality Case Module

`ARCHITECTURE LOCKED`

### Responsibility

Own the conceptual Quality Case and its lifecycle:

`DRAFT → INVESTIGATING → RESOLVED`

It is responsible for:

- case creation;
- case identity;
- structured context;
- state transitions;
- whether a case is mutable;
- lifecycle-level validation.

The same Quality Case remains the canonical object throughout its lifecycle.

There is no separate "knowledge record" created after resolution.

---

## 4.3 Guided Investigation Module

`ARCHITECTURE LOCKED`

### Responsibility

Represent and validate the investigation structure:

`Problem → Context/Evidence → Contributing Causes → Working Root Cause → Corrective Action`

It must preserve the reasoning relationship rather than storing the investigation only as a single text blob.

It is responsible for:

- evidence items;
- contributing-cause items;
- Evidence ↔ Contributing Cause relationships;
- one Working Root Cause at resolution;
- corrective-action information;
- investigation-completeness information;
- investigation summary used before resolution.

It does **not** determine whether a root cause is objectively true.

---

## 4.4 Resolution / Quality Memory Module

`ARCHITECTURE LOCKED`

### Responsibility

- enforce the minimum resolution gate;
- perform explicit user-driven transition to `RESOLVED`;
- enforce resolved-case immutability;
- expose resolved cases as reusable Quality Memory;
- preserve the complete reasoning chain for future reference.

It does not create a second knowledge object.

Conceptually:

```text
Active Quality Case
        ↓
Explicit Resolve
        ↓
Same Quality Case, now RESOLVED
        ↓
Reusable Quality Memory
```

---

## 4.5 Relevant Past Case Retrieval Module

`ARCHITECTURE LOCKED`

### Responsibility

M4 is an internal modular responsibility.

The Retrieval module:

1. receives structured information from the current investigation;
2. considers only resolved Quality Cases;
3. evaluates deterministic product-level relevance;
4. returns zero to three relevant past cases;
5. provides explainable shared signals for each surfaced case.

### Modularity Constraint

The rest of the application must depend on the Retrieval module's **behavioral contract**, not on the exact rule implementation.

This preserves future replaceability without creating a separate service or infrastructure layer in the MVP.

### Must Not

- use semantic/vector retrieval in the MVP;
- require an external search service;
- infer the current root cause;
- automatically copy a historical root cause into the current case;
- automatically recommend a historical Corrective Action as the correct action now.

---

## 4.6 Persistence Access Module

`ARCHITECTURE LOCKED`

### Responsibility

Provide one controlled application path to the canonical Quality Case persistence.

It must support:

- creation and update of mutable cases;
- retrieval of current cases;
- retrieval of resolved cases;
- preservation of investigation relationships;
- atomic enforcement, where technically appropriate, of lifecycle-sensitive writes;
- read access needed by M4.

It must not create a second durable source of truth for retrieval.

---

# 5. Quality Case Lifecycle

`ARCHITECTURE LOCKED`

## 5.1 `DRAFT`

A case exists but has not yet progressed into active investigation.

Architecture expectations:

- mutable;
- not eligible for M4 as Quality Memory;
- may contain incomplete context;
- unknown context must remain unknown rather than being fabricated.

## 5.2 `INVESTIGATING`

The case is actively being investigated.

Architecture expectations:

- mutable;
- Guided Investigation structure can grow/change;
- M4 can use the current Problem, available Context, and available Evidence;
- M4 failure must not block investigation;
- not eligible to become historical Quality Memory until explicitly resolved.

## 5.3 `RESOLVED`

The investigation has passed the minimum resolution gate and the user explicitly resolves it.

Architecture expectations:

- read-only/immutable for MVP;
- eligible for M4;
- complete reasoning chain remains available;
- still stored as the same canonical Quality Case;
- no reopen behavior exists in the MVP.

---

# 6. Locked Context Behavior

`ARCHITECTURE LOCKED`

The compact structured context contains:

### Core Structured Context
- `Production Stage / Process`

### Structured Context Completed When Available
- `Product / Model Reference`
- `Material`
- `Machine / Workstation`
- `Batch / Order Reference`
- `Additional Context Note`

Architecture must allow these context values to be incomplete while the case is active.

The system must not use database-level or application-level requirements that force users to invent unavailable context merely to create or continue a case.

---

# 7. Conceptual Domain Model

This section is conceptual and intentionally does not prescribe a database schema.

`ARCHITECTURE LOCKED`

```text
QualityCase
│
├── Identity
├── Lifecycle State
│   ├── DRAFT
│   ├── INVESTIGATING
│   └── RESOLVED
│
├── Problem
│
├── Context
│   ├── Production Stage / Process
│   ├── Product / Model Reference
│   ├── Material
│   ├── Machine / Workstation
│   ├── Batch / Order Reference
│   └── Additional Context Note
│
├── Evidence [0..n while active; >=1 for resolution]
│
├── Contributing Causes [0..n while active; >=1 for resolution]
│
├── Evidence ↔ Cause Relationships
│
├── Working Root Cause
│   └── exactly one required at resolution
│
└── Corrective Action
    └── at least one required at resolution
```

The model must preserve enough structure that a resolved case can later be understood without relying on the memory of the person who created it.

---

# 8. Evidence ↔ Contributing Cause Relationship

`ARCHITECTURE LOCKED`

Evidence and Contributing Causes are separate conceptual entities.

A Contributing Cause is not considered supported merely because it exists.

The architecture must represent explicit relationships:

```text
Evidence A ─────┐
Evidence B ─────┼──> Contributing Cause 1
                │
Evidence C ─────────> Contributing Cause 2
```

Required behavior:

- one Evidence item may support multiple Contributing Causes;
- one Contributing Cause may reference multiple Evidence items;
- deleting/changing Evidence while a case is active must not silently preserve misleading relationships;
- the user must be able to understand which Evidence supports which cause;
- a Working Root Cause must remain traceable to the investigation reasoning.

`IMPLEMENTATION DETAIL`

The exact persistence structure for this relationship is not fixed here.

---

# 9. Resolution Invariants

`ARCHITECTURE LOCKED`

A transition to `RESOLVED` is permitted only when all minimum conditions are satisfied:

1. Problem exists;
2. at least one Evidence item exists;
3. at least one Contributing Cause exists;
4. exactly one Working Root Cause has been selected/established for resolution;
5. at least one Corrective Action exists;
6. the user explicitly requests Resolve.

Additional invariants:

- completion alone must not auto-resolve the case;
- resolution validation must be enforced inside the application/domain boundary, not only by UI state;
- unresolved cases must never be exposed as reusable Quality Memory;
- a resolution failure must leave the canonical case non-resolved;
- a successful resolution must preserve all approved investigation information.

---

# 10. Resolved-Case Immutability

`ARCHITECTURE LOCKED`

For the MVP:

> A `RESOLVED` Quality Case is read-only.

The architecture must prevent normal update paths from mutating resolved investigation content.

This rule protects:

- historical consistency;
- retrieval reliability;
- demo predictability;
- interpretation of Quality Memory.

No reopen or versioned-edit lifecycle is included in the MVP.

`IMPLEMENTATION DETAIL`

The exact combination of application validation and persistence safeguards used to enforce immutability is not yet selected.

---

# 11. Data Flow — M1 Create Quality Case

`ARCHITECTURE LOCKED`

```text
User
 ↓
Presentation
 ↓
Quality Case Module
 ↓
Validate minimum creation input
 ↓
Create canonical Quality Case
 ↓
Canonical Persistence
 ↓
Return DRAFT / active case representation
```

Key behaviors:

- creation must not require complete investigation information;
- non-core Context can remain absent;
- creating a case must not create a Quality Memory entry;
- M1 does not invoke root-cause automation or M4 as a requirement.

---

# 12. Data Flow — M2 Guided Investigation

`ARCHITECTURE LOCKED`

```text
Quality Case
    ↓
Problem + Context
    ↓
Evidence
    ↓
Evidence ↔ Contributing Causes
    ↓
One Working Root Cause
    ↓
Corrective Action
    ↓
Investigation Summary
```

Application responsibilities:

- preserve semi-guided stages;
- allow user revision while active;
- validate relationships;
- expose completion status;
- maintain one current canonical investigation state.

M4 may be invoked during `INVESTIGATING`, but M2 must remain usable when M4 returns no result or fails.

---

# 13. Data Flow — M3 Resolve to Quality Memory

`ARCHITECTURE LOCKED`

```text
Current Investigation
        ↓
Resolution Request
        ↓
Resolution Invariant Check
        ↓
      valid?
     /      \
   no        yes
   ↓          ↓
Remain       Transition
active       to RESOLVED
              ↓
      Canonical Persistence
              ↓
      Read-only Quality Memory
```

No second persistence or knowledge-entry workflow is introduced.

---

# 14. Data Flow — M4 Relevant Past Case Retrieval

`ARCHITECTURE LOCKED`

```text
Current INVESTIGATING Case
       │
       ├─ Problem
       ├─ available Context
       └─ available Evidence
                ↓
       Internal Retrieval Module
                ↓
       Read canonical RESOLVED cases
                ↓
       Deterministic relevance rules
                ↓
       Filter / order candidates
                ↓
            Return 0–3
                ↓
       Add explainable signals
                ↓
   Present as historical references
```

M4 does not create or mutate the current Working Root Cause.

---

# 15. Deterministic Relevance Behavior

`ARCHITECTURE LOCKED`

Relevance is evaluated from structured information that is already part of approved Quality Case behavior.

Product-level relevance may consider:

- similarity of the Problem;
- shared `Production Stage / Process`;
- shared `Product / Model Reference`, when known;
- shared `Material`, when known;
- shared `Machine / Workstation`, when known;
- shared `Batch / Order Reference`, when meaningful;
- other available current-case information explicitly approved by PRD behavior.

The retrieval implementation must:

1. consider only `RESOLVED` cases;
2. permit zero results;
3. surface at most three cases;
4. prefer no result over an unrelated result;
5. remain deterministic for the same stored data and rule configuration;
6. never interpret similarity as proof of identical root cause.

`IMPLEMENTATION DETAIL`

Exact rule ordering, weights, thresholds, tie-breaking, normalization, and matching semantics are not fixed by the architecture document.

They must be testable and must preserve the product definition of relevance.

---

# 16. Explainability of Relevance

`ARCHITECTURE LOCKED`

Each surfaced case must expose understandable shared signals, for example:

- `Same production stage: Sewing`
- `Same material: Cotton 24s`
- `Similar quality problem`
- `Same machine/workstation context`

The architecture must make explanation data available alongside each retrieval result.

User-facing explanation must not use false precision such as a causal-confidence percentage.

A relevance explanation describes **why the case was surfaced**, not why its historical root cause should be accepted.

---

# 17. Persistence Responsibilities

`ARCHITECTURE LOCKED`

There is one canonical persistence responsibility.

It must durably preserve:

- Quality Case identity;
- lifecycle state;
- Problem;
- structured Context;
- Evidence;
- Contributing Causes;
- Evidence ↔ Cause relationships;
- Working Root Cause;
- Corrective Action;
- resolved status / information required to enforce immutability.

The same canonical persistence is used for:

- current investigation state;
- resolved Quality Memory;
- M4 candidate reading.

There is no dedicated retrieval store.

## Persistence Properties Needed

At architecture level, persistence must support:

- durable writes;
- consistent reads for demo-critical workflows;
- representation of Quality Case relationships;
- enforcement or support of lifecycle invariants;
- practical querying of resolved cases for the expected MVP data volume.

`TECHNOLOGY DECISION NEEDED`

The concrete persistence technology is not yet selected.

---

# 18. Failure Behavior

`ARCHITECTURE LOCKED`

## 18.1 Create / Update Failure

If persistence fails:

- the system must not claim the change was saved;
- the visible lifecycle must not advance falsely;
- user must receive understandable failure feedback.

## 18.2 Resolution Failure

If resolution validation or persistence fails:

- case remains non-resolved;
- it must not become available to M4 as Quality Memory;
- UI must not present successful resolution.

## 18.3 Retrieval Failure

If M4 fails:

- Guided Investigation remains usable;
- current case remains unchanged;
- user is informed that past references are unavailable;
- system must not substitute invented/unverified references.

## 18.4 No Relevant Case

This is **not an error**.

The correct result may be zero relevant cases.

## 18.5 Poor / Incomplete Context

Retrieval may return fewer or zero references.

The system must not require fabricated context to increase retrieval success.

---

# 19. Security Boundaries

`ARCHITECTURE LOCKED`

The architecture assumes the locked MVP access model:

> one organizational context + one active user persona.

This does not eliminate basic security responsibilities.

Required boundaries:

1. business/lifecycle validation must not rely solely on client-side controls;
2. resolved-case immutability must be enforced inside the trusted application boundary;
3. untrusted user input must be handled safely;
4. persistence must not be directly exposed to the browser/client;
5. secrets/configuration, if required by selected technologies, must not be embedded in user-visible application code;
6. error handling must not expose sensitive internal details;
7. the system should operate over secure transport in deployed form.

## Not Required for MVP Architecture

- enterprise RBAC;
- cross-organization sharing;
- multi-tenant authorization model;
- SSO;
- fine-grained department permissions.

`TECHNOLOGY DECISION NEEDED`

Whether the public hackathon deployment includes a minimal authentication/access mechanism remains a technology/deployment decision, provided it does not introduce new product roles or workflows.

---

# 20. Testing Strategy

`ARCHITECTURE LOCKED`

Testing must prioritize product invariants and the golden demo.

## 20.1 Domain / Unit Tests

Required coverage areas:

- lifecycle transitions;
- invalid lifecycle transitions;
- resolution invariants;
- resolved immutability;
- Evidence ↔ Cause relationship behavior;
- single Working Root Cause invariant at resolution;
- incomplete context handling.

## 20.2 Deterministic Retrieval Tests

Use fixed Quality Case fixtures.

Test:

- resolved-only eligibility;
- expected relevant candidate inclusion;
- irrelevant candidate exclusion;
- zero-result behavior;
- maximum three results;
- deterministic ordering/tie behavior once implementation rules are chosen;
- explainable shared signals;
- similarity never mutating current diagnosis.

Because retrieval is deterministic, identical fixture state should produce predictable output.

## 20.3 Integration Tests

Cover:

- application module ↔ canonical persistence behavior;
- create/save/reload case;
- resolution persisted as immutable;
- resolved case becomes visible to M4;
- retrieval failure does not block M2.

## 20.4 End-to-End Golden Demo Test

The test scenario must prove:

```text
Create Case
  ↓
Guided Investigation
  ↓
Relevant Past Case Appears
  ↓
Historical Reasoning Viewed
  ↓
Current Working Root Cause Remains User-Controlled
  ↓
Corrective Action
  ↓
Resolve
  ↓
New Quality Memory
```

This is the highest-priority end-to-end path for hackathon reliability.

---

# 21. Scalability Requirements

`ARCHITECTURE LOCKED`

MVP scalability target is intentionally modest.

The architecture only needs to support:

- one organizational dataset;
- one active user persona;
- a practical number of Quality Cases for hackathon/demo usage;
- deterministic scanning/querying of resolved cases without noticeable disruption to the demo;
- future internal replacement of retrieval implementation if data volume eventually grows.

The architecture does not need:

- distributed writes;
- independent service scaling;
- multi-region architecture;
- high-concurrency optimization;
- dedicated search scaling;
- event-driven infrastructure.

`ASSUMPTION`

For the expected MVP data volume, one canonical persistence plus deterministic retrieval is sufficient for acceptable interaction latency.

---

# 22. Architecture Constraints

`ARCHITECTURE LOCKED`

1. **Modular monolith, not microservices.**
2. **One canonical Quality Case persistence.**
3. **No dedicated retrieval index.**
4. **No vector database.**
5. **No semantic retrieval for MVP.**
6. **No message queue.**
7. **No cache layer required by architecture.**
8. **No distributed business workflow.**
9. **Retrieval remains an internal module with a replaceable contract.**
10. **M2 must work when M4 is unavailable or returns zero cases.**
11. **Resolved Quality Cases are immutable.**
12. **Only resolved cases are M4 candidates.**
13. **M4 returns at most three references.**
14. **Relevance explanation is mandatory.**
15. **No historical reference may automatically change current-case diagnosis.**
16. **Incomplete context is valid while a case is active.**
17. **No product feature outside approved M1–M4 may be introduced through architecture.**

---

# 23. Explicit Architectural Non-Goals

`ARCHITECTURE LOCKED`

The MVP architecture will not introduce:

- microservices;
- separate retrieval/search service;
- dedicated search infrastructure;
- vector database;
- embeddings;
- semantic search;
- LLM dependency;
- message queue/event bus;
- distributed cache;
- read replicas;
- CQRS;
- event sourcing;
- separate analytics store;
- data warehouse;
- multi-tenant architecture;
- complex RBAC;
- service mesh;
- container orchestration as an architectural requirement;
- independent scaling of M1–M4 modules.

These are not prohibited forever; they are explicitly unnecessary for the approved MVP.

---

# 24. Golden Demo Reliability Requirements

`ARCHITECTURE LOCKED`

The architecture is successful for the hackathon if:

1. M1–M4 can run through one application boundary;
2. no external semantic/AI/search dependency is required for the golden path;
3. resolved historical cases needed for the demo can be stored canonically before the demo;
4. deterministic retrieval produces predictable relevant results for the prepared scenario;
5. M4 failure cannot corrupt or block the current investigation;
6. resolution cannot accidentally create mutable historical memory;
7. the complete golden path can be repeatedly tested before presentation.

---

# 25. Architecture Decision Summary

| Decision | Status |
|---|---|
| Compact Modular Monolith | `ARCHITECTURE LOCKED` |
| Internal modular Retrieval responsibility | `ARCHITECTURE LOCKED` |
| Deterministic/rule-based M4 | `ARCHITECTURE LOCKED` |
| One canonical Quality Case persistence | `ARCHITECTURE LOCKED` |
| No dedicated retrieval index | `ARCHITECTURE LOCKED` |
| Resolved-case immutability | `ARCHITECTURE LOCKED` |
| M4 0–3 resolved references | `ARCHITECTURE LOCKED` |
| Explainable shared signals | `ARCHITECTURE LOCKED` |
| Concrete technology stack | `TECHNOLOGY DECISION NEEDED` |

---

# 26. Remaining Technical Decisions

The architecture is locked, but the technologies implementing it are intentionally not selected yet.

## TD-1 — Web Application Implementation Style

`TECHNOLOGY DECISION NEEDED`

Choose the web application technology/framework pattern that can implement:

- responsive web UI;
- semi-guided interaction;
- server-side/trusted business validation;
- modular monolith structure;
- one deployable application boundary or an equally simple deployment shape consistent with the locked architecture.

Selection criteria:

- development speed;
- team familiarity;
- reliability;
- deployment simplicity;
- testability;
- support for M1–M4.

Do not select based on novelty.

---

## TD-2 — Application Runtime / Language

`TECHNOLOGY DECISION NEEDED`

Choose the runtime/language used for application/domain logic.

It must comfortably support:

- lifecycle invariants;
- structured domain logic;
- deterministic retrieval;
- persistence interaction;
- test automation.

Team proficiency is more important than theoretical performance for this MVP.

---

## TD-3 — Canonical Persistence Technology

`TECHNOLOGY DECISION NEEDED`

Choose one persistence technology.

It must support:

- durable Quality Case storage;
- structured relationships;
- practical resolved-case queries;
- simple deployment/operations;
- predictable local and hosted testing.

The architecture does not require a vector/search datastore.

---

## TD-4 — Data Access / Persistence Mapping Approach

`TECHNOLOGY DECISION NEEDED`

Choose how application/domain logic communicates with canonical persistence.

Selection should prioritize:

- clarity of lifecycle rules;
- low accidental complexity;
- testability;
- straightforward migration/setup for demo environments.

The choice must not turn into a second persistence abstraction/service.

---

## TD-5 — Deployment Platform

`TECHNOLOGY DECISION NEEDED`

Choose hosting that supports:

- stable public access during judging;
- the selected web application/runtime;
- canonical persistence connectivity;
- simple deployment and recovery;
- environment configuration.

Live-demo reliability has higher priority than infrastructure sophistication.

---

## TD-6 — MVP Access Protection

`TECHNOLOGY DECISION NEEDED`

Decide whether the deployed demo uses:

- no interactive authentication but controlled/demo-only access; or
- a minimal authentication mechanism.

The choice must preserve OD-8:

- one organizational context;
- one active user persona;
- no RBAC product capability.

---

## TD-7 — Testing Toolchain

`TECHNOLOGY DECISION NEEDED`

Select tools for:

- unit/domain tests;
- integration tests;
- browser/end-to-end tests.

The stack must make the golden demo path easy to rerun automatically or semi-automatically before judging.

---

## TD-8 — UI Styling / Component Strategy

`TECHNOLOGY DECISION NEEDED`

Choose the UI implementation approach that enables:

- clear semi-guided stages;
- relationship visibility;
- fast iteration;
- responsive design.

This is a technology/product-delivery choice, not a new product capability.

---

# 27. Implementation Details Not Requiring Architecture Approval

The following are examples of decisions that may be made during engineering provided they preserve this document.

## Case Identity

`IMPLEMENTATION DETAIL`

Exact ID format.

## Timestamps

`IMPLEMENTATION DETAIL`

Exact timestamp fields and formatting.

## Persistence Table/Collection Shape

`IMPLEMENTATION DETAIL`

Exact schema, keys, joins, documents, or mapping structures.

## Evidence ↔ Cause Storage Representation

`IMPLEMENTATION DETAIL`

Exact mechanism used to persist the many-to-many conceptual relationship.

## Retrieval Rules

`IMPLEMENTATION DETAIL`

Exact deterministic weights, thresholds, normalization, tie-breaking, and ordering.

These must remain explainable and testable.

## Validation Placement

`IMPLEMENTATION DETAIL`

Exact layering of request validation, domain validation, and persistence constraints, provided architecture invariants remain trusted-server enforced.

## Form State Handling

`IMPLEMENTATION DETAIL`

Autosave vs explicit save mechanics, local form state, and navigation guards, provided the PRD's save/error behavior is preserved.

## Error Message Copy

`IMPLEMENTATION DETAIL`

Exact user-facing wording.

## Module Folder / Package Structure

`IMPLEMENTATION DETAIL`

Exact source-code organization inside the modular monolith.

## Logging

`IMPLEMENTATION DETAIL`

Exact logging library and format.

## Build / CI Configuration

`IMPLEMENTATION DETAIL`

Exact scripts and pipeline structure.

---

# 28. Technology Selection Principles

Before any technology is approved, each candidate must answer:

1. **Which M1–M4 requirement does this choice help satisfy?**
2. **Does it improve development speed or demo reliability?**
3. **Does the team already understand it sufficiently to debug under deadline pressure?**
4. **Does it reduce or add operational dependencies?**
5. **Can the golden demo be reproduced locally if deployment has a problem?**
6. **Does it preserve the modular monolith boundary?**
7. **Does it introduce infrastructure not required by PRODUCT/PRD?**
8. **Can it be tested easily?**

A technology that is more sophisticated but does not materially improve these answers should not be preferred.

---

# 29. Architecture Completion State

`ARCHITECTURE LOCKED`

Architecture Selection is complete for the MVP.

The next decision stage is **Technology Selection**, not implementation.

Implementation must not begin until the required technology decisions have been reviewed and approved.

The locked high-level architecture remains:

> **One compact modular-monolith web application, one canonical Quality Case persistence, Guided Investigation as the core domain workflow, and an internal deterministic retrieval module that reuses resolved cases as explainable historical references.**
