# PRD.md — ITechnoCup 2026

## 0. Document Status

**Status:** Draft for Product/Design/Engineering Review  
**Source of truth:** `PRODUCT.md` (approved)  
**Scope:** Product requirements only. This document does **not** define technology stack, database design, retrieval algorithm, AI/ML model, external API, architecture, or implementation plan.

No contradiction was identified between the approved `PRODUCT.md` and the requirements below. The following remain locked unless a real contradiction is discovered and reported first:

- problem statement;
- primary user;
- S1+S2 Hybrid direction;
- core loop;
- M1–M4 MUST capabilities;
- explicit non-goals.

### Requirement Labels

- **`REQUIREMENT`** — behavior required for the approved MVP.
- **`ASSUMPTION`** — product belief that is not fully established by current evidence.
- **`OPEN DECISION`** — a product decision that still requires explicit human approval.

---

# 1. Product Thesis

> **Pada sebagian IKM konveksi, quality event belum selalu berubah menjadi diagnosis yang terstruktur dan pembelajaran yang dapat digunakan kembali. Produk membantu owner/supervisor melakukan investigasi quality issue secara terstruktur, lalu menjadikan hasil investigasi tersebut sebagai quality memory yang dapat digunakan sebagai referensi ketika masalah relevan muncul di masa depan.**

## 1.1 Primary User

**Owner, supervisor produksi, atau penanggung jawab quality pada IKM konveksi skala kecil yang ikut langsung menangani quality issue.**

`ASSUMPTION` — Struktur organisasi dan pembagian tanggung jawab berbeda antar-IKM; persona di atas adalah target operasional MVP, bukan klaim bahwa seluruh IKM konveksi memiliki struktur yang sama.

## 1.2 Value Proposition

> **Membantu owner atau supervisor konveksi melakukan investigasi quality issue secara terstruktur, lalu mengubah hasil investigasi tersebut menjadi quality memory yang dapat digunakan sebagai referensi ketika masalah relevan muncul kembali.**

## 1.3 Locked Core Loop

`Quality event → Guided Investigation → Evidence → Contributing Causes → Working Root Cause → Corrective Action → Resolved Quality Case → Quality Memory → Relevant Past Case membantu investigation berikutnya`

---

# 2. Product Principles

`REQUIREMENT` — Produk harus tetap **investigation-first**, bukan defect-recording-first atau dashboard-first.

`REQUIREMENT` — Hasil investigasi harus mempertahankan hubungan antara problem, evidence, contributing causes, working root cause, dan corrective action.

`REQUIREMENT` — Resolved Quality Case adalah sumber Quality Memory; tidak ada workflow terpisah untuk membuat knowledge-base entry.

`REQUIREMENT` — Relevant Past Cases selalu diposisikan sebagai **reference**, bukan diagnosis otomatis, root cause otomatis, atau bukti bahwa dua kasus memiliki penyebab yang sama.

`REQUIREMENT` — Setiap requirement MVP harus dapat ditelusuri ke M1, M2, M3, atau M4.

---

# 3. Quality Case Lifecycle

## 3.1 Minimum Lifecycle States

### State A — `DRAFT`

Quality Case sudah dibuat, tetapi informasi awal belum cukup untuk dianggap sebagai investigation yang aktif.

`REQUIREMENT`
- Case memiliki identitas yang dapat dibedakan dari case lain.
- User dapat menambah atau memperbaiki Problem dan Context.
- Case pada state ini **belum** menjadi Quality Memory.
- Case pada state ini **tidak boleh** diperlakukan sebagai Relevant Past Case.

### State B — `INVESTIGATING`

Problem sudah cukup terdefinisi untuk menjalankan Guided Investigation.

`REQUIREMENT`
- User dapat menambah, mengubah, atau menghapus Context/Evidence, Contributing Causes, Working Root Cause, dan Corrective Action selama case belum resolved.
- Case tetap dianggap current investigation.
- Case **belum** menjadi Quality Memory.
- Relevant Past Cases dapat ditampilkan sebagai reference selama state ini.

### State C — `RESOLVED`

Investigation dinyatakan selesai oleh user dan memenuhi minimum completion requirements.

`REQUIREMENT`
- Case mempertahankan struktur:
  `Problem → Context/Evidence → Contributing Causes → Working Root Cause → Corrective Action`.
- Case menjadi structured Quality Memory.
- Case dapat dipertimbangkan untuk Relevant Past Case Retrieval pada investigation lain.
- Status resolved harus terlihat jelas sehingga user tidak menganggap case masih aktif.

## 3.2 Minimum Resolution Gate

`REQUIREMENT` — Sebuah Quality Case hanya dapat menjadi `RESOLVED` jika minimal memiliki:
1. Problem yang terdefinisi;
2. setidaknya satu Evidence;
3. setidaknya satu Contributing Cause;
4. setidaknya satu Working Root Cause;
5. setidaknya satu Corrective Action.

`REQUIREMENT` — Jika minimum resolution gate belum terpenuhi, sistem harus menjelaskan bagian apa yang masih belum lengkap dan tidak mengubah status menjadi `RESOLVED`.

`REQUIREMENT` — Pada MVP, satu Quality Case memiliki **satu Working Root Cause** pada saat Resolve. Beberapa Contributing Causes tetap diperbolehkan selama investigation.

`REQUIREMENT` — Pada MVP, case yang sudah `RESOLVED` bersifat **immutable/read-only** dan tidak memiliki reopen flow.

---

# 4. Investigation Information Model — Product Level

