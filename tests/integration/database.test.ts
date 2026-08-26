import "dotenv/config";

import { afterAll, afterEach, describe, expect, it } from "vitest";

import { checkDatabaseConnection, disconnectDatabase, getPrisma } from "../../src/lib/db/prisma";
import { createQualityCase, getActiveQualityCase, updateActiveQualityCase } from "../../src/lib/quality-case/service";

const createdIds: string[] = [];

afterEach(async () => {
  if (createdIds.length > 0) {
    await getPrisma().qualityCase.deleteMany({ where: { id: { in: createdIds.splice(0) } } });
  }
});

afterAll(async () => {
  await disconnectDatabase();
});

describe("canonical PostgreSQL connectivity", () => {
  it("menghubungkan Prisma ke PostgreSQL yang nyata", async () => {
    await expect(checkDatabaseConnection()).resolves.toBeUndefined();
  });

  it("menjalankan pembacaan teknis tanpa model produk", async () => {
    const result = await getPrisma().$queryRaw<Array<{ database: string }>>`SELECT current_database() AS database`;
    expect(result[0]?.database).toBeTruthy();
  });
});

describe("persistensi Kasus Kualitas", () => {
  it("membuat, menyimpan, dan memuat ulang Kasus Kualitas aktif", async () => {
    const created = await createQualityCase({
      problem: "Jahitan sisi terlepas setelah proses obras",
      productionStage: "Obras",
      material: "Katun combed",
    });
    createdIds.push(created.id);

    const reloaded = await getActiveQualityCase(created.id);
    expect(reloaded).toMatchObject({
      id: created.id,
      status: "DRAFT",
      problem: "Jahitan sisi terlepas setelah proses obras",
      productionStage: "Obras",
      material: "Katun combed",
    });
  });

  it("menyimpan konteks yang belum diketahui sebagai absent", async () => {
    const created = await createQualityCase({ problem: "Noda minyak pada kain" });
    createdIds.push(created.id);

    expect(created).toMatchObject({
      status: "DRAFT",
      productionStage: null,
      productModelReference: null,
      material: null,
      machineWorkstation: null,
      batchOrderReference: null,
      additionalContextNote: null,
    });
  });

  it("memperbarui Masalah dan konteks pada Kasus Kualitas aktif", async () => {
    const created = await createQualityCase({ problem: "Ukuran lengan berubah" });
    createdIds.push(created.id);

    await updateActiveQualityCase(created.id, {
      problem: "Ukuran lengan berubah setelah pencucian awal",
      productionStage: "Pencucian",
      machineWorkstation: "Mesin cuci 2",
    });

    await expect(getActiveQualityCase(created.id)).resolves.toMatchObject({
      status: "DRAFT",
      problem: "Ukuran lengan berubah setelah pencucian awal",
      productionStage: "Pencucian",
      machineWorkstation: "Mesin cuci 2",
    });
  });
});
describe("persistensi Bukti", () => {
  it("menyimpan, memuat ulang, memperbarui, dan menghapus Bukti pada case aktif", async () => {
    const { addEvidence, updateEvidence, removeEvidence } = await import("../../src/lib/quality-case/service");
    const created = await createQualityCase({ problem: "Benang putus" }); createdIds.push(created.id);
    const first = await addEvidence(created.id, "Benang putus pada mesin nomor 2");
    const second = await addEvidence(created.id, "Terjadi pada 4 dari 10 potong");
    await updateEvidence(created.id, first.id, "Benang putus pada mesin nomor 2 saat obras");
    await removeEvidence(created.id, second.id);
    await expect(getActiveQualityCase(created.id)).resolves.toMatchObject({ status: "INVESTIGATING", evidence: [{ id: first.id, content: "Benang putus pada mesin nomor 2 saat obras" }] });
  });
});
describe("Bukti pada case nonaktif", () => {
  it("menolak mutation ketika case sudah RESOLVED", async () => {
    const { addEvidence, updateEvidence, removeEvidence } = await import("../../src/lib/quality-case/service");
    const created = await createQualityCase({ problem: "Case selesai" }); createdIds.push(created.id);
    const evidence = await addEvidence(created.id, "Bukti awal");
    await getPrisma().qualityCase.update({ where: { id: created.id }, data: { status: "RESOLVED" } });
    await expect(addEvidence(created.id, "Bukti lain")).rejects.toBeInstanceOf(Error);
    await expect(updateEvidence(created.id, evidence.id, "Ubah")).rejects.toBeInstanceOf(Error);
    await expect(removeEvidence(created.id, evidence.id)).rejects.toBeInstanceOf(Error);
  });
});

