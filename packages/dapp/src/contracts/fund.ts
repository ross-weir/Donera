import { encodeAddress, subContractId } from "@alephium/web3";
import { blake2b } from "@noble/hashes/blake2b";

export * from "../../artifacts/ts/Fund";

interface DeriveFundPathArgs {
  // in hex string format
  name: string;
  goal: string;
  deadlineTimestamp: number;
  organizer: string;
  beneficiary: string;
}

export function deriveFundSubContractPath({
  name,
  goal,
  deadlineTimestamp,
  organizer,
  beneficiary,
}: DeriveFundPathArgs): string {
  const buf = Buffer.concat([
    Buffer.from(name),
    encodeAddress(beneficiary),
    encodeAddress(organizer),
    Buffer.from(goal),
    Buffer.from(deadlineTimestamp.toString(16)),
  ]);
  return new TextDecoder().decode(blake2b(buf));
}

export function deriveFundSubContractId(
  args: DeriveFundPathArgs,
  doneraContractId: string
): string {
  return subContractId(doneraContractId, deriveFundSubContractPath(args), 0);
}
