/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { default as CreateFundScriptJson } from "../CreateFund.ral.json";
import { default as DonateToFundScriptJson } from "../DonateToFund.ral.json";
import { default as FinalizeFundScriptJson } from "../FinalizeFund.ral.json";
import { default as SetListingFeeScriptJson } from "../SetListingFee.ral.json";

export const CreateFund = new ExecutableScript<{
  donera: HexString;
  uiDev: Address;
  uiFeeToken: HexString;
  uiFee: bigint;
  metadataUrl: HexString;
  beneficiary: Address;
  goal: bigint;
  deadlineTimestamp: bigint;
}>(Script.fromJson(CreateFundScriptJson, ""));

export const DonateToFund = new ExecutableScript<{
  donera: HexString;
  uiDev: Address;
  uiFeeToken: HexString;
  uiFee: bigint;
  fundContractId: HexString;
  tokenId: HexString;
  amount: bigint;
}>(Script.fromJson(DonateToFundScriptJson, ""));

export const FinalizeFund = new ExecutableScript<{
  donera: HexString;
  uiDev: Address;
  uiFeeToken: HexString;
  uiFee: bigint;
  fundContractId: HexString;
}>(Script.fromJson(FinalizeFundScriptJson, ""));

export const SetListingFee = new ExecutableScript<{
  donera: HexString;
  newListingFee: bigint;
}>(Script.fromJson(SetListingFeeScriptJson, ""));
