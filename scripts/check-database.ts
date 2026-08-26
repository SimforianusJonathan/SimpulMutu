import "dotenv/config";

import {
  checkDatabaseConnection,
  disconnectDatabase,
} from "../src/lib/db/prisma";

try {
  await checkDatabaseConnection();
  console.log("Koneksi PostgreSQL melalui Prisma berhasil.");
} catch {
  console.error("Koneksi PostgreSQL melalui Prisma gagal.");
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