Bagian ini mendefinisikan **makna produk dan hubungan informasi**, bukan database schema.

## 4.1 Problem

Problem menjelaskan quality issue yang sedang diinvestigasi.

`REQUIREMENT`
- Problem harus menjawab secara cukup jelas **apa yang salah** pada quality event.
- Problem tidak boleh diperlakukan sebagai root cause.
- User harus dapat memperbaiki wording Problem selama case belum resolved.

`OPEN DECISION` — Exact input structure untuk Problem (misalnya satu summary field atau kombinasi summary + description).

## 4.2 Context

Context adalah informasi situasional yang membantu membedakan kasus dan memahami kondisi saat quality event terjadi.

`REQUIREMENT`
- User harus dapat menambahkan context yang dianggap relevan terhadap investigation.
- Context harus dapat dibaca kembali ketika case menjadi Quality Memory.
- Context dapat digunakan sebagai salah satu dasar product-level relevance untuk M4.

`REQUIREMENT` — Compact Structured Context untuk MVP terdiri dari:
- `Production Stage / Process` sebagai **core structured context**;
- `Product / Model Reference`;
- `Material`;
- `Machine / Workstation`;
- `Batch / Order Reference`;
- `Additional Context Note`.

Seluruh context field **tidak boleh menjadi blocking requirement pada Create Quality Case** ketika informasinya belum diketahui. User dapat melengkapinya selama investigation ketika informasi tersedia. User tidak boleh dipaksa mengarang context. `Production Stage / Process` diperlakukan sebagai signal context utama ketika tersedia, bukan alasan untuk menolak case creation ketika belum diketahui.

## 4.3 Evidence

Evidence adalah informasi/observasi yang mendukung atau melemahkan pemahaman terhadap quality issue.

`REQUIREMENT`
- Evidence harus direpresentasikan sebagai item yang dapat dibedakan, bukan hanya satu catatan panjang yang bercampur dengan conclusion.
- User dapat menambah lebih dari satu Evidence.
- Evidence harus tetap terlihat pada resolved case.

`REQUIREMENT`
- Evidence dapat dihubungkan dengan satu atau lebih Contributing Causes agar reasoning trace tidak hilang.

`ASSUMPTION` — Primary user dapat mengidentifikasi dan memasukkan evidence yang cukup berguna untuk investigation.

## 4.4 Contributing Causes

Contributing Cause adalah faktor yang dianggap mungkin berkontribusi terhadap Problem berdasarkan investigation saat ini.

`REQUIREMENT`
- User harus dapat membuat lebih dari satu Contributing Cause.
- Contributing Cause harus dapat ditinjau dan diperbaiki selama case masih `INVESTIGATING`.
- Contributing Cause tidak boleh otomatis dianggap sebagai Working Root Cause.
- User harus dapat melihat Evidence mana yang berhubungan dengan Contributing Cause tersebut.

`REQUIREMENT`
- Sistem tidak boleh menyatakan bahwa suatu Contributing Cause telah terbukti hanya karena ada historical case yang mirip.

## 4.5 Working Root Cause

Working Root Cause adalah kesimpulan investigation yang saat ini dianggap paling menjelaskan Problem berdasarkan informasi yang tersedia.

`REQUIREMENT`
- Label dan wording produk harus menjaga sifatnya sebagai **working investigation conclusion**, bukan causal fact yang otomatis dibuktikan sistem.
- Working Root Cause harus dapat ditelusuri kembali ke Contributing Causes dan Evidence yang mendukung reasoning user.
- Sistem tidak boleh mengisi Working Root Cause secara otomatis dari Relevant Past Case.

`OPEN DECISION` — Apakah user wajib secara eksplisit memilih Contributing Cause tertentu sebagai basis Working Root Cause, atau cukup memberikan hubungan yang terlihat dalam summary investigation.

## 4.6 Corrective Action

Corrective Action adalah tindakan yang dipilih user sebagai tindak lanjut terhadap Working Root Cause.

`REQUIREMENT`
- Minimal satu Corrective Action diperlukan sebelum resolution.
- Corrective Action harus tetap tersedia pada resolved Quality Memory.
- Corrective Action dari past case hanya boleh ditampilkan sebagai historical reference.

`REQUIREMENT`
- MVP tidak mengukur efektivitas Corrective Action dan tidak membuat causal claim bahwa action tertentu memperbaiki outcome.

---

# 5. M1 — Create Quality Case

## 5.1 User Goal

> Ketika quality issue ditemukan, user ingin membuat satu tempat investigation yang jelas agar masalah tersebut dapat diproses melalui core loop produk.

## 5.2 User Flow

1. User memulai `Create Quality Case`.
2. User mendefinisikan Problem.
3. User menambahkan Context awal yang tersedia.
4. Sistem membuat Quality Case dalam state `DRAFT`.
5. Setelah Problem cukup terdefinisi dan user melanjutkan investigation, case masuk state `INVESTIGATING`.

`OPEN DECISION` — Trigger exact dari `DRAFT` ke `INVESTIGATING` perlu ditentukan dalam UX detail; PRD hanya mensyaratkan kedua state memiliki makna yang berbeda.

## 5.3 Functional Requirements

### M1-R1
`REQUIREMENT` — User dapat membuat Quality Case baru tanpa harus mengisi seluruh investigation sekaligus.

### M1-R2
`REQUIREMENT` — Setiap Quality Case harus dapat dibedakan secara jelas dari Quality Case lain.

