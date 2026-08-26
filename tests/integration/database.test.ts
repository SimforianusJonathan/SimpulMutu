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