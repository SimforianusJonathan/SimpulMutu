# AGENTS.md — Coding Agent Operating Guardrails

## 0. Purpose

This file is an operating contract for coding agents working on the ITechnoCup 2026 MVP.

It is **not**:
- an implementation plan;
- a backlog;
- a coding task list;
- permission to expand scope.

Agents must implement only behavior supported by the locked source documents:

1. `PRODUCT.md` — product direction and scope authority;
2. `PRD.md` — product requirements authority;
3. `ARCHITECTURE.md` — high-level architecture authority;
4. `TECH_STACK.md` — implementation technology authority;
5. `DESIGN.md` — interaction and design authority.

If these documents appear to contradict each other, **do not resolve the contradiction silently**. Stop the affected work, identify the conflicting statements, and request a human decision.

---

# 1. Product Thesis — Non-Negotiable

The MVP exists to support this loop:

> A quality event becomes a structured investigation; the completed investigation becomes reusable organizational learning; relevant past learning can later re-enter a new investigation as a reference without becoming an automatic diagnosis.

The primary user is an owner, production supervisor, or quality person in a small garment/convection IKM who directly handles quality issues.

The product must remain:

> **investigation-first, not dashboard-first.**

The product must feel like **one continuous learning loop**, not separate RCA and knowledge-base products.

Any proposed implementation that weakens this thesis is out of scope unless the source documents are explicitly changed by a human.

---

# 2. Locked Product Object and Interface Terminology

The primary product object is one **Quality Case / Kasus Kualitas**.

While active, it is an investigation workspace.

When resolved, the **same Kasus Kualitas** becomes read-only **Memori Kualitas**.

Do not create a separate knowledge object solely to represent resolved learning.

## User-Facing Language

Bahasa Indonesia is the primary interface language.

Use the locked glossary consistently:

| Internal/Product Concept | User-Facing Term |
|---|---|
| Quality Case | **Kasus Kualitas** |
| Evidence | **Bukti** |
| Contributing Causes | **Faktor Penyebab** |
| Working Root Cause | **Dugaan Akar Penyebab** |
| Corrective Action | **Tindakan Korektif** |
| Quality Memory | **Memori Kualitas** |

Do not mix Indonesian and English user-facing terminology without a documented domain reason.

Internal code identifiers may use English when appropriate, but must preserve the same domain meaning.

---

# 3. M1–M4 Capability Boundaries

No implementation may create a fifth MVP capability.

## M1 — Create Quality Case

M1 allows the user to create a Kasus Kualitas and begin an investigation.

Required behavior:

- creation does not require the entire investigation to be completed;
- Problem/Masalah can be defined and revised while active;
- context may be added as information becomes available;
- unknown context must remain allowed;
- creating a case must not automatically create Memori Kualitas;
- M1 must not request or generate a root cause as part of creation.

Locked structured context:

- `Production Stage / Process` is the core structured context;
- `Product / Model Reference`;
- `Material`;
- `Machine / Workstation`;
- `Batch / Order Reference`;
- `Additional Context Note`.

These context fields must **not** become blocking creation requirements when the information is unknown. Never force placeholder/fabricated values just to satisfy persistence validation.

---

## M2 — Guided Investigation

M2 is the core product mechanism.

Preserve the conceptual reasoning chain:

`Problem & Context → Evidence → Contributing Causes → Working Root Cause → Corrective Action → Summary`

User-facing:

`Masalah & Konteks → Bukti → Faktor Penyebab → Dugaan Akar Penyebab → Tindakan Korektif → Ringkasan`

Required behavior:

- multiple Bukti items are allowed;
- multiple Faktor Penyebab are allowed;
- Bukti ↔ Faktor Penyebab relationships are explicit;
- one Bukti may support multiple Faktor Penyebab;
- one Faktor Penyebab may reference multiple Bukti;
- the user may revise active investigation reasoning;
- Dugaan Akar Penyebab is a user-owned working conclusion, not a proven fact;
- exactly one Dugaan Akar Penyebab is required at resolution;
- at least one Tindakan Korektif is required at resolution;
- past-case references must not auto-fill or determine current conclusions.