### M1-R3
`REQUIREMENT` — User harus dapat mendefinisikan dan mengedit Problem selama case belum resolved.

### M1-R4
`REQUIREMENT` — User harus dapat menambahkan Context awal selama pembuatan case dan memperbaruinya selama investigation.

### M1-R5
`REQUIREMENT` — Case baru tidak boleh otomatis dianggap sebagai Quality Memory.

### M1-R6
`REQUIREMENT` — M1 tidak boleh meminta user membuat root cause atau corrective action sebelum user memasuki Guided Investigation.

## 5.4 Information Needed

Minimum:
- Problem;
- Context awal secukupnya untuk membedakan case.

System-level product metadata:
- case identity;
- lifecycle state.

`REQUIREMENT` — Context taxonomy mengikuti locked OD-1: `Production Stage / Process` sebagai core structured context; `Product / Model Reference`, `Material`, `Machine / Workstation`, `Batch / Order Reference`, dan `Additional Context Note` dapat dilengkapi ketika tersedia. Tidak ada context field yang boleh memaksa user mengarang informasi yang belum diketahui, dan context tidak boleh menjadi blocking requirement untuk case creation ketika belum tersedia.

## 5.5 System Behavior

`REQUIREMENT`
- Setelah creation berhasil, user harus mengetahui bahwa Quality Case telah dibuat dan statusnya belum resolved.
- User harus dapat melanjutkan ke Guided Investigation tanpa membuat object lain.

## 5.6 Acceptance Criteria

- User dapat membuat case dengan Problem yang valid dan menyimpannya.
- Case yang baru dibuat tampil sebagai `DRAFT` atau `INVESTIGATING` sesuai progression UX yang disetujui.
- Case tidak muncul sebagai resolved Quality Memory.
- User dapat kembali ke case yang masih aktif dan melanjutkan investigation.

## 5.7 Empty / Loading / Error States

### Empty
`REQUIREMENT` — Jika belum ada Quality Case, experience harus menjelaskan bahwa user perlu membuat Quality Case pertama untuk memulai investigation; tidak boleh menggantikannya dengan generic dashboard.

### Loading
`REQUIREMENT` — Saat create/save sedang diproses, sistem harus memberi feedback bahwa aksi sedang berlangsung.

### Error
`REQUIREMENT` — Jika create/save gagal, sistem harus memberi error yang dapat dipahami dan tidak boleh memberi kesan bahwa case sudah tersimpan jika belum berhasil.

`OPEN DECISION` — Detail mekanisme preservation terhadap input yang belum tersimpan akan ditentukan kemudian dan tidak ditetapkan sebagai architecture requirement di sini.

## 5.8 Edge Cases

- Problem terlalu kosong/tidak bermakna.
- User membuat case lalu berhenti sebelum investigation.
- Dua case memiliki wording Problem yang mirip tetapi sebenarnya berbeda.
- Context awal belum lengkap.

`REQUIREMENT` — Context yang belum lengkap tidak boleh memaksa user mengarang informasi; investigation dapat dilanjutkan dan context diperbarui selama case aktif.

## 5.9 Constraints

- Creation harus tetap ringan.
- Tidak boleh memasukkan inventory, production order, scheduling, atau generic defect analytics ke M1.

## 5.10 Explicit Out-of-Scope

- automatic defect detection;
- automatic root-cause suggestion pada tahap creation;
- production planning;
- inventory linkage;
- generic dashboard;
- full production record.

---

# 6. M2 — Guided Investigation

## 6.1 User Goal

> User ingin mengubah quality problem menjadi investigation yang lebih terstruktur dengan memisahkan Problem, Evidence, Contributing Causes, Working Root Cause, dan Corrective Action.

## 6.2 User Flow

1. User membuka Quality Case `INVESTIGATING`.
2. User meninjau Problem dan Context.
3. User menambahkan Evidence.
4. User membentuk satu atau lebih Contributing Causes.
5. User menghubungkan Evidence yang relevan terhadap Contributing Causes.
6. User menentukan Working Root Cause berdasarkan reasoning investigation.
7. User menentukan setidaknya satu Corrective Action.
8. User meninjau investigation summary sebelum memilih resolution.

Relevant Past Cases dari M4 dapat muncul selama flow ini sebagai **reference**, tetapi tidak menggantikan langkah-langkah di atas.

## 6.3 Functional Requirements

### M2-R1
`REQUIREMENT` — Guided Investigation harus menjaga urutan konseptual:
`Problem → Context/Evidence → Contributing Causes → Working Root Cause → Corrective Action`.

Ini tidak mengharuskan UI berbentuk wizard linear, tetapi relationship tersebut harus jelas bagi user.

### M2-R2
`REQUIREMENT` — User dapat menambahkan lebih dari satu Evidence.

### M2-R3
`REQUIREMENT` — User dapat menambahkan lebih dari satu Contributing Cause.

### M2-R4
`REQUIREMENT` — User dapat menghubungkan Evidence dengan Contributing Cause yang dianggap didukung oleh Evidence tersebut.

### M2-R5
`REQUIREMENT` — User dapat memperbaiki atau menghapus Evidence dan Contributing Causes selama case masih aktif.

### M2-R6
`REQUIREMENT` — User dapat mendefinisikan Working Root Cause setelah memiliki investigation context yang cukup menurut user.

### M2-R7
`REQUIREMENT` — Working Root Cause harus diposisikan sebagai conclusion dari current investigation, bukan output otomatis sistem.

