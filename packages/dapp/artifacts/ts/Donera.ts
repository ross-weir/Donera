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
    selfListingFee: bigint;
    selfDonationFee: bigint;
    selfDeadlineLimit: bigint;
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
  export type FundFinalizedEvent = ContractEvent<{
    finalizer: Address;
    fundContractId: HexString;
  }>;

  export interface CallMethodTable {
    getListingFee: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getDonationFee: {
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
    DoneraError: { InvalidDeadline: BigInt(0) },
    OwnedError: { Forbidden: BigInt(90) },
  };

  at(address: string): DoneraInstance {
    return new DoneraInstance(address);
  }

  tests = {
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
    upgrade: async (
      params: TestContractParams<DoneraTypes.Fields, { newCode: HexString }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "upgrade", params);
    },
    upgradeWithFields: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        {
          newCode: HexString;
          newImmFieldsEncoded: HexString;
          newMutFieldsEncoded: HexString;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "upgradeWithFields", params);
    },
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
    deriveFundPath: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        {
          name: HexString;
          beneficiary: Address;
          organizer: Address;
          goal: bigint;
          deadlineTimestamp: bigint;
        }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "deriveFundPath", params);
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
    getListingFee: async (
      params: Omit<TestContractParams<DoneraTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getListingFee", params);
    },
    setListingFee: async (
      params: TestContractParams<DoneraTypes.Fields, { newListingFee: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setListingFee", params);
    },
    getDonationFee: async (
      params: Omit<TestContractParams<DoneraTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getDonationFee", params);
    },
    setDonationFee: async (
      params: TestContractParams<DoneraTypes.Fields, { newDonationFee: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setDonationFee", params);
    },
    setSelfDeadlineLimit: async (
      params: TestContractParams<
        DoneraTypes.Fields,
        { newDeadlineLimit: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setSelfDeadlineLimit", params);
    },
  };
}

// Use this object to test and deploy the contract
export const Donera = new Factory(
  Contract.fromJson(
    DoneraContractJson,
    "=5+14c41e842=1-1+1420d421d4233424=2-1+2=3-1+2a242=1-1+f=1-1+2=1-1+8=1-1+2c542=1-1+e=1-1+2=1-1+b=1+2e8=1-1=1-1+0=1+05=2+00=1-1+03b=1-2+600=1+60=1-2=1-1+60316047=1+05=1-1+02d6=1-2+72656=1+7=1-1+65=1-1+67=1-1+6e6=1+3a207b0a20202020202073706=1+6e3a206=1+6=1+7472792c=1+a2020202020206e6=1+6d653a2=2+52c=1+a202020202020626=1+6e65666963696172793a200e2c=2+202=1+202=1+2020676f616c3a201b2c0a2020202020206=1+6561646c696e6554696d657374616d7=2+a=1+0060a202020207d=65+67e02402e63726561746546756e643a207b7370616e3a20737562436f6e7472616374506174682c2070617468486173683a20017d160=91+16097e02402863726561746546756e643a207b7370616e3a2066756e64437265617465642c2066756e6449643a20017d=43-1+c1600160116027e044039646f6e617465546f46756e643a207b0a2020202020207370616e3a20656e7472792c0a20202020202066756e64436f6e747261637449643a20112c0a202020202020746f6b656e49643a20102c0a202020202020616d6f756e743a20060a202020207d=279-1+d=30+16057e02402e64657269766546756e64506174683a207b7370616e3a20656e636f64696e672c2070617468456e636f6465643a20017d=176",
    "90eb7417765958cdbc0c83f4d5daf1330244b1ef0dcd9c26437455de81e55af0"
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
    getListingFee: async (
      params?: DoneraTypes.CallMethodParams<"getListingFee">
    ): Promise<DoneraTypes.CallMethodResult<"getListingFee">> => {
      return callMethod(
        Donera,
        this,
        "getListingFee",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getDonationFee: async (
      params?: DoneraTypes.CallMethodParams<"getDonationFee">
    ): Promise<DoneraTypes.CallMethodResult<"getDonationFee">> => {
      return callMethod(
        Donera,
        this,
        "getDonationFee",
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
