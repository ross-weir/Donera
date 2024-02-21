import { describe, it, beforeAll, expect } from "bun:test";
import { randomContractAddress, testAddress } from "@alephium/web3-test";
import { expectAssertionError, prepareForTests } from "./test-utils";
import { Fund } from "./fund";
import { ALPH_TOKEN_ID, ONE_ALPH } from "@alephium/web3";

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