### M2-R8
`REQUIREMENT` — User dapat menentukan minimal satu Corrective Action sebelum resolution.

### M2-R9
`REQUIREMENT` — Sistem harus menyediakan summary yang memperlihatkan reasoning chain sebelum resolution:
`Problem → Evidence → Contributing Causes → Working Root Cause → Corrective Action`.

### M2-R10
`REQUIREMENT` — Past case reference tidak boleh otomatis menyalin Working Root Cause atau Corrective Action ke current case sebagai keputusan final.

## 6.4 Information Needed

- Problem;
- Context;
- Evidence items;
- Contributing Causes;
- relationship antara Evidence dan Contributing Causes;
- Working Root Cause;
- Corrective Action.

`REQUIREMENT` — Investigation Guidance menggunakan **lightweight evidence-first guidance** dengan tujuan product-level berikut: memperjelas Problem, menangkap Context, memisahkan Evidence dari conclusion, membentuk Contributing Causes, menghubungkan Evidence ke causes, memilih satu Working Root Cause, lalu menentukan Corrective Action. Exact copywriting tetap menjadi design detail.

`REQUIREMENT` — Guided Investigation menggunakan **semi-guided staged workflow**: Problem & Context → Evidence → Contributing Causes → Working Root Cause → Corrective Action → Investigation Summary. User dapat kembali dan memperbaiki tahap sebelumnya selama case belum resolved.

## 6.5 System Behavior

`REQUIREMENT`
- Sistem harus menunjukkan bagian investigation yang sudah ada dan bagian yang masih belum lengkap untuk resolution.
- Sistem harus menjaga distinction antara observation/evidence, possible causes, dan Working Root Cause.
- Jika user mengubah reasoning sebelum resolution, summary harus merefleksikan current state, bukan versi lama yang menyesatkan.

## 6.6 Acceptance Criteria

Guided Investigation lulus jika user dapat:
1. mulai dari Problem;
2. menambahkan Evidence;
3. membentuk Contributing Causes;
4. melihat relationship Evidence → Contributing Cause;
5. menetapkan Working Root Cause;
6. menetapkan Corrective Action;
7. melihat full reasoning chain pada summary;
8. tetap memahami bahwa Working Root Cause adalah conclusion user, bukan automatic diagnosis.

## 6.7 Empty / Loading / Error States

### Empty
`REQUIREMENT` — Jika belum ada Evidence, UI harus mendorong user menambahkan observation/evidence tanpa mengisi contoh conclusion sebagai fakta.

`REQUIREMENT` — Jika belum ada Contributing Cause, UI harus menjelaskan bahwa belum ada cause hypothesis yang dicatat.

### Loading
Hanya relevan bila suatu user action memerlukan processing.

`REQUIREMENT` — Loading tidak boleh mengubah positioning produk menjadi seolah sistem sedang "menemukan root cause" secara otomatis.

### Error
`REQUIREMENT` — Jika perubahan investigation gagal tersimpan, sistem harus memberi feedback jelas dan tidak boleh menampilkan state yang memberi kesan perubahan telah tersimpan jika belum.

## 6.8 Edge Cases

- Evidence mendukung lebih dari satu Contributing Cause.
- Satu Contributing Cause memiliki sedikit Evidence.
- User menghapus Evidence yang sebelumnya mendukung suatu cause.
- Investigation menghasilkan beberapa plausible causes.
- User ingin mengubah Working Root Cause sebelum resolution.
- Past case menunjukkan root cause berbeda dari dugaan current case.

`REQUIREMENT` — Sistem tidak boleh memaksa current case mengikuti diagnosis past case ketika evidence current case berbeda.

## 6.9 Constraints

- Guided Investigation harus cukup ringan untuk demo dan MVP; tidak boleh berubah menjadi full Six Sigma suite.
- Tidak boleh menambahkan full CAPA lifecycle.
- Tidak boleh menambahkan automatic root-cause determination.
- Tidak boleh menambahkan chatbot.

## 6.10 Explicit Out-of-Scope

- AI-generated root cause as final answer;
- automated causal inference;
- full fishbone diagramming suite kecuali kemudian diputuskan sebagai interaction representation dari kebutuhan M2, bukan feature tambahan;
- action effectiveness tracking;
- severity analytics;
- statistical process control suite.

---

# 7. M3 — Resolve Case into Structured Quality Memory

## 7.1 User Goal

> Setelah investigation cukup selesai, user ingin menutup case tanpa kehilangan reasoning dan tindakan yang telah dihasilkan, sehingga pengalaman tersebut dapat menjadi reference di masa depan.

## 7.2 User Flow

1. User membuka investigation summary.
2. Sistem memeriksa minimum resolution gate.
3. Jika incomplete, user diberi tahu bagian yang belum lengkap.
4. Jika complete, user memilih Resolve.
5. Case berubah menjadi `RESOLVED`.
6. Structured investigation yang sama menjadi Quality Memory.
7. Case dapat dipertimbangkan dalam M4 untuk investigation lain.

## 7.3 Functional Requirements

### M3-R1
`REQUIREMENT` — Resolution harus merupakan aksi eksplisit user; sistem tidak boleh otomatis resolve hanya karena semua field terisi.

### M3-R2
`REQUIREMENT` — Sistem harus menolak resolution jika minimum resolution gate belum terpenuhi.

### M3-R3
`REQUIREMENT` — Setelah resolution, case harus mempertahankan Problem, Context/Evidence, Contributing Causes, Working Root Cause, dan Corrective Action.

