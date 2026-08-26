# DESIGN.md — ITechnoCup 2026

## 0. Status

**Status:** FINAL — Design Definition Locked for MVP  
**Product authority:** `PRODUCT.md`, `PRD.md`  
**Technical authority:** `ARCHITECTURE.md`, `TECH_STACK.md`

This document is the design source of truth for the MVP.

It defines:
- information hierarchy;
- navigation behavior;
- active investigation structure;
- Evidence Loom behavior;
- Relevant Past Case behavior;
- active/resolved differentiation;
- interface terminology;
- golden-demo design sequence;
- responsive design constraints.

It does **not** select:
- styling framework;
- component library;
- color palette;
- font family;
- icon library;
- implementation details.

TD-8 is resolved separately after this document.

---

# 1. Selected Design Direction

The selected direction is:

> **Layout A — Evidence Loom as the foundation.**

Two ideas are selectively adopted:

- from **Layout B — Case Thread**: staged/chapter-like progression;
- from **Layout C — Quality Dossier**: calm, read-only treatment for resolved Quality Memory.

The synthesis is intentionally asymmetric:

- **A defines the layout and reasoning interaction.**
- **B contributes progression semantics only.**
- **C contributes resolved-state presentation only.**

The product must not become an uncontrolled hybrid of A, B, and C.

---

# 2. Design Thesis

The interface must make the product thesis understandable through interaction:

> **Bukti dirangkai menjadi Faktor Penyebab, pengguna menetapkan Dugaan Akar Penyebab sebagai kesimpulan sementara investigasi, kemudian kasus yang selesai menjadi Memori Kualitas yang dapat membantu investigasi berikutnya sebagai referensi—bukan jawaban otomatis.**

The active product experience must remain:

> **investigation-first, not dashboard-first.**

---

# 3. Interface Language and Domain Glossary

## 3.1 Primary Language

**LOCKED:** Bahasa Indonesia is the primary interface language.

English terms must not be mixed into the user interface without a justified domain need.

Technical/internal code terminology is outside this design decision.

## 3.2 Locked Domain Terminology

| Product Concept | Interface Term |
|---|---|
| Quality Case | **Kasus Kualitas** |
| Evidence | **Bukti** |
| Contributing Causes | **Faktor Penyebab** |
| Working Root Cause | **Dugaan Akar Penyebab** |
| Corrective Action | **Tindakan Korektif** |
| Quality Memory | **Memori Kualitas** |

These terms must be used consistently across:
- navigation;
- case detail;
- investigation stages;
- past-case references;
- resolved states;
- empty/error states;
- golden demo.

Do not alternate between synonyms such as `akar masalah`, `root cause`, `penyebab utama`, and `Dugaan Akar Penyebab` unless product copy later defines a deliberate distinction.

---

# 4. Design Principles

## DP-1 — Investigation First

The current Kasus Kualitas is the visual center of gravity.

The product must not open or behave primarily as:
- analytics dashboard;
- KPI overview;
- production dashboard;
- knowledge-base homepage.

---

## DP-2 — Evidence Before Conclusion

The interface must visually establish this order:

`Masalah → Bukti → Faktor Penyebab → Dugaan Akar Penyebab`

The user should not experience Dugaan Akar Penyebab as a field that can be filled without visible investigation reasoning.

---

## DP-3 — Structured but Not Bureaucratic

The investigation is staged, but must not feel like a long administrative wizard.

The design should:
- expose one cognitive task at a time;
- keep completed reasoning accessible;
- allow revision before resolution;
- allow unknown context to remain unknown.

---

## DP-4 — Current Case Owns Attention

Relevant historical cases remain supporting context.

Memori Kualitas must never visually compete with or replace the current investigation.

---

## DP-5 — Epistemic States Must Be Distinct

The interface must distinguish:

- **Bukti** — observations/information;
- **Faktor Penyebab** — possible contributing factors;
- **Dugaan Akar Penyebab** — current investigation conclusion;
- **Memori Kualitas terdahulu** — historical reference.

These are not equivalent cards with different labels.

---

## DP-6 — Resolution Changes Mode

