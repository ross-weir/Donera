import { describe, it, beforeAll, expect } from "bun:test";
import { randomContractAddress, testAddress } from "@alephium/web3-test";
import { prepareForTests } from "./utils.test";
import { Donera } from "./donera";
import {
  ALPH_TOKEN_ID,
  ONE_ALPH,
  convertAlphAmountWithDecimals,
  stringToHex,
} from "@alephium/web3";
import { Fund } from "./fund";

describe("Donera", () => {
  beforeAll(async () => {
    await prepareForTests();
  });
  describe("createFund()", () => {
    it("should pay listing fee to donera", async () => {
      const fundTemplate = Fund.stateForTest(Fund.getInitialFieldsWithDefaultValues());
      const doneraAddress = randomContractAddress();
      const initialAlph = ONE_ALPH;
      const listingFee = ONE_ALPH * 5n;
      const result = await Donera.tests.createFund({
        address: doneraAddress,
        initialAsset: { alphAmount: initialAlph },
        initialFields: {
          ...Donera.getInitialFieldsWithDefaultValues(),
          selfAttoListingFee: listingFee,
          selfFundTemplateId: fundTemplate.contractId,
        },
        testArgs: {
          name: stringToHex("test"),
          description: stringToHex("testing description"),
          beneficiary: testAddress,
          deadlineTimestamp: 5n,
          goal: convertAlphAmountWithDecimals(500)!,
        },
        inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 20n } }],
        existingContracts: [fundTemplate],
      });
      const contract = result.contracts.find((c) => c.address === doneraAddress)!;
      expect(contract.asset.alphAmount).toBe(initialAlph + listingFee);
    });
    it("should emit a fund listed event", async () => {
      const fundTemplate = Fund.stateForTest(Fund.getInitialFieldsWithDefaultValues());
      const doneraAddress = randomContractAddress();
      const result = await Donera.tests.createFund({
        address: doneraAddress,
        initialFields: {
          ...Donera.getInitialFieldsWithDefaultValues(),
          selfAttoListingFee: convertAlphAmountWithDecimals(1)!,
          selfFundTemplateId: fundTemplate.contractId,
        },
        testArgs: {
          name: stringToHex("test"),
          description: stringToHex("testing description"),
          beneficiary: testAddress,
          deadlineTimestamp: 5n,
          goal: convertAlphAmountWithDecimals(500)!,
        },
        inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
        existingContracts: [fundTemplate],
      });
      const event = result.events.find(
        (e) => e.contractAddress === doneraAddress && e.eventIndex === Donera.eventIndex.FundListed
      );
      expect(event).toBeDefined();
      // TODO: assert field values
    });
  });
  describe("donateToFund())", () => {
    it("should emit a donation event", async () => {
      const doneraAddress = randomContractAddress();
      const fund = Fund.stateForTest({
        ...Fund.getInitialFieldsWithDefaultValues(),
        selfOwner: doneraAddress,
      });
      const result = await Donera.tests.donateToFund({
        address: doneraAddress,
        initialFields: Donera.getInitialFieldsWithDefaultValues(),
        inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
        existingContracts: [fund],
        testArgs: {
          fundContractId: fund.contractId,
          tokenId: ALPH_TOKEN_ID,
          amount: convertAlphAmountWithDecimals(5)!,
        },
      });
      const event = result.events.find(
        (e) => e.contractAddress === doneraAddress && e.eventIndex === Donera.eventIndex.Donation
      );
      expect(event).toBeDefined();
      // TODO: assert event fields
    });
  });
});
