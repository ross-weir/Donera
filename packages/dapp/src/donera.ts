import {
  NetworkId,
  ONE_ALPH,
  SignerProvider,
  stringToHex,
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
  private readonly tokens: TokenInfo[];
  private readonly deploys: Deployments;

  constructor(networkId: NetworkId, deploys: Deployments) {
    this.tokens = getTokensForNetwork(networkId);
    this.deploys = deploys;
  }

  static forNetwork(network: NetworkId): DoneraDapp {
    return new DoneraDapp(network, loadDeployments(network));
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
        name: stringToHex(params.name),
        description: stringToHex(params.description),
        recipient: params.beneficiary,
        goal: attoGoal,
        deadlineTimestamp: BigInt(deadlineUnixTs),
      },
      attoAlphAmount: listingFeeCall.returns + ONE_ALPH,
    });
    const { fields } = await this.getEventForTx<DoneraTypes.FundListedEvent, DoneraInstance>(
      txId,
      Donera,
      Donera.eventIndex.FundListed
    );

    return {
      txId,
      fundContractId: fields.fundContractId,
      name: params.name,
      description: params.description,
      goal: attoGoal.toString(),
      deadline: params.deadline,
      beneficiary: params.beneficiary,
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
        fundContractId,
        tokenId,
        amount: donateAmount,
      },
      attoAlphAmount: donateAmount,
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
