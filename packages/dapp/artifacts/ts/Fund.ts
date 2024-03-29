/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as FundContractJson } from "../Fund.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace FundTypes {
  export type Fields = {
    selfName: HexString;
    selfDescription: HexString;
    selfBeneficiary: Address;
    selfOrganizer: Address;
    selfGoal: bigint;
    selfDeadline: bigint;
    selfOwner: Address;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getName: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getDescription: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getGoal: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getBeneficiary: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getOrganizer: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<FundInstance, FundTypes.Fields> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as FundTypes.Fields;
  }

  consts = {
    OwnedError: { Forbidden: BigInt(90) },
    FundError: { FundInProgress: BigInt(50) },
  };

  at(address: string): FundInstance {
    return new FundInstance(address);
  }

  tests = {
    donate: async (
      params: TestContractParams<
        FundTypes.Fields,
        { donor: Address; tokenId: HexString; amount: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "donate", params);
    },
    finalize: async (
      params: Omit<TestContractParams<FundTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "finalize", params);
    },
    assertOwner: async (
      params: TestContractParams<FundTypes.Fields, { caller: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertOwner", params);
    },
    setOwner: async (
      params: TestContractParams<FundTypes.Fields, { newOwner: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setOwner", params);
    },
    getName: async (
      params: Omit<TestContractParams<FundTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getName", params);
    },
    getDescription: async (
      params: Omit<TestContractParams<FundTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getDescription", params);
    },
    getGoal: async (
      params: Omit<TestContractParams<FundTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getGoal", params);
    },
    getBeneficiary: async (
      params: Omit<TestContractParams<FundTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getBeneficiary", params);
    },
    getOrganizer: async (
      params: Omit<TestContractParams<FundTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getOrganizer", params);
    },
  };
}

// Use this object to test and deploy the contract
export const Fund = new Factory(
  Contract.fromJson(
    FundContractJson,
    "",
    "d029c5f32519bc4a1639873afb0be1eb619a6bccd76846e5da6347e55bc25e63"
  )
);

// Use this class to interact with the blockchain
export class FundInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<FundTypes.State> {
    return fetchContractState(Fund, this);
  }

  methods = {
    getName: async (
      params?: FundTypes.CallMethodParams<"getName">
    ): Promise<FundTypes.CallMethodResult<"getName">> => {
      return callMethod(
        Fund,
        this,
        "getName",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getDescription: async (
      params?: FundTypes.CallMethodParams<"getDescription">
    ): Promise<FundTypes.CallMethodResult<"getDescription">> => {
      return callMethod(
        Fund,
        this,
        "getDescription",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getGoal: async (
      params?: FundTypes.CallMethodParams<"getGoal">
    ): Promise<FundTypes.CallMethodResult<"getGoal">> => {
      return callMethod(
        Fund,
        this,
        "getGoal",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBeneficiary: async (
      params?: FundTypes.CallMethodParams<"getBeneficiary">
    ): Promise<FundTypes.CallMethodResult<"getBeneficiary">> => {
      return callMethod(
        Fund,
        this,
        "getBeneficiary",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getOrganizer: async (
      params?: FundTypes.CallMethodParams<"getOrganizer">
    ): Promise<FundTypes.CallMethodResult<"getOrganizer">> => {
      return callMethod(
        Fund,
        this,
        "getOrganizer",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends FundTypes.MultiCallParams>(
    calls: Calls
  ): Promise<FundTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      Fund,
      this,
      calls,
      getContractByCodeHash
    )) as FundTypes.MultiCallResults<Calls>;
  }
}
