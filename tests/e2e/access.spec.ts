import "dotenv/config";

import { expect, test } from "@playwright/test";

import { disconnectDatabase, getPrisma } from "../../src/lib/db/prisma";

const validCredential = process.env.APP_ACCESS_CREDENTIAL ?? "credential-e2e-lokal";
const createdCaseIds: string[] = [];

function rememberCurrentCase(page: import("@playwright/test").Page) {
  const id = new URL(page.url()).pathname.split("/").at(-1);
  if (id) createdCaseIds.push(id);
}

test.afterAll(async () => {
  if (createdCaseIds.length > 0) {
    await getPrisma().qualityCase.deleteMany({
      where: { id: { in: createdCaseIds } },
    });
  }
  await disconnectDatabase();
});

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/akses");
  await page.getByLabel("Kredensial akses").fill(validCredential);
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  await expect(page).toHaveURL(/\/$/);
}

test("health check produksi mencapai PostgreSQL melalui Prisma", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test("area aplikasi menolak akses tanpa sesi", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/akses$/);
  await expect(page.getByRole("heading", { name: "Masuk ke ruang investigasi" })).toBeVisible();
});

test("kredensial yang salah ditolak", async ({ page }) => {
  await page.goto("/akses");
  await page.getByLabel("Kredensial akses").fill("kredensial-salah");
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("Kredensial tidak dikenali");
  await expect(page).toHaveURL(/\/akses$/);
});

test("akses, buat Kasus Kualitas tanpa konteks opsional, lalu buka kembali", async ({ page }) => {
  const problem = `Jahitan sisi terlepas ${Date.now()}`;
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(problem);
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();

  await expect(page).toHaveURL(/\/kasus-kualitas\/[a-z0-9]+$/);
  rememberCurrentCase(page);
  await expect(page.getByText("DRAF · KASUS KUALITAS AKTIF")).toBeVisible();
  await expect(page.getByLabel("Masalah")).toHaveValue(problem);
  await expect(page.getByLabel("Tahap Produksi / Proses")).toHaveValue("");

  await page.reload();
  await expect(page.getByLabel("Masalah")).toHaveValue(problem);
});

test("Kasus Kualitas aktif dapat diperbarui", async ({ page }) => {
  const originalProblem = `Ukuran lengan berubah ${Date.now()}`;
  const updatedProblem = `${originalProblem} setelah pencucian awal`;
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(originalProblem);
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();

  rememberCurrentCase(page);
  await expect(page.getByRole("button", { name: "Simpan perubahan" })).toBeEnabled();
  await expect(page.getByLabel("Masalah")).toHaveValue(originalProblem);
  await page.getByLabel("Masalah").fill(updatedProblem);
  await page.getByLabel("Tahap Produksi / Proses").fill("Pencucian");
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page.getByRole("status")).toContainText("telah disimpan");

  await page.reload();
  await expect(page.getByLabel("Masalah")).toHaveValue(updatedProblem);
  await expect(page.getByLabel("Tahap Produksi / Proses")).toHaveValue("Pencucian");
});

test("validasi simpan tidak menampilkan keberhasilan palsu", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").evaluate((element) => element.removeAttribute("required"));
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();

  await expect(page.locator("form").getByRole("alert")).toContainText("Masalah perlu diisi");
  await expect(page).toHaveURL(/\/kasus-kualitas\/baru$/);
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("keluar menghapus sesi aplikasi", async ({ page }) => {
  await signIn(page);
  await page.getByRole("button", { name: "Keluar" }).click();
  await expect(page).toHaveURL(/\/akses$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/akses$/);
});
test("Bukti dapat ditambah, diubah, dihapus, dan tahap dapat dikunjungi", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(`Kain bernoda ${Date.now()}`);
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);
  await page.getByRole("link", { name: "Bukti" }).click();
  await page.getByLabel("Bukti baru").fill("Noda terlihat setelah pencucian");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();
  await expect(page.getByText("BUKTI 1", { exact: true })).toBeVisible();
  await page.getByLabel("Bukti baru").fill("Noda muncul pada tiga potong");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();
  await expect(page.getByText("BUKTI 2", { exact: true })).toBeVisible();
  await page.getByLabel("Isi Bukti 1").fill("Noda terlihat setelah pencucian awal");
  await page.getByRole("button", { name: "Simpan perubahan" }).first().click();
  await expect(page.getByText("Bukti telah diperbarui.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Hapus Bukti" }).last().click();
  await expect(page.getByText("BUKTI 2", { exact: true })).toHaveCount(0);
  await page.getByRole("link", { name: "Faktor Penyebab" }).click();
  await expect(page.getByText("Tahap ini adalah bagian dari alur investigasi")).toBeVisible();
  await page.getByRole("link", { name: "Masalah & Konteks" }).click();
  await expect(page.getByText("Masalah & Konteks")).toBeVisible();
});