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

## MVP Runtime

The current foundation uses:

- Node.js 24 LTS;
- Next.js App Router with TypeScript;
- Tailwind CSS;
- Prisma ORM with one PostgreSQL database;
- a server-side single-credential application gate;
- Vitest and Playwright;
- a Railway-compatible Node.js deployment shape.

The complete MVP supports one investigation-first learning loop: create a Kasus Kualitas, record Bukti and Faktor Penyebab with explicit relationships, record a provisional Dugaan Akar Penyebab and Tindakan Korektif, resolve the same case into read-only Memori Kualitas, and inspect relevant resolved cases as references.

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
npm run prisma:generate
npm run prisma:validate
npm exec prisma migrate deploy
npm run db:check
npm run dev
```

Open `http://localhost:3000`. Requests without a valid session are redirected to `/akses`.

### Synthetic demo rehearsal

The final demo dataset is marked internally as `SYNTHETIC`. Before a rehearsal, run:

```bash
npm run db:reset:golden-demo
```

This ensures QC-001, QC-002, and QC-003 are available as resolved historical fixtures and recreates only the marker-owned `SYNTHETIC - DEMO-CURRENT` case in its active investigation state. It does not alter normal application data.

### Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run test:e2e
```

`npm run test:e2e` builds the standalone production application first, runs its generated Node.js server, verifies the access gate and the M1-M4 golden flow in Chromium, then stops the test server afterward.

### Railway

Create one Railway web service and one managed PostgreSQL service. Configure the three required server variables in the web service. `railway.toml` uses Railpack, applies committed Prisma migrations before the standalone Next.js build, starts with `npm run start`, and checks `/api/health`, which returns generic availability only after both access configuration and PostgreSQL are ready.

Run the synthetic demo reset only against a local/demo database; it is not part of the Railway startup command.
