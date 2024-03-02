import { ALPH_TOKEN_ID, ZERO_ADDRESS } from "@alephium/web3";

// In frontend apps its easiest to deal with fees in strings instead of bigints to avoid issues associated
// with serialization/network requests.
export type UiFee = {
  uiDev: string;
  uiFeeToken: string;
  uiFee: string;
};

export type UiFeeOnchain = {
  uiDev: string;
  uiFeeToken: string;
  uiFee: bigint;
};

export function convertUiFeeToOnchain({ uiFee, ...rest }: UiFee): UiFeeOnchain {
  return { ...rest, uiFee: BigInt(uiFee) };
}

export const NO_UI_FEE: Readonly<UiFeeOnchain> = Object.freeze({
  uiDev: ZERO_ADDRESS,
  uiFeeToken: ALPH_TOKEN_ID,
  uiFee: BigInt(0),
});