A resolved Kasus Kualitas changes from:

> active thinking workspace

to:

> calm read-only Memori Kualitas.

It remains the same conceptual object.

---

# 5. Information Hierarchy

## 5.1 Active Kasus Kualitas

### Primary Attention

1. **Masalah**
2. current investigation stage
3. current reasoning content
4. Bukti ↔ Faktor Penyebab relationships
5. Dugaan Akar Penyebab when reached
6. Tindakan Korektif
7. readiness to resolve

### Secondary Attention

1. known structured context;
2. stage completion/progress;
3. Relevant Past Cases / Memori Kualitas terdahulu;
4. explanation of why a past case is relevant.

### Must Not Dominate

- charts;
- KPI cards;
- generic statistics;
- global case counts;
- activity feeds;
- historical cases;
- navigation chrome.

---

## 5.2 Resolved Memori Kualitas

### Primary Attention

1. Masalah;
2. clear `SELESAI / MEMORI KUALITAS` state;
3. reasoning chain;
4. Dugaan Akar Penyebab recorded in that investigation;
5. Tindakan Korektif.

### Secondary Attention

1. Context;
2. Bukti details;
3. Bukti ↔ Faktor Penyebab traceability;
4. historical relevance information when opened as a past reference.

### Must Not Dominate

- edit controls;
- active-stage navigation;
- unrelated cases;
- generic analytics.

---

# 6. Navigation Model

## 6.1 Global Navigation

The navigation model remains intentionally narrow:

```text
Kasus Kualitas
├── Aktif
└── Selesai

Buat Kasus Kualitas
```

No enterprise module tree is introduced.

There is no separate `Knowledge Base` navigation item.

Resolved Kasus Kualitas are the Memori Kualitas.

---

## 6.2 Active Case Navigation

**LOCKED: DD-5 Option A — horizontal staged progression strip**

The active investigation uses a horizontal staged progression strip:

```text
Masalah & Konteks
→ Bukti
→ Faktor Penyebab
→ Dugaan Akar Penyebab
→ Tindakan Korektif
→ Ringkasan
```

Required behavior:

- current stage is obvious;
- completed stages remain recognizable;
- user can revisit earlier stages before resolution;
- progression does not behave like a hard-locked onboarding wizard;
- the strip must not consume the Evidence Loom workspace unnecessarily.

On narrow screens, the same logical progression may adapt responsively without changing stage semantics.

---

## 6.3 Relevant Past Case Navigation

Relevant past cases are opened **contextually from the active investigation**.

**LOCKED: DD-2 Option A — on-demand drawer**

Interaction direction:

```text
Current Kasus Kualitas
        ↓
Open "Kasus Terdahulu yang Relevan"
        ↓
Secondary Drawer
        ↓
Open Historical Case Detail / Preview
        ↓
Return to Current Investigation
```

Opening a historical case must not destroy or replace the current investigation context.

---

# 7. Guided Investigation Interaction

The staged interaction is:

```text
Masalah & Konteks
→ Bukti
→ Faktor Penyebab
→ Dugaan Akar Penyebab
→ Tindakan Korektif
→ Ringkasan
```

The interface is semi-guided rather than wizard-locked.

---

## 7.1 Stage 1 — Masalah & Konteks

Goal:
- establish the quality issue;
- capture context currently known.

Core structured context:
- Production Stage / Process, expressed in Indonesian interface language.

Additional approved context may be completed when known:
- Product / Model Reference;
- Material;
- Machine / Workstation;
- Batch / Order Reference;
- Additional Context Note.

Unknown context is not an error.

The design must not visually pressure the user to invent missing context.

---

## 7.2 Stage 2 — Bukti

Goal:

> distinguish what is observed/known from what is interpreted.

Each Bukti item must remain individually addressable so it can be referenced by Faktor Penyebab.

The interface should make multiple Bukti items easy to scan and distinguish.

---

## 7.3 Stage 3 — Faktor Penyebab

Goal:
- formulate possible contributing factors;
- explicitly connect them to Bukti.

This is the main Evidence Loom interaction.

A Faktor Penyebab is a hypothesis/contributing factor, not a proven root cause.

