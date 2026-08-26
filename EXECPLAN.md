# EXECPLAN.md — ITechnoCup 2026 MVP

## 0. Status and Authority

**Status:** Draft implementation execution plan — waiting for human approval before coding begins.

This ExecPlan is subordinate to the locked sources of truth:

1. `PRODUCT.md`
2. `PRD.md`
3. `ARCHITECTURE.md`
4. `TECH_STACK.md`
5. `DESIGN.md`
6. `AGENTS.md`

If this plan conflicts with any locked source, the locked source wins. Do not silently reinterpret the product, architecture, technology, or design to make a milestone easier.

This document is a **vertical-slice implementation plan**. It is not permission to add product scope.

---

# 1. Golden Path Target

The implementation must converge on this end-to-end golden path:

`Access → Create Kasus Kualitas → Investigasi Terpandu → Bukti ↔ Faktor Penyebab → Kasus Terdahulu yang Relevan → Dugaan Akar Penyebab → Tindakan Korektif → Resolve → Memori Kualitas`

Every milestone must leave the application runnable and must add a user-visible slice or a demo-critical reliability capability.

---

# 2. Why This Milestone Order

The requested sequence is largely correct, but two principles are used to preserve vertical slicing:

1. **Persistence is introduced only as needed by a user-visible slice.**  
   Milestone 1 establishes only enough persistence and application plumbing to prove connectivity and access. Domain persistence grows incrementally in later milestones.

2. **M2 is split into two user-visible slices.**  
   Basic staged investigation is delivered first, then the core Bukti ↔ Faktor Penyebab relationship and Evidence Loom are added as a separate milestone because that interaction is both technically and visually distinctive.

3. **M4 comes only after M3.**  
   Relevant Past Cases must operate on canonical `RESOLVED` cases. Implementing M4 earlier would require fake or special-case storage and would violate the architecture’s source-of-truth model.

4. **Resolved design polish is separated from resolution correctness.**  
   M3 is first made domain-correct and immutable; the calm C-inspired Memori Kualitas reading mode is then integrated with the golden demo after M4 exists.

This produces nine milestones that remain individually runnable and testable.

---

# 3. Cross-Milestone Rules

## `IMPLEMENTATION DECISION`

- Keep all business behavior inside the locked Next.js Compact Modular Monolith.
- Keep PostgreSQL as the only canonical persistence.
- Use Prisma for all persistence mapping.
- Use Tailwind for custom visual implementation.
- Use Radix only for approved accessible primitives.
- Keep Evidence Loom custom.
- Use Vitest for domain/application behavior and Playwright for critical browser flows.
- Keep all user-facing terminology in Bahasa Indonesia using the locked glossary.

## `RISK`

The largest recurring risk is accidental scope growth while building supporting UX or infrastructure.

## `ACCEPTANCE`

No milestone is accepted if it introduces:
- AI/LLM;
- semantic/vector retrieval;
- analytics/dashboard;
- user-management capability;
- extra infrastructure;
- additional lifecycle states;
- action-effectiveness verification;
- new product modules outside M1–M4.

---

# 4. Milestone 1 — Runnable Foundation + Access Gate + Persistence Connectivity

`MILESTONE`

## Objective

Create the smallest deployable/runnable application skeleton that proves:

- the locked stack works locally;
- the single-credential application gate works;
- the application can connect to canonical PostgreSQL;
- the project can be tested and deployed without introducing product capability.

## User-Visible Outcome

A user can:

1. open the application;
2. see the single-credential access gate;
3. enter the valid demo credential;
4. reach a minimal authenticated application shell;
5. see a neutral empty-state entry point for `Kasus Kualitas`.

No real Kasus Kualitas creation is implemented yet.

## Requirements / Capabilities Served

- Cross-cutting access protection from `TECH_STACK.md`.
- Foundation for M1–M4.
- No M1 capability is considered complete yet.

## Implementation Scope

- Next.js App Router project foundation.
- TypeScript / Node.js 24 LTS setup.
- Tailwind CSS setup.
- Radix available only if an approved primitive is actually needed for the access interaction.
- Prisma initialization.
- PostgreSQL connectivity.
- Environment configuration.
- Minimal single-credential server-side access gate.
- Minimal authenticated app shell.
- Vitest and Playwright setup.
- Railway-compatible runtime configuration.

## Database / Schema Changes

Minimal persistence connectivity only.

Permitted schema work:
- only technical/database objects required to verify connectivity and migration flow;
- no speculative product schema.

If the first product table/model is not needed yet, do not create it.

## Domain / Application Work

- server-side credential validation;
- session/access check;
- trusted route protection for the application area;
- one shared application-level persistence connectivity path.

## UI Work

- Bahasa Indonesia access gate;
- invalid credential error;
- minimal authenticated empty state;
- no dashboard;
- no KPI cards;
- no fake product data.

## Tests

### Vitest
- credential validation helper/domain behavior if factored into testable logic;
- environment/config validation where useful.

### Playwright
- invalid credential is rejected;
- valid credential reaches application shell;
- protected application area cannot be accessed without the gate.

### Integration
- application can connect to PostgreSQL;
- Prisma migration/test connectivity works.

## Seed / Demo Data

None required.

## `DEPENDENCY`

No prior milestone.

## `RISK`

- overbuilding authentication;
- introducing signup/account concepts;
- adding generic dashboard shell because the app is otherwise empty;
- coupling local development to Railway.

