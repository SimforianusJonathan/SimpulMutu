import { NextResponse } from "next/server";

import { checkDatabaseConnection } from "@/lib/db/prisma";
import { getAccessEnvironment } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    getAccessEnvironment();
    await checkDatabaseConnection();
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
