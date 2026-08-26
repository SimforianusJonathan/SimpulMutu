# TECH_STACK.md — ITechnoCup 2026

## 0. Status

**Status:** Technology + UI Styling Selection Fully Locked for MVP  
**Authority:** `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, and `DESIGN.md`

This document is the implementation-technology source of truth for the MVP. It does not define database schema, API specification, folder structure, implementation plan, or code.

---

# 1. Selected Technologies

| Area | Locked Selection | Responsibility |
|---|---|---|
| Web application | **Next.js App Router — full-stack application** | Presentation layer plus trusted server-side application entry points inside the Compact Modular Monolith |
| Runtime / language | **TypeScript + Node.js 24 LTS** | Shared language/runtime for UI, server-side application/domain logic, deterministic retrieval, and tests |
| Canonical persistence | **PostgreSQL** | Single durable source of truth for all Quality Cases, including active investigations and resolved Quality Memory |
| Data access | **Prisma ORM** | Typed persistence access, relational mapping, migrations, and transactional database operations |
| Deployment | **Railway — web application + managed PostgreSQL** | Publicly deployed Next.js application and managed canonical PostgreSQL persistence |
| MVP access protection | **Minimal single-credential application gate** | Protect writable demo environment without introducing user-management capability |
| Unit/integration testing | **Vitest** | Fast deterministic tests for domain rules, lifecycle invariants, resolution rules, and M4 retrieval behavior |
| Browser / E2E testing | **Playwright** | Real-browser verification of the golden demo path and critical user flows |
| UI styling | **Tailwind CSS** | Custom visual implementation of the locked `DESIGN.md` direction, including layout, states, responsive treatment, and Evidence Loom presentation |
| Accessible interaction primitives | **Radix Primitives** | Unstyled/low-level accessible primitives used only where needed for interactions such as drawer/dialog, tooltip, popover, disclosure/collapsible, and similar approved interaction needs |

---

# 2. Runtime and Version Targets

## Node.js

**Locked target:** `Node.js 24 LTS`

The application must run on the Node.js 24 LTS line in local development, automated testing where applicable, and deployed runtime.

## TypeScript

Use a stable TypeScript release supported by the selected stable Next.js and Prisma versions.

## Next.js

Use a stable Next.js release with App Router support that is compatible with Node.js 24 LTS.

## Prisma ORM

Use a stable Prisma ORM release that officially supports the locked Node.js 24 LTS runtime and PostgreSQL.

## PostgreSQL

Use a currently supported PostgreSQL major version provided by the selected local/deployment environment.

### Version Pinning Rule

Exact package versions other than the locked Node.js major line are an **implementation detail** and must be pinned by the project dependency lockfile when implementation begins.

Do not introduce pre-release framework, ORM, database, or test-runner versions for the MVP unless a proven blocker requires it.

---

# 3. Responsibility Boundaries

## 3.1 Next.js

Next.js is the delivery shell of the Compact Modular Monolith.

It is responsible for:

- rendering the web interface;
- handling navigation and user interaction entry points;
- invoking trusted server-side application behavior;
- returning application results and failures to the UI.

Next.js is **not** the domain model itself. Quality Case lifecycle, Guided Investigation rules, resolution invariants, and deterministic M4 behavior must remain explicit application/domain responsibilities rather than being hidden inside UI components.

---

## 3.2 TypeScript + Node.js

TypeScript and Node.js are the common implementation environment for:

- Quality Case application logic;
- Guided Investigation logic;
- resolution validation;
- resolved-case immutability enforcement at the trusted application boundary;
- internal deterministic Retrieval responsibility;
- persistence interaction;
- test code.

The runtime must not introduce a second backend language or runtime for the MVP.

---

## 3.3 PostgreSQL

PostgreSQL is the **only canonical persistence** for Quality Cases.

It stores the durable state required by the approved architecture, including:

- active Quality Cases;
- resolved Quality Cases / Quality Memory;
- lifecycle state;
- approved structured context;
- investigation information;
- Evidence ↔ Contributing Cause relationships;
- Working Root Cause;
- Corrective Action.

PostgreSQL is also the source read by M4 through the application’s internal Retrieval responsibility.

There is no dedicated search or retrieval persistence.

---

## 3.4 Prisma ORM

Prisma is the application’s data-access technology.

Its responsibility is limited to persistence concerns such as:

- typed access to PostgreSQL;
- persistence mapping;
- database migrations;
- relational reads/writes;
- transactional operations where needed to preserve approved invariants.

Prisma must not become a separate service or second source of truth.

The exact schema and mapping strategy remain implementation details.

---

## 3.5 Railway

Railway hosts the deployed MVP as:

```text
Railway Project
├── Next.js Web Application
└── Managed PostgreSQL
```

Railway is responsible for deployment/runtime availability and managed database hosting.

The deployment must preserve the locked architecture:

- one application boundary;
- one canonical persistence;
- no additional search, queue, cache, vector, or worker infrastructure required by M1–M4.

---

## 3.6 Tailwind CSS + Radix Primitives

### Tailwind CSS

Tailwind CSS is the locked styling technology for the MVP.

It is responsible for:

- implementing the custom visual direction defined by `DESIGN.md`;
- layout, spacing, responsive behavior, visual states, and typography styling;
- Evidence Loom presentation and selected/faint relationship states;
- active vs resolved visual differentiation.

Tailwind must not become a reason to introduce generic dashboard patterns or components that are not required by M1–M4.

### Radix Primitives

Radix is limited to accessible interaction primitives that are genuinely needed by the approved design, such as:

- drawer/dialog behavior;
- tooltip;
- popover;
- disclosure/collapsible;
- other low-level primitives required to implement an already-approved interaction.

Radix is **not** the visual design foundation.

The application must style Radix primitives according to `DESIGN.md`.

### Evidence Loom Constraint

The Evidence Loom remains a **custom product interaction**.

It must not be replaced by a component-library graph, workflow, or diagram component merely because one is available.

Connector lines are not the sole representation of Bukti ↔ Faktor Penyebab relationships. Textual relationship references must remain available, including the locked narrow-screen fallback.

### Explicit UI-Library Constraint

Do not use shadcn/ui, Material UI, or another pre-styled visual design system as the MVP foundation.

Do not add a UI component solely because it exists in a library.

---

# 4. Local Development Shape

Local development must remain conceptually equivalent to production:

```text
Browser
   ↓
