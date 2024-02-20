// preserves new line characters, etc
export function stringToHex(str: string): string {
  return Buffer.from(str).toString("hex");
}