Do not reduce M2 to a single root-cause text box.

---

## M3 — Resolve Case into Quality Memory

Resolution is an explicit user action.

The same Kasus Kualitas becomes `RESOLVED` and functions as Memori Kualitas.

Required behavior:

- no duplicate knowledge-entry workflow;
- unresolved cases are not Memori Kualitas;
- resolution must enforce all locked invariants;
- resolved cases are immutable/read-only for the MVP;
- no reopen workflow exists;
- no action-effectiveness verification is required;
- no CAPA workflow may be added.

---

## M4 — Relevant Past Case Retrieval

M4 is an internal, deterministic, rule-based responsibility.

Required behavior:

- only `RESOLVED` cases are candidates;
- return **0–3** relevant past cases;
- zero results are valid;
- prefer zero results over unrelated references;
- each surfaced case explains why it is relevant using understandable shared signals;
- historical cases remain references, not answers;
- current investigation remains usable if M4 returns nothing or fails;
- M4 must never mutate the current Dugaan Akar Penyebab.

Relevant behavior may use approved structured information such as:

- similarity of the Problem;
- shared Production Stage / Process;
- shared Product / Model Reference when known;
- shared Material when known;
- shared Machine / Workstation when known;
- shared Batch / Order Reference when meaningful;
- available approved context/evidence signals.

Exact deterministic weights, thresholds, normalization, and tie-breaking are implementation details, but they must remain explainable and testable.

Do not add semantic/vector retrieval.

---

# 4. Explicit Product Non-Goals

Do **not** implement or scaffold:

- generic quality dashboard;
- KPI/analytics dashboard;
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
- generic company knowledge base;
- cross-company knowledge sharing;
- automatic corrective-action recommendation;
- action-effectiveness tracking;
- causal/confidence scoring;
- owner/assignment workflow;
- due-date workflow.

A feature is outside the MVP if it does not directly improve either:

1. **structured investigation**, or
2. **reuse of previous investigation learning**,

and cannot be traced to M1–M4.

Do not add “helpful” features speculatively.

---

# 5. Architecture Constraints

The architecture is locked.

## Application Boundary

Use a **Compact Modular Monolith**.

Do not introduce:

- microservices;
- separate business backend service;
- distributed application boundaries;
- event-driven service architecture.

M1–M4 remain internal modules/responsibilities of one application.

## Persistence

Use one canonical PostgreSQL persistence for Kasus Kualitas.

Do not introduce:

- second persistence technology;
- dedicated search store;
- dedicated retrieval index;
- vector database;
- analytics database;
- read model as a second source of truth.

Resolved Memori Kualitas is read from the same canonical Quality Case persistence.

## Retrieval

Relevant Past Case Retrieval remains an **internal modular responsibility**, not a service.

Its internal contract should be replaceable later, but MVP implementation remains deterministic and reads canonical resolved cases directly.

## Infrastructure

Do not add:

- Redis;
- cache layer as architecture;
- message queue;
- event bus;
- worker service;
- search infrastructure;
- container orchestration;
- Kubernetes;
- service mesh;
- distributed coordination.

If an implementation task seems to require one of these, treat that as a blocker and request review rather than adding it.

---

# 6. Locked Technology Constraints

Use:

- **Next.js App Router** — full-stack application;
- **TypeScript**;
- **Node.js 24 LTS**;
- **PostgreSQL** — only canonical persistence;
- **Prisma ORM** — persistence access/mapping;
- **Railway** — web application + managed PostgreSQL deployment;
- **Vitest** — fast domain/unit/integration-oriented tests;
- **Playwright** — browser/E2E testing;
- **Tailwind CSS** — custom visual implementation;
- **Radix Primitives** — only for genuinely needed accessible interaction primitives.

## Access Protection

Use only the locked **minimal single-credential application gate**.