describe("persistensi Faktor Penyebab dan hubungan Bukti", () => {
  it("menyimpan many-to-many, unlink, dan membersihkan link saat Bukti/Faktor dihapus", async () => {
    const {
      addContributingCause,
      addEvidence,
      removeContributingCause,
      removeEvidence,
      updateContributingCause,
    } = await import("../../src/lib/quality-case/service");
    const created = await createQualityCase({
      problem: "Jahitan loncat pada sisi samping",
    });
    createdIds.push(created.id);

    const firstEvidence = await addEvidence(
      created.id,
      "Defect terkonsentrasi pada mesin M-04",
    );
    const secondEvidence = await addEvidence(
      created.id,
      "Jarum terlihat aus saat pemeriksaan",
    );
    const firstCause = await addContributingCause(
      created.id,
      "Kondisi mesin lokal mungkin berkontribusi",
      [firstEvidence.id, secondEvidence.id],
    );
    const secondCause = await addContributingCause(
      created.id,
      "Kondisi jarum mungkin berkontribusi",
      [secondEvidence.id],
    );

    let reloaded = await getActiveQualityCase(created.id);
    expect(reloaded?.contributingCauses).toHaveLength(2);
    expect(
      reloaded?.contributingCauses.find((cause) => cause.id === firstCause.id)
        ?.evidenceLinks,
    ).toEqual(
      expect.arrayContaining([
        { evidenceId: firstEvidence.id },
        { evidenceId: secondEvidence.id },
      ]),
    );
    expect(
      reloaded?.evidence.find((item) => item.id === secondEvidence.id)
        ?.causeLinks,
    ).toEqual(
      expect.arrayContaining([
        { contributingCauseId: firstCause.id },
        { contributingCauseId: secondCause.id },
      ]),
    );

    await updateContributingCause(
      created.id,
      firstCause.id,
      "Kondisi mesin lokal perlu diperiksa",
      [firstEvidence.id],
    );
    expect(
      await getPrisma().evidenceCauseLink.findUnique({
        where: {
          evidenceId_contributingCauseId: {
            evidenceId: secondEvidence.id,
            contributingCauseId: firstCause.id,
          },
        },
      }),
    ).toBeNull();

    await removeEvidence(created.id, secondEvidence.id);
    expect(
      await getPrisma().evidenceCauseLink.count({
        where: { evidenceId: secondEvidence.id },
      }),
    ).toBe(0);
    reloaded = await getActiveQualityCase(created.id);
    expect(reloaded?.evidence).toHaveLength(1);
    expect(
      reloaded?.contributingCauses.find((cause) => cause.id === secondCause.id)
        ?.evidenceLinks,
    ).toEqual([]);

    await removeContributingCause(created.id, firstCause.id);
    expect(
      await getPrisma().evidenceCauseLink.count({
        where: { contributingCauseId: firstCause.id },
      }),
    ).toBe(0);
    await expect(getActiveQualityCase(created.id)).resolves.toMatchObject({
      problem: "Jahitan loncat pada sisi samping",
      status: "INVESTIGATING",
    });
  });

  it("menolak mutation Faktor Penyebab ketika case tidak aktif", async () => {
    const {
      addContributingCause,
      addEvidence,
      removeContributingCause,
      updateContributingCause,
    } = await import("../../src/lib/quality-case/service");
    const created = await createQualityCase({ problem: "Case selesai" });
    createdIds.push(created.id);
    const evidence = await addEvidence(created.id, "Bukti awal");
    const cause = await addContributingCause(
      created.id,
      "Faktor awal",
      [evidence.id],
    );

    await getPrisma().qualityCase.update({
      where: { id: created.id },
      data: { status: "RESOLVED" },
    });

    await expect(
      addContributingCause(created.id, "Faktor lain", [evidence.id]),
    ).rejects.toBeInstanceOf(Error);
    await expect(
      updateContributingCause(created.id, cause.id, "Ubah", [evidence.id]),
    ).rejects.toBeInstanceOf(Error);
    await expect(
      removeContributingCause(created.id, cause.id),
    ).rejects.toBeInstanceOf(Error);
  });

  it("menolak hubungan Bukti dari Kasus Kualitas lain", async () => {
    const {
      addContributingCause,
      addEvidence,
      InvalidEvidenceSelectionError,
      updateContributingCause,
    } = await import("../../src/lib/quality-case/service");
    const firstCase = await createQualityCase({ problem: "Masalah pertama" });
    const secondCase = await createQualityCase({ problem: "Masalah kedua" });
    createdIds.push(firstCase.id, secondCase.id);
    const foreignEvidence = await addEvidence(
      secondCase.id,
      "Bukti milik kasus kedua",
    );
    const cause = await addContributingCause(
      firstCase.id,
      "Faktor pada kasus pertama",
      [],
    );

    await expect(
      addContributingCause(firstCase.id, "Faktor lintas kasus", [
        foreignEvidence.id,
      ]),
    ).rejects.toBeInstanceOf(InvalidEvidenceSelectionError);
    await expect(
      updateContributingCause(
        firstCase.id,
        cause.id,
        "Faktor lintas kasus",
        [foreignEvidence.id],
      ),
    ).rejects.toBeInstanceOf(InvalidEvidenceSelectionError);

    await expect(
      getPrisma().evidenceCauseLink.count({
        where: { contributingCauseId: cause.id },
      }),
    ).resolves.toBe(0);
    await expect(
      getPrisma().contributingCause.count({
        where: { qualityCaseId: firstCase.id },
      }),
    ).resolves.toBe(1);
  });
});


