export const syntheticActiveQualityCaseFixture = {
  fixtureMarker: "synthetic-m4-demo-current",
  label: "SYNTHETIC \u2014 DEMO-CURRENT",
  problem: "Jahitan loncat kembali muncul pada sisi samping produk.",
  productionStage: "Penjahitan",
  productModelReference: "Kaos Model D",
  material: "Cotton 24s",
  machineWorkstation: "M-07",
  batchOrderReference: "DEMO-CURRENT",
  evidence: [
    "Defect hanya terlihat pada hasil M-07.",
    "Jarum telah diganti sebelum batch berjalan.",
    "Defect mulai muncul setelah penyesuaian setting pada M-07.",
  ],
  contributingCauses: [
    { content: "Kondisi jarum mungkin berkontribusi.", evidenceIndexes: [1] },
    {
      content: "Setting workstation mungkin berkontribusi.",
      evidenceIndexes: [2],
    },
    {
      content: "Faktor lokal pada M-07 perlu diperiksa.",
      evidenceIndexes: [0, 2],
    },
  ],
  workingRootCause:
    "Penyesuaian setting pada M-07 menjadi dugaan akar penyebab saat ini.",
  correctiveActions: [
    "Periksa dan kembalikan setting M-07 ke konfigurasi kerja yang sesuai sebelum produksi dilanjutkan.",
  ],
} as const;