Do not implement:

- signup;
- OAuth/social login;
- password reset;
- RBAC;
- organizations/teams;
- multiple-user workflows;
- user-management capability;
- external identity platform as a product dependency.

Credential validation belongs in the trusted server-side application boundary. Secrets must not be exposed in client-readable configuration.

## UI Technology Restrictions

Tailwind is used to implement the custom `DESIGN.md` direction.

Radix may be used for low-level accessible interactions such as:

- drawer/dialog;
- tooltip;
- popover;
- disclosure/collapsible;
- other approved interaction primitives that are actually needed.

Do not use shadcn/ui, Material UI, or another pre-styled visual design system as the UI foundation.

Do not add a component just because it exists in a library.

---

# 7. Internal Module Responsibility Boundaries

Keep responsibilities explicit even though all modules live in one deployable application.

## Presentation / Interaction

Owns:

- rendering;
- navigation;
- user interaction;
- loading/empty/error presentation;
- staged investigation UI;
- Evidence Loom presentation;
- past-case drawer;
- resolved read mode.

Must not own the only enforcement of domain invariants.

Do not put lifecycle correctness exclusively in client components.

---

## Quality Case Module

Owns:

- case creation;
- case identity;
- structured context;
- `DRAFT → INVESTIGATING → RESOLVED` lifecycle;
- lifecycle-level mutability rules.

Must not create separate knowledge records.

---

## Guided Investigation Module

Owns:

- Masalah/Problem;
- Bukti;
- Faktor Penyebab;
- Bukti ↔ Faktor Penyebab relationships;
- Dugaan Akar Penyebab;
- Tindakan Korektif;
- investigation completeness/summary semantics.

Must not claim causal truth.

---

## Resolution / Quality Memory Module

Owns:

- resolution invariant checks;
- explicit transition to `RESOLVED`;
- resolved-case immutability;
- exposure of the same resolved case as Memori Kualitas.

Must not add verification/effectiveness workflows.

---

## Relevant Past Case Retrieval Module

Owns:

- candidate filtering to `RESOLVED`;
- deterministic relevance evaluation;
- ordering/filtering;
- limit of 0–3;
- human-readable relevance explanations.

Must not become:
- semantic search;
- recommendation engine;
- diagnosis engine;
- external service.

---

## Persistence Access

Owns controlled PostgreSQL/Prisma persistence access.

Must preserve:

- one canonical source of truth;
- lifecycle-sensitive writes;
- relationship integrity;
- consistent resolved reads for M4.

Do not let UI components perform uncontrolled persistence writes that bypass application/domain rules.

---

# 8. Domain Invariants

These invariants are non-negotiable.

## Lifecycle

Allowed conceptual lifecycle:

`DRAFT → INVESTIGATING → RESOLVED`

Do not invent additional product lifecycle states without explicit approval.

## Resolution Gate

A case may become `RESOLVED` only when:

1. Problem/Masalah exists;
2. at least one Bukti exists;
3. at least one Faktor Penyebab exists;
4. exactly one Dugaan Akar Penyebab exists for resolution;
5. at least one Tindakan Korektif exists;
6. the user explicitly requests resolution.

Completion must never auto-resolve a case.

If validation or persistence fails, the case must remain non-resolved.

## Immutability

A `RESOLVED` Kasus Kualitas is read-only.

Do not expose or implement normal mutation paths for resolved investigation content.

No reopen behavior exists in the MVP.

## Evidence Relationship Integrity

Bukti and Faktor Penyebab are distinct entities/concepts.

Relationship rules:

- many Bukti may support one Faktor Penyebab;
- one Bukti may support many Faktor Penyebab;
- deleting/changing a Bukti must not leave silently misleading dangling relationships;
- relationship semantics must remain traceable in active and resolved views.

## Historical Reference Safety

A historical Dugaan Akar Penyebab or Tindakan Korektif is **historical information only**.

It must never automatically become the current case conclusion/action.

---