Next.js / Node.js 24
Compact Modular Monolith
   ↓
Prisma ORM
   ↓
Local PostgreSQL
```

The local PostgreSQL instance may be provided natively or through a local container. That choice is an implementation detail.

Required local-development properties:

- no cloud-only dependency is required to exercise M1–M4;
- M4 deterministic retrieval works against local canonical Quality Cases;
- the golden demo path can be rehearsed locally;
- access-protection behavior can be exercised without a separate identity provider.

---

# 5. Deployment Shape

The MVP deployment is:

```text
User Browser
     ↓
Railway-hosted Next.js Application
     ↓
Railway-managed PostgreSQL
```

Deployment must not introduce additional business services.

The application and database may use Railway-managed environment configuration, but exact environment-variable names and deployment commands are implementation details.

The deployed environment must be capable of running the same M1–M4 behavior as local development.

---

# 6. Testing Responsibilities

## 6.1 Vitest

Vitest is responsible for fast deterministic tests of behavior that does not require a real browser.

Priority coverage:

- `DRAFT → INVESTIGATING → RESOLVED` lifecycle;
- invalid lifecycle transitions;
- minimum resolution invariants;
- exactly one Working Root Cause at resolution;
- resolved-case immutability;
- Evidence ↔ Contributing Cause relationship behavior;
- incomplete-context behavior;
- resolved-only M4 eligibility;
- deterministic relevance rules;
- zero-result retrieval;
- maximum-three-result behavior;
- relevance explanation signals;
- guarantee that M4 does not mutate current diagnosis.

Where persistence behavior itself is being verified, tests may use the real PostgreSQL/Prisma integration rather than mocking away behavior that matters to the architecture.

---

## 6.2 Playwright

Playwright is responsible for real-browser testing of critical product journeys.

Highest-priority E2E scenario:

```text
Access Gate
   ↓
Create Quality Case
   ↓
Guided Investigation
   ↓
Relevant Past Case Appears
   ↓
Historical Case Is Reviewed as Reference
   ↓
Current Diagnosis Remains User-Controlled
   ↓
Corrective Action
   ↓
Resolve
   ↓