### M3-R4
`REQUIREMENT` — Resolved Quality Case otomatis berfungsi sebagai Quality Memory; tidak ada duplicate manual knowledge-entry flow.

### M3-R5
`REQUIREMENT` — Resolved case harus dapat dibaca dalam bentuk yang mempertahankan reasoning chain, bukan hanya final root cause dan action.

### M3-R6
`REQUIREMENT` — Resolved case dapat menjadi candidate past reference pada M4.

### M3-R7
`REQUIREMENT` — Case yang belum resolved tidak boleh dipresentasikan sebagai reusable resolved Quality Memory.

## 7.4 Information Needed

Semua informasi yang berasal dari M1 dan M2:
- Problem;
- Context;
- Evidence;
- Contributing Causes;
- evidence/cause relationships;
- Working Root Cause;
- Corrective Action;
- resolved status.

## 7.5 System Behavior

`REQUIREMENT`
- Before resolve, system menunjukkan summary dan completion status.
- After resolve, system menunjukkan bahwa case sekarang merupakan resolved Quality Memory.
- Product copy tidak boleh menyatakan bahwa root cause telah "proven by the system".

## 7.6 Acceptance Criteria

- Incomplete case tidak dapat di-resolve.
- Complete case dapat di-resolve oleh user.
- Setelah resolution, reasoning chain tetap utuh.
- Resolved case tidak membutuhkan re-entry ke separate knowledge base.
- Resolved case eligible untuk M4.

## 7.7 Empty / Loading / Error States

### Empty
Tidak ada separate empty state untuk memory creation karena memory berasal langsung dari resolved cases.

### Loading
`REQUIREMENT` — Resolution action harus memberi processing feedback bila diperlukan.

### Error
`REQUIREMENT` — Jika resolve gagal, status case tidak boleh berubah menjadi `RESOLVED` secara visual.

## 7.8 Edge Cases

- User mencoba resolve tanpa Evidence.
- User mencoba resolve tanpa Working Root Cause.
- User mencoba resolve tanpa Corrective Action.
- Current summary memiliki cause yang kehilangan Evidence karena user menghapus Evidence sebelumnya.
- User ingin mengubah resolved case setelah resolution.

`REQUIREMENT` — Pada MVP, resolved Quality Memory bersifat **read-only**. Editing dan reopening resolved case berada di luar scope MVP.

## 7.9 Constraints

- M3 tidak boleh menambahkan effectiveness evaluation.
- M3 tidak boleh membuat separate "lesson" object yang harus diisi manual.
- M3 tidak boleh membuat automatic causal conclusion.

## 7.10 Explicit Out-of-Scope

- reopen workflow;
- corrective action effectiveness tracking;
- approval chain;
- audit/compliance workflow;
- CAPA status management beyond the selected corrective action record.

---

# 8. M4 — Relevant Past Case Retrieval

## 8.1 User Goal

> Saat melakukan investigation baru, user ingin melihat resolved past cases yang cukup relevan untuk menjadi reference, sehingga pengalaman perusahaan sebelumnya dapat membantu current reasoning tanpa dianggap sebagai automatic answer.

## 8.2 Product Definition of “Relevant”

Sebuah resolved past case dianggap **relevant secara product behavior** jika case tersebut memiliki kemiripan konteks yang cukup bermakna dengan current investigation sehingga reasonable bagi user untuk meninjaunya sebagai reference.

Relevance dapat berasal dari satu atau kombinasi unsur berikut pada level produk:
- karakteristik Problem yang serupa;
- konteks quality event yang serupa;
- jenis Evidence atau pola kondisi yang serupa;
- bagian proses atau situasi operasional yang serupa, jika informasi tersebut memang tersedia dalam Quality Case.

`REQUIREMENT` — Product harus membedakan:
- **relevant past case** = layak ditinjau sebagai reference;
- **same root cause** = **tidak boleh disimpulkan otomatis**.

`REQUIREMENT` — Exact technical method untuk menentukan relevance berada di luar PRD ini.

## 8.3 User Flow

1. User sedang berada pada Quality Case `INVESTIGATING`.
2. Current case telah memiliki Problem dan sebagian Context/Evidence.
3. Sistem mencoba memunculkan resolved past cases yang relevant.
4. User melihat ringkasan mengapa case tersebut dianggap relevant pada level produk.
5. User membuka past case.
6. User meninjau historical Problem, Context/Evidence, Contributing Causes, Working Root Cause, dan Corrective Action.
7. User kembali ke current investigation.
8. User sendiri menentukan apakah historical learning berguna terhadap current reasoning.

## 8.4 Functional Requirements

### M4-R1
`REQUIREMENT` — Hanya `RESOLVED` Quality Cases yang boleh diposisikan sebagai Quality Memory reference.

### M4-R2
`REQUIREMENT` — Sistem dapat menampilkan zero, one, atau multiple relevant past cases tergantung context current investigation.

### M4-R3
`REQUIREMENT` — Jika tidak ada case yang cukup relevant, sistem harus menampilkan keadaan “tidak ada relevant past case” daripada memaksakan unrelated case.

### M4-R4
`REQUIREMENT` — Setiap surfaced past case harus memungkinkan user memahami **mengapa** case tersebut dianggap relevant melalui shared/contextual signals yang terlihat.

### M4-R5
`REQUIREMENT` — User dapat membuka resolved case dan melihat reasoning chain historisnya.

### M4-R6
`REQUIREMENT` — Past case tidak boleh otomatis menentukan, menyalin, atau mengunci Working Root Cause pada current investigation.

