import { Project, web3 } from "@alephium/web3";
import { expect } from "bun:test";

export async function prepareForTests() {
  web3.setCurrentNodeProvider("http://127.0.0.1:22973");
  await Project.build();
}

// `@alephium/web3-test` function assumes jests global `expect` is available
// so doesn't work with bun
export async function expectAssertionError(
  call: () => Promise<unknown>,
  address: string,
  errorCode: bigint
): Promise<void> {
  expect(call()).rejects.toThrow(
    new RegExp(`AssertionFailedWithErrorCode\\(${address},${errorCode}\\)`, "mg")
  );
}