## `ACCEPTANCE`

Milestone passes when:

- local app boots on Node.js 24 LTS;
- PostgreSQL connectivity is confirmed;
- valid single credential grants access;
- invalid/no credential is denied;
- the authenticated app shell renders;
- test runners execute successfully;
- no user-management capability exists.

## Definition of Done

- local setup works from a clean environment using documented configuration;
- access gate is enforced server-side;
- secrets are not client-exposed;
- app remains one modular monolith;
- tests pass;
- no product capability beyond access shell has been added.

## Explicit Out-of-Scope

- signup;
- OAuth;
- password reset;
- RBAC;
- user profile;
- Kasus Kualitas CRUD;
- analytics;
- dashboard;
- full navigation implementation;
- production seed data.

---

# 5. Milestone 2 — M1 Create Kasus Kualitas

`MILESTONE`

## Objective

Deliver the first complete product capability: create and revisit a canonical Kasus Kualitas with non-blocking structured context.

## User-Visible Outcome

The user can:

1. enter the application;
2. choose `Buat Kasus Kualitas`;
3. enter Masalah;
4. enter `Production Stage / Process`;
5. optionally enter any known structured context;
6. create the case;
7. return to the case later;
8. see the case as active/non-resolved.

Unknown context does not block creation.

## Requirements / Capabilities Served

- **M1 — Create Quality Case**
- Lifecycle foundation: `DRAFT` / active progression.
- Locked context taxonomy.

## Implementation Scope

- canonical Kasus Kualitas persistence;
- create/read active case;
- minimal active/resolved distinction in case listing;
- Masalah editing while active;
- structured context editing while active;
- lifecycle state persisted canonically;
- no investigation reasoning beyond Masalah + Konteks.

## Database / Schema Changes

Add only what M1 needs conceptually:

- Kasus Kualitas identity;
- lifecycle state;
- Masalah;
- approved structured context fields;
- timestamps/technical metadata if needed.

Do not add Bukti, Faktor Penyebab, root-cause, action, or retrieval tables/models until required by later milestones.

## Domain / Application Work

- create case;
- validate minimum creation requirements;
- allow optional context to remain absent;
- edit active Masalah/context;
- enforce that created case is not `RESOLVED`;
- list/load existing cases.

## UI Work

- `Kasus Kualitas` collection;
- `Aktif` / `Selesai` distinction, even if no resolved cases exist yet;
- `Buat Kasus Kualitas`;
- Masalah & Konteks form;
- locked Bahasa Indonesia terminology;
- empty state when no cases exist;
- save/loading/error states.

The design should already avoid dashboard-first composition.

## Tests

### Vitest
- creation validation;
- optional context remains optional;
- lifecycle initial state;
- active case can be edited;
- case is not treated as Memori Kualitas.

### Integration
- create/save/reload from PostgreSQL;
- optional context persists as absent when unknown.

### Playwright
- access → create case → reopen case;
- unknown optional context does not block creation;
- failed save does not show false success where practical to test.

## Seed / Demo Data

Optional development-only empty database.

No golden demo historical cases required yet.

## `DEPENDENCY`

Milestone 1.

## `RISK`

- accidentally making all context required at schema or form level;
- turning the case list into an analytics dashboard;
- prematurely introducing investigation fields.

## `ACCEPTANCE`

Milestone passes when:

- a user can create a Kasus Kualitas with Masalah + sufficient initial context;
- optional context may remain unknown;
- case persists and reloads;
- case is clearly active;
- user can edit active Masalah/context;
- no Memori Kualitas exists yet.

## Definition of Done

- M1 acceptance criteria from PRD are met;
- schema supports only approved M1 concepts;
- UI uses locked Indonesian glossary;
- unit/integration/E2E coverage passes;
- app remains deployable and runnable.

## Explicit Out-of-Scope

- Bukti;
- Faktor Penyebab;
- Evidence Loom;
- Dugaan Akar Penyebab;
- Tindakan Korektif;
- Resolve;
- M4;
- analytics.

---

# 6. Milestone 3 — M2 Basic Staged Investigation

`MILESTONE`

## Objective

Turn an active Kasus Kualitas into a semi-guided investigation workspace with the locked horizontal staged progression and independent Bukti capture.

## User-Visible Outcome

The user can open an active case and move through:

`Masalah & Konteks → Bukti → Faktor Penyebab → Dugaan Akar Penyebab → Tindakan Korektif → Ringkasan`

At this milestone:

- Masalah & Konteks is functional;
- Bukti creation/editing is functional;
- later stages may render clearly as not-yet-complete placeholders within the approved flow, but must not pretend their behavior exists.

The app now visibly feels investigation-first.

## Requirements / Capabilities Served

- **M2 — Guided Investigation**, partial vertical slice.
- Semi-guided interaction.
- Bukti as distinct observations, not conclusions.

## Implementation Scope

- horizontal staged progression strip;
- active case investigation shell;
- multiple Bukti items;
- create/edit/delete Bukti while active;
- stage navigation and completion cues;
- basic Ringkasan skeleton that reflects available data without claiming resolution readiness.

## Database / Schema Changes

Add conceptual persistence for:

- Bukti items;
- relationship from Bukti to Kasus Kualitas.

No Faktor Penyebab relationship model yet unless strictly required by this milestone’s UI shell.

## Domain / Application Work

