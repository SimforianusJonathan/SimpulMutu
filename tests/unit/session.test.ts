import { describe, expect, it } from "vitest";

import {
  createSessionToken,
  isSessionTokenValid,
  SESSION_DURATION_SECONDS,
} from "../../src/lib/access/session";

const secret = "rahasia-pengujian-minimum-tiga-puluh-dua-karakter";
const now = Date.UTC(2026, 7, 18, 8, 0, 0);

describe("session token", () => {
  it("menerima token yang ditandatangani dan belum kedaluwarsa", () => {
    const token = createSessionToken(secret, now);
    expect(isSessionTokenValid(token, secret, now + 1_000)).toBe(true);
  });

  it("menolak token yang diubah", () => {
    const token = createSessionToken(secret, now);
    expect(isSessionTokenValid(`${token}x`, secret, now)).toBe(false);
  });

  it("menolak token yang kedaluwarsa", () => {
    const token = createSessionToken(secret, now);
    const expiredAt = now + SESSION_DURATION_SECONDS * 1_000;
    expect(isSessionTokenValid(token, secret, expiredAt)).toBe(false);
  });

  it("menolak token dengan rahasia lain", () => {
    const token = createSessionToken(secret, now);
    expect(
      isSessionTokenValid(
        token,
        "rahasia-lain-minimum-tiga-puluh-dua-karakter-sekali",
        now,
      ),
    ).toBe(false);
  });
});
