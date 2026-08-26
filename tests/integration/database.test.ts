import "dotenv/config";

import { afterAll, describe, expect, it } from "vitest";

import {
  checkDatabaseConnection,
  disconnectDatabase,
  getPrisma,
} from "../../src/lib/db/prisma";

afterAll(async () => {
  await disconnectDatabase();
});

describe("canonical PostgreSQL connectivity", () => {
  it("menghubungkan Prisma ke PostgreSQL yang nyata", async () => {
    await expect(checkDatabaseConnection()).resolves.toBeUndefined();
  });

  it("menjalankan pembacaan teknis tanpa model produk", async () => {
    const result = await getPrisma().$queryRaw<Array<{ database: string }>>`
      SELECT current_database() AS database
    `;

    expect(result[0]?.database).toBeTruthy();
  });
});