- add/update/remove Bukti on active cases;
- prevent mutation if case is not active;
- calculate basic stage completeness;
- preserve active lifecycle.

## UI Work

- locked horizontal staged progression;
- Bukti stage with individually addressable items;
- clear distinction between observation and interpretation;
- completed-stage compact summaries;
- ability to revisit earlier stages;
- no hard-locked wizard behavior.

## Tests

### Vitest
- multiple Bukti allowed;
- Bukti updates/deletions on active case;
- mutations rejected for non-active case path if applicable;
- stage completeness logic for Masalah/Konteks/Bukti.

### Integration
- Bukti persists and reloads;
- deleting Bukti removes it canonically.

### Playwright
- create/reopen case;
- enter Bukti;
- navigate forward/backward across stages;
- prior entered reasoning remains available.

## Seed / Demo Data

A simple active development case may be seeded for UI iteration.

Clearly mark it synthetic.

## `DEPENDENCY`

Milestone 2.

## `RISK`

- making stage navigation a rigid wizard;
- hiding previous reasoning;
- treating Bukti as a generic notes field;
- implementing later M2 stages prematurely.

## `ACCEPTANCE`

Milestone passes when:

- user can move through the staged investigation shell;
- user can add multiple Bukti;
- Bukti is visibly distinct from later interpretation;
- user can revisit earlier stages;
- app remains runnable even though cause/root/action behavior is not complete.

## Definition of Done

- staged navigation behaves according to `DESIGN.md`;
- Bukti persistence is reliable;
- tests pass;
- no fake root-cause/cause logic is displayed as implemented behavior.

## Explicit Out-of-Scope

- Evidence ↔ Cause linking;
- Evidence Loom connectors;
- Dugaan Akar Penyebab behavior;
- Tindakan Korektif behavior;
- Resolve;
- M4.

---

# 7. Milestone 4 — Evidence ↔ Faktor Penyebab + Evidence Loom

`MILESTONE`

## Objective

Deliver the core visual and domain mechanism of S1: explicit Bukti ↔ Faktor Penyebab relationships and the custom Evidence Loom.

## User-Visible Outcome

The user can:

1. create multiple Faktor Penyebab;
2. link each Faktor Penyebab to one or more Bukti;
3. link one Bukti to multiple Faktor Penyebab;
4. see all existing relationships faintly;
5. select a Bukti or Faktor Penyebab and emphasize its direct links;
6. read textual Bukti references in addition to visual connectors;
7. use a stacked relationship representation on narrow screens.

This is the first milestone where the design thesis becomes visually distinctive.

## Requirements / Capabilities Served

- **M2 — Guided Investigation**
- Bukti ↔ Faktor Penyebab traceability.
- Evidence Loom design constraints.
- Accessibility relationship requirement.

## Implementation Scope

- Faktor Penyebab persistence;
- many-to-many Bukti ↔ Faktor Penyebab relationship;
- add/edit/delete Faktor Penyebab while active;
- relationship editing;
- custom Evidence Loom;
- textual relation representation;
- responsive stacked fallback.

## Database / Schema Changes

Add conceptual persistence for:

- Faktor Penyebab items;
- explicit Bukti ↔ Faktor Penyebab many-to-many relationship.

Schema must ensure relationship integrity.

Do not add graph database or second persistence.

## Domain / Application Work

- create/update/delete Faktor Penyebab;
- link/unlink Bukti;
- prevent dangling/misleading relationships when Bukti or cause is deleted;
- return relationship data in a form usable by active and future resolved views.

## UI Work

### Desktop
- Bukti column;
- Faktor Penyebab column;
- custom relationship connector layer;
- faint default connections;
- selected relationship emphasis;
- textual references within/near cause representation.

### Narrow Screens
- stacked Bukti;
- stacked Faktor Penyebab cards;
- explicit `Didukung oleh: E1, E2...` references;
- no forced mini-graph.

### Accessibility
- keyboard-inspectable items;
- selected relationship has a non-color cue;
- connectors are supplementary, not sole semantics.

## Tests

### Vitest
- one Bukti → many causes;
- many Bukti → one cause;
- link/unlink behavior;
- deletion integrity;
- relationship representation returned correctly;
- no relationship mutation on resolved case path once such behavior exists later.

### Integration
- relation persistence survives reload;
- deletion does not leave orphan relation records.

### Playwright
- create Bukti and Faktor Penyebab;
- link them;
- verify textual references;
- select one item and verify emphasized state;
- basic responsive/narrow-screen behavior.

## Seed / Demo Data

Synthetic active case with:
- 3 Bukti;
- 2–3 Faktor Penyebab;
- overlapping relationships.

This fixture should become the early basis of the golden demo current case.

## `DEPENDENCY`

Milestone 3.

## `RISK`

- turning the loom into a general graph editor;
- connector layout becoming fragile;
- accessibility depending only on SVG/lines;
- adding confidence/likelihood labels;
- overengineering automatic positioning.

## `ACCEPTANCE`

Milestone passes when:

- relationships are explicit and persisted;
- all relationships are faintly visible by default;
- selected direct relationships are emphasized;
- textual relationship information exists;
- narrow-screen fallback works without connectors;
- no library graph component replaces the custom interaction.

## Definition of Done

- domain relation integrity is tested;
- Evidence Loom behavior matches locked design;
- keyboard/textual semantics are preserved;
- app remains stable and runnable with synthetic fixture data.