---

## 7.4 Stage 4 — Dugaan Akar Penyebab

Goal:
- establish exactly one current working conclusion for resolution.

The interface must position it as:

> **Dugaan Akar Penyebab**  
> Kesimpulan sementara berdasarkan investigasi saat ini.

Equivalent wording may be refined later, but the provisional meaning must remain.

The interface must not use:
- `Akar penyebab ditemukan`;
- `Penyebab terbukti`;
- `Diagnosis sistem`;
- confidence percentages.

---

## 7.5 Stage 5 — Tindakan Korektif

Goal:
- record at least one action responding to the current Dugaan Akar Penyebab.

The design must not introduce:
- effectiveness verification;
- action outcome tracking;
- due-date workflow;
- assignment workflow;
- CAPA expansion.

---

## 7.6 Stage 6 — Ringkasan

Goal:
- show the complete reasoning chain;
- expose missing resolution requirements;
- allow explicit Resolve only when locked invariants are satisfied.

The summary should make it easy to read:

```text
Masalah
  ↓
Bukti
  ↓
Faktor Penyebab
  ↓
Dugaan Akar Penyebab
  ↓
Tindakan Korektif
```

---

# 8. Evidence Loom — Bukti ↔ Faktor Penyebab

## 8.1 Desktop Foundation

The primary visual relationship remains a loom-like reasoning area:

```text
BUKTI                         FAKTOR PENYEBAB
─────                         ───────────────

E1 ─────────────────────────→ C1
E2 ────────────────┬────────→ C1
                   └────────→ C2
E3 ─────────────────────────→ C2
```

This is not a general-purpose node graph.

It exists only to make the relationship:

> **Bukti mana mendukung Faktor Penyebab mana?**

immediately legible.

---

## 8.2 Relationship Density

**LOCKED: DD-1 Option A**

> **All relationships are faintly visible by default; selected relationships are emphasized.**

Default state:
- all existing Evidence ↔ Cause links are visible;
- connectors remain visually quiet;
- the overall investigation structure can be understood.

Focused state:
- selecting/inspecting one Bukti or Faktor Penyebab emphasizes its direct relationships;
- unrelated connectors and items become visually quieter;
- unrelated content remains visible enough to preserve orientation.

This treatment must not depend on color alone.

---

## 8.3 Relationship Semantics

The design must support:

- one Bukti → multiple Faktor Penyebab;
- multiple Bukti → one Faktor Penyebab;
- explicit visual references;
- understandable deletion/update states while active;
- traceability into Ringkasan and resolved Memori Kualitas.

---

## 8.4 Narrow-Screen Fallback

**LOCKED: DD-4 Option A**

On narrow screens the three-column/connector loom collapses into:

> **stacked Bukti + Faktor Penyebab cards with Bukti references.**

Concept:

```text
BUKTI

E1 — ...
E2 — ...
E3 — ...


FAKTOR PENYEBAB

C1 — ...
Didukung oleh: [E1] [E2]

C2 — ...
Didukung oleh: [E2] [E3]
```

The responsive fallback preserves reasoning semantics rather than attempting to force a miniature desktop graph.

---

# 9. Dugaan Akar Penyebab Visual Treatment

## 9.1 Hierarchical Separation

Dugaan Akar Penyebab must appear after/below the Bukti ↔ Faktor Penyebab reasoning region.

It must not look like another Faktor Penyebab card.

Concept:

```text
Bukti
   ↓
Faktor Penyebab
   ↓
────────────────────────────
DUGAAN AKAR PENYEBAB
Kesimpulan sementara
────────────────────────────
   ↓
Tindakan Korektif
```

---

## 9.2 Provisional Status

The treatment must communicate:
- current conclusion;
- user-owned reasoning;
- revisability while active.

It must not communicate:
- proven causal truth;
- algorithmic confidence;
- automatic diagnosis.

---

## 9.3 Traceability

Where appropriate, the treatment should show which Faktor Penyebab and Bukti form the reasoning basis.

Example semantic structure:

```text
Dugaan Akar Penyebab

Berdasarkan:
C1, C2

Didukung melalui:
E1, E2, E4
```

No numeric confidence score is required or allowed by the current product definition.

---

# 10. Relevant Past Cases / Memori Kualitas

## 10.1 Attention Level

Relevant past cases remain a secondary contextual layer.

They must not:
- auto-open;
- interrupt stage progression;
- appear as the main answer area;
- displace the Evidence Loom.

---

## 10.2 On-Demand Drawer

**LOCKED: DD-2 Option A**

The drawer may display zero to three resolved historical cases.

Each card should prioritize:

1. historical/resolved identity;
2. historical Masalah summary;
3. **why relevant** signals.

Example semantics:

```text
KASUS SELESAI

Rotasi jahitan sisi setelah perubahan produksi

Relevan karena:
• Tahap produksi sama
• Material sama
• Masalah kualitas serupa

Lihat Memori Kualitas
```

---

## 10.3 Relevance Explanation

Relevance must be explained through understandable shared signals.

Allowed style of explanation:
- `Tahap produksi sama`;
- `Material sama`;
- `Mesin/workstation sama`;
- `Masalah kualitas serupa`.

Do not show:
- similarity percentages;
- causal confidence;
- `recommended root cause`;
- `best answer`.

---

## 10.4 Historical Detail

When a historical case is opened from M4, historical information must be clearly framed as historical:

- Bukti pada kasus terdahulu;
- Faktor Penyebab pada kasus terdahulu;
- Dugaan Akar Penyebab pada kasus terdahulu;
- Tindakan Korektif pada kasus terdahulu.

Historical conclusions must never visually merge into the current case's Dugaan Akar Penyebab.

---

# 11. Resolved Quality Memory

## 11.1 Selected Resolved Direction

**LOCKED: DD-3 Option B**

Resolved Kasus Kualitas uses a:

> **C-inspired calm, condensed, read-only dossier/read mode.**

It is not simply the active Evidence Loom with disabled inputs.

---

## 11.2 Resolved-State Characteristics

The resolved state must reduce:
- edit affordances;
- progression urgency;
- add/remove controls;
- active investigation emphasis.

It should increase:
- readability;
- reasoning-chain clarity;
- historical stability;
- resolved status clarity.

---

## 11.3 Same Object, Different Mode

The user should still recognize that the Memori Kualitas is the same Kasus Kualitas that was investigated.

The resolved read mode must preserve:

1. Masalah;
2. Context;
3. Bukti;
4. Faktor Penyebab;
5. Bukti ↔ Faktor Penyebab traceability;
6. Dugaan Akar Penyebab;
7. Tindakan Korektif.

It must not collapse into only:

`Dugaan Akar Penyebab + Tindakan Korektif`.

---

## 11.4 Immutability Treatment

Resolved cases are read-only.

No edit/reopen affordance should imply otherwise.

The resolved visual treatment should reinforce immutability without making the case look like a separate knowledge-base article.

---

# 12. Active vs Resolved Differentiation

## Active Investigation

Must communicate:
- work in progress;
- current stage;
- editable reasoning;
- Evidence Loom interaction;
- incomplete states;
- secondary past references;
- explicit Resolve when ready.

## Resolved Memori Kualitas

Must communicate:
- investigation completed;
- read-only state;
- calm reading hierarchy;
- condensed reasoning;
- historical conclusion;
- no editing;
- reusable reference status.

Active and resolved modes should share enough structural identity that the lifecycle feels continuous.

---

# 13. Golden Demo Screen / State Sequence

The design must support the approved 3–5 minute demo without adding capabilities.

## State 1 — Kasus Kualitas

Show:
- active/resolved distinction;
- existing historical resolved cases;
- `Buat Kasus Kualitas`.

Do not show analytics as the hero.

---

## State 2 — Masalah & Konteks

Show:
- new quality problem;
- Production Stage / Process;
- selected available context;
- missing context is allowed.

---

## State 3 — Bukti

Show:
- two or three clear Bukti items;
- observation separated from interpretation.

---

## State 4 — Evidence Loom / Faktor Penyebab