Case Becomes Quality Memory
```

Playwright is also responsible for verifying critical empty/error states that materially affect the golden demo.

The testing strategy does not require a large browser/device matrix for the MVP unless design validation later establishes a specific need.

---

# 7. MVP Access-Protection Boundary

The deployment uses a **minimal single-credential application gate**.

Locked product constraints:

- one organizational context;
- one active user persona;
- no signup;
- no OAuth/social login;
- no password reset;
- no RBAC;
- no multiple-user workflow;
- no user-management capability.

Technology boundary:

```text
Unauthenticated Request
       ↓
Trusted Application Gate
       ↓
Credential Accepted?
      /             \
    No              Yes
    ↓                ↓
Access Denied     Application Session
                       ↓
                     M1–M4
```

The credential must be validated within the trusted server-side application boundary.

The secret must not be shipped as readable client-side application configuration.

The exact session/cookie mechanism is an implementation detail.

This access gate exists to protect the writable hackathon demo environment, not to create an authentication product.

---

# 8. Technology Constraints

The implementation must preserve all locked architecture constraints.

Specifically:

1. Next.js must remain one full-stack application boundary.
2. M1–M4 must remain internal modules/responsibilities of the Compact Modular Monolith.
3. PostgreSQL is the only canonical Quality Case persistence.
4. Prisma accesses the canonical PostgreSQL persistence; it does not create an additional data layer/service.
5. M4 remains deterministic/rule-based and reads resolved Quality Cases from canonical persistence.
6. Retrieval must remain internally modular so its implementation can be replaced later without changing PRODUCT/PRD behavior.
7. M2 must remain usable when M4 returns zero results or fails.
8. Resolved-case immutability must be enforced inside the trusted application boundary, not only by disabled UI controls.
9. No technology choice may silently introduce a new product capability.
10. Tailwind CSS is the locked styling technology and must implement the custom visual direction in `DESIGN.md`.
11. Radix Primitives may be used only for accessible interaction primitives genuinely required by approved UI behavior.
12. Evidence Loom must remain custom and must preserve textual Bukti ↔ Faktor Penyebab relationships in addition to connectors.
13. shadcn/ui, Material UI, and other pre-styled visual design systems must not become the MVP foundation.

---

# 9. Explicit Technology Non-Goals

The MVP technology stack will **not** add:

- microservices;
- separate backend service in addition to the selected Next.js full-stack application;
- vector database;
- semantic search;
- embedding model;
- LLM dependency;
- Redis;
- distributed cache;
- message queue;
- worker service;
- event bus;
- dedicated search infrastructure;
- separate retrieval index;
- second persistence technology;
- data warehouse;
- analytics database;
- multi-tenant identity architecture;
- external OAuth requirement;
- full authentication/user-management platform;
- container orchestration;
- Kubernetes;
- service mesh;
- distributed application architecture.
- shadcn/ui as the visual foundation;
- Material UI as the visual foundation;
- another pre-styled design system that overrides the locked custom `DESIGN.md` direction.

Docker/containerization may be used as a local or deployment implementation mechanism if useful, but it is **not** an architectural requirement or additional service boundary.

---

# 10. Deferred Decisions

The following are intentionally not defined by `TECH_STACK.md`:

- database schema;
- Prisma models;
- API/Server Action/Route Handler specification;
- folder/package structure;
- deterministic retrieval weights and thresholds;
- migration commands;
- seed-data format;
- form-state strategy;
- implementation milestones;
- detailed logging strategy;
- CI workflow;
- color palette details;
- font family selection;
- icon library selection;
- exact Tailwind class composition and reusable styling abstractions;
- exact Radix primitive composition for approved interactions.

These must be resolved later without contradicting `PRODUCT.md`, `PRD.md`, `ARCHITECTURE.md`, or this technology selection.

---

# 11. Locked Technology Summary

The MVP implementation technology is:

> **A Next.js App Router full-stack modular monolith written in TypeScript on Node.js 24 LTS, using Prisma ORM against one canonical PostgreSQL database, deployed as a Railway web application plus managed PostgreSQL, protected by a minimal single-credential application gate, styled with Tailwind CSS, using Radix Primitives only for necessary accessible interaction primitives, and tested with Vitest and Playwright.**

The Evidence Loom remains a custom product interaction. Technology + Design Selection is fully locked for the MVP.