## Explicit Out-of-Scope

- confidence scores;
- causal scoring;
- auto-generated causes;
- graph editing beyond Bukti↔Cause support links;
- M4;
- Resolve.

---

# 8. Milestone 5 — Dugaan Akar Penyebab + Tindakan Korektif + Ringkasan

`MILESTONE`

## Objective

Complete M2 so the user can move from evidence-supported contributing factors to one provisional current conclusion and at least one action, then review the full reasoning chain.

## User-Visible Outcome

The user can:

1. review Bukti and Faktor Penyebab;
2. establish one `Dugaan Akar Penyebab`;
3. see that it is explicitly provisional/current;
4. add at least one `Tindakan Korektif`;
5. open `Ringkasan`;
6. see the complete reasoning chain;
7. see which resolution requirements are still incomplete.

The case is **not yet resolvable** until Milestone 6 implements the actual transition.

## Requirements / Capabilities Served

- **M2 — Guided Investigation**, completed.
- Working conclusion semantics.
- Corrective action capture.
- Summary and resolution-readiness presentation.

## Implementation Scope

- exactly one active Dugaan Akar Penyebab representation;
- Tindakan Korektif persistence;
- traceability from Dugaan Akar Penyebab back to current reasoning;
- Ringkasan;
- resolution-readiness calculation;
- no actual resolve mutation yet.

## Database / Schema Changes

Add only what is needed for:

- one Working Root Cause / Dugaan Akar Penyebab per case at resolution;
- one or more Tindakan Korektif.

Do not add:
- effectiveness status;
- due dates;
- owner;
- approvals;
- confidence.

## Domain / Application Work

- set/change Dugaan Akar Penyebab while active;
- ensure exactly one current root-cause conclusion is used for resolution readiness;
- add/edit/delete Tindakan Korektif while active;
- calculate locked resolution gate completeness;
- produce reasoning summary.

## UI Work

- visually separated provisional `Dugaan Akar Penyebab`;
- supporting traceability;
- Tindakan Korektif stage;
- Ringkasan with full reasoning chain;
- clear missing-requirement indicators;
- no “root cause found” language.

## Tests

### Vitest
- exactly one Working Root Cause at readiness;
- root cause can change while active;
- corrective action minimum;
- resolution-readiness matrix;
- no confidence/verification semantics.

### Integration
- root/action persist and reload;
- summary reads canonical current state.

### Playwright
- move from loom → Dugaan Akar Penyebab → Tindakan Korektif → Ringkasan;
- change the working conclusion and verify summary updates;
- missing requirement blocks readiness indication.

## Seed / Demo Data

Extend the synthetic current case with:
- candidate Faktor Penyebab;
- one current Dugaan Akar Penyebab;
- one Tindakan Korektif.

Keep this synthetic and editable for demo rehearsal.

## `DEPENDENCY`

Milestone 4.

## `RISK`

- wording makes Dugaan Akar Penyebab look proven;
- adding scoring/confidence;
- turning Tindakan Korektif into task management;
- silently treating readiness as automatic resolution.

## `ACCEPTANCE`

Milestone passes when:

- one provisional Dugaan Akar Penyebab is captured;
- at least one Tindakan Korektif can be captured;
- Ringkasan displays the full reasoning chain;
- completeness is visible;
- case does not auto-resolve.

## Definition of Done

- all M2 functional behavior is implemented;
- summary is accurate and current;
- tests cover provisional conclusion and resolution-readiness logic;
- no action-effectiveness workflow exists.

## Explicit Out-of-Scope

- actual `RESOLVED` transition;
- immutable memory mode;
- action verification;
- assignment;
- due dates;
- M4.

---

# 9. Milestone 6 — M3 Resolve → Immutable Memori Kualitas

`MILESTONE`

## Objective

Close the investigation loop correctly: explicitly resolve a complete case and turn the same canonical Kasus Kualitas into immutable Memori Kualitas.

## User-Visible Outcome

The user can:

1. reach Ringkasan;
2. see that all locked resolution requirements are satisfied;
3. explicitly choose `Selesaikan Kasus` / equivalent approved wording;
4. transition the case to `SELESAI`;
5. reopen it as read-only Memori Kualitas;
6. observe that edit controls are no longer available.

No separate knowledge entry is created.

## Requirements / Capabilities Served

- **M3 — Resolve Case into Quality Memory**
- lifecycle `RESOLVED`;
- resolution invariants;
- immutability;
- same-object memory behavior.

## Implementation Scope

- trusted resolution command/action;
- domain-level invariant enforcement;
- atomic persistence of resolved state;
- read-only guards;
- resolved case listing eligibility;
- minimal read-only memory presentation sufficient to prove M3.

Full C-inspired visual polish is deferred to Milestone 8.

## Database / Schema Changes

Only changes required to support:

- resolved lifecycle state;
- resolution metadata if technically required;
- immutability enforcement support.

Do not create:
- second `Memory` table/object purely for product memory;
- version history;
- reopen state.

## Domain / Application Work

- resolution invariant check;
- explicit user-driven transition;
- reject incomplete resolution;
- reject mutation after resolved;
- expose resolved cases as M4-eligible canonical cases.

## UI Work

- Resolve action only when ready;
- clear missing-requirements behavior otherwise;
- success transition to resolved;
- read-only controls;
- clear `SELESAI / MEMORI KUALITAS` identity;
- no edit/reopen affordance.

