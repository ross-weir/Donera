import { describe, it, beforeAll, expect } from "bun:test";
import { randomContractAddress, testAddress } from "@alephium/web3-test";
import { expectAssertionError, prepareForTests } from "./test-utils";
import { Donera } from "./donera";
import {
  ALPH_TOKEN_ID,
  ONE_ALPH,
  binToHex,
  convertAlphAmountWithDecimals,
  encodeAddress,
  encodeByteVec,
  encodeU256,
  hexToString,
  stringToHex,
} from "@alephium/web3";
import { Fund } from "./fund";
import { bytesToHex } from "@noble/hashes/utils";

const THREE_MONTHS = 7889229n;
const ONE_DAY = 86400n;

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
    it("msg", async () => {
      const fundTemplate = Fund.stateForTest(Fund.getInitialFieldsWithDefaultValues());
      const doneraAddress = randomContractAddress();
      console.log(`donera address ${doneraAddress}`);
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
      const msg = result.debugMessages[0].message;
      const buf = Buffer.from(msg, "binary");
      const hex = binToHex(buf);
      //010400fdfd5f37fd45fdfd6cb33128fd42fd78fd0f04012a2cfd24fdfdfdfd0a
      console.log(hex);
      const addressBytes = encodeAddress("1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH");
      const addressVec = encodeByteVec(binToHex(addressBytes));
      const actual = Buffer.concat([encodeU256(1n), addressVec]);
      const actualHex = binToHex(actual);
      console.log(actualHex);
    });
    it("should emit a fund listed event", async () => {
      const fundTemplate = Fund.stateForTest(Fund.getInitialFieldsWithDefaultValues());
      const doneraAddress = randomContractAddress();
      console.log(`donera address ${doneraAddress}`);
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
      console.log(`debug msg count: ${result.debugMessages.length}`);
      const msg = result.debugMessages[0].message;
      const buf = Buffer.from(msg, "binary");
      console.log(buf.length);
      const hex = binToHex(buf);
      console.log(hex);

      //  {
      //   name: "74657374",
      //   beneficiary: "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH",
      //   organizer: "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH",
      //   goal: 500000000000000000000n,
      //   deadlineTimestamp: 5n,
      //   fundContractId: "9cd408150fdb99ddf9b0f67751eb10286db305e358c05a172de8014be8b37300",
      // }     // 27ohG7wP2kAN3T8zZBxGttVEkSSzfGLaXJFftuLffg2Sy
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
            selfAttoListingFee: convertAlphAmountWithDecimals(1)!,
            selfFundTemplateId: fundTemplate.contractId,
          },
          testArgs: {
            name: stringToHex("test"),
            description: stringToHex("testing description"),
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
            selfAttoListingFee: convertAlphAmountWithDecimals(1)!,
            selfFundTemplateId: fundTemplate.contractId,
          },
          testArgs: {
            name: stringToHex("test"),
            description: stringToHex("testing description"),
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
