export type SyntheticResolvedQualityCaseFixture = {
  label: string;
  problem: string;
  productionStage: string;
  productModelReference?: string;
  material?: string;
  machineWorkstation?: string;
  batchOrderReference?: string;
  additionalContextNote?: string;
  evidence: readonly string[];
  contributingCauses: readonly {
    content: string;
    evidenceIndexes: readonly number[];
  }[];
  workingRootCause: string;
  correctiveActions: readonly string[];
};

export const syntheticResolvedQualityCaseFixtures = [
  {
    label: "SYNTHETIC \u2014 QC-001",
    problem: "Jahitan loncat pada sisi samping beberapa produk.",
    productionStage: "Penjahitan",
    material: "Katun combed",
    machineWorkstation: "Mesin jahit M-04",
    evidence: [
      "Jahitan loncat terlihat pada sisi samping 8 dari 20 produk.",
      "Tegangan benang pada mesin M-04 berubah selama proses penjahitan.",
    ],
    contributingCauses: [
      { content: "Tegangan benang mesin tidak stabil.", evidenceIndexes: [0, 1] },
    ],
    workingRootCause: "Pengaturan tegangan benang pada mesin M-04 tidak konsisten.",
    correctiveActions: [
      "Atur ulang tegangan benang dan catat parameter mesin M-04.",
    ],
  },
  {
    label: "SYNTHETIC \u2014 QC-002",
    problem:
      "Jahitan tidak stabil setelah penyesuaian mesin pada proses penjahitan.",
    productionStage: "Penjahitan",
    material: "Katun combed",
    machineWorkstation: "Mesin jahit M-02",
    evidence: [
      "Panjang jahitan berubah setelah operator menyesuaikan mesin M-02.",
      "Produk dengan material katun combed menunjukkan jahitan yang tidak rata.",
    ],
    contributingCauses: [
      {
        content: "Parameter panjang jahitan berubah tanpa pencatatan.",
        evidenceIndexes: [0],
      },
      {
        content: "Pemeriksaan hasil setelan mesin belum konsisten.",
        evidenceIndexes: [0, 1],
      },
    ],
    workingRootCause:
      "Setelan mesin diubah tanpa standar parameter yang dicatat.",
    correctiveActions: [
      "Gunakan catatan parameter setelan sebelum produksi dilanjutkan.",
    ],
  },
  {
    label: "SYNTHETIC \u2014 QC-003",
    problem: "Hasil potong tidak konsisten pada bagian lengan.",
    productionStage: "Pemotongan",
    material: "Polyester",
    machineWorkstation: "Meja potong C-01",
    evidence: [
      "Panjang potongan lengan berbeda pada beberapa lembar hasil potong.",
      "Pola bergeser saat material polyester ditata di meja potong C-01.",
    ],
    contributingCauses: [
      {
        content: "Material bergeser saat proses penataan pola.",
        evidenceIndexes: [1],
      },
    ],
    workingRootCause:
      "Penataan material belum distabilkan sebelum pemotongan.",
    correctiveActions: ["Tambahkan penjepit material sebelum pola dipotong."],
  },
] as const satisfies readonly SyntheticResolvedQualityCaseFixture[];
