// import "dotenv/config";

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
  await expect(page.getByRole("heading", { name: "Faktor Penyebab" }).first()).toBeVisible();
  await page.getByRole("link", { name: "Masalah & Konteks" }).click();
  await expect(page.getByText("Masalah & Konteks")).toBeVisible();
});

test("Evidence Loom menyimpan hubungan many-to-many dan tetap bermakna pada layar sempit", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page
    .getByLabel("Masalah")
    .fill(`Jahitan loncat Evidence Loom ${Date.now()}`);
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);

  await page.getByRole("link", { name: "Bukti" }).click();
  await page.getByLabel("Bukti baru").fill("Defect terkonsentrasi pada M-04");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();
  await expect(page.getByText("BUKTI 1", { exact: true })).toBeVisible();
  await page.getByLabel("Bukti baru").fill("Jarum terlihat aus");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();
  await expect(page.getByText("BUKTI 2", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Faktor Penyebab" }).click();
  const newCauseForm = page
    .getByLabel("Faktor Penyebab baru")
    .locator("xpath=ancestor::form");
  await newCauseForm
    .getByLabel("Faktor Penyebab baru")
    .fill("Kondisi mesin lokal mungkin berkontribusi");
  await newCauseForm.getByRole("checkbox").nth(0).check();
  await newCauseForm.getByRole("checkbox").nth(1).check();
  await newCauseForm
    .getByRole("button", { name: "Tambah Faktor Penyebab" })
    .click();
  await expect(page.getByText("C1", { exact: true })).toBeVisible();

  const refreshedNewCauseForm = page
    .getByLabel("Faktor Penyebab baru")
    .locator("xpath=ancestor::form");
  await refreshedNewCauseForm
    .getByLabel("Faktor Penyebab baru")
    .fill("Kondisi jarum mungkin berkontribusi");
  await refreshedNewCauseForm.getByRole("checkbox").nth(1).check();
  await refreshedNewCauseForm
    .getByRole("button", { name: "Tambah Faktor Penyebab" })
    .click();
  await expect(page.getByText("C2", { exact: true })).toBeVisible();

  await expect(
    page
      .getByLabel("Isi Faktor Penyebab C1")
      .locator("xpath=ancestor::article"),
  ).toContainText("Didukung oleh: E1, E2");
  await expect(
    page
      .getByLabel("Isi Faktor Penyebab C2")
      .locator("xpath=ancestor::article"),
  ).toContainText("Didukung oleh: E2");

  const connectors = page.getByTestId("evidence-loom-connectors");
  await expect(connectors).toBeVisible();
  await expect(connectors.locator("path")).toHaveCount(3);
  await expect(connectors.locator('path[data-direct="true"]')).toHaveCount(0);

  await page
    .getByRole("button", { name: /^Periksa Bukti E2:/ })
    .click();
  await expect(connectors.locator('path[data-direct="true"]')).toHaveCount(2);
  await expect(
    page.getByRole("button", { name: /^Periksa Bukti E2:/ }),
  ).toHaveAttribute("aria-pressed", "true");

  const firstCauseForm = page
    .getByLabel("Isi Faktor Penyebab C1")
    .locator("xpath=ancestor::form");
  await firstCauseForm
    .getByLabel("Isi Faktor Penyebab C1")
    .fill("Kondisi mesin M-04 perlu diperiksa");
  await firstCauseForm.getByRole("checkbox").nth(1).uncheck();
  await firstCauseForm
    .getByRole("button", { name: "Simpan Faktor & Hubungan" })
    .click();
  await expect(
    page.getByText("Faktor Penyebab dan hubungan Bukti telah diperbarui."),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(connectors).toBeHidden();
  await expect(
    page
      .getByLabel("Isi Faktor Penyebab C1")
      .locator("xpath=ancestor::article"),
  ).toContainText("Didukung oleh: E1");

  await page.getByRole("link", { name: "Bukti" }).click();
  await expect(page.getByText("BUKTI 1", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Faktor Penyebab" }).click();
  await expect(page.getByLabel("Isi Faktor Penyebab C1")).toHaveValue(
    "Kondisi mesin M-04 perlu diperiksa",
  );

  const secondCauseCard = page
    .getByLabel("Isi Faktor Penyebab C2")
    .locator("xpath=ancestor::article");
  await secondCauseCard
    .getByRole("button", { name: "Hapus Faktor Penyebab" })
    .click();
  await expect(page.getByLabel("Isi Faktor Penyebab C2")).toHaveCount(0);

  await page.reload();
  await expect(page.getByLabel("Isi Faktor Penyebab C1")).toHaveValue(
    "Kondisi mesin M-04 perlu diperiksa",
  );
  await expect(page.getByText("C2", { exact: true })).toHaveCount(0);
});


test("M2 lengkap menyimpan kesimpulan sementara, Tindakan Korektif, dan Ringkasan tanpa resolve", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(`Jahitan loncat M2 lengkap ${Date.now()}`);
  await page.getByLabel("Tahap Produksi / Proses").fill("Obras");
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);

  await page.getByRole("link", { name: "Bukti" }).click();
  await page.getByLabel("Bukti baru").fill("Defect terkonsentrasi pada mesin M-04");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();

  await page.getByRole("link", { name: "Faktor Penyebab" }).click();
  const causeForm = page
    .getByLabel("Faktor Penyebab baru")
    .locator("xpath=ancestor::form");
  await causeForm
    .getByLabel("Faktor Penyebab baru")
    .fill("Tegangan benang mungkin tidak stabil");
  await causeForm.getByRole("checkbox").check();
  await causeForm.getByRole("button", { name: "Tambah Faktor Penyebab" }).click();

  await page.getByRole("link", { name: "Dugaan Akar Penyebab" }).click();
  await page.getByLabel("Kesimpulan kerja saat ini").evaluate((element) => element.removeAttribute("required"));
  await page.getByRole("button", { name: "Simpan Dugaan Akar Penyebab" }).click();
  await expect(page.getByText("Dugaan Akar Penyebab perlu diisi sebelum disimpan.")).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(
    page.getByText("Kesimpulan sementara, bukan fakta terbukti."),
  ).toBeVisible();
  await page
    .getByLabel("Kesimpulan kerja saat ini")
    .fill("Tegangan benang pada mesin M-04 perlu distabilkan.");
  await page
    .getByRole("button", { name: "Simpan Dugaan Akar Penyebab" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "kesimpulan sementara",
  );
  await page
    .getByLabel("Kesimpulan kerja saat ini")
    .fill("Tegangan benang M-04 perlu distabilkan dan dipantau.");
  await page
    .getByRole("button", { name: "Perbarui Dugaan Akar Penyebab" })
    .click();

  await page.getByRole("link", { name: "Ringkasan" }).click();
  await expect(
    page.getByRole("heading", { name: "Pemeriksaan kesiapan penyelesaian" }),
  ).toBeVisible();
  await expect(
    page.getByText("Tindakan Korektif").last(),
  ).toBeVisible();
  await expect(page.getByText("Belum lengkap").last()).toBeVisible();

  await page.getByRole("link", { name: "Tindakan Korektif" }).click();
  await page.getByLabel("Tindakan Korektif baru").evaluate((element) => element.removeAttribute("required"));
  await page.getByRole("button", { name: "Tambah Tindakan Korektif" }).click();
  await expect(page.getByText("Tindakan Korektif perlu diisi sebelum disimpan.")).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await page
    .getByLabel("Tindakan Korektif baru")
    .fill("Atur ulang tegangan benang pada mesin M-04.");
  await page
    .getByRole("button", { name: "Tambah Tindakan Korektif" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Tindakan Korektif telah disimpan.",
  );
  await page
    .getByLabel("Tindakan Korektif baru")
    .fill("Catat parameter tegangan setelah pengaturan ulang.");
  await page
    .getByRole("button", { name: "Tambah Tindakan Korektif" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Tindakan Korektif telah disimpan.",
  );
  await expect(page.getByText("Tindakan 2", { exact: true })).toBeVisible();

  await page
    .getByLabel("Isi Tindakan Korektif 1")
    .fill("Atur ulang dan catat tegangan benang pada mesin M-04.");
  await page
    .getByRole("button", { name: "Simpan Tindakan Korektif" })
    .first()
    .click();
  await expect(page.getByText("Tindakan Korektif telah diperbarui.")).toBeVisible();
  await page
    .getByRole("button", { name: "Hapus Tindakan Korektif" })
    .last()
    .click();
  await expect(page.getByText("Tindakan 2", { exact: true })).toHaveCount(0);

  await page.getByRole("link", { name: "Ringkasan" }).click();
  await expect(
    page.getByText("Tegangan benang M-04 perlu distabilkan dan dipantau."),
  ).toBeVisible();
  await expect(
    page.getByText("Atur ulang dan catat tegangan benang pada mesin M-04."),
  ).toBeVisible();
  await expect(page.getByText("Didukung oleh: E1")).toBeVisible();
  await expect(page.getByText("Lengkap").last()).toBeVisible();
  await expect(page.getByText("Kasus Kualitas tetap aktif.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Selesaikan Kasus" })).toBeVisible();
});

test("M3 hanya menyelesaikan case lengkap secara eksplisit lalu menampilkannya sebagai Memori Kualitas baca-saja", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(`Kasus incomplete M3 ${Date.now()}`);
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);
  await page.getByRole("link", { name: "Ringkasan" }).click();
  await expect(page.getByText("Belum lengkap").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Selesaikan Kasus" })).toHaveCount(0);

  await page.getByRole("link", { name: "Bukti" }).click();
  await page.getByLabel("Bukti baru").fill("Benang terlepas pada mesin M-04.");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();

  await page.getByRole("link", { name: "Faktor Penyebab" }).click();
  const causeForm = page
    .getByLabel("Faktor Penyebab baru")
    .locator("xpath=ancestor::form");
  await causeForm
    .getByLabel("Faktor Penyebab baru")
    .fill("Tegangan benang mungkin tidak stabil.");
  await causeForm.getByRole("checkbox").check();
  await causeForm.getByRole("button", { name: "Tambah Faktor Penyebab" }).click();

  await page.getByRole("link", { name: "Dugaan Akar Penyebab" }).click();
  await page
    .getByLabel("Kesimpulan kerja saat ini")
    .fill("Tegangan benang M-04 perlu distabilkan.");
  await page
    .getByRole("button", { name: "Simpan Dugaan Akar Penyebab" })
    .click();

  await page.getByRole("link", { name: "Tindakan Korektif" }).click();
  await page
    .getByLabel("Tindakan Korektif baru")
    .fill("Atur ulang tegangan benang pada mesin M-04.");
  await page
    .getByRole("button", { name: "Tambah Tindakan Korektif" })
    .click();

  await page.getByRole("link", { name: "Ringkasan" }).click();
  await expect(page.getByRole("button", { name: "Selesaikan Kasus" })).toBeVisible();
  await page.getByRole("button", { name: "Selesaikan Kasus" }).click();

  await expect(page.getByText("SELESAI / MEMORI KUALITAS")).toBeVisible();
  await expect(page.getByText("Tegangan benang M-04 perlu distabilkan.")).toBeVisible();
  await expect(
    page.getByText("Atur ulang tegangan benang pada mesin M-04."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Simpan perubahan" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Tambah Bukti" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Tambah Faktor Penyebab" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Simpan Dugaan Akar Penyebab" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Tambah Tindakan Korektif" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Masalah & Konteks" })).toHaveCount(0);

  const resolvedUrl = page.url();
  const resolvedCaseId = new URL(resolvedUrl).pathname.split("/").at(-1);
  await page.reload();
  await expect(page).toHaveURL(resolvedUrl);
  await expect(page.getByText("SELESAI / MEMORI KUALITAS")).toBeVisible();
  await page.getByRole("link", { name: "Selesai", exact: true }).click();
  await expect(page.locator(`a[href="/kasus-kualitas/${resolvedCaseId}"]`)).toBeVisible();
});

test("M4 membuka referensi historis tanpa mengubah penalaran Kasus Kualitas saat ini", async ({ page }) => {
  const currentRootCause = "Setting M-07 perlu diperiksa sebagai dugaan saat ini.";
  const currentAction = "Kembalikan setting M-07 sebelum produksi dilanjutkan.";

  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page
    .getByLabel("Masalah")
    .fill(`Jahitan loncat kembali muncul pada sisi samping produk ${Date.now()}`);
  await page.getByLabel("Tahap Produksi / Proses").fill("Penjahitan");
  await page.getByLabel("Material").fill("Cotton 24s");
  await page.getByLabel("Mesin / Workstation").fill("M-07");
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);

  await page.getByRole("link", { name: "Dugaan Akar Penyebab" }).click();
  await page.getByLabel("Kesimpulan kerja saat ini").fill(currentRootCause);
  await page
    .getByRole("button", { name: "Simpan Dugaan Akar Penyebab" })
    .click();
  await page.getByRole("link", { name: "Tindakan Korektif" }).click();
  await page.getByLabel("Tindakan Korektif baru").fill(currentAction);
  await page
    .getByRole("button", { name: "Tambah Tindakan Korektif" })
    .click();

  await page
    .getByRole("button", { name: "Kasus Terdahulu yang Relevan" })
    .click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("Jahitan loncat pada sisi samping beberapa produk.");
  await expect(drawer).toContainText(
    "Jahitan tidak stabil setelah penyesuaian mesin pada proses penjahitan.",
  );
  await expect(drawer.getByText("Relevan karena:").first()).toBeVisible();
  await expect(drawer.getByText("Tahap produksi sama").first()).toBeVisible();
  await drawer.getByRole("button", { name: "Lihat Memori Kualitas" }).first().click();
  await expect(drawer).toContainText("MEMORI KUALITAS TERDAHULU / BACA-SAJA");
  await expect(drawer).toContainText("Dugaan Akar Penyebab pada kasus terdahulu");
  await expect(drawer).toContainText("Konteks pada kasus terdahulu");
  await expect(drawer).toContainText("Mesin / Workstation");
  await expect(drawer).toContainText("M-04");
  await expect(drawer).toContainText("Didukung oleh: Bukti 3");
  await expect(drawer).toContainText("bukan jawaban otomatis");
  await drawer.getByRole("button", { name: "Kembali ke referensi" }).click();
  await drawer.getByRole("button", { name: "Tutup" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "Dugaan Akar Penyebab" }).click();
  await expect(page.getByLabel("Kesimpulan kerja saat ini")).toHaveValue(currentRootCause);
  await page.getByRole("link", { name: "Tindakan Korektif" }).click();
  await expect(page.getByLabel("Isi Tindakan Korektif 1")).toHaveValue(currentAction);
});

