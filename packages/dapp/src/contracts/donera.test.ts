import { describe, it, beforeAll, expect } from "bun:test";
import { randomContractAddress, testAddress } from "@alephium/web3-test";
import { expectAssertionError, prepareForTests } from "./test-utils";
import { Donera, deriveFundContractPath } from "./donera";
import {
  ALPH_TOKEN_ID,
  ONE_ALPH,
  convertAlphAmountWithDecimals,
  stringToHex,
} from "@alephium/web3";
import { Fund } from "./fund";

const THREE_MONTHS = 7889229n;
const ONE_DAY = 86400n;

describe("Donera", () => {
  beforeAll(async () => {
    await prepareForTests();
  });
  describe("deriveFundPath", () => {
    it("should produce matching fund subcontract paths", async () => {
      const args = {
        metadataUrl: stringToHex("ipfs://klmasdfxvxcvalksdf"),
        beneficiary: testAddress,
        organizer: testAddress,
        deadlineTimestamp: 10000000n,
        goal: convertAlphAmountWithDecimals(500)!,
      };
      const { returns } = await Donera.tests.deriveFundPath({
        initialFields: {
          ...Donera.getInitialFieldsWithDefaultValues(),
        },
        testArgs: {
          ...args,
        },
      });
      expect(returns).toBe(deriveFundContractPath(args));
    });
  });
  describe("createFund", () => {
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
          selfListingFee: listingFee,
          selfFundTemplateId: fundTemplate.contractId,
        },
        testArgs: {
          metadataUrl: stringToHex("ipfs://klmasdfxvxcvalksdf"),
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
          selfListingFee: convertAlphAmountWithDecimals(1)!,
          selfFundTemplateId: fundTemplate.contractId,
        },
        testArgs: {
          metadataUrl: stringToHex("ipfs://klmasdfxvxcvalksdf"),
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
    it("should raise exception if deadline is invalid", async () => {
      const fundTemplate = Fund.stateForTest(Fund.getInitialFieldsWithDefaultValues());
      const doneraAddress = randomContractAddress();
      const call = () =>
        Donera.tests.createFund({
          address: doneraAddress,
          blockTimeStamp: 0,
          initialFields: {
            ...Donera.getInitialFieldsWithDefaultValues(),
            selfDeadlineLimit: THREE_MONTHS,
            selfListingFee: convertAlphAmountWithDecimals(1)!,
            selfFundTemplateId: fundTemplate.contractId,
          },
          testArgs: {
            metadataUrl: stringToHex("ipfs://klmasdfxvxcvalksdf"),
            beneficiary: testAddress,
            deadlineTimestamp: THREE_MONTHS + ONE_DAY,
            goal: convertAlphAmountWithDecimals(500)!,
          },
          inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
          existingContracts: [fundTemplate],
        });
      await expectAssertionError(call, doneraAddress, Donera.consts.DoneraError.InvalidDeadline);
    });
    it("should succeed if deadline is within deadline limit", async () => {
      const fundTemplate = Fund.stateForTest(Fund.getInitialFieldsWithDefaultValues());
      const doneraAddress = randomContractAddress();
      const call = () =>
        Donera.tests.createFund({
          address: doneraAddress,
          blockTimeStamp: 0,
          initialFields: {
            ...Donera.getInitialFieldsWithDefaultValues(),
            selfDeadlineLimit: THREE_MONTHS,
            selfListingFee: convertAlphAmountWithDecimals(1)!,
            selfFundTemplateId: fundTemplate.contractId,
          },
          testArgs: {
            metadataUrl: stringToHex("ipfs://klmasdfxvxcvalksdf"),
            beneficiary: testAddress,
            deadlineTimestamp: THREE_MONTHS - ONE_DAY,
            goal: convertAlphAmountWithDecimals(500)!,
          },
          inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
          existingContracts: [fundTemplate],
        });
      expect(call()).resolves.toBeDefined();
    });
  });
  describe("donateToFund", () => {
    it("should pay donation fee to donera", async () => {
      const doneraAddress = randomContractAddress();
      const fund = Fund.stateForTest({
        ...Fund.getInitialFieldsWithDefaultValues(),
        selfOwner: doneraAddress,
      });
      const initialAlph = ONE_ALPH;
      const donationFee = ONE_ALPH * 5n;
      const donateAmount = convertAlphAmountWithDecimals(5)!;
      const result = await Donera.tests.donateToFund({
        address: doneraAddress,
        initialAsset: { alphAmount: initialAlph },
        initialFields: {
          ...Donera.getInitialFieldsWithDefaultValues(),
          selfDonationFee: donationFee,
        },
        testArgs: {
          fundContractId: fund.contractId,
          tokenId: ALPH_TOKEN_ID,
          amount: donateAmount,
        },
        inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 20n } }],
        existingContracts: [fund],
      });
      const contract = result.contracts.find((c) => c.address === doneraAddress)!;
      expect(contract.asset.alphAmount).toBe(initialAlph + donationFee);
    });
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
