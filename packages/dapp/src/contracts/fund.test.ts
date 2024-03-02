import { describe, it, beforeAll, expect } from "bun:test";
import { randomContractAddress, testAddress } from "@alephium/web3-test";
import { expectAssertionError, prepareForTests } from "./test-utils";
import { Fund, deriveFundSubContractId } from "./fund";
import {
  ALPH_TOKEN_ID,
  ONE_ALPH,
  binToHex,
  convertAlphAmountWithDecimals,
  encodeAddress,
  encodeByteVec,
  encodeScriptFieldAsString,
  toApiByteVec,
} from "@alephium/web3";
import { stringToHex } from "@donera/core";
import { bytesToHex } from "@noble/hashes/utils";

describe("Fund", () => {
  beforeAll(async () => {
    await prepareForTests();
  });
  describe("donate()", () => {
    it("should fail when called by an address that isn't donera", async () => {
      const address = randomContractAddress();
      const call = () =>
        Fund.tests.donate({
          address,
          initialFields: {
            ...Fund.getInitialFieldsWithDefaultValues(),
            selfOwner: randomContractAddress(),
          },
          testArgs: { donor: testAddress, tokenId: ALPH_TOKEN_ID, amount: ONE_ALPH },
          inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
        });
      await expectAssertionError(call, address, Fund.consts.OwnedError.Forbidden);
    });
    it("should transfer the expected tokens to self", async () => {
      const address = randomContractAddress();
      const initialAlph = ONE_ALPH;
      const donatedAlph = ONE_ALPH * 5n;
      const result = await Fund.tests.donate({
        address,
        initialAsset: { alphAmount: initialAlph },
        initialFields: {
          ...Fund.getInitialFieldsWithDefaultValues(),
          selfOwner: testAddress,
        },
        testArgs: { donor: testAddress, tokenId: ALPH_TOKEN_ID, amount: donatedAlph },
        inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
      });
      const contract = result.contracts.find((c) => c.address === address);
      expect(contract!.asset.alphAmount).toBe(initialAlph + donatedAlph);
    });
  });
  describe("finalize()", () => {
    it("should fail when called by an address that isn't donera", async () => {
      const address = randomContractAddress();
      const call = () =>
        Fund.tests.finalize({
          address,
          initialFields: {
            ...Fund.getInitialFieldsWithDefaultValues(),
            selfOwner: randomContractAddress(),
          },
          inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
        });
      await expectAssertionError(call, address, Fund.consts.OwnedError.Forbidden);
    });
    it("should fail if fund raising is still in progress", async () => {
      const address = randomContractAddress();
      const call = () =>
        Fund.tests.finalize({
          address,
          blockTimeStamp: 5,
          initialFields: {
            ...Fund.getInitialFieldsWithDefaultValues(),
            selfDeadline: 6n,
            selfOwner: testAddress,
          },
          inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
        });
      await expectAssertionError(call, address, Fund.consts.FundError.FundInProgress);
    });
    // currently throwing an error about a contract not existing
    it.todo("should transfer assets to recipient", async () => {
      const address = randomContractAddress();
      const result = await Fund.tests.finalize({
        address,
        blockTimeStamp: 7,
        initialAsset: { alphAmount: ONE_ALPH },
        initialFields: {
          ...Fund.getInitialFieldsWithDefaultValues(),
          selfBeneficiary: testAddress,
          selfDeadline: 6n,
          selfOwner: testAddress,
        },
        inputAssets: [{ address: testAddress, asset: { alphAmount: ONE_ALPH * 200n } }],
        callerAddress: testAddress,
      });
      console.log(result);
    });
  });
});

describe("derviveFundSubContractId()", () => {
  it("should produce the expected subcontract id using the provided fields", () => {
    // toByteVec! = "00fdfd5f37fd45fdfd6cb33128fd42fd78fd0f04012a2cfd24fdfdfdfd0a"
    // encodeToByteVec! = "010400fdfd5f37fd45fdfd6cb33128fd42fd78fd0f04012a2cfd24fdfdfdfd0a"
    const expectAddr = "010400fdfd5f37fd45fdfd6cb33128fd42fd78fd0f04012a2cfd24fdfdfdfd0a";

    const val = encodeAddress(testAddress);
    const addrStr = new TextDecoder().decode(val);
    const addrHex = binToHex(val);
    const vec = encodeByteVec(addrHex);
    const vecHex = binToHex(vec);
    expect(vecHex).toEqual(expectAddr);
    // console.log(expectAddr.length);
    // console[log(encoded.length);
    // expect(actual).toEqual(expectAddr);
    // const expectedSubContractId =
    //   "9cd408150fdb99ddf9b0f67751eb10286db305e358c05a172de8014be8b37300";
    // const actualSubContractId = deriveFundSubContractId(
    //   {
    //     name: stringToHex("test"),
    //     beneficiary: testAddress,
    //     organizer: testAddress,
    //     deadlineTimestamp: 5,
    //     goal: "500000000000000000000",
    //   },
    //   "27ohG7wP2kAN3T8zZBxGttVEkSSzfGLaXJFftuLffg2Sy"
    // );
    //
    // expect(actualSubContractId).toEqual(expectedSubContractId);
  });
});

//encodeToByteVec!(ByteVec, Address, Address, U256))