test("M4 menampilkan zero-result sebagai state valid", async ({ page }) => {
  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(`Noda tinta pada kain linen ${Date.now()}`);
  await page.getByLabel("Tahap Produksi / Proses").fill("Pemeriksaan akhir");
  await page.getByLabel("Material").fill("Linen");
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);

  await page
    .getByRole("button", { name: "Kasus Terdahulu yang Relevan" })
    .click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("Belum ada Kasus Terdahulu yang Relevan");
  await expect(drawer).toContainText("tetap dapat melanjutkan investigasi saat ini");
  await drawer.getByRole("button", { name: "Tutup" }).click();
  await expect(page.getByLabel("Masalah")).toHaveValue(/Noda tinta pada kain linen/);
});


test("golden demo M1-M4 menjaga investigasi aktif hingga menjadi Memori Kualitas", async ({ page }) => {
  const problem = "Jahitan loncat pada sisi samping demo " + Date.now();

  await signIn(page);
  await page.getByRole("link", { name: "Buat Kasus Kualitas" }).first().click();
  await page.getByLabel("Masalah").fill(problem);
  await page.getByLabel("Tahap Produksi / Proses").fill("Penjahitan");
  await page.getByLabel("Material").fill("Cotton 24s");
  await page.getByLabel("Mesin / Workstation").fill("M-07");
  await page.getByRole("button", { name: "Simpan Kasus Kualitas" }).click();
  rememberCurrentCase(page);

  await page.getByRole("link", { name: "Bukti" }).click();
  await page.getByLabel("Bukti baru").fill("Defect terkonsentrasi pada hasil M-07.");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();
  await page.getByLabel("Bukti baru").fill("Defect muncul setelah setting M-07 disesuaikan.");
  await page.getByRole("button", { name: "Tambah Bukti" }).click();

  await page.getByRole("link", { name: "Faktor Penyebab" }).click();
  const firstCause = page.getByLabel("Faktor Penyebab baru").locator("xpath=ancestor::form");
  await firstCause.getByLabel("Faktor Penyebab baru").fill("Faktor lokal workstation mungkin berkontribusi.");
  await firstCause.getByRole("checkbox").nth(0).check();
  await firstCause.getByRole("button", { name: "Tambah Faktor Penyebab" }).click();
  await expect(page.getByText("C1", { exact: true })).toBeVisible();

  const secondCause = page.getByLabel("Faktor Penyebab baru").locator("xpath=ancestor::form");
  await secondCause.getByLabel("Faktor Penyebab baru").fill("Penyesuaian setting mungkin berkontribusi.");
  await secondCause.getByRole("checkbox").nth(1).check();
  await secondCause.getByRole("button", { name: "Tambah Faktor Penyebab" }).click();
  await expect(page.getByTestId("evidence-loom-connectors")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByTestId("evidence-loom-connectors")).toBeHidden();
  await expect(
    page.getByLabel("Isi Faktor Penyebab C1").locator("xpath=ancestor::article"),
  ).toContainText("Didukung oleh: E1");
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.getByRole("button", { name: "Kasus Terdahulu yang Relevan" }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toContainText("SELESAI / MEMORI KUALITAS TERDAHULU");
  await expect(drawer).toContainText("Relevan karena:");
  await drawer.getByRole("button", { name: "Lihat Memori Kualitas" }).first().click();
  await expect(drawer).toContainText("MEMORI KUALITAS TERDAHULU / BACA-SAJA");
  await expect(drawer).toContainText("Dugaan Akar Penyebab pada kasus terdahulu");
  await expect(drawer).toContainText("Tindakan Korektif pada kasus terdahulu");
  await drawer.getByRole("button", { name: "Kembali ke referensi" }).click();
  await drawer.getByRole("button", { name: "Tutup" }).click();

  await page.getByRole("link", { name: "Dugaan Akar Penyebab" }).click();
  await expect(page.getByLabel("Kesimpulan kerja saat ini")).toHaveValue("");
  await page.getByLabel("Kesimpulan kerja saat ini").fill(
    "Penyesuaian setting M-07 menjadi dugaan akar penyebab saat ini.",
  );
  await page.getByRole("button", { name: "Simpan Dugaan Akar Penyebab" }).click();

  await page.getByRole("link", { name: "Tindakan Korektif" }).click();
  await page.getByLabel("Tindakan Korektif baru").fill(
    "Periksa dan kembalikan setting M-07 sebelum produksi dilanjutkan.",
  );
  await page.getByRole("button", { name: "Tambah Tindakan Korektif" }).click();

  await page.getByRole("link", { name: "Ringkasan" }).click();
  await expect(page.getByText("Didukung oleh: E1")).toBeVisible();
  await expect(page.getByText("Didukung oleh: E2")).toBeVisible();
  await page.getByRole("button", { name: "Selesaikan Kasus" }).click();

  await expect(page.getByText("SELESAI / MEMORI KUALITAS")).toBeVisible();
  await expect(page.getByText("BACA-SAJA / TIDAK DAPAT DIUBAH")).toBeVisible();
  await expect(page.getByText("Faktor Penyebab dan hubungan Bukti")).toBeVisible();
  await expect(page.getByRole("button", { name: "Tambah Bukti" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Simpan perubahan" })).toHaveCount(0);
});