## Tests

### Vitest
- every resolution invariant individually;
- incomplete case cannot resolve;
- complete case resolves;
- completion does not auto-resolve;
- mutation after resolve is rejected;
- only resolved cases are memory-eligible.

### Integration
- transaction/persistence failure leaves case non-resolved;
- reload preserves resolved state;
- canonical record remains the same case.

### Playwright
- complete case → explicit resolve → read-only state;
- incomplete case cannot resolve;
- resolved case cannot be edited through normal UI flow.

## Seed / Demo Data

Create reusable **synthetic resolved historical case fixtures** now that M3 exists.

These fixtures will feed Milestone 7 M4.

## `DEPENDENCY`

Milestone 5.

## `RISK`

- UI-only immutability;
- duplicate memory object;
- auto-resolution;
- accidentally introducing reopen/versioning;
- requiring corrective-action effectiveness verification.

## `ACCEPTANCE`

Milestone passes when:

- the locked resolution gate is enforced server-side/domain-side;
- a complete case resolves only after explicit user action;
- resolved cases are immutable;
- the same canonical record serves as Memori Kualitas;
- incomplete cases cannot become M4 candidates.

## Definition of Done

- M3 acceptance criteria are satisfied;
- canonical persistence behavior is verified;
- immutability tests pass;
- resolved case remains recognizable and readable.

## Explicit Out-of-Scope

- final resolved visual polish;
- reopen;
- edit history;
- approval workflow;
- action verification;
- M4 retrieval logic.

---

# 10. Milestone 7 — M4 Deterministic Relevant Past Cases

`MILESTONE`

## Objective

Complete the reusable-learning loop by surfacing zero to three resolved historical cases using deterministic structured relevance and explicit shared-signal explanations.

## User-Visible Outcome

During an active investigation, the user can:

1. open `Kasus Terdahulu yang Relevan`;
2. see 0–3 relevant resolved cases;
3. see `Relevan karena...` signals;
4. open a historical resolved case;
5. inspect its historical reasoning;
6. return to the current investigation;
7. continue without the historical root cause being copied or applied automatically.

## Requirements / Capabilities Served

- **M4 — Relevant Past Case Retrieval**
- S2 reusable learning loop.
- Reference-not-diagnosis guardrail.

## Implementation Scope

- internal retrieval module contract;
- canonical query of resolved cases;
- deterministic rule-based relevance;
- candidate ordering/filtering;
- max 3;
- relevance explanation;
- on-demand drawer;
- historical preview/read path;
- graceful zero-result/failure behavior.

## Database / Schema Changes

Prefer **no new durable retrieval schema**.

Use the existing canonical Quality Case data.

Only add a schema field if it is already justified by locked Product/PRD context semantics—not to optimize retrieval infrastructure.

No:
- dedicated index;
- vectors;
- embeddings;
- search database.

## Domain / Application Work

Implement internal retrieval behavior using deterministic structured signals.

### `IMPLEMENTATION DECISION`

Exact scoring/weights/thresholds are developed through fixture-based tests.

The implementation may use deterministic combinations of:
- Problem lexical/structured similarity;
- same Production Stage / Process;
- same Product / Model Reference when known;
- same Material when known;
- same Machine / Workstation when known;
- same Batch / Order Reference when meaningful;
- approved available contextual/evidence signals.

The product definition of relevance must not change.

The rule system must satisfy:
- only `RESOLVED`;
- 0–3 results;
- zero preferred over unrelated;
- same inputs/rules → deterministic output;
- relevance explanation derives from actual shared signals.

## UI Work

- on-demand Radix-based accessible drawer if appropriate;
- historical case cards;
- `Relevan karena...` explanation;
- explicit historical labeling;
- current investigation remains visible/returnable;
- no auto-fill;
- no confidence percentages.

## Tests

### Vitest — Fixture-Driven Retrieval

Build a deterministic fixture suite covering:

1. exact/shared process + material case should be included;
2. similar problem but contradictory/different context should not automatically outrank stronger structured match;
3. unresolved case is excluded;
4. unrelated resolved case is excluded;
5. zero-result fixture returns zero;
6. more than three candidates returns at most three;
7. ordering remains deterministic;
8. explanations match actual shared signals;
9. historical root/action never mutate current case.

The fixture tests are the mechanism for tuning exact weights/thresholds.

### Integration
- retrieval reads canonical resolved cases;
- resolved case becomes immediately eligible without secondary index sync.

### Playwright
- current investigation → open drawer;
- see relevant synthetic cases;
- inspect historical case;
- return;
- verify current Dugaan Akar Penyebab unchanged;
- zero-result behavior for a separate fixture if practical.

## Seed / Demo Data

Use the dedicated synthetic golden-demo dataset described in Section 14.

## `DEPENDENCY`

Milestone 6.

## `RISK`

- overfitting rules only to one demo case;
- showing unrelated cases to avoid empty state;
- surfacing technical similarity scores;
- semantic search creeping in;
- historical case visually becoming recommendation.

## `ACCEPTANCE`

Milestone passes when:

- only resolved cases are considered;
- output is deterministic;
- 0–3 results are returned;
- each result has explainable shared signals;
- fixture tests cover expected inclusion/exclusion;
- historical references do not change current reasoning;
- no retrieval infrastructure outside canonical persistence exists.

## Definition of Done

