import { describe, it } from "bun:test";
import { testAddress, testNodeWallet } from "@alephium/web3-test";
import { web3, Project, ALPH_TOKEN_ID } from "@alephium/web3";
import { DoneraDapp } from "../../src/donera";

describe("end-to-end Donera", () => {
  it("should do end to end flow", async () => {
    web3.setCurrentNodeProvider("http://127.0.0.1:22973");
    await Project.build();
    const signer = await testNodeWallet();
    const donera = DoneraDapp.forNetwork("devnet");
    console.log(`Donera instance: ${donera.doneraInstance.address}`);

    const newFund = await donera.createFund(signer, {
      name: "end-to-end-fundraiser",
      description: "console.log('hello world')",
      goal: 50,
      deadline: new Date(),
      beneficiary: testAddress,
    });
    console.log("Fund created");
    console.table(newFund);

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
