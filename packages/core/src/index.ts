export * from "./lifecycle";

// preserves new line characters, etc
export function stringToHex(str: string): string {
  return Buffer.from(str).toString("hex");
}

export function getEnvVarOrThrow(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`getEnvVarOrThrow: env var not found ${key}`);
  }
  return value;
}