- M4 acceptance criteria from PRD are satisfied;
- fixture suite passes;
- drawer interaction is accessible;
- failure/zero states preserve M2 usability;
- no AI/semantic infrastructure exists.

## Explicit Out-of-Scope

- semantic search;
- vectors;
- LLM;
- recommendations;
- auto-root-cause;
- cross-company retrieval;
- generic search page;
- more than three references.

---

# 11. Milestone 8 — Resolved-Memory Design + Golden-Demo Integration

`MILESTONE`

## Objective

Unify all completed behavior into the locked Evidence Loom → Memori Kualitas design direction and make the 3–5 minute golden demo visually coherent.

## User-Visible Outcome

The product now looks and behaves like the intended final MVP:

- active investigations use Evidence Loom;
- horizontal staged progression is coherent;
- Relevant Past Cases remain secondary;
- historical references are clearly historical;
- resolved cases use the calm C-inspired read-only Memori Kualitas treatment;
- the transition from active investigation to memory is visually obvious.

## Requirements / Capabilities Served

- M1–M4 integrated.
- `DESIGN.md` final source of truth.
- Golden demo design acceptance.

## Implementation Scope

- final resolved reading mode;
- reasoning-chain presentation;
- active vs resolved visual differentiation;
- historical preview consistency;
- golden-path screen transitions;
- responsive pass on primary demo views;
- interface terminology audit.

No new capability.

## Database / Schema Changes

None expected.

A schema change here is a warning sign and requires justification against locked sources.

## Domain / Application Work

Minimal.

Only integration adjustments required to present already-approved domain behavior consistently.

No new domain behavior should originate in this milestone.

## UI Work

- calm read-only Memori Kualitas composition;
- preserve Bukti ↔ Faktor Penyebab traceability in resolved mode;
- ensure Dugaan Akar Penyebab remains historical/provisional wording;
- final horizontal staged strip behavior;
- drawer polish;
- active/resolved collection treatment;
- responsive stacked relationship fallback;
- consistent Bahasa Indonesia glossary.

## Tests

### Vitest
- no new major domain behavior expected;
- update tests only if presentation adapters/view models need coverage.

### Playwright
Add/complete the full golden demo flow:

`Access → Create → Masalah & Konteks → Bukti → Faktor Penyebab / Loom → Relevant Past Case → Historical Preview → Dugaan Akar Penyebab → Tindakan Korektif → Ringkasan → Resolve → Memori Kualitas`

Also test:
- historical root cause does not populate current root cause;
- resolved state has no edit controls;
- drawer can close/return without losing current state;
- narrow-screen relationship text remains understandable.

## Seed / Demo Data

Use the final synthetic golden-demo seed dataset.

Data must be reproducible and resettable for rehearsal.

## `DEPENDENCY`

Milestone 7.

## `RISK`

- polishing creates accidental new features;
- resolved view loses reasoning trace;
- visual hierarchy makes past case too prominent;
- styling library fingerprint replaces custom design direction;
- terminology becomes mixed English/Indonesian.

## `ACCEPTANCE`

Milestone passes when:

- the entire golden demo is visually coherent;
- active vs resolved modes are unmistakable;
- Evidence Loom remains the hero reasoning interaction;
- past cases are secondary references;
- all user-facing terminology follows the locked glossary;
- no new product behavior was added during polish.

## Definition of Done

- `DESIGN.md` constraints are implemented for demo-critical surfaces;
- M1–M4 remain unchanged functionally;
- full Playwright golden path passes;
- synthetic seed reset supports repeated demo rehearsal.

## Explicit Out-of-Scope

- analytics polish;
- dashboard;
- design-system expansion;
- new onboarding;
- new navigation sections;
- animation work that is not necessary for clarity.

---

# 12. Milestone 9 — Hardening, Failure States, Test Closure, Demo Preparation

`MILESTONE`

## Objective

Make the MVP reliable enough for repeated judging/demo use without expanding scope.

This milestone is not a feature milestone. It closes reliability gaps across the already-complete vertical slices.

## User-Visible Outcome

The product behaves predictably under:

- normal golden flow;
- empty state;
- incomplete investigation;
- failed save/update;
- retrieval with zero cases;
- retrieval failure;
- invalid resolution attempt;
- resolved read-only access;
- basic narrow-screen use.

The demo can be reset and rehearsed repeatedly.

## Requirements / Capabilities Served

- M1–M4 reliability.
- PRD empty/loading/error requirements.
- `AGENTS.md` testing/failure expectations.
- Golden demo reliability.

## Implementation Scope

- close missing loading/error/empty states;
- tighten validation/failure feedback;
- accessibility audit for critical flows;
- performance sanity check for expected demo dataset;
- seed reset workflow;
- production configuration validation;
- Railway smoke-test path;
- documentation needed to run/test/demo.

No new user capability.

## Database / Schema Changes

None expected.

Any schema change must fix a demonstrated correctness blocker, not improve hypothetical future scalability.

## Domain / Application Work

- close edge-case validation bugs;
- verify M4 failure isolation;
- verify transaction behavior around Resolve;
- ensure no mutation path bypasses resolved immutability;
- ensure deterministic retrieval remains stable.

## UI Work

- complete required empty/loading/error states;
- focus management;
- visible keyboard focus;
- relationship accessibility;
- final responsive check;
- no mixed terminology.

## Tests

### Vitest
Complete coverage of:
- lifecycle;
- invariants;
- relationship integrity;
- deterministic retrieval;
- failure behavior.

