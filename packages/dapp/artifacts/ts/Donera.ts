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
import { default as DoneraContractJson } from "../Donera.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace DoneraTypes {
  export type Fields = {
    selfFundTemplateId: HexString;
    selfAttoListingFee: bigint;
    selfOwner: Address;
  };

  export type State = ContractState<Fields>;

  export type FundListedEvent = ContractEvent<{
    name: HexString;
    description: HexString;
    beneficiary: Address;
    organizer: Address;
    goal: bigint;
    deadlineTimestamp: bigint;
    fundContractId: HexString;
  }>;
  export type DonationEvent = ContractEvent<{
    tokenId: HexString;
    amount: bigint;
    donor: Address;
    fundContractId: HexString;
  }>;
  export type FundFinalizedEvent = ContractEvent<{ contractId: HexString }>;

  export interface CallMethodTable {
    getAttoListingFee: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
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

class Factory extends ContractFactory<DoneraInstance, DoneraTypes.Fields> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as DoneraTypes.Fields;
  }

  eventIndex = { FundListed: 0, Donation: 1, FundFinalized: 2 };
  consts = {
    DoneraError: { Forbidden: BigInt(0) },
    OwnedError: { Forbidden: BigInt(90) },
  };

  at(address: string): DoneraInstance {
    return new DoneraInstance(address);
  }

  tests = {
    assertOwner: async (
      params: TestContractParams<DoneraTypes.Fields, { caller: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertOwner", params);
    },
    setOwner: async (
      params: TestContractParams<DoneraTypes.Fields, { newOwner: Address }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setOwner", params);
    },
    createFund: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        {
          name: HexString;
          description: HexString;
          beneficiary: Address;
          goal: bigint;
          deadlineTimestamp: bigint;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "createFund", params);
    },
    donateToFund: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        { fundContractId: HexString; tokenId: HexString; amount: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "donateToFund", params);
    },
    finalizeFund: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        { fundContractId: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "finalizeFund", params);
    },
    withdraw: async (
      params: TestContractParams<DoneraTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "withdraw", params);
    },
    setSelfFundTemplateId: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        { newFundTemplateId: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setSelfFundTemplateId", params);
    },
    getAttoListingFee: async (
      params: Omit<TestContractParams<DoneraTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getAttoListingFee", params);
    },
    setSelfAttoListingFee: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        { newAttoListingFee: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setSelfAttoListingFee", params);
    },
  };
}

// Use this object to test and deploy the contract
export const Donera = new Factory(
  Contract.fromJson(
    DoneraContractJson,
    "",
    "95d645d0a244eac9a552d34c48c31125d2d0882e0a4e814b7c628c363b5276a4"
  )
);

// Use this class to interact with the blockchain
export class DoneraInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<DoneraTypes.State> {
    return fetchContractState(Donera, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeFundListedEvent(
    options: EventSubscribeOptions<DoneraTypes.FundListedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      Donera.contract,
      this,
      options,
      "FundListed",
      fromCount
    );
  }

  subscribeDonationEvent(
    options: EventSubscribeOptions<DoneraTypes.DonationEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      Donera.contract,
      this,
      options,
      "Donation",
      fromCount
    );
  }

  subscribeFundFinalizedEvent(
    options: EventSubscribeOptions<DoneraTypes.FundFinalizedEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      Donera.contract,
      this,
      options,
      "FundFinalized",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | DoneraTypes.FundListedEvent
      | DoneraTypes.DonationEvent
      | DoneraTypes.FundFinalizedEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(Donera.contract, this, options, fromCount);
  }

  methods = {
    getAttoListingFee: async (
      params?: DoneraTypes.CallMethodParams<"getAttoListingFee">
    ): Promise<DoneraTypes.CallMethodResult<"getAttoListingFee">> => {
      return callMethod(
        Donera,
        this,
        "getAttoListingFee",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends DoneraTypes.MultiCallParams>(
    calls: Calls
  ): Promise<DoneraTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      Donera,
      this,
      calls,
      getContractByCodeHash
    )) as DoneraTypes.MultiCallResults<Calls>;
  }
}