# 9. Design Constraints

The locked design direction is **Evidence Loom**.

## Information Hierarchy

Current investigation is primary.

Secondary:
- known context;
- stage progression;
- relevant historical references.

Must not dominate:
- analytics;
- global metrics;
- historical content;
- navigation chrome.

## Navigation

Global navigation stays narrow:

- Kasus Kualitas;
- Aktif;
- Selesai;
- Buat Kasus Kualitas.

Do not add enterprise module navigation.

## Staged Progression

Use the locked horizontal staged progression:

`Masalah & Konteks → Bukti → Faktor Penyebab → Dugaan Akar Penyebab → Tindakan Korektif → Ringkasan`

It is semi-guided, not hard-locked wizard navigation.

## Relevant Past Cases

Use an **on-demand drawer**.

Past references must remain visually secondary.

## Resolved Mode

Use the locked calm, read-only, dossier-inspired Memori Kualitas treatment.

Do not simply disable inputs in the active workspace and call it resolved design.

---

# 10. Evidence Loom Implementation Principles

Evidence Loom is a **custom product interaction**.

Do not search for or substitute a generic graph/workflow component.

## Desktop Behavior

- Bukti and Faktor Penyebab are visually distinct;
- all existing relationship connectors are faintly visible by default;
- selecting/inspecting a Bukti or Faktor Penyebab emphasizes its direct relationships;
- unrelated connections become visually quieter, not hidden in a way that destroys orientation.

## Relationship Semantics

Connector lines are **not** the only representation.

Always preserve textual/semantic relationship information, for example:

- Faktor Penyebab card references supporting Bukti IDs/labels;
- accessible text exposes support relationships;
- resolved read mode retains traceability.

## Narrow Screens

Use the locked fallback:

- stacked Bukti;
- stacked Faktor Penyebab cards;
- explicit Bukti references within each Faktor Penyebab.

Do not force a miniaturized desktop connector graph onto narrow screens.

## No False Epistemic Signals

Do not add:

- confidence percentages;
- `likely / unlikely` scoring;
- AI badges;
- “root cause found” presentation;
- “recommended root cause” treatment.

Dugaan Akar Penyebab must remain visibly provisional.

---

# 11. Accessibility Expectations

Accessibility is part of task correctness, not optional polish.

At minimum:

- all interactive controls must be keyboard reachable;
- visible focus states must be preserved;
- drawers/dialogs/popovers must handle focus appropriately;
- form controls need meaningful labels;
- active/resolved state cannot be communicated only by color;
- selected relationships cannot be communicated only by connector color;
- Evidence Loom relationships must have textual equivalents;
- narrow-screen fallback must remain semantically understandable;
- historical/current conclusions must be distinguishable in text, not just appearance;
- loading, empty, and error states must be perceivable and understandable.

Use semantic HTML first.

Use Radix where an approved interaction benefits from its accessibility behavior; do not use Radix merely for availability.

Do not remove accessible behavior in pursuit of visual fidelity.

---

# 12. Testing Expectations

Implementation work must preserve the locked testing strategy.

## Vitest

Use Vitest for fast deterministic tests of relevant domain/application behavior, especially:

- lifecycle transitions;
- invalid transitions;
- resolution invariants;
- resolved immutability;
- incomplete context handling;
- Bukti ↔ Faktor Penyebab relationship integrity;
- one Dugaan Akar Penyebab at resolution;
- deterministic M4 behavior;
- resolved-only eligibility;
- zero results;
- maximum three results;
- relevance explanation;
- guarantee that M4 does not mutate current diagnosis.

When correctness depends on Prisma/PostgreSQL behavior, do not mock away the behavior being tested.

## Playwright

Use Playwright for critical real-browser behavior, especially the golden loop:

`Access → Create → Investigate → Inspect Relevant Past Case → Continue Current Reasoning → Resolve → Read Memori Kualitas`

Critical UI work should test the relevant:
- interaction;
- state transition;
- empty/error behavior;
- accessibility-sensitive navigation where practical.