### Integration
- Prisma/PostgreSQL real behavior for demo-critical paths;
- clean database setup/migration/seed.

### Playwright
- full golden flow;
- invalid credential;
- create/save/reload;
- incomplete resolve blocked;
- resolved immutability;
- relevant-case drawer;
- zero-result state;
- failure state where practical;
- narrow-screen relationship fallback.

## Seed / Demo Data

Final synthetic dataset, deterministic reset, clearly labeled as synthetic in internal/demo preparation materials.

## `DEPENDENCY`

Milestone 8.

## `RISK`

- treating hardening as permission to refactor architecture;
- adding caching/search infrastructure to “improve performance” without evidence;
- expanding test matrix beyond hackathon value;
- last-minute feature additions.

## `ACCEPTANCE`

Milestone passes when:

- golden path passes repeatedly;
- critical Vitest/Playwright suites are green;
- seed reset is reliable;
- Railway deployment is smoke-tested;
- no known blocker affects the 3–5 minute demo;
- required error/empty/loading states are covered;
- accessibility-critical interactions are functional.

## Definition of Done

- MVP is runnable locally and deployed;
- golden demo can be rehearsed repeatedly from known synthetic state;
- no unresolved critical bug violates M1–M4 or source-of-truth constraints;
- no unapproved feature/infrastructure was introduced.

## Explicit Out-of-Scope

- performance engineering for hypothetical scale;
- observability platform expansion;
- analytics;
- product experiments;
- feature additions;
- architectural refactors without blocker.

---

# 13. Milestone Dependency Graph

```text
M1 Foundation / Access / Connectivity
        ↓
M2 Create Kasus Kualitas
        ↓
M3 Basic Staged Investigation + Bukti
        ↓
M4 Bukti ↔ Faktor Penyebab + Evidence Loom
        ↓
M5 Dugaan Akar Penyebab + Tindakan Korektif + Ringkasan
        ↓
M6 Resolve → Immutable Memori Kualitas
        ↓
M7 Deterministic Relevant Past Cases
        ↓
M8 Resolved Design + Golden Demo Integration
        ↓
M9 Hardening + Demo Preparation
```

Each milestone depends only on completed behavior from the previous milestones and must leave the application runnable.

---

# 14. Golden Demo Seed-Data Plan

All demo data in this section is **SYNTHETIC**.

It must never be presented as evidence gathered from a real IKM.

Purpose:
- make M4 deterministic and demonstrable;
- show that historical cases are references, not automatic answers;
- support repeatable Playwright fixtures and live-demo rehearsal.

## 14.1 Synthetic Historical Case A — Resolved

**Label:** `SYNTHETIC — QC-001`

### Masalah
Jahitan loncat pada sisi samping beberapa produk.

### Konteks
- Production Stage / Process: Sewing / Penjahitan
- Product / Model Reference: Kaos Model A
- Material: Cotton 24s
- Machine / Workstation: M-04
- Batch / Order Reference: DEMO-BATCH-A

### Bukti
- E1: Defect terkonsentrasi pada hasil dari M-04.
- E2: Mesin lain pada material yang sama tidak menunjukkan defect serupa.
- E3: Kondisi jarum M-04 terlihat aus saat pemeriksaan.

### Faktor Penyebab
- C1: Kondisi jarum dapat berkontribusi pada jahitan loncat.
- C2: Kondisi mesin/workstation perlu diperiksa sebagai faktor lokal.

### Bukti ↔ Faktor Penyebab
- E1 → C2
- E2 → C2
- E3 → C1

### Dugaan Akar Penyebab
Kondisi jarum pada M-04 menjadi dugaan akar penyebab pada investigasi ini.

### Tindakan Korektif
Ganti jarum dan periksa ulang setup dasar workstation sebelum melanjutkan produksi.

### State
`RESOLVED`

### Intended M4 Role
Strongly relevant to a future case with:
- same process;
- same material;
- similar problem.

It must be shown as historical reference only.

---

## 14.2 Synthetic Historical Case B — Resolved

**Label:** `SYNTHETIC — QC-002`

### Masalah
Jahitan tidak stabil setelah penyesuaian mesin pada proses penjahitan.

### Konteks
- Production Stage / Process: Sewing / Penjahitan
- Product / Model Reference: Kaos Model B
- Material: Cotton 24s
- Machine / Workstation: M-02
- Batch / Order Reference: DEMO-BATCH-B

### Bukti
- E1: Defect muncul setelah perubahan setting pada workstation.
- E2: Jarum baru digunakan.
- E3: Setelah setting dikembalikan, hasil lebih konsisten.

### Faktor Penyebab
- C1: Setting mesin dapat berkontribusi.
- C2: Kondisi jarum tidak didukung kuat oleh Bukti pada kasus ini.

### Dugaan Akar Penyebab
Setting mesin yang tidak sesuai menjadi dugaan akar penyebab pada investigasi historis ini.

### Tindakan Korektif
Kembalikan setting ke konfigurasi kerja yang sesuai dan lakukan pemeriksaan awal sebelum batch berikutnya.

### State
`RESOLVED`

### Intended M4 Role
Also relevant to a current sewing/cotton/stitch issue, but with a **different historical conclusion** from Case A.

This fixture is important because it demonstrates:

> similar quality problem does not imply one automatic historical answer.

---

