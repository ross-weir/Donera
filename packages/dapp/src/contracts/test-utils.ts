import { Project, web3 } from "@alephium/web3";
import { expect } from "bun:test";

export async function prepareForTests() {
  web3.setCurrentNodeProvider("http://127.0.0.1:22973");
  await Project.build();
}

export async function expectAssertionError(
  call: () => Promise<unknown>,
  address: string,
  errorCode: bigint
): Promise<void> {
  const pattern = `Assertion Failed in Contract @ ${address}, Error Code: ${errorCode}`;
  expect(call()).rejects.toThrow(new RegExp(pattern, "mg"));
}
