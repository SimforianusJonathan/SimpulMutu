export class ConfigurationError extends Error {
  constructor(variableName: string, requirement?: string) {
    const detail = requirement ? ` ${requirement}` : "";
    super(`Konfigurasi server ${variableName} tidak valid.${detail}`);
    this.name = "ConfigurationError";
  }
}

function readRequired(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new ConfigurationError(name, "Nilai wajib tersedia.");
  }

  return value;
}

export function getAccessEnvironment() {
  const credential = readRequired("APP_ACCESS_CREDENTIAL");
  const sessionSecret = readRequired("SESSION_SECRET");

  if (sessionSecret.length < 32) {
    throw new ConfigurationError(
      "SESSION_SECRET",
      "Gunakan minimal 32 karakter.",
    );
  }

  return { credential, sessionSecret };
}

export function getDatabaseUrl(): string {
  return readRequired("DATABASE_URL");
}