Do not build a large test matrix that does not improve MVP reliability.

---

# 13. Failure-Behavior Rules

Never make the UI claim success before trusted persistence/domain work has succeeded.

## Create/Update Failure

- do not show unsaved changes as saved;
- do not advance lifecycle falsely;
- show understandable failure feedback.

## Resolution Failure

- leave the case non-resolved;
- do not expose it as Memori Kualitas;
- do not show success state.

## Retrieval Failure

- M2 remains usable;
- current investigation stays unchanged;
- show that historical references are unavailable;
- do not fabricate fallback references.

## Zero Relevant Cases

This is a valid result, not an error.

Do not surface unrelated cases merely to fill the drawer.

---

# 14. Scope-Control Rules for Agents

Before adding any behavior, ask:

1. Which exact M1–M4 requirement does this satisfy?
2. Is it required by `PRD.md`, `ARCHITECTURE.md`, `TECH_STACK.md`, or `DESIGN.md`?
3. Does it preserve investigation-first behavior?
4. Does it add a new user capability?
5. Does it add a new infrastructure dependency?
6. Does it weaken demo reliability?
7. Can the need be met with the already locked stack?

If a change introduces a new capability, module, service, persistent store, user role, navigation area, analytics surface, AI behavior, or workflow state, **do not implement it without human approval**.

Prefer the smallest implementation that satisfies the locked requirement.

Do not future-proof with speculative infrastructure.

---

# 15. Rules for Schema Changes

The exact Prisma/PostgreSQL schema is an implementation detail, but domain semantics are not.

An agent may make a schema change without reopening architecture only when the change:

- supports already-approved M1–M4 behavior;
- preserves one canonical PostgreSQL source of truth;
- preserves the locked lifecycle and invariants;
- does not add a new product concept/capability;
- does not create a second persistence/index;
- includes appropriate migration/test impact.

Stop and request human approval if a proposed schema change would:

- add a new domain capability;
- create new lifecycle semantics;
- make resolved cases mutable;
- require a second datastore/index;
- add user/role/account concepts beyond the single-credential gate;
- change what “relevant” means at the product level.

Do not alter source-of-truth product semantics just to make the schema easier.

---

# 16. Rules for API / Server Interface Changes

The exact use of Server Actions, Route Handlers, or internal interfaces is an implementation detail.

Any interface must:

- stay within the Next.js full-stack modular monolith;
- enforce trusted server-side validation;
- preserve module boundaries;
- avoid exposing persistence directly to the client;
- preserve consistent errors and lifecycle semantics.

Do not introduce:

- separate API service;
- public API product capability;
- API gateway;
- service-to-service protocol;
- event bus.

If an API/interface change modifies user-visible behavior or M1–M4 semantics, it requires review against `PRD.md` before implementation.

---

# 17. Rules for UI Changes

UI may evolve only within `DESIGN.md`.

Allowed implementation-level variation includes:
- spacing;
- responsive composition;
- Tailwind class structure;
- exact Radix primitive composition;
- microcopy refinement that preserves locked terminology and meaning.

Human approval is required before a UI change that would:

- add a new screen/module not traceable to M1–M4;
- change navigation hierarchy;
- make dashboard/analytics primary;
- move Relevant Past Cases into primary attention;
- change Evidence Loom semantics;
- remove textual Bukti ↔ Faktor Penyebab relationships;
- change the horizontal staged progression model;
- make resolved Memori Kualitas editable;
- alter the locked Indonesian domain glossary;
- introduce a pre-styled design system foundation.

Do not add components solely to make the UI look more feature-complete.

---

# 18. Prohibited Additions

Agents must not independently add:

## AI / ML
- LLM calls;
- embeddings;
- semantic search;
- AI-generated diagnosis;
- AI suggestions;
- vector databases.

## Analytics
- KPI cards;
- dashboards;
- charting;
- aggregate quality analytics;
- scoring systems.

