import {
  binToHex,
  encodeU256,
  encodeVmAddress,
  encodeVmByteVec,
  encodeVmU256,
} from "@alephium/web3";
import { blake2b } from "@noble/hashes/blake2b";

export * from "../../artifacts/ts/Donera";

export type DeriveFundPathParam = {
  // hex formatted
  metadataUrl: string;
  organizer: string;
  beneficiary: string;
  goal: bigint;
  deadlineTimestamp: bigint;
};

/** Calculate the path used for the fund subcontract */
export function deriveFundContractPath({
  metadataUrl,
  beneficiary,
  deadlineTimestamp,
  goal,
  organizer,
}: DeriveFundPathParam): string {
  const buf = Buffer.concat([
    encodeU256(5n),
    encodeVmByteVec(metadataUrl),
    encodeVmAddress(beneficiary),
    encodeVmAddress(organizer),
    encodeVmU256(goal),
    encodeVmU256(deadlineTimestamp),
  ]);
  return binToHex(blake2b(buf, { dkLen: 32 }));
}
