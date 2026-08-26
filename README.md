# ITechnoCup 2026 MVP — Initial Codex Repository

This repository package contains the locked source-of-truth documents and the implementation guardrails needed to begin the MVP in Codex.

## Source of Truth

Root:
- `AGENTS.md` — coding-agent operating contract. Codex should read this automatically.
- `EXECPLAN.md` — approved milestone structure / implementation execution plan.

`docs/`:
- `PRODUCT.md`
- `PRD.md`
- `ARCHITECTURE.md`
- `TECH_STACK.md`
- `DESIGN.md`

Do not modify locked source-of-truth documents during implementation unless a real blocker is found and a human explicitly approves the change.

## Recommended Local Setup

After unzipping:

```bash
cd itechno-quality-memory-initial-repo
git init
git add .
git commit -m "chore: initialize locked project docs"
```

Then open the repository in Codex.

Recommended workflow:

```text
one worktree
=
one milestone
=
preflight
=
implementation
=
tests
=
review
=
merge
```

Start with **Milestone 1 — Runnable Foundation + Access Gate + Persistence Connectivity**.

## Codex Start

Use the prompt in:

- `prompts/milestone-01-preflight.md`

Review Codex's preflight output first. If it is correct and reports no blocker, use:

- `prompts/milestone-01-implement.md`

Do not ask Codex to implement the entire `EXECPLAN.md` in one thread.

## Skills

No custom Codex skill is required yet.

Start with:
- root `AGENTS.md`;
- `EXECPLAN.md`;
- one bounded milestone prompt.

A repo-local skill can be created later only if a repeated milestone workflow has proven stable and worth codifying.

## Milestone 1 Runtime

The current foundation uses:

- Node.js 24 LTS;
- Next.js App Router with TypeScript;
- Tailwind CSS;
- Prisma ORM with one PostgreSQL database;
- a server-side single-credential application gate;
- Vitest and Playwright;
- a Railway-compatible Node.js deployment shape.

No Kasus Kualitas product model or creation workflow is included yet.

### Local prerequisites

1. Install Node.js 24 LTS and npm.
2. Provide a reachable PostgreSQL database.
3. Copy `.env.example` to `.env` and replace every placeholder.
4. Use at least 32 characters for `SESSION_SECRET`.

The required server variables are:

- `DATABASE_URL`;
- `APP_ACCESS_CREDENTIAL`;
- `SESSION_SECRET`.

Do not prefix these values with `NEXT_PUBLIC_`. They must remain server-only.

### Install and run

```bash
npm install
npm run prisma:validate
npm run db:check
npm run dev
```

Open `http://localhost:3000`. Requests without a valid session are redirected to `/akses`.

### Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
```

`npm run test:e2e` builds the standalone production application first, runs its generated Node.js server, executes the Chromium access-gate scenarios, and stops the test server afterward.

### Railway

Create one Railway web service and one managed PostgreSQL service. Configure the three required server variables in the web service. `railway.toml` uses Railpack with the standalone Next.js build and checks `/api/health`, which returns generic availability only after both access configuration and PostgreSQL are ready.

There are no Prisma migrations in Milestone 1 because no product table is required to prove connectivity.
