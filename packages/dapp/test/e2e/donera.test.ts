import { describe, it, beforeAll, expect } from "bun:test";
import { testAddress, testNodeWallet } from "@alephium/web3-test";
import { web3, Project, ALPH_TOKEN_ID, addressFromContractId, stringToHex } from "@alephium/web3";
import { DoneraDapp } from "../../src/donera";
import { Fund } from "../../src/contracts/fund";

function generateRandomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateMetadataUrl() {
  return `ipfs://${generateRandomString(10)}`;
}

describe("end-to-end Donera", () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider("http://127.0.0.1:22973");
    await Project.build();
  });
  it("should create, donate and finalize fund", async () => {
    const signer = await testNodeWallet();
    const donera = DoneraDapp.forNetwork("devnet");
    console.log(`Donera instance: ${donera.doneraInstance.address}`);

    const metadataUrl = generateMetadataUrl();
    const fundParams = {
      metadataUrl,
      goal: 50,
      deadline: new Date(),
      beneficiary: testAddress,
    };

    const newFund = await donera.createFund(signer, fundParams);
    console.log("Fund created");
    console.table(newFund);

    // confirms the way we manually derive fundContractId matches what happened onchain
    const fund = Fund.at(addressFromContractId(newFund.fundContractId));
    const state = await fund.fetchState();
    const { selfMetadataUrl, selfOwner } = state.fields;

    expect(selfMetadataUrl).toEqual(stringToHex(metadataUrl));
    expect(selfOwner).toEqual(donera.doneraInstance.address);

    const donateResult = await donera.donateToFund(signer, {
      fundContractId: newFund.fundContractId,
      tokenId: ALPH_TOKEN_ID,
      amount: 5,
    });
    console.log("Donation made");
    console.table(donateResult);

    const finalizeResult = await donera.finalizeFund(signer, {
      fundContractId: newFund.fundContractId,
    });
    console.log("Fund finalized");
    console.table(finalizeResult);
  });
});