## Authentication / Users
- signup;
- OAuth;
- password reset;
- RBAC;
- user profiles;
- teams;
- multi-user collaboration.

## Infrastructure
- microservices;
- Redis;
- queues;
- workers;
- event buses;
- search services;
- additional databases;
- cache clusters;
- Kubernetes.

## Product Expansion
- inventory;
- production planning;
- CAPA suite;
- weekly meeting workflow;
- CV inspection;
- generic knowledge base;
- tasks/owners/due dates;
- action-effectiveness verification.

A library dependency that implicitly drags the project toward one of these areas should be challenged before addition.

---

# 19. Dependency Rules

Before adding a package:

- verify the required behavior cannot be implemented cleanly with the locked stack or existing dependencies;
- prefer small, focused dependencies;
- avoid packages that impose visual/product architecture not present in `DESIGN.md`;
- do not add duplicate libraries for the same responsibility without a concrete blocker;
- do not add a library merely to save a few lines of code when it increases runtime/deployment risk.

For UI:
- Tailwind is the styling foundation;
- Radix is the accessible primitive layer;
- Evidence Loom remains custom.

---

# 20. Definition of Done for Every Implementation Task

A task is done only when all applicable checks below are satisfied.

## Requirement Traceability

- the change can be traced to M1, M2, M3, or M4, or to a locked cross-cutting requirement;
- no unapproved capability was added;
- no source-of-truth constraint was silently changed.

## Domain Correctness

- relevant lifecycle/invariant rules are preserved;
- resolved immutability is preserved;
- Bukti ↔ Faktor Penyebab integrity is preserved where applicable;
- M4 remains deterministic/reference-only where applicable.

## Product Behavior

- loading/empty/error states required by the PRD are handled where relevant;
- unknown context is not fabricated or incorrectly blocked;
- historical cases do not become current answers;
- user-facing terminology follows the locked Indonesian glossary.

## Architecture / Technology

- implementation remains inside the Compact Modular Monolith;
- PostgreSQL remains the only canonical persistence;
- Prisma remains the data-access layer;
- no prohibited infrastructure/dependency was introduced;
- Tailwind/Radix usage follows `TECH_STACK.md`.

## Design / Accessibility

- UI follows `DESIGN.md`;
- current investigation remains primary;
- Evidence Loom semantics are preserved where applicable;
- textual relationship representation exists in addition to connectors;
- keyboard/focus/semantic accessibility is preserved;
- narrow-screen behavior remains understandable where affected.

## Testing

- relevant Vitest tests are added/updated and pass;
- relevant Playwright coverage is added/updated for critical browser behavior;
- regressions in the golden path are not introduced;
- tests verify behavior rather than only implementation details.

## Quality / Failure Safety

- errors do not create false success states;
- server-side/domain validation exists for critical invariants;
- secrets are not exposed client-side;
- no unresolved TODO changes product semantics.

## Documentation Impact

- implementation-detail changes are documented where the codebase convention requires;
- if the task reveals a real contradiction or requires changing a locked product/architecture/design/technology decision, the task is **not done** until a human approves the source-of-truth change.

---

# 21. Conflict and Escalation Rule

When unsure, do not expand scope.

If a request or implementation pressure conflicts with a locked document:

1. stop the conflicting part;
2. identify the exact source-of-truth constraint;
3. explain the blocker;
4. propose the smallest compliant alternative if one exists;
5. request human approval before changing locked behavior.

Never “fix” a product, architecture, technology, or design decision silently.

---

# 22. Agent Success Criterion

A successful coding agent makes the approved MVP **more complete and reliable without making it broader**.

The implementation should make this golden loop unmistakable:

`Kasus Kualitas → Investigasi Terpandu → Bukti ↔ Faktor Penyebab → Dugaan Akar Penyebab → Tindakan Korektif → Selesai/Memori Kualitas → Kasus Terdahulu yang Relevan membantu investigasi berikutnya`

Past experience remains a **reference**, not an automatic answer.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
