import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAccessEnvironment } from "@/lib/env";
import { isSessionTokenValid, SESSION_COOKIE_NAME } from "./session";

export async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const { sessionSecret } = getAccessEnvironment();
  return isSessionTokenValid(token, sessionSecret);
}

export async function requireSession(): Promise<void> {
  if (!(await hasValidSession())) {
    redirect("/akses");
  }
}
