"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isCredentialValid } from "@/lib/access/credential";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/access/session";
import { getAccessEnvironment } from "@/lib/env";

export type AccessActionState = {
  error?: string;
};

export async function grantAccess(
  _previousState: AccessActionState,
  formData: FormData,
): Promise<AccessActionState> {
  const submittedCredential = formData.get("credential");
  const { credential, sessionSecret } = getAccessEnvironment();

  if (
    typeof submittedCredential !== "string" ||
    !isCredentialValid(submittedCredential, credential)
  ) {
    return {
      error: "Kredensial tidak dikenali. Periksa kembali lalu coba lagi.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken(sessionSecret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  redirect("/");
}

export async function revokeAccess(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/akses");
}