describe("persistensi Dugaan Akar Penyebab dan Tindakan Korektif", () => {
  it("menyimpan, memuat ulang, memperbarui, dan menghapus data aktif tanpa mengubah lifecycle", async () => {
    const {
      addCorrectiveAction,
      addContributingCause,
      addEvidence,
      removeCorrectiveAction,
      updateCorrectiveAction,
      updateWorkingRootCause,
    } = await import("../../src/lib/quality-case/service");
    const created = await createQualityCase({
      problem: "Jahitan loncat pada mesin M-04",
      productionStage: "Obras",
    });
    createdIds.push(created.id);

    const evidence = await addEvidence(
      created.id,
      "Defect terkonsentrasi pada mesin M-04",
    );
    const cause = await addContributingCause(
      created.id,
      "Tegangan benang mungkin tidak stabil",
      [evidence.id],
    );
    await updateWorkingRootCause(
      created.id,
      "Tegangan benang pada mesin M-04 perlu distabilkan.",
    );
    const firstAction = await addCorrectiveAction(
      created.id,
      "Atur ulang tegangan benang pada mesin M-04.",
    );
    const secondAction = await addCorrectiveAction(
      created.id,
      "Catat parameter setelah pengaturan ulang.",
    );
    await updateCorrectiveAction(
      created.id,
      firstAction.id,
      "Atur ulang dan catat tegangan benang pada mesin M-04.",
    );
    await removeCorrectiveAction(created.id, secondAction.id);

    const reloaded = await getActiveQualityCase(created.id);
    expect(reloaded).toMatchObject({
      status: "INVESTIGATING",
      workingRootCause: "Tegangan benang pada mesin M-04 perlu distabilkan.",
      correctiveActions: [
        {
          id: firstAction.id,
          content: "Atur ulang dan catat tegangan benang pada mesin M-04.",
        },
      ],
    });
    expect(
      reloaded?.contributingCauses.find((item) => item.id === cause.id)
        ?.evidenceLinks,
    ).toEqual([{ evidenceId: evidence.id }]);
  });

  it("menolak mutation kesimpulan dan tindakan ketika case tidak aktif", async () => {
    const {
      addCorrectiveAction,
      updateWorkingRootCause,
    } = await import("../../src/lib/quality-case/service");
    const created = await createQualityCase({ problem: "Case selesai" });
    createdIds.push(created.id);

    await getPrisma().qualityCase.update({
      where: { id: created.id },
      data: { status: "RESOLVED" },
    });

    await expect(
      updateWorkingRootCause(created.id, "Kesimpulan tidak boleh tersimpan"),
    ).rejects.toBeInstanceOf(Error);
    await expect(
      addCorrectiveAction(created.id, "Tindakan tidak boleh tersimpan"),
    ).rejects.toBeInstanceOf(Error);
  });

  it("menyimpan kesimpulan dan tindakan pada case DRAFT tanpa memajukan lifecycle", async () => {
    const { addCorrectiveAction, updateWorkingRootCause } = await import(
      "../../src/lib/quality-case/service"
    );
    const created = await createQualityCase({ problem: "Masalah aktif" });
    createdIds.push(created.id);

    await updateWorkingRootCause(created.id, "Dugaan kerja awal.");
    const action = await addCorrectiveAction(created.id, "Atur ulang parameter.");

    await expect(getActiveQualityCase(created.id)).resolves.toMatchObject({
      status: "DRAFT",
      workingRootCause: "Dugaan kerja awal.",
      correctiveActions: [{ id: action.id, content: "Atur ulang parameter." }],
    });
  });
});