### M4-R7
`REQUIREMENT` — Past Corrective Action harus diposisikan sebagai historical action, bukan recommended action otomatis.

### M4-R8
`REQUIREMENT` — Retrieval failure tidak boleh mencegah user melanjutkan Guided Investigation.

### M4-R9
`REQUIREMENT` — Current investigation harus tetap menjadi primary context; past cases adalah supporting references.

## 8.5 Information Needed

From current case:
- Problem;
- available Context;
- available Evidence.

From resolved past case:
- Problem;
- Context/Evidence;
- Contributing Causes;
- Working Root Cause;
- Corrective Action.

`REQUIREMENT` — Relevance explanation menggunakan **explicit shared contextual signals** yang dapat dipahami user, seperti kemiripan quality problem dan shared context yang tersedia. Product tidak menampilkan numeric similarity score sebagai requirement MVP.

`REQUIREMENT` — M4 menampilkan **0–3 Relevant Past Cases**. Jika tidak ada case yang cukup relevant, sistem menampilkan 0; sistem tidak memaksakan unrelated reference hanya untuk memenuhi jumlah tertentu.

## 8.6 System Behavior

`REQUIREMENT`
- Relevance dapat berubah saat current investigation memperoleh Context/Evidence baru.
- Jika relevant cases berubah, product behavior tidak boleh memberi kesan bahwa diagnosis current case telah berubah otomatis.
- Past case must remain read-as-reference.

## 8.7 Acceptance Criteria

M4 lulus jika:
1. current investigation dapat memunculkan resolved past case yang relevant;
2. user dapat melihat alasan product-level relevance;
3. user dapat membaca historical reasoning chain;
4. current Working Root Cause tidak berubah otomatis;
5. user tetap dapat melanjutkan investigation walaupun tidak ada relevant case.

## 8.8 Empty / Loading / Error States

### Empty — No Quality Memory Yet
`REQUIREMENT` — Jika belum ada resolved cases, sistem menjelaskan bahwa belum ada Quality Memory yang dapat dijadikan reference. Investigation tetap dapat dilanjutkan.

### Empty — No Relevant Past Case
`REQUIREMENT` — Jika resolved cases ada tetapi tidak ada yang cukup relevant, sistem harus mengatakan bahwa tidak ditemukan relevant past case. Jangan menampilkan unrelated case hanya agar area tidak kosong.

### Loading
`REQUIREMENT` — Saat relevance/retrieval sedang diproses, user dapat memahami bahwa reference sedang dicari tanpa mengunci current investigation.

### Error
`REQUIREMENT` — Jika retrieval gagal, current investigation tetap usable dan sistem memberi feedback bahwa reference tidak tersedia saat itu.

## 8.9 Edge Cases

- Banyak past cases memiliki wording Problem mirip tetapi context berbeda.
- Satu past case memiliki same defect symptom tetapi Working Root Cause berbeda.
- Relevant past case memiliki corrective action yang tidak cocok pada current context.
- Hanya sedikit historical cases tersedia.
- Current case terlalu minim context untuk menemukan reference yang meaningful.
- Multiple cases sama-sama relevant.

`REQUIREMENT` — System must preserve ambiguity; similarity tidak boleh diubah menjadi causal certainty.

## 8.10 Constraints

- No automatic diagnosis.
- No chatbot.
- No generic knowledge-base search requirement.
- No complex analytics.
- No separate knowledge management module.

## 8.11 Explicit Out-of-Scope

- generating a new root cause from past cases;
- automatic recommended corrective action;
- causal scoring;
- manual enterprise-wide knowledge search;
- cross-company knowledge sharing;
- recommendation engine outside relevant past case references.

---

# 9. End-to-End Acceptance Scenario

Scenario ini membuktikan M1–M4 dalam satu product loop.

## Scenario Setup

Terdapat Quality Case A yang sudah `RESOLVED` dan memiliki:
- Problem;
- Context;
- Evidence;
- Contributing Causes;
- Working Root Cause;
- Corrective Action.

## Scenario

1. User membuat Quality Case B dari quality event baru. **[M1]**
2. User mendefinisikan Problem dan Context awal. **[M1]**
3. Case B masuk Guided Investigation. **[M2]**
4. User menambahkan Evidence dan Contributing Causes. **[M2]**
5. User melihat relationship Evidence → Contributing Causes. **[M2]**
6. Berdasarkan Problem/Context/Evidence Case B, system menampilkan Case A sebagai relevant reference. **[M4]**
7. User dapat melihat alasan Case A dianggap relevant. **[M4]**
8. User membuka Case A dan membaca historical reasoning chain. **[M4]**
9. System tidak mengubah Working Root Cause Case B secara otomatis. **[M4]**
10. User kembali ke Case B dan melanjutkan reasoning berdasarkan evidence current case. **[M2]**
11. User menetapkan Working Root Cause dan Corrective Action pada Case B. **[M2]**
12. User melihat investigation summary. **[M2]**
13. Case B memenuhi minimum resolution gate. **[M3]**
14. User secara eksplisit memilih Resolve. **[M3]**
15. Case B menjadi `RESOLVED` Quality Memory tanpa duplicate knowledge-entry flow. **[M3]**
16. Case B sekarang eligible menjadi relevant reference untuk future investigation. **[M3/M4]**

## End-to-End Pass Condition

`REQUIREMENT` — Seluruh scenario di atas dapat diselesaikan tanpa menggunakan feature di luar M1–M4.