## 14.3 Synthetic Historical Case C — Resolved but Intentionally Weak/Irrelevant

**Label:** `SYNTHETIC — QC-003`

### Masalah
Hasil potong tidak konsisten pada bagian lengan.

### Konteks
- Production Stage / Process: Cutting / Pemotongan
- Product / Model Reference: Kemeja Model C
- Material: Polyester
- Machine / Workstation: Cutting Table C
- Batch / Order Reference: DEMO-BATCH-C

### State
`RESOLVED`

### Intended M4 Role
Should not outrank the sewing/cotton historical cases for the golden current case.

This fixture is used to prove exclusion/low relevance.

---

## 14.4 Synthetic Current Golden-Demo Case

**Label:** `SYNTHETIC — DEMO-CURRENT`

This case should be created live or reset to an early active state before the demo.

### Masalah
Jahitan loncat kembali muncul pada sisi samping produk.

### Initial Konteks
- Production Stage / Process: Sewing / Penjahitan
- Product / Model Reference: Kaos Model D
- Material: Cotton 24s
- Machine / Workstation: M-07
- Batch / Order Reference: DEMO-CURRENT

### Bukti to Enter During Demo
- E1: Defect hanya terlihat pada hasil M-07.
- E2: Jarum telah diganti sebelum batch berjalan.
- E3: Defect mulai muncul setelah penyesuaian setting pada M-07.

### Faktor Penyebab to Build During Demo
- C1: Kondisi jarum mungkin berkontribusi.
- C2: Setting workstation mungkin berkontribusi.
- C3: Faktor lokal pada M-07 perlu diperiksa.

### Example Relationships
- E1 → C3
- E2 → C1
- E3 → C2
- E3 → C3

### Intended Historical References
Expected M4 candidates:
1. QC-002 — shared process, material, similar problem, setting-related context;
2. QC-001 — shared process, material, similar problem;
3. QC-003 should be excluded or clearly lower than the top relevant set.

### Current Dugaan Akar Penyebab for Demo
A Dugaan Akar Penyebab based on **current evidence**, such as:

> Penyesuaian setting pada M-07 menjadi dugaan akar penyebab saat ini.

This must remain a user-made current conclusion.

It must **not** be auto-filled from QC-002.

### Current Tindakan Korektif for Demo
A current action responding to the current conclusion, such as:

> Periksa dan kembalikan setting M-07 ke konfigurasi kerja yang sesuai sebelum produksi dilanjutkan.

Again, this is synthetic demonstration content.

---

# 15. Deterministic M4 Fixture Strategy

`IMPLEMENTATION DECISION`

Do not lock a scoring formula in this ExecPlan.

During Milestone 7:

1. create deterministic fixture cases;
2. define expected relevant inclusion/exclusion behavior;
3. implement the smallest explainable rule set;
4. tune exact weights/thresholds only until fixture behavior is correct;
5. add counter-fixtures to reduce demo-only overfitting.

Fixture expectations must preserve the product definition:

- relevance means worth reviewing;
- relevance does not mean same root cause;
- zero results are valid;
- explanations must come from actual shared signals.

## Example Fixture Assertions

`ACCEPTANCE`

For `DEMO-CURRENT`:

- QC-001 is eligible and relevant;
- QC-002 is eligible and relevant;
- QC-003 should not outrank them and may be excluded by threshold;
- results contain no unresolved cases;
- results contain at most 3 cases;
- each result includes shared-signal explanation;
- current Dugaan Akar Penyebab remains unchanged before and after retrieval.

---

# 16. Golden Demo Acceptance at End of ExecPlan

The completed MVP must support this repeatable sequence:

1. **Access**  
   Enter the single credential.

2. **Create Kasus Kualitas**  
   Define Masalah and available Konteks without fabricating unknown data.

3. **Investigasi Terpandu**  
   Move through the horizontal staged progression.

4. **Bukti**  
   Add multiple observations.

5. **Bukti ↔ Faktor Penyebab**  
   Build explicit links and show Evidence Loom.

6. **Kasus Terdahulu yang Relevan**  
   Open the on-demand drawer and inspect explainable historical references.

7. **Return to Current Investigation**  
   Historical case does not become current answer.

8. **Dugaan Akar Penyebab**  
   User establishes one provisional current conclusion.

9. **Tindakan Korektif**  
   User records at least one action.

10. **Ringkasan**  
    Full reasoning chain is visible.

11. **Resolve**  
    Explicit user action passes invariants.

12. **Memori Kualitas**  
    Same Kasus Kualitas becomes calm, read-only, immutable historical memory.

13. **Learning Loop Is Visible**  
    The newly resolved case is now eligible to help future investigations.

---

# 17. First Milestone to Start After Approval

`MILESTONE`

The correct first implementation milestone is:

> **Milestone 1 — Runnable Foundation + Access Gate + Persistence Connectivity**

Why:

- it proves the selected stack and Railway-compatible deployment shape before product work accumulates;
- it establishes the trusted server boundary needed by all later domain invariants;
- it validates Prisma/PostgreSQL connectivity without prematurely designing the full schema;
- it creates the test harness required for incremental vertical slices;
- it leaves the application runnable while introducing no product scope beyond the locked access gate.

It should **not** be expanded into:
- full database modeling;
- complete navigation;
- authentication system;
- design system construction;
- generic project infrastructure.

Implementation must not begin until this ExecPlan is approved.