Show:
- multiple Faktor Penyebab;
- all relationships faintly visible;
- selecting one Bukti emphasizes its linked Faktor Penyebab.

This is the primary visual proof of the Guided Investigation mechanism.

---

## State 5 — Kasus Terdahulu yang Relevan

Open the on-demand drawer.

Show:
- one or more past cases;
- clear `Relevan karena...` explanation.

---

## State 6 — Historical Memori Kualitas Preview

Show:
- historical/read-only identity;
- prior reasoning;
- prior Dugaan Akar Penyebab;
- prior Tindakan Korektif.

Then return to the current investigation.

The historical conclusion must not auto-fill the current case.

---

## State 7 — Current Dugaan Akar Penyebab

Show:
- current user conclusion;
- provisional language;
- traceability to current Bukti/Faktor Penyebab.

---

## State 8 — Tindakan Korektif + Ringkasan

Show:
- Tindakan Korektif;
- full reasoning chain;
- resolution readiness.

---

## State 9 — Resolve → Memori Kualitas

Show lifecycle change:

```text
SEDANG DIINVESTIGASI
        ↓
      Resolve
        ↓
SELESAI / MEMORI KUALITAS
```

The final state uses the calm C-inspired read-only treatment.

Golden demo message:

> **Investigasi hari ini menjadi pengalaman yang dapat digunakan kembali, sementara pengalaman lama tetap menjadi referensi—bukan jawaban otomatis.**

---

# 14. Accessibility and Interaction Baseline

The design must support:

- visible keyboard focus;
- accessible drawer/dialog focus behavior;
- labels that do not depend only on color;
- Bukti ↔ Faktor Penyebab relationships understandable without connector color alone;
- readable relationship fallback on narrow screens;
- clear active vs resolved text labels;
- usable horizontal progression without requiring pointer-only interaction;
- ability to open and close past-case context without losing current work.

Exact implementation is defined later by TD-8 and implementation.

---

# 15. Explicit Design Rejections

The final MVP design must not introduce or imply:

- dashboard-first navigation;
- KPI/analytics hero surfaces;
- generic QMS modules;
- S6/weekly review;
- computer vision;
- chatbot;
- AI root-cause answer;
- confidence score;
- `likely / unlikely` cause scoring;
- action-effectiveness verification;
- owner/assignment workflow;
- due-date workflow;
- separate Knowledge Base module;
- editable resolved memory;
- historical case as automatic answer;
- more than three Relevant Past Cases;
- mandatory unknown context;
- new product capabilities outside M1–M4.

---

# 16. Styling and Component Technology Boundary

This document intentionally does not select:

- Tailwind CSS;
- CSS Modules;
- Radix UI;
- React Aria;
- shadcn/ui;
- Material UI;
- any other component library;
- fonts;
- palette;
- icons.

The selected implementation must be capable of reproducing this design direction, especially:

1. custom Evidence Loom;
2. selected-link emphasis;
3. accessible staged progression;
4. on-demand historical drawer;
5. narrow-screen relationship fallback;
6. calm read-only resolved mode;
7. low visual library fingerprint.

The technology choice belongs to **TD-8**.

---

# 17. Final Design Direction Summary

**Foundation:** Evidence Loom.

**Progression:** horizontal staged progression inspired selectively by Case Thread.

**Reasoning visualization:** all Bukti ↔ Faktor Penyebab relationships faintly visible; selected relationships emphasized.

**Relevant history:** on-demand drawer, zero to three references, explicit relevance explanation.

**Working conclusion:** `Dugaan Akar Penyebab`, visually separated and explicitly provisional.

**Responsive reasoning:** stacked Bukti and Faktor Penyebab cards with Bukti references.

**Resolved mode:** calm C-inspired read-only `Memori Kualitas`.

**Language:** Bahasa Indonesia, with locked domain glossary.

The final design must make one product idea obvious:

> **Bukti dirangkai menjadi reasoning yang dapat dipertanggungjawabkan, reasoning yang selesai menjadi Memori Kualitas, dan Memori Kualitas dapat kembali membantu investigasi berikutnya tanpa mengambil alih keputusan pengguna.**