---

# 10. Golden Demo Acceptance Criteria — 3–5 Minutes

Golden demo harus membuktikan thesis, bukan hanya menunjukkan screens.

## Demo Setup

- Minimal satu resolved historical Quality Case tersedia.
- Current demo case memiliki quality problem yang cukup relevan terhadap historical case untuk menunjukkan M4.
- Data demo realistis tetapi tidak boleh dipresentasikan sebagai real-world evidence jika memang synthetic/demo data.

## Acceptance Criteria

### GD-1 — Problem becomes investigation
`REQUIREMENT` — Dalam demo, juri dapat melihat quality event diubah menjadi Quality Case dan bukan sekadar defect log. **[M1]**

### GD-2 — Structured reasoning is visible
`REQUIREMENT` — Juri dapat melihat distinction dan relationship antara:
Problem, Evidence, Contributing Causes, Working Root Cause, dan Corrective Action. **[M2]**

### GD-3 — Historical learning re-enters the workflow
`REQUIREMENT` — Relevant resolved past case muncul dan bisa ditinjau saat current investigation berlangsung. **[M4]**

### GD-4 — Reference is not diagnosis
`REQUIREMENT` — Demo secara eksplisit memperlihatkan bahwa historical root cause tidak otomatis menjadi root cause current case. **[M4]**

### GD-5 — Loop closes
`REQUIREMENT` — Current investigation dapat di-resolve dan menjadi Quality Memory. **[M3]**

### GD-6 — One continuous product loop
`REQUIREMENT` — Demo tidak boleh terasa seperti “fitur RCA” lalu “fitur knowledge base” yang terpisah; transition investigation → resolved memory → future reference harus coherent.

### GD-7 — No non-goal dependency
`REQUIREMENT` — Demo compelling tanpa dashboard generic, inventory, production planning, S6/weekly meeting, computer vision, chatbot, full CAPA, ERP features, atau complex analytics.

---

# 11. Explicit Non-Goals

Locked from `PRODUCT.md`.

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

`REQUIREMENT` — Requirement baru yang tidak dapat ditelusuri ke structured investigation atau reuse of investigation learning harus ditolak dari MVP.

---

# 12. Cross-Capability Constraints

`REQUIREMENT` — M1–M4 harus menggunakan satu conceptual `Quality Case` lifecycle; product tidak boleh meminta user membuat record kedua hanya untuk knowledge memory.

`REQUIREMENT` — M4 tidak boleh membuat current investigation dependent pada adanya historical data; S1 Guided Investigation harus tetap usable pada cold start.

`REQUIREMENT` — S1 harus menghasilkan struktur yang cukup jelas agar resolved case dapat dipahami kembali pada M4.

`REQUIREMENT` — S2/M4 tidak boleh mengubah historical similarity menjadi causal certainty.

`REQUIREMENT` — Product language harus menghindari klaim seperti “system proved the root cause” atau “past case says this is the same cause”.

---

# 13. Requirement Traceability

| Requirement Group | Requirement IDs / Topic | Traces To |
|---|---|---|
| Case creation | M1-R1 — M1-R6 | **M1 — Create Quality Case** |
| Lifecycle `DRAFT` | LC / M1 | **M1** |
| Guided investigation structure | M2-R1 — M2-R10 | **M2 — Guided Investigation** |
| Evidence ↔ cause traceability | M2-R2 — M2-R5 | **M2** |
| Working Root Cause positioning | M2-R6 — M2-R7 | **M2** |
| Corrective Action before resolution | M2-R8 | **M2** |
| Investigation summary | M2-R9 | **M2** |
| Resolution gate | M3-R1 — M3-R3 | **M3 — Resolve Case into Quality Memory** |
| Same case becomes memory | M3-R4 — M3-R7 | **M3** |
| Relevant case definition | M4 Product Definition | **M4 — Relevant Past Case Retrieval** |
| Resolved-only memory retrieval | M4-R1 | **M4** |
| Zero/one/multiple relevant cases | M4-R2 — M4-R3 | **M4** |
| Explanation of relevance | M4-R4 | **M4** |
| Historical reasoning visibility | M4-R5 | **M4** |
| Reference-not-diagnosis guardrail | M4-R6 — M4-R9 | **M4** |
| Cold-start behavior | M4 empty state / cross-constraint | **M2 + M4** |
| End-to-end loop | Section 9 | **M1 + M2 + M3 + M4** |
| Golden demo | Section 10 | **M1 + M2 + M3 + M4** |
| Non-goals | Section 11 | Approved `PRODUCT.md` scope guardrail |

---

# 14. Locked Product Decisions — MVP

OD-1 sampai OD-8 telah di-approve dan sekarang menjadi **locked MVP product behavior**. Keputusan ini tidak menambah capability baru; semuanya memperjelas bagaimana M1–M4 harus berperilaku.

## OD-1 — Compact Structured Context
`REQUIREMENT`

Context taxonomy MVP:

- `Production Stage / Process` — **core structured context**;
- `Product / Model Reference`;
- `Material`;
- `Machine / Workstation`;
- `Batch / Order Reference`;
- `Additional Context Note`.

Context fields dapat dilengkapi ketika informasinya tersedia.

**Blocking rule:** seluruh context fields tidak boleh menjadi blocking requirement pada `Create Quality Case` jika informasi belum diketahui. User tidak boleh dipaksa mengarang context. `Production Stage / Process` adalah signal context utama ketika tersedia, tetapi case creation tetap dapat berlangsung jika field tersebut belum diketahui pada saat creation.

