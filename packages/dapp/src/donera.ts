import {
  NetworkId,
  ONE_ALPH,
  SignerProvider,
  web3,
  Contract,
  convertAlphAmountWithDecimals,
  ContractFactory,
  ContractInstance,
  convertAmountWithDecimals,
  ALPH_TOKEN_ID,
} from "@alephium/web3";
import { ALPH, TokenInfo } from "@alephium/token-list";
import { Donera, DoneraInstance, DoneraTypes } from "./contracts/donera";
import { Deployments, loadDeployments } from "./deploys";
import { CreateFund, DonateToFund } from "./scripts";
import { getTokensForNetwork } from "./tokens";
import { stringToHex } from "@donera/core";
import { NO_UI_FEE, UiFee, UiFeeOnchain, convertUiFeeToOnchain } from "./fees";
import retry from "retry";

export type CreateFundParam = {
  name: string;
  description: string;
  goal: number | string;
  deadline: Date;
  beneficiary: string;
};

export type CreateFundResult = {
  txId: string;
  fundContractId: string;
  name: string;
  description: string;
  goal: string;
  deadline: Date;
  beneficiary: string;
  organizer: string;
};

export type DonateToFundParam = {
  fundContractId: string;
  tokenId: string;
  amount: number | string;
};

export type DonateToFundResult = {
  txId: string;
};

export class DoneraDapp {
  private readonly uiFee: UiFeeOnchain;
  private readonly tokens: TokenInfo[];
  private readonly deploys: Deployments;

  constructor(networkId: NetworkId, deploys: Deployments, uiFee?: UiFee) {
    this.uiFee = uiFee ? convertUiFeeToOnchain(uiFee) : NO_UI_FEE;
    this.tokens = getTokensForNetwork(networkId);
    this.deploys = deploys;
  }

  static forNetwork(network: NetworkId, uiFee?: UiFee): DoneraDapp {
    return new DoneraDapp(network, loadDeployments(network), uiFee);
  }

  public async createFund(
    signer: SignerProvider,
    params: CreateFundParam
  ): Promise<CreateFundResult> {
    const deadlineUnixTs = Math.floor(params.deadline.getTime() / 1000);
    const listingFeeCall = await this.doneraInstance.methods.getAttoListingFee();
    const attoGoal = convertAlphAmountWithDecimals(params.goal)!;
    const { txId } = await CreateFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        name: stringToHex(params.name),
        description: stringToHex(params.description),
        beneficiary: params.beneficiary,
        goal: attoGoal,
        deadlineTimestamp: BigInt(deadlineUnixTs),
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH + this.uiFee.uiFee,
    });
    const { fields } = await this.getEventForTxWithRetry<
      DoneraTypes.FundListedEvent,
      DoneraInstance
    >(txId, Donera, Donera.eventIndex.FundListed);

    // TODO: should probably return the values in `fields` as they come from
    // the blockchain itself
    return {
      txId,
      fundContractId: fields.fundContractId,
      name: params.name,
      description: params.description,
      goal: attoGoal.toString(),
      deadline: params.deadline,
      beneficiary: params.beneficiary,
      organizer: fields.organizer,
    };
  }

  public async donateToFund(
    signer: SignerProvider,
    { fundContractId, tokenId, amount }: DonateToFundParam
  ): Promise<DonateToFundResult> {
    const tokenInfo = this.getTokenInfo(tokenId);

    if (!tokenInfo) {
      throw new Error(`Only verified tokens can be donated, tokenId ${tokenId} is not verified`);
    }

    const donateAmount = convertAmountWithDecimals(amount, tokenInfo.decimals)!;
    const { txId } = await DonateToFund.execute(signer, {
      initialFields: {
        donera: this.doneraInstance.contractId,
        ...this.uiFee,
        fundContractId,
        tokenId,
        amount: donateAmount,
      },
      attoAlphAmount: donateAmount + this.uiFee.uiFee,
    });

    return { txId };
  }

  private async getEventForTx<E, C extends ContractInstance>(
    txId: string,
    // needed to get the events signatures
    contractFactory: ContractFactory<C>,
    eventIndex: number
  ): Promise<E> {
    const { events } = await web3.getCurrentNodeProvider().events.getEventsTxIdTxid(txId);
    const targetEvent = events.find((e) => e.eventIndex === eventIndex);
    if (!targetEvent) {
      throw new Error(`getEventForTx: Failed to find event with index ${eventIndex} in tx ${txId}`);
    }
    return Contract.fromApiEvent(targetEvent, undefined, txId, () => contractFactory.contract) as E;
  }

  async getEventForTxWithRetry<E, C extends ContractInstance>(
    txId: string,
    contractFactory: ContractFactory<C>,
    eventIndex: number
  ): Promise<E> {
    return new Promise((resolve, reject) => {
      const operation = retry.operation({
        retries: 20, // Max retries
        factor: 1, // The exponential factor
        minTimeout: 3 * 1000, // 3 seconds in milliseconds
        maxTimeout: 3 * 1000, // 3 seconds in milliseconds
        randomize: false,
      });

      operation.attempt(async (currentAttempt: number) => {
        try {
          const result = await this.getEventForTx<E, C>(txId, contractFactory, eventIndex);
          resolve(result); // Resolve with the result on success
        } catch (err) {
          console.log(`Attempt ${currentAttempt} failed, retrying...`);
          if (!operation.retry(err as Error)) {
            reject(operation.mainError()); // Reject with the error if all attempts fail
          }
        }
      });
    });
  }

  private getTokenInfo(tokenId: string): TokenInfo | undefined {
    if (tokenId === ALPH_TOKEN_ID) {
      return ALPH;
    }
    return this.tokens.find((t) => t.id === tokenId);
  }

  get contracts(): Deployments["contracts"] {
    return this.deploys.contracts;
  }

  get doneraInstance(): DoneraInstance {
    return this.contracts.Donera.contractInstance;
  }
}
