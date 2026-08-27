export type SyntheticResolvedQualityCaseFixture = {
  fixtureMarker: string;
  label: string;
  problem: string;
  productionStage: string;
  productModelReference?: string;
  material?: string;
  machineWorkstation?: string;
  batchOrderReference?: string;
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
    fixtureMarker: "synthetic-m4-qc-001",
    label: "SYNTHETIC \u2014 QC-001",
    problem: "Jahitan loncat pada sisi samping beberapa produk.",
    productionStage: "Penjahitan",
    productModelReference: "Kaos Model A",
    material: "Cotton 24s",
    machineWorkstation: "M-04",
    batchOrderReference: "DEMO-BATCH-A",
    evidence: [
      "Defect terkonsentrasi pada hasil dari M-04.",
      "Mesin lain pada material yang sama tidak menunjukkan defect serupa.",
      "Kondisi jarum M-04 terlihat aus saat pemeriksaan.",
    ],
    contributingCauses: [
      {
        content: "Kondisi jarum dapat berkontribusi pada jahitan loncat.",
        evidenceIndexes: [2],
      },
      {
        content: "Kondisi mesin / workstation perlu diperiksa sebagai faktor lokal.",
        evidenceIndexes: [0, 1],
      },
    ],
    workingRootCause:
      "Kondisi jarum pada M-04 menjadi dugaan akar penyebab pada investigasi ini.",
    correctiveActions: [
      "Ganti jarum dan periksa ulang setup dasar workstation sebelum melanjutkan produksi.",
    ],
  },
  {
    fixtureMarker: "synthetic-m4-qc-002",
    label: "SYNTHETIC \u2014 QC-002",
    problem:
      "Jahitan tidak stabil setelah penyesuaian mesin pada proses penjahitan.",
    productionStage: "Penjahitan",
    productModelReference: "Kaos Model B",
    material: "Cotton 24s",
    machineWorkstation: "M-02",
    batchOrderReference: "DEMO-BATCH-B",
    evidence: [
      "Defect muncul setelah perubahan setting pada workstation.",
      "Jarum baru digunakan.",
      "Setelah setting dikembalikan, hasil lebih konsisten.",
    ],
    contributingCauses: [
      {
        content: "Setting mesin dapat berkontribusi.",
        evidenceIndexes: [0, 2],
      },
      {
        content:
          "Kondisi jarum tidak didukung kuat oleh Bukti pada kasus ini.",
        evidenceIndexes: [1],
      },
    ],
    workingRootCause:
      "Setting mesin yang tidak sesuai menjadi dugaan akar penyebab pada investigasi historis ini.",
    correctiveActions: [
      "Kembalikan setting ke konfigurasi kerja yang sesuai dan lakukan pemeriksaan awal sebelum batch berikutnya.",
    ],
  },
  {
    fixtureMarker: "synthetic-m4-qc-003",
    label: "SYNTHETIC \u2014 QC-003",
    problem: "Hasil potong tidak konsisten pada bagian lengan.",
    productionStage: "Pemotongan",
    productModelReference: "Kemeja Model C",
    material: "Polyester",
    machineWorkstation: "Cutting Table C",
    batchOrderReference: "DEMO-BATCH-C",
    evidence: [
      "Panjang potongan lengan berbeda pada beberapa lembar hasil potong.",
    ],
    contributingCauses: [
      {
        content: "Material bergeser saat proses penataan pola.",
        evidenceIndexes: [0],
      },
    ],
    workingRootCause:
      "Penataan material belum distabilkan sebelum pemotongan.",
    correctiveActions: ["Tambahkan penjepit material sebelum pola dipotong."],
  },
] as const satisfies readonly SyntheticResolvedQualityCaseFixture[];
