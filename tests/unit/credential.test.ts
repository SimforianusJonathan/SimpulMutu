import { describe, expect, it } from "vitest";

import { isCredentialValid } from "../../src/lib/access/credential";

describe("isCredentialValid", () => {
  it("menerima kredensial yang sama", () => {
    expect(isCredentialValid("akses-demo", "akses-demo")).toBe(true);
  });

  it("menolak kredensial yang berbeda", () => {
    expect(isCredentialValid("akses-salah", "akses-demo")).toBe(false);
  });
});