**Traceability:** M1, M2, M3, M4.

---

## OD-2 — Guided Investigation Interaction Shape
`REQUIREMENT`

Gunakan **semi-guided staged workflow**:

`Problem & Context → Evidence → Contributing Causes → Working Root Cause → Corrective Action → Investigation Summary`

User dapat kembali ke tahap sebelumnya dan memperbaiki reasoning selama case belum `RESOLVED`.

**Traceability:** terutama M2; mendukung M1 dan M3.

---

## OD-3 — Investigation Guidance Content
`REQUIREMENT`

Gunakan **lightweight evidence-first guidance**, bukan user-facing formal methodology yang berat.

Guidance harus membantu user menjawab secara sederhana:

- **Problem:** apa quality issue yang sedang diinvestigasi?
- **Context:** dalam kondisi apa masalah terjadi?
- **Evidence:** apa yang benar-benar dilihat, diketahui, atau diobservasi?
- **Contributing Causes:** faktor apa yang mungkin ikut menyebabkan masalah, dan Evidence apa yang mendukungnya?
- **Working Root Cause:** berdasarkan Evidence saat ini, satu working conclusion apa yang paling masuk akal?
- **Corrective Action:** tindakan apa yang dipilih terhadap Working Root Cause tersebut?

Exact wording/copy dapat ditentukan pada tahap design tanpa mengubah behavior di atas.

**Traceability:** M2 dan M3.

---

## OD-4 — Single Working Root Cause at Resolve
`REQUIREMENT`

Satu Quality Case memiliki **satu Working Root Cause** pada saat Resolve.

Beberapa Contributing Causes tetap diperbolehkan selama investigation. Working Root Cause dapat diubah selama case masih aktif.

Keputusan ini menyederhanakan reasoning dan Quality Memory untuk MVP tanpa mengklaim bahwa seluruh real-world quality problem selalu mono-causal.

**Traceability:** M2 dan M3.

---

## OD-5 — Resolved Case Is Immutable
`REQUIREMENT`

Setelah user secara eksplisit melakukan Resolve dan minimum resolution gate terpenuhi, Quality Case menjadi **read-only Quality Memory**.

MVP tidak memiliki editing atau reopening workflow untuk resolved cases.

**Traceability:** M3 dan M4.

---

## OD-6 — Explicit Relevance Explanation Signals
`REQUIREMENT`

Relevant Past Case harus menjelaskan **mengapa** ia dianggap layak ditinjau melalui explicit shared/contextual signals yang tersedia, misalnya:

- similar quality problem;
- same/similar `Production Stage / Process`;
- same/similar Product / Model Reference;
- same/similar Material;
- same/similar Machine / Workstation;
- same/similar Batch / Order context, jika bermakna.

Tidak ada requirement untuk menampilkan numeric similarity score. Explanation harus membantu user mengevaluasi reference, bukan menciptakan false precision.

**Traceability:** M4; menggunakan context dari M1–M3.

---

## OD-7 — Surface 0–3 Relevant Past Cases
`REQUIREMENT`

M4 menampilkan **maksimal tiga Relevant Past Cases**.

- `0` jika tidak ada resolved case yang cukup relevant;
- `1–3` jika tersedia reference yang layak ditinjau.

Sistem tidak boleh memaksakan tiga hasil atau menampilkan unrelated case hanya untuk mengisi area reference.

**Traceability:** M4.

---

## OD-8 — Single Organization, Single Active User Persona
`REQUIREMENT`

MVP beroperasi dalam konteks **satu IKM konveksi / satu organizational context** dan cukup mendukung **satu active primary-user persona** untuk menjalankan core loop M1–M4.

MVP tidak membutuhkan product behavior untuk multi-role collaboration, approval chains, cross-organization memory, atau role/permission model.

Keputusan ini tidak menentukan apakah implementation memiliki login atau mekanisme teknis tertentu; hal tersebut berada di tahap architecture/implementation.

**Traceability:** M1, M2, M3, M4.

---

# 15. Assumptions Register

## A1 — Guided Investigation Adds Value
`ASSUMPTION`

Structured guidance materially helps non-specialist owner/supervisors produce more useful investigations.

## A2 — Past Cases Are Reusable
`ASSUMPTION`

Quality cases recur with enough contextual similarity that resolved cases can provide useful references.

## A3 — Users Will Invest Investigation Effort
`ASSUMPTION`

Primary users are willing to spend enough effort to investigate meaningful quality issues instead of only performing rework.

## A4 — Sufficient Context Can Be Captured
`ASSUMPTION`

Users know and can provide enough context/evidence for structured investigation and meaningful retrieval.

## A5 — Relevant References Can Be Used Safely
`ASSUMPTION`

Past cases can assist current reasoning without leading users to equate similar symptom with identical root cause.

---

# 16. PRD Completion Gate

PRD is considered ready for the next product/design review when:

- M1–M4 requirements are understood and accepted;
- lifecycle states are accepted;
- `Problem → Context/Evidence → Contributing Causes → Working Root Cause → Corrective Action` relationship is accepted;
- definition of product-level relevance is accepted;
- golden demo acceptance criteria are accepted;
- OD-1 sampai OD-8 telah locked sebagai MVP product behavior; open design details lain tetap dapat dilabeli `OPEN DECISION` bila belum diputuskan;
- no requirement depends on a non-goal;
- no technology stack, database, retrieval algorithm, AI model, architecture, or implementation plan has been silently introduced.
