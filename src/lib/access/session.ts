import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "quality_memory_session";
export const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function signaturesMatch(actual: string, expected: string): boolean {
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function createSessionToken(
  secret: string,
  now = Date.now(),
): string {
  const expiresAt = Math.floor(now / 1000) + SESSION_DURATION_SECONDS;
  const payload = `v1.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function isSessionTokenValid(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, expiresAtText, signature] = parts;
  if (version !== "v1") return false;

  const expiresAt = Number(expiresAtText);
  if (!Number.isSafeInteger(expiresAt)) return false;
  if (expiresAt <= Math.floor(now / 1000)) return false;

  const payload = `${version}.${expiresAtText}`;
  return signaturesMatch(signature, sign(payload, secret));
}
