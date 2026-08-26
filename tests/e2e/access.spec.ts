import { expect, test } from "@playwright/test";

const validCredential =
  process.env.APP_ACCESS_CREDENTIAL ?? "credential-e2e-lokal";

test("health check produksi mencapai PostgreSQL melalui Prisma", async ({
  request,
}) => {
  const response = await request.get("/api/health");

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test("area aplikasi menolak akses tanpa sesi", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/akses$/);
  await expect(
    page.getByRole("heading", { name: "Masuk ke ruang investigasi" }),
  ).toBeVisible();
});

test("kredensial yang salah ditolak", async ({ page }) => {
  await page.goto("/akses");
  await page.getByLabel("Kredensial akses").fill("kredensial-salah");
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();

  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Kredensial tidak dikenali",
  );
  await expect(page).toHaveURL(/\/akses$/);
});

test("kredensial yang benar mencapai shell terlindungi", async ({ page }) => {
  await page.goto("/akses");
  await page.getByLabel("Kredensial akses").fill(validCredential);
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Belum ada Kasus Kualitas" }),
  ).toBeVisible();
  await expect(
    page.getByText("Pembuatan Kasus Kualitas belum tersedia"),
  ).toBeVisible();
});

test("keluar menghapus sesi aplikasi", async ({ page }) => {
  await page.goto("/akses");
  await page.getByLabel("Kredensial akses").fill(validCredential);
  await page.getByRole("button", { name: "Masuk ke aplikasi" }).click();
  await page.getByRole("button", { name: "Keluar" }).click();

  await expect(page).toHaveURL(/\/akses$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/akses$/);
});
