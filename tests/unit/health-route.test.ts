import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/health/route";
import { checkDatabaseConnection } from "@/lib/db/prisma";

vi.mock("@/lib/db/prisma", () => ({
  checkDatabaseConnection: vi.fn(),
}));

const mockedCheckDatabaseConnection = vi.mocked(checkDatabaseConnection);

function useValidAccessEnvironment() {
  vi.stubEnv("APP_ACCESS_CREDENTIAL", "akses-pengujian");
  vi.stubEnv(
    "SESSION_SECRET",
    "rahasia-pengujian-minimum-tiga-puluh-dua-karakter",
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});

describe("GET /api/health", () => {
  it("menolak readiness ketika konfigurasi access gate tidak valid", async () => {
    vi.stubEnv("APP_ACCESS_CREDENTIAL", "akses-pengujian");
    vi.stubEnv("SESSION_SECRET", "terlalu-pendek");

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ status: "unavailable" });
    expect(mockedCheckDatabaseConnection).not.toHaveBeenCalled();
  });

  it("menolak readiness ketika PostgreSQL tidak tersedia", async () => {
    useValidAccessEnvironment();
    mockedCheckDatabaseConnection.mockRejectedValueOnce(
      new Error("database tidak tersedia"),
    );

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ status: "unavailable" });
  });

  it("menyatakan siap hanya ketika konfigurasi dan PostgreSQL valid", async () => {
    useValidAccessEnvironment();
    mockedCheckDatabaseConnection.mockResolvedValueOnce();

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok" });
  });
});
