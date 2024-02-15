// VERY rough end-to-end test for fund creation -> donation -> fund finalization
import { describe, it } from "bun:test";
import { testNodeWallet } from "@alephium/web3-test";
import { CreateFund, DonateToFund, FinalizeFund } from "../../src/scripts";
import { Donera, DoneraTypes } from "../../src/contracts/donera";
import { loadDeployments } from "../../artifacts/ts/deployments";
import {
  ONE_ALPH,
  stringToHex,
  web3,
  Contract,
  Project,
  addressFromContractId,
  convertAlphAmountWithDecimals,
  SignerProvider,
  ALPH_TOKEN_ID,
} from "@alephium/web3";

describe("end-to-end Donera", () => {
  it("should create, donte & finalize funds", async () => {
    web3.setCurrentNodeProvider("http://127.0.0.1:22973");
    await Project.build();
    const signer = (await testNodeWallet()) as unknown as SignerProvider;
    const account = await signer.getSelectedAccount();
    const deploys = loadDeployments("devnet");
    const donera = deploys.contracts.Donera.contractInstance.contractId;
    const listingFeeCall =
      await deploys.contracts.Donera.contractInstance.methods.getAttoListingFee();
    console.log(`Donera address: ${deploys.contracts.Donera.contractInstance.address}`);
    const result = await CreateFund.execute(signer as unknown as SignerProvider, {
      initialFields: {
        donera,
        name: stringToHex("test fund14"),
        description: stringToHex("testing a fund raiser"),
        recipient: account.address,
        goal: 1n,
        deadlineTimestamp: 5n,
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH,
    });
    console.log(`create fund txid: ${result.txId}`);
    const node = web3.getCurrentNodeProvider();
    const events = await node.events.getEventsTxIdTxid(result.txId);
    const fundCreatedEvent = events.events.find(
      (e) => e.eventIndex === Donera.eventIndex.FundListed
    );
    if (!fundCreatedEvent) {
      console.error(events);
      throw new Error("Couldn't find a fund created event");
    }
    const parsedEvent = Contract.fromApiEvent(
      fundCreatedEvent,
      Donera.contract.codeHash,
      result.txId
    ) as DoneraTypes.FundListedEvent;
    console.log(parsedEvent.fields);
    console.log(parsedEvent.fields.fundContractId);
    // DONATE TO FUND
    console.log(`donating to address: ${addressFromContractId(parsedEvent.fields.fundContractId)}`);
    const donateAmount = convertAlphAmountWithDecimals(3)!;
    const donateResult = await DonateToFund.execute(signer, {
      initialFields: {
        donera,
        fundContractId: parsedEvent.fields.fundContractId,
        tokenId: ALPH_TOKEN_ID,
        amount: donateAmount,
      },
      attoAlphAmount: donateAmount,
    });
    console.log(`donate tx id: ${donateResult.txId}`);
    const donateEvents = await node.events.getEventsTxIdTxid(donateResult.txId);
    const donationEvent = donateEvents.events.find(
      (e) => e.eventIndex === Donera.eventIndex.Donation
    );
    if (!donationEvent) {
      console.error(donateEvents);
      throw new Error("couldnt find donation event");
    }
    const donEvent = Contract.fromApiEvent(
      donationEvent,
      Donera.contract.codeHash,
      result.txId
    ) as DoneraTypes.DonationEvent;
    console.log(donEvent);
    // FINALIZE FUND
    const finalizeResult = await FinalizeFund.execute(signer, {
      initialFields: {
        donera,
        fundContractId: parsedEvent.fields.fundContractId,
      },
    });
    console.log(`finalize fund tx id: ${finalizeResult.txId}`);
  });
});
