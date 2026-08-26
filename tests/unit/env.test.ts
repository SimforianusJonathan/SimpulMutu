import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ConfigurationError,
  getAccessEnvironment,
  getDatabaseUrl,
} from "../../src/lib/env";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("server environment", () => {
  it("membaca konfigurasi akses yang lengkap", () => {
    vi.stubEnv("APP_ACCESS_CREDENTIAL", "akses-lokal");
    vi.stubEnv(
      "SESSION_SECRET",
      "rahasia-pengujian-minimum-tiga-puluh-dua-karakter",
    );

    expect(getAccessEnvironment()).toEqual({
      credential: "akses-lokal",
      sessionSecret: "rahasia-pengujian-minimum-tiga-puluh-dua-karakter",
    });
  });

  it("menolak rahasia sesi yang terlalu pendek tanpa menampilkan nilainya", () => {
    vi.stubEnv("APP_ACCESS_CREDENTIAL", "akses-lokal");
    vi.stubEnv("SESSION_SECRET", "terlalu-pendek");

    expect(() => getAccessEnvironment()).toThrow(ConfigurationError);
    expect(() => getAccessEnvironment()).not.toThrow(/terlalu-pendek/);
  });

  it("menolak konfigurasi database yang tidak tersedia", () => {
    vi.stubEnv("DATABASE_URL", "");
    expect(() => getDatabaseUrl()).toThrow(ConfigurationError);
  });
});